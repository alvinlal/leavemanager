import { QueryTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Leave from '../models/Leave.js';
import Category from '../models/Category.js';

export const getReport = async (req, res) => {
  try {
    if (req.query.startdate && req.query.enddate) {
      const report = await sequelize.query(
        "SELECT tbl_login.username,SUM(CASE WHEN DATE(leave_application_date)>=DATE($startdate) AND DATE(leave_application_date)<=DATE($enddate) AND leave_approval_status='approved' THEN no_of_days ELSE 0 END) AS total_days, CONCAT(COALESCE(teacher_firstname,staff_firstname),' ',COALESCE(teacher_lastname,staff_lastname)) AS applicant_name,LOWER(user_type) AS user_type,tbl_department.dept_id,dept_name,COALESCE(teacher_designation,staff_designation) AS applicant_designation FROM tbl_login LEFT JOIN tbl_teacher ON tbl_login.username=tbl_teacher.username LEFT JOIN tbl_department ON tbl_teacher.dept_id=tbl_department.dept_id LEFT JOIN tbl_staff ON tbl_login.username=tbl_staff.username LEFT JOIN tbl_leave ON tbl_login.username=tbl_leave.applicant_username WHERE user_type!='ADMIN' GROUP BY tbl_login.username;",
        { bind: { startdate: req.query.startdate, enddate: req.query.enddate }, type: QueryTypes.SELECT }
      );
      return res.json(report);
    } else {
      return res.status(400).send('bad request');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};

export const getReportByUsername = async (req, res) => {
  try {
    if (req.query.startdate && req.query.enddate && req.params.username) {
      const userReport = await sequelize.query(
        "SELECT leave_application_date,leave_startDate,leave_endDate,no_of_days,leave_reason,leave_slip_image,category_name FROM tbl_leave JOIN tbl_category ON tbl_leave.category_id=tbl_category.category_id WHERE applicant_username=:username AND leave_application_date BETWEEN :startdate AND :enddate;SELECT category_name,SUM(CASE WHEN DATE(leave_application_date)>=DATE(:startdate) AND DATE(leave_application_date)<=DATE(:enddate) AND leave_approval_status='approved' THEN no_of_days ELSE 0 END) AS total_days FROM tbl_category LEFT JOIN tbl_leave ON tbl_category.category_id=tbl_leave.category_id AND tbl_leave.applicant_username=:username GROUP BY tbl_category.category_id",
        {
          model: Leave,
          mapToModel: true,
          // bind parameters doesn't seems to be working with multiple statements
          replacements: { startdate: req.query.startdate, enddate: req.query.enddate, username: req.params.username },
          type: QueryTypes.SELECT,
        }
      );

      return res.json({
        leaves: [...userReport[0]],
        category_wise_stats: [...userReport[1]],
      });
    } else {
      return res.status(400).send('bad request');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};
