import dotenv from 'dotenv';
import passport from 'passport';
import GithubStrategy from 'passport-github';
import FacebookStarategy from 'passport-facebook';
import User from './models/User';
import { githubLoginCallback, facebookLoginCallback } from './controllers/userController';
import routes from './routes';



dotenv.config();

passport.use(User.createStrategy()); 

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: `http://localhost:4000${routes.githubCallback}`,
}, githubLoginCallback));

passport.use(new FacebookStarategy({
  clientID: process.env.FB_ID,
  clientSecret:  process.env.FB_SECRET,
  callbackURL: `http://localhost:4000${routes.facebookCallback}`,
  profileFileds: ['id', 'displayName', 'photos', 'email'],
  scope: ['public_profile', 'email'],
}, facebookLoginCallback));

// createStrategy: 로그인 방식. 페이스북으로 할것? 깃허보르 할것? 등

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// serialize: 어떤 정보를 쿠키엑 주느냐?
// 웹브라우저에 있는 사용자에 대해서 ㅇ떤 저옵를 가질 수 있느냐? 쿠키가 어던 정보를 가질 수 있는가?
// 쿠키 정보는 자동으로 백엔으로 전송된다.
// 어떤 필드가 쿠크에 포함될 것인지 알려주는 역할을 하는 것이 serialize
// 쿠키는 작아야 하고, 민감한 정보를 담아선 안된다.