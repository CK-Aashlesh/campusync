const path = require('path');
const fs = require('fs');
let content = fs.readFileSync(path.join(__dirname, '../src/controllers/mentorController.js'), 'utf8');

// Update getMyAssignedStudents
content = content.replace(
  /exports\.getMyAssignedStudents = async \(req, res\) => \{[\s\S]*?try \{[\s\S]*?const staff = await Staff\.findOne\(\{ user: req\.user\._id \}\);[\s\S]*?if \(!staff\) \{[\s\S]*?return res\.status\(403\)\.json\(\{ success: false, message: 'Not authorized as staff' \}\);[\s\S]*?\}[\s\S]*?const assignments = await MentorAssignment\.find\(\{ mentor: staff\._id, active: true \}\)/m,
  `exports.getMyAssignedStudents = async (req, res) => {
  try {
    let assignments;
    if (req.user.role === 'Admin') {
      assignments = await MentorAssignment.find({ active: true })
    } else {
      const staff = await Staff.findOne({ user: req.user._id });
      if (!staff) return res.status(403).json({ success: false, message: 'Not authorized as staff' });
      assignments = await MentorAssignment.find({ mentor: staff._id, active: true })
    }`
);

// We need to also patch the mentor assignments find method chaining .populate(...)
// since the original string matched up to `.find({ mentor: staff._id, active: true })`

fs.writeFileSync(path.join(__dirname, '../src/controllers/mentorController.js'), content);
console.log('patched getMyAssignedStudents');
