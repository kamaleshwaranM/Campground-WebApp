const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const localConfig = { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }
router.route('/register')
    .get(users.registerForm)
    .post(users.register);

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', localConfig ), users.logIn)

router.get('/logout', users.logOut);

module.exports = router;