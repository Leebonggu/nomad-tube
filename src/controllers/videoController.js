import routes from '../routes';
import Video from '../models/Video';
import Comment from '../models/Comment';

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({_id: -1});
    res.render('home', { pageTitle: 'Home', videos });
  } catch(error) {
    console.log(error);
    res.render('home', { pageTitle: 'Home', videos: [] });
  }
};

export const search = async (req, res) => {
  const { term: searchingBy } = req.query;
  let videos = [];
  try {
    videos = await Video.find({
      title: {$regex: searchingBy, $options: 'i'}
    });
  } catch(err) {
    console.log(err);
  }

  res.render('search', { pageTitle: 'search', searchingBy, videos });
};

export const getUpload = (req, res) => {
  res.render('upload', { pageTitle: 'upload' });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path} 
    // todo: Upload and Save
  } = req;
  try {
    const newVideo = await Video.create({
      fileUrl: path,
      title,
      description,
      creator: req.user.id,
    });
    req.user.videos.push(newVideo._id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo._id));
  } catch (err) {
    console.log(err);
    res.redirect(routes.home);
  }

};

export const videoDetail = async (req, res) => {
  const { params: { id }} = req;
  try {
    const video = await Video.findById({ _id: id }).populate('creator').populate('comments');
    res.render('videoDetail', { pageTitle: `${video.title}`, video });
  } catch(err) {
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) =>{
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById({ _id: id });
    if (video.creator !== req.user.id) {
      throw Error();
    } else {
      const { title, description } = video;
      res.render('editVideo', { pageTitle: `Edit ${video.title}`, video, title, description });
    }
  } catch(err) {
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, {
      title,
      description
    });
    res.redirect(routes.videoDetail(id));
  } catch {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById({ _id: id });
    if (video.creator !== req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
      res.redirect(routes.home);
    }
  } catch(err) {
    res.redirect(routes.home);
  }
  // res.render('deleteVideo', { pageTitle: 'deleteVideo' })
};


// rgister views
export const postRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById({_id: id});
    video.views += 1;
    video.save();
    res.status(200);
  } catch(err) {
    res.status(400);
    res.end();
  } finally {
    res.end();
  }
};

// add comment

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  
  try {
    const video = await Video.findById({_id: id});
    const newComment = await Comment.create({
      text: comment,
      creator: user.id
    });

    video.comments.push(newComment.id);
    video.save();
  } catch(err) {
    res.status(400);
  } finally {
    res.end();
  }
}