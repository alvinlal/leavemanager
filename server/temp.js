import bcrypt from 'bcrypt';

import Login from './models/Login.js';

const hash = async () => {
  const hashedpwd = await bcrypt.hash('123456', 10);

  await Login.create({ username: 'admin@leaveman.com', password: hashedpwd, user_type: 'ADMIN' });
};

hash();
