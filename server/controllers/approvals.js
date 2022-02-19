import { QueryTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Teacher from '../models/Teacher.js';

export const getAllApprovals = async (req, res) => {
  try {
    const { dept_id } = await Teacher.findOne({
      attributes: ['dept_id'],
      where: { username: req.user.username },
    });

    const leaves = await sequelize.query(
      `SELECT leave_id,leave_application_date,leave_startDate,leave_endDate,leave_approval_status,leave_slip_image,leave_reason,category_name FROM tbl_leave JOIN tbl_category ON tbl_leave.leave_category_id=tbl_category.category_id LEFT JOIN tbl_teacher ON tbl_leave.applicant_username=tbl_teacher.username WHERE dept_id=${dept_id} AND tbl_leave.applicant_username!='${req.user.username}' ORDER BY CASE leave_application_date WHEN 'pending' THEN 1 WHEN 'approved' THEN 2 WHEN 'declined' THEN 3 ELSE 4 END`,
      { type: QueryTypes.SELECT }
    );

    return res.json(leaves);
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};
