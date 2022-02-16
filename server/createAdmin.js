import bcrypt from 'bcrypt';

import Login from './models/Login.js';

const save = async () => {
  try {
    const hashedpassword = await bcrypt.hash('123456', 10);

    await Login.create({ username: 'admin@leaveman.com', password: hashedpassword, user_type: 'ADMIN' });
  } catch (error) {
    console.error(error);
  }
};

save();
