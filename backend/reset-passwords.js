const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

dotenv.config();

const resetPasswords = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/campusync';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB...');

    const users = await User.find({});
    let count = 0;
    
    for (const user of users) {
      user.password = 'admin@123';
      // Mongoose will trigger the pre('save') hook in User.js and hash this password
      await user.save();
      count++;
    }

    console.log(`Successfully reset passwords for ${count} users to 'admin@123'`);
    process.exit();
  } catch (err) {
    console.error('Error resetting passwords:', err);
    process.exit(1);
  }
};

resetPasswords();
