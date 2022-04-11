import { QueryTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Teacher from '../models/Teacher.js';
import Leave from '../models/Leave.js';

export const getAllApprovals = async (req, res) => {
  try {
    const { dept_id } = await Teacher.findOne({
      attributes: ['dept_id'],
      where: { username: req.user.username },
    });

    const leaves = await sequelize.query(
      `SELECT leave_id,leave_application_date,leave_startDate,teacher_firstname,teacher_lastname,leave_endDate,no_of_days,leave_approval_status,leave_slip_image,leave_reason,category_name FROM tbl_leave JOIN tbl_category ON tbl_leave.category_id=tbl_category.category_id LEFT JOIN tbl_teacher ON tbl_leave.applicant_username=tbl_teacher.username WHERE dept_id=${dept_id} AND tbl_leave.applicant_username!='${req.user.username}' ORDER BY CASE leave_application_date WHEN 'pending' THEN 1 WHEN 'approved' THEN 2 WHEN 'declined' THEN 3 ELSE 4 END, leave_application_date DESC`,
      { type: QueryTypes.SELECT }
    );

    return res.json(leaves);
  } catch (error) {
    global.logger.error(`${error.message} ${error.stack}`);
    return res.status(500).send('internal server error');
  }
};

export const changeApprovalStatus = async (req, res) => {
  try {
    await Leave.update(
      { leave_approval_status: req.body.leave_approval_status },
      { where: { leave_id: req.body.leave_id } }
    );
    const { leave_id, leave_approval_status } = await Leave.findByPk(req.body.leave_id, {
      attributes: ['leave_id', 'leave_approval_status'],
    });
    return res.json({
      error: false,
      data: { leave_id, leave_approval_status },
    });
  } catch (error) {
    global.logger.error(`${error.message} ${error.stack}`);
    return res.status(500).send('internal server error');
  }
};
