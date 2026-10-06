const path = require('path');
const fs = require('fs');
let content = fs.readFileSync(path.join(__dirname, '../src/controllers/staffController.js'), 'utf8');

content = content.replace(
  /res\.status\(201\)\.json\(\{.*?success: true,.*?data: staff,.*?\}\);/s,
  `req.auditUserId = req.user.id; await require('../utils/auditLogger')(req, 'STAFF_CREATED', 'Created staff ' + staff.employeeId);\n    $&`
);

content = content.replace(
  /staff = await Staff\.findByIdAndUpdate\([^;]+;\n\n    res\.status\(200\)\.json\(\{.*?success: true,.*?data: staff,.*?\}\);/s,
  `$&`.replace('res.status(200)', `req.auditUserId = req.user.id; await require('../utils/auditLogger')(req, 'STAFF_UPDATED', 'Updated staff ' + staff.employeeId);\n    res.status(200)`)
);

content = content.replace(
  /user\.isActive = !user\.isActive;\n    await user\.save\(\);/s,
  `$&\n    req.auditUserId = req.user.id; await require('../utils/auditLogger')(req, 'STAFF_STATUS_TOGGLE', 'Toggled staff ' + staff.employeeId);`
);

content = content.replace(
  /user\.password = 'password123';.*?await user\.save\(\);/s,
  `$&\n    req.auditUserId = req.user.id; await require('../utils/auditLogger')(req, 'STAFF_PASSWORD_RESET', 'Reset password for staff ' + staff.employeeId);`
);

fs.writeFileSync(path.join(__dirname, '../src/controllers/staffController.js'), content);
console.log('staffController patched with audit logs');
