const path = require('path');
const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '../src/models');
if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });

const models = {
  'Course.js': `const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
}, { timestamps: true });
module.exports = mongoose.model('Course', courseSchema);`,

  'Batch.js': `const mongoose = require('mongoose');
const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Batch', batchSchema);`,

  'Semester.js': `const mongoose = require('mongoose');
const semesterSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Semester', semesterSchema);`,

  'Section.js': `const mongoose = require('mongoose');
const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Section', sectionSchema);`,

  'Subject.js': `const mongoose = require('mongoose');
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
module.exports = mongoose.model('Subject', subjectSchema);`,
};

Object.keys(models).forEach(file => {
  fs.writeFileSync(path.join(modelsDir, file), models[file]);
});
console.log('Models created successfully.');
