require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./src/models/User');
const Student = require('./src/models/Student');
const Staff = require('./src/models/Staff');
const Course = require('./src/models/Course');
const Batch = require('./src/models/Batch');
const Semester = require('./src/models/Semester');
const Section = require('./src/models/Section');
const Subject = require('./src/models/Subject');
const Attendance = require('./src/models/Attendance');
const Fee = require('./src/models/Fee');
const Fine = require('./src/models/Fine');
const AuditLog = require('./src/models/AuditLog');

const wipeAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusync');
    console.log('Connected to DB...');

    // Wipe all
    await User.deleteMany();
    await Student.deleteMany();
    await Staff.deleteMany();
    await Course.deleteMany();
    await Batch.deleteMany();
    await Semester.deleteMany();
    await Section.deleteMany();
    await Subject.deleteMany();
    await Attendance.deleteMany();
    await Fee.deleteMany();
    await Fine.deleteMany();
    await AuditLog.deleteMany();
    
    console.log('Database wiped successfully.');

    // Create Admin
    await User.create({
      name: 'Super Admin',
      email: 'admin@campusync.com',
      password: 'admin123',
      role: 'Admin',
      isTemporaryPassword: false
    });
    console.log('Admin user created (admin@campusync.com / admin123)');

    // Create Admission Staff
    await User.create({
      name: 'Admission Desk',
      email: 'admission@campusync.com',
      password: 'admin123',
      role: 'Admission Staff',
      isTemporaryPassword: false
    });
    console.log('Admission Staff user created (admission@campusync.com / admin123)');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

wipeAndSeed();
