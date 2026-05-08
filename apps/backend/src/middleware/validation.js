/**
 * Request validation middleware
 */

const validateIntent = (req, res, next) => {
  const { intent } = req.body;
  
  if (!intent || !['project', 'advice', 'mentorship'].includes(intent)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid intent. Must be project, advice, or mentorship'
    });
  }
  
  next();
};

const validateLead = (req, res, next) => {
  const { email, intent } = req.body;
  
  // Check required fields
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }
  
  // Validate intent if provided
  if (intent && !['project', 'advice', 'mentorship'].includes(intent)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid intent'
    });
  }
  
  // Sanitize inputs
  req.body.email = email.toLowerCase().trim();
  if (req.body.name) {
    req.body.name = req.body.name.trim().slice(0, 100);
  }
  
  next();
};

module.exports = {
  validateIntent,
  validateLead
};