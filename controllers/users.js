const User = require('../models/user');

module.exports.registerForm = (req, res) => res.render('user/register')

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', `Welcome ${username}!`);
            res.redirect('/campgrounds');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => res.render('user/login')

module.exports.logIn = (req, res) => {
    const { username } = req.user;
    req.flash('success', `Welcome back,${username}`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

}
module.exports.logOut = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'Logged Out!')
        res.redirect('/')
    });
}