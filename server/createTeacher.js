import bcrypt from 'bcrypt';

import Teacher from './models/Teacher.js';
import Department from './models/Department.js';

const save = async () => {
  try {
    const hashedpassword = await bcrypt.hash('123456', 10);
    const username = 'teacher@gmail.com';
    await Teacher.create(
      {
        username,
        dept_id: 1,
        teacher_firstname: 'Alvin',
        teacher_lastname: 'Lal',
        teacher_designation: 'HOD',
        Login: {
          username,
          user_type: 'TEACHER',
          password: hashedpassword,
        },
      },
      {
        include: [
          { model: Department, attributes: ['dept_name'] },
          {
            association: Teacher.Login,
          },
        ],
      }
    );
    console.log('teacher successfully created');
  } catch (error) {
    console.error(error);
  }
};

save();
