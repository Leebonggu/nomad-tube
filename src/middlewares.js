import multer from 'multer';
import routes from './routes';

const multerVideo = multer({ dest: "uploads/videos/" });
const multerAvatar = multer({ dest: "uploads/avatars/"})

export const localsMiddleWare = (req, res, next) => {
  res.locals.siteName = 'Nomad-Tube'; 
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  next();
};

// 로그인 안된 사람들 전용
export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

// 로그인 된 사람들 전용
export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};

// passport가 로그인할 때 쿠키, 시리얼라이즈, 디시리얼라이즈 등의 기능을 다 지원해줌
// req.user: user가 담긴 오브젝트를 넘겨줌

export const uploadVideo = multerVideo.single('videoFile');
export const uploadAvatar = multerAvatar.single('avatar');