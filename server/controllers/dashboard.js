import sequelize from '../config/db.js';
import { Op, QueryTypes } from 'sequelize';
import Leave from '../models/Leave.js';

export const getDashBoardData = async (req, res) => {
  console.log(req.user);
  try {
    if (req.user.user_type === 'ADMIN') {
      const startOftheCurrentYear = new Date(new Date().getFullYear(), 0, 1).toLocaleDateString('en-CA');
      const endOftheCurrentYear = new Date(new Date().getFullYear(), 11, 31).toLocaleDateString('en-CA');
      const leaves = await sequelize.query(
        `SELECT dept_name,SUM(no_of_days) as 'no_of_leaves'  FROM tbl_leave JOIN tbl_teacher  ON applicant_username=tbl_teacher.username  JOIN tbl_department ON tbl_teacher.dept_id=tbl_department.dept_id  WHERE leave_approval_status='approved' AND leave_application_date BETWEEN '${startOftheCurrentYear}' AND '${endOftheCurrentYear}' GROUP BY tbl_teacher.dept_id;`,
        { type: QueryTypes.SELECT }
      );
      res.json(leaves);
    } else {
      const leaves = await Leave.findAll({
        attributes: [
          'leave_startDate',
          'leave_endDate',
          'no_of_days',
          'leave_reason',
          'leave_approval_status',
          'leave_reason',
        ],
        where: {
          [Op.and]: [
            { applicant_username: req.user.username },
            sequelize.where(sequelize.fn('YEAR', sequelize.col('leave_application_date')), new Date().getFullYear()),
          ],
        },
        order: [['leave_application_date', 'DESC']],
      });
      return res.json(leaves);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};
