import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';
import mongoose from 'mongoose';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import path from 'path';

import userRouter from './rotuer/userRouter';
import globalRouter from './rotuer/globalRouter';
import videoRouter from './rotuer/videoRouter';
import apiRouter from './rotuer/apiRouter';
import routes from './routes';
import { localsMiddleWare } from './middlewares';

import './passport';

dotenv.config();

const app = express();

const CookieStore = mongoStore(session);
// 세션은 서버를 재시작하면 정보가 사라진다
// 그 정보를 계속 유지시키기 위해 몽고디비를 사용

app.use(helmet());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, "views"))
app.use(bodyParser.urlencoded({extended: true}));
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new CookieStore({ mongooseConnection: mongoose.connection }),
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleWare);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter)

export default app;
