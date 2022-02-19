import Leave from '../models/Leave.js';
import Category from '../models/Category.js';
import formidable from 'formidable';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import Teacher from '../models/Teacher.js';

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
      ],
      where: { applicant_id: req.user.username },
      include: [{ model: Category, attributes: ['category_name', 'category_id'] }],
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
      if (fields.hasLimit == 'true') {
        // because formdata converts booleans to strings, SMH 😞
        //TODO:- check academic year
        const total_no_of_days = await Leave.sum('no_of_days', {
          where: { leave_category_id: fields.category_id, applicant_id: req.user.username },
        });

        if (total_no_of_days >= (req.user.user_type === 'TEACHER' ? fields.max_days_teachers : fields.max_days_staff)) {
          return res.json({
            error: {
              category: `You have reached ${fields.category_name} limit`,
            },
          });
        }
      }

      const filename = crypto.randomBytes(10).toString('hex');
      const extension = files.leave_slip_image.mimetype.split('/')[1];
      const no_of_days = daysBetween(new Date(fields.leave_startDate), new Date(fields.leave_endDate));
      const {
        leave_id,
        leave_category_id,
        leave_startDate,
        leave_endDate,
        leave_approval_status,
        leave_slip_image,
        leave_application_date,
        leave_reason,
      } = await Leave.create({
        applicant_id: req.user.username,
        leave_category_id: fields.category_id,
        leave_startDate: fields.leave_startDate,
        leave_endDate: fields.leave_endDate,
        leave_reason: fields.leave_reason,
        leave_application_date: new Date().toISOString().split('T')[0],
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
            category_id: leave_category_id,
          },
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
