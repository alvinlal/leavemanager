import sequelize from '../config/db.js';
import { Op } from 'sequelize';
import Leave from '../models/Leave.js';

export const getDashBoardData = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};
