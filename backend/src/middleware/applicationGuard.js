const ApplicationDAO = require('../integration/ApplicationDAO');

/**
 * Middleware to ensure application is in 'unhandled' status before allowing modifications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function requireUnhandledApplication(req, res, next) {
  try {
    const application = await ApplicationDAO.findByPersonId(req.user.id);

    if (!application) {
      // No application yet - user can still edit their profile
      req.application = null;
      next();
      return;
    }

    if (application.status !== 'unhandled') {
      return res.status(403).json({
        error: `Application is ${application.status} and cannot be modified.`
      });
    }

    req.application = application;
    next();
  } catch (error) {
    console.error('Error in requireUnhandledApplication middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { requireUnhandledApplication };
