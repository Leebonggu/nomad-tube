import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URL_PROD, {
  useNewUrlParser: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

const handleOpen = () => {
  console.log('COOL! connect to DB');
};

const handleError= (err) => {
  console.log('BAD! Error' + err);
};

db.once('open', handleOpen);
db.on('error', handleError);