import { Op, QueryTypes } from 'sequelize';
import Leave from '../models/Leave.js';
import Category from '../models/Category.js';
import formidable from 'formidable';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import sequelize from '../config/db.js';
import dayjs from 'dayjs';

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      attributes: [
        'leave_id',
        'leave_application_date',
        'leave_startDate',
        'leave_endDate',
        'leave_approval_status',
        'leave_slip_image',
        'leave_reason',
        'category_id',
      ],
      // TODO:- ORDER BY leave_application_date and pending
      where: { applicant_username: req.user.username },
      include: [{ model: Category, attributes: ['category_name'] }],
      order: [['leave_application_date', 'DESC']],
    });
    return res.json(leaves);
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};

const daysBetween = (date1, date2) => {
  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date1 - date2);

  // Convert back to days and return, one is added
  return Math.round(differenceMs / ONE_DAY) + 1;
};

export const addLeave = async (req, res) => {
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('internal server error');
    }
    if (files.leave_slip_image.size > 5000000) {
      return res.json({
        error: {
          leave_slip_image: 'max file size is 5mb !',
        },
      });
    }

    try {
      //checks if leave applications already exists in given date range
      const query =
        fields.leave_startDate == fields.leave_endDate
          ? `SELECT leave_id,leave_startDate,leave_endDate FROM tbl_leave WHERE applicant_username=$username AND DATE($startdate) BETWEEN leave_startDate AND leave_endDate;`
          : `SELECT leave_id FROM tbl_leave WHERE applicant_username=$username AND (leave_startDate BETWEEN $startdate AND $enddate OR leave_endDate BETWEEN $startdate AND $enddate)`;
      const hasLeaves = sequelize.query(query, {
        bind: { startdate: fields.leave_startDate, enddate: fields.leave_endDate, username: req.user.username },
        type: QueryTypes.SELECT,
      });
      if (hasLeaves) {
        return res.json({
          error: {
            date: 'You already have leave applications in the given date range',
          },
        });
      }
      // checks for limits
      if (fields.hasLimit == 'true') {
        // because formdata converts booleans to strings, SMH 😞
        const startOftheCurrentYear = new Date(new Date().getFullYear(), 0, 1).toLocaleDateString('en-CA');
        const endOftheCurrentYear = new Date(new Date().getFullYear(), 11, 31).toLocaleDateString('en-CA');

        const total_no_of_days = await Leave.sum('no_of_days', {
          where: {
            applicant_username: req.user.username,
            category_id: fields.category_id,
            leave_application_date: {
              [Op.between]: [startOftheCurrentYear, endOftheCurrentYear],
            },
          },
        });

        const newNoOfDays =
          total_no_of_days + daysBetween(new Date(fields.leave_startDate), new Date(fields.leave_endDate));
        const remainingDays =
          req.user.user_type === 'TEACHER'
            ? fields.max_days_teachers - total_no_of_days
            : fields.max_days_staff - total_no_of_days;
        if (newNoOfDays > (req.user.user_type === 'TEACHER' ? fields.max_days_teachers : fields.max_days_staff)) {
          return res.json(
            remainingDays == 0
              ? {
                  error: {
                    category: `You have reached your limit for ${fields.category_name}`,
                  },
                }
              : {
                  error: {
                    date: `You have ${remainingDays} leaves remaining for ${fields.category_name}`,
                  },
                }
          );
        }
      }

      // stores file in filesystem and create leave on db
      const filename = crypto.randomBytes(10).toString('hex');
      const extension = files.leave_slip_image.mimetype.split('/')[1];
      const no_of_days = daysBetween(new Date(fields.leave_startDate), new Date(fields.leave_endDate));
      const {
        leave_id,
        category_id,
        leave_startDate,
        leave_endDate,
        leave_approval_status,
        leave_slip_image,
        leave_application_date,
        leave_reason,
      } = await Leave.create({
        applicant_username: req.user.username,
        category_id: fields.category_id,
        leave_startDate: fields.leave_startDate,
        leave_endDate: fields.leave_endDate,
        leave_reason: fields.leave_reason,
        leave_application_date: new Date().toLocaleDateString('en-CA'),
        no_of_days,
        leave_slip_image: filename + '.' + extension,
        leave_approval_status: req.user.isHOD || req.user.user_type === 'STAFF' ? 'approved' : 'pending',
        ...(req.user.isHOD && { leave_approved_by: req.user.username }),
      });
      const oldPath = files.leave_slip_image.filepath;
      const newPath = path.join(global.__basedir, `/public/uploads/slips/${filename}.${extension}`);
      var source = fs.createReadStream(oldPath);
      var dest = fs.createWriteStream(newPath, { flags: 'wx' });
      source.pipe(dest);
      source.on('error', () => res.status(500).send('internal server error'));
      dest.on('error', () => res.status(500).send('internal server error'));
      source.on('end', () => {});
      return res.json({
        error: false,
        data: {
          leave_id,
          Category: {
            category_name: fields.category_name,
          },
          category_id,
          leave_startDate,
          leave_endDate,
          leave_approval_status,
          leave_slip_image,
          leave_application_date,
          leave_reason,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send('internal server error');
    }
  });
};

export const updateLeave = async (req, res) => {
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(error);
      return res.status(500).send('internal server error');
    }

    if (files.leave_slip_image && files.leave_slip_image.size > 5000000) {
      return res.json({
        error: {
          leave_slip_image: 'max file size is 5mb !',
        },
      });
    }
    try {
      //checks if leave applications already exists in given date range excluding currently updating leave
      const hasLeaves = await Leave.findOne({
        attributes: ['leave_id'],
        where: {
          applicant_username: req.user.username,
          leave_id: {
            [Op.not]: fields.leave_id,
          },
          [Op.or]: {
            leave_startDate: {
              [Op.between]: [new Date(fields.leave_startDate), new Date(fields.leave_endDate)],
            },
            leave_endDate: {
              [Op.between]: [new Date(fields.leave_startDate), new Date(fields.leave_endDate)],
            },
          },
        },
      });
      if (hasLeaves) {
        return res.json({
          error: {
            date: 'You already have leave applications in the given date range',
          },
        });
      }
      // checks for limits excluding currently updating leave
      if (fields.hasLimit == 'true') {
        // because formdata converts booleans to strings, SMH 😞
        const startOftheCurrentYear = new Date(new Date().getFullYear(), 0, 1).toLocaleDateString('en-CA');
        const endOftheCurrentYear = new Date(new Date().getFullYear(), 11, 31).toLocaleDateString('en-CA');

        const total_no_of_days = await Leave.sum('no_of_days', {
          where: {
            applicant_username: req.user.username,
            leave_id: {
              [Op.not]: fields.leave_id,
            },
            category_id: fields.category_id,
            leave_application_date: {
              [Op.between]: [startOftheCurrentYear, endOftheCurrentYear],
            },
          },
        });

        const newNoOfDays =
          total_no_of_days + daysBetween(new Date(fields.leave_startDate), new Date(fields.leave_endDate));
        const remainingDays =
          req.user.user_type === 'TEACHER'
            ? fields.max_days_teachers - total_no_of_days
            : fields.max_days_staff - total_no_of_days;
        if (newNoOfDays > (req.user.user_type === 'TEACHER' ? fields.max_days_teachers : fields.max_days_staff)) {
          return res.json(
            remainingDays == 0
              ? {
                  error: {
                    category: `You have reached your limit for ${fields.category_name}`,
                  },
                }
              : {
                  error: {
                    date: `You have ${remainingDays} leaves remaining for ${fields.category_name}`,
                  },
                }
          );
        }
      }
      const no_of_days = daysBetween(new Date(fields.leave_startDate), new Date(fields.leave_endDate));

      if (files.leave_slip_image) {
        var filename = crypto.randomBytes(10).toString('hex');
        var extension = files.leave_slip_image.mimetype.split('/')[1];
        const oldPath = files.leave_slip_image.filepath;
        const newPath = path.join(global.__basedir, `/public/uploads/slips/${filename}.${extension}`);
        var source = fs.createReadStream(oldPath);
        var dest = fs.createWriteStream(newPath, { flags: 'wx' });
        source.pipe(dest);
        source.on('error', () => res.status(500).send('internal server error'));
        dest.on('error', () => res.status(500).send('internal server error'));
        source.on('end', () => {});
        fs.unlink(path.join(global.__basedir, `/public/uploads/slips/${fields.current_leave_slip_image}`), (err) => {
          if (err) return res.status(500).send('internal server error');
        });
      }
      await Leave.update(
        {
          category_id: fields.category_id,
          leave_startDate: fields.leave_startDate,
          leave_endDate: fields.leave_endDate,
          leave_reason: fields.leave_reason,
          ...(files.leave_slip_image && { leave_slip_image: filename + '.' + extension }),
        },
        { where: { leave_id: fields.leave_id } }
      );

      const { leave_id, category_id, leave_startDate, leave_endDate, leave_reason, leave_slip_image } =
        await Leave.findByPk(fields.leave_id, {
          attributes: [
            'leave_id',
            'category_id',
            'leave_startDate',
            'leave_endDate',
            'leave_slip_image',
            'leave_reason',
          ],
        });
      return res.json({
        error: false,
        data: {
          leave_id,
          Category: {
            category_name: fields.category_name,
          },
          category_id,
          leave_startDate,
          leave_endDate,
          leave_slip_image,
          leave_reason,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send('internal server error');
    }
  });
};

export const getLeaveDates = async (req, res) => {
  try {
    if (req.query.year) {
      const leaves = await Leave.findAll({
        attributes: ['leave_startDate', 'leave_endDate', 'no_of_days', 'leave_approval_status'],
        where: {
          [Op.and]: [
            { applicant_username: req.user.username },
            sequelize.where(sequelize.fn('YEAR', sequelize.col('leave_application_date')), req.query.year),
          ],
        },
      });
      var dates = [];
      leaves.forEach((leave) => {
        dates.push(leave.leave_startDate);
        var currentDate = leave.leave_startDate;
        for (let i = 1; i < leave.no_of_days; i++) {
          var newDate = dayjs(currentDate).add(1, 'day');
          dates.push(newDate.format('YYYY-MM-DD'));
          currentDate = newDate;
        }
      });
      return res.json(dates);
    } else {
      return res.status(400).send('bad request');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('internal server error');
  }
};
