function redirectIfAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/")
  } else {
    next()
  }
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

// preventing cache on pages that their funcationality changes depending if logged in or not (because don't 
// want someone pressing back after logging out and seeing protected stuff from cache or vice versa)
// This doesn't rly work for safari but leaving it anyway. I noticed on chrome it doesn't save regardless (even without the middleware)
// On safari, even for website like GitHub it shows the logged in page when pressing back so i think it is fine
function preventCache(req, res, next) {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next()
}

// supposed to run ensureAuthenticated before
function ensureNotMember(req, res, next) {
  // I don't check for req.user here because it is being checked before in ensureAuthenticated (since I put that middleware before on the become-member route)
  if (req.user.is_member) {
    res.redirect("/")
  } else {
    next()
  }
}

// supposed to run ensureAuthenticated before
function ensureMember(req, res, next) {
  if (req.user.is_member) {
    next()
  } else {
    res.redirect("/become-member")
  }
}

// supposed to run ensureAuthenticated and ensureMember before
function ensureNotAdmin(req, res, next) {
  if (req.user.is_admin) {
    res.redirect("/")
  } else {
    next()
  }
}

// supposed to run ensureAuthenticated and ensureMember before
function ensureAdmin(req, res, next) {
  if (req.user.is_admin) {
    next()
  } else {
    res.redirect("/become-admin")
  }
}

module.exports = {
  redirectIfAuthenticated,
  ensureAuthenticated,
  preventCache,
  ensureNotMember,
  ensureMember,
  ensureNotAdmin,
  ensureAdmin
}