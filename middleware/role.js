const roleCheck = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  };
};

module.exports = roleCheck;
