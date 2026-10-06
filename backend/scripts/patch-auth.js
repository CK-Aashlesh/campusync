const path = require('path');
const fs = require('fs');
let content = fs.readFileSync(path.join(__dirname, '../src/controllers/mentorController.js'), 'utf8');

content = content.replace(/const staff = await Staff\.findOne\(\{ user: req\.user\._id \}\);\s*if \(!staff\) \{\s*return res\.status\(403\)\.json\(\{ success: false, message: 'Not authorized as staff' \}\);\s*\}/g,
`let staff = null;
    if (req.user.role !== 'Admin') {
      staff = await Staff.findOne({ user: req.user._id });
      if (!staff) return res.status(403).json({ success: false, message: 'Not authorized as staff' });
    }`);

content = content.replace(/const assignment = await MentorAssignment\.findOne\(\{\s*mentor: staff\._id,\s*student: req\.params\.studentId,\s*active: true\s*\}\);/g,
`const assignmentQuery = { student: req.params.studentId, active: true };
    if (req.user.role !== 'Admin') assignmentQuery.mentor = staff._id;
    const assignment = await MentorAssignment.findOne(assignmentQuery);`);

content = content.replace(/mentor: staff\._id,/g, `mentor: staff ? staff._id : req.user._id,`); // for addAttendanceReason just in case

fs.writeFileSync(path.join(__dirname, '../src/controllers/mentorController.js'), content);
console.log('Fixed auth bug in mentorController');
