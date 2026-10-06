const path = require('path');
const fs = require('fs');
let content = fs.readFileSync(path.join(__dirname, '../src/controllers/academicController.js'), 'utf8');

// For createCourse, createBatch, createSemester, createSection, createSubject
['Course', 'Batch', 'Semester', 'Section', 'Subject'].forEach(model => {
  content = content.replace(
    new RegExp(`const ${model.toLowerCase()} = await ${model}\\.create\\(req\\.body\\);.*?res\\.status\\(201\\)\\.json\\(\\{`, 's'),
    `$&`.replace('res.status(201)', `req.auditUserId = req.user.id; await require('../utils/auditLogger')(req, 'ACADEMIC_STRUCTURE_ADDED', 'Added ${model} ' + ${model.toLowerCase()}.name || ${model.toLowerCase()}.number);\n    res.status(201)`)
  );
});

fs.writeFileSync(path.join(__dirname, '../src/controllers/academicController.js'), content);
console.log('academicController patched');
