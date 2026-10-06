const AuditLog = require('../models/AuditLog');

const logAudit = async (req, action, details = '', resource = '') => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Attempt to get user from req.user (if authenticated), or from req.body.email during login
    let userId = null;
    if (req.user) {
      userId = req.user.id || req.user._id;
    } else if (req.auditUserId) {
      // Custom property we can set in controllers
      userId = req.auditUserId;
    }

    if (!userId) {
      // We might be logging an anonymous action, but schema requires user.
      // So we skip logging if no user is determinable.
      return;
    }

    await AuditLog.create({
      user: userId,
      action,
      details,
      ipAddress,
      resource
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

module.exports = logAudit;
