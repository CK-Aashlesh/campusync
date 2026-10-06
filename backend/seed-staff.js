const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Staff = require('./src/models/Staff');

dotenv.config();

const seedStaffProfiles = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/campusync';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB...');

    // Find all users who are marked as Staff or Admission Staff
    const staffUsers = await User.find({ role: { $in: ['Staff', 'Admission Staff', 'Admin'] } });
    console.log(`Found ${staffUsers.length} potential staff/admin users.`);

    let count = 0;
    for (const user of staffUsers) {
      // Check if a staff profile already exists for this user
      const existingStaff = await Staff.findOne({ user: user._id });
      
      if (!existingStaff) {
        // Create a new staff profile for the user
        await Staff.create({
          user: user._id,
          employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}-${user._id.toString().slice(-4)}`,
          department: 'General',
          designation: user.role === 'Admin' ? 'Administrator' : 'Faculty',
          contactNumber: 'Not Provided',
          address: 'Not Provided'
        });
        count++;
        console.log(`Created Staff profile for ${user.email} (${user.role})`);
      }
    }

    console.log(`\nSuccessfully created ${count} missing staff profiles.`);
    process.exit();
  } catch (err) {
    console.error('Error seeding staff:', err);
    process.exit(1);
  }
};

seedStaffProfiles();
