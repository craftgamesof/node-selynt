export function checkAuthentication(req, res, next) {
  if (req.session?.isAuthenticated) {
    return res.redirect('/apps');
  }
  return next();
}

export function isAuthenticated(req, res, next) {
  if (req.session?.isAuthenticated) {
    return next();
  }
  return res.redirect('/login');
}