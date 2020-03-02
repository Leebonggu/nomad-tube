import passport from 'passport';
import routes from "../routes";
import User from '../models/User';

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res, next) => {
  const { 
    body: {
      name, email, password, password2
    }
  } = req;
  if (password !== password2) {
    res.status(400); //bad req
    res.render('join', { pageTitle: 'Join' });
  } else {
    try {
      // Todo: Log user in
      // User.create는 db에 저장까지함
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch(err) {
      console.log(err);
    }
    // Todo: register User
    // res.redirect(routes.home);
  }
};

export const getLogin = (req, res) => {
  res.render('login', { pageTitle: 'login' })
};

// authenticate은 username, password를 찾아서 보게 되어있음

export const postLogin = passport.authenticate('local', {
  failureRedirect: routes.login,
  successRedirect: routes.home,
});

export const githubLogin = passport.authenticate('github');

export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
}

export const githubLoginCallback = async(_, __, profile, cb) => {
  const { _json: {
    id,
    avatar_url,
    name,
    email
  }} = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.avatarUrl = avatar_url;
      user.save();
      return cb(null, user);
    } 
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl: avatar_url,
    });
    return cb(null, newUser);
  } catch(err) {
    return cb(err);
  }
};

export const facebookLogin = passport.authenticate('facebook');

export const facebookLoginCallback = async(_, __, profile, cb) => {
  const { _json: {
    id,
    name,
    email
  }} = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl= `https://graph.facebook.com/${id}/picture?type=large`,
      user.save();
      return cb(null, user);
    } 
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
    });
    return cb(null, newUser);
  } catch(err) {
    return cb(err);
  }
};

export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  // todo: logOut
  req.logout();
  res.redirect(routes.home);
};

export const users = (req, res) => res.render('users', { pageTitle: 'users' });

export const getMe = (req, res) => {
  res.render('userDetail', { pageTitle: 'editProfile', user: req.user });
};

export const userDetail = async (req, res) => {
  const { params: { id } } = req;
  try {
    const user = await User.findById({_id: id}).populate('videos')
    console.log(user);
    res.render('userDetail', { pageTitle: 'Profile', user });
  } catch(err) {
    res.redirect(routes.home)
  }
}

export const getEditProfile = (req, res) => {
  res.render('editProfile', { pageTitle: 'editProfile' });
};

export const postEditProfile = async (req, res) => {
  const { 
    body: {
      name,
      email,
    },
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.path : req.user.avatarUrl,
    });
    res.redirect(routes.me);
  } catch(err) {
    res.render('editProfile', { pageTitle: "Edit Profile" })
  }
};

export const getChangePassword = (req, res) => {
  res.render('changePassword', { pageTitle: 'changePassword' })
};

export const postChangePassword = async (req, res) => {
  
  const {
    body: {
      oldPassword,
      newPassword,
      newPassword1,
    }
  } = req;
  try {
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch(err) {
    res.status(400);
    res.redirect(`/users${routes.editProfile}`);
  }
};
