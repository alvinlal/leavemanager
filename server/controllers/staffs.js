import crypto from 'crypto';
import bcrypt from 'bcrypt';
import Staff from '../models/Staff.js';

export const getAllStaffs = async (req, res) => {
  try {
    const staffs = await Staff.findAll({
      attributes: ['staff_id', 'username', 'staff_firstname', 'staff_lastname', 'staff_designation', 'staff_status'],
    });
    return res.json(staffs);
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};

export const addStaff = async (req, res) => {
  const randomPassword = crypto.randomBytes(6).toString('hex');
  const hashedpassword = await bcrypt.hash(randomPassword, 10);
  try {
    const { username, staff_id, staff_firstname, staff_lastname, staff_designation, staff_status } = await Staff.create(
      {
        username: req.body.username,
        staff_firstname: req.body.staff_firstname,
        staff_lastname: req.body.staff_lastname,
        staff_designation: req.body.staff_designation,
        Login: {
          username: req.body.username,
          user_type: 'STAFF',
          password: hashedpassword,
        },
      },
      {
        include: [
          {
            association: Staff.Login,
          },
        ],
      }
    );
    // send as SES mail with the password here
    return res.json({
      error: false,
      data: {
        staff_id,
        username,
        password: randomPassword,
        staff_firstname,
        staff_lastname,
        staff_designation,
        staff_status,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.name == 'SequelizeUniqueConstraintError') {
      return res.json({
        error: {
          username: 'Email already exists !',
        },
      });
    }
    return res.status(500).send('internal server error');
  }
};

export const updateStaff = async (req, res) => {
  try {
    await Staff.update(
      {
        staff_firstname: req.body.staff_firstname,
        staff_lastname: req.body.staff_lastname,
        staff_designation: req.body.staff_designation,
      },
      { where: { staff_id: req.body.staff_id } }
    );

    const { staff_firstname, staff_lastname, staff_designation, staff_id } = await Staff.findByPk(req.body.staff_id, {
      attributes: ['staff_firstname', 'staff_lastname', 'staff_designation', 'staff_id'],
    });

    return res.json({
      error: false,
      data: { staff_id, staff_firstname, staff_lastname, staff_designation },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};

export const toggleStaffStatus = async (req, res) => {
  try {
    await Staff.update(
      { staff_status: req.body.current_staff_status ? 0 : 1 },
      { where: { staff_id: req.body.staff_id } }
    );
    return res.json({
      error: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};
