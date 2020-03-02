const videoContainer = document.getElementById('jsVideoPlayer');
const playButton = document.getElementById('jsPlayButton');
const volumnButton = document.getElementById('jsVolumeBtn');
const fullScreenButton = document.getElementById('jsFullScreen');
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById('jsVolume');
let videoPlayer;

const registerView = () => {
  const videoId = window.location.href.split('/videos/')[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST",
  });
};

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playButton.innerHTML = "멈춰"
  } else {
    videoPlayer.pause();
    playButton.innerHTML = "플레이"
  }
}

function handleVolumnClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumnButton.innerHTML = "볼륨"
    volumeRange.value = videoPlayer.volume;
  } else {
    videoPlayer.muted = true;
    volumeRange.value = 0;
    volumnButton.innerHTML = "뮤트"
  }
}

function goSmallScreen() {
  fullScreenButton.innerHTML = "전체보기";
  fullScreenButton.addEventListener('click', goFullScreen);
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function goFullScreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
  fullScreenButton.innerHTML = "최소화";
  fullScreenButton.removeEventListener('click', goFullScreen);
  fullScreenButton.addEventListener('click', goSmallScreen);
}

const formatDate = seconds => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
};

function getCurrentTime() {
  currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}

function setTotalTime() {
  const totalTimeString = formatDate(videoPlayer.duration);
  totalTime.innerHTML = totalTimeString;
  setInterval(getCurrentTime, 1000);
}

function handleEnded() {
  registerView();
  videoPlayer.currentTime = 0;
  videoPlayer.pause();
  playButton.innerHTML = "플레이"
}

function handleDrag(event) {
  const { target: { value } } = event;
  videoPlayer.volume = value;
}

function init() {
  videoPlayer = videoContainer.querySelector('video');
  videoPlayer.volume = 0.5;
  playButton.addEventListener('click', handlePlayClick);
  volumnButton.addEventListener('click', handleVolumnClick);
  fullScreenButton.addEventListener('click', goFullScreen);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener('ended', handleEnded);
  volumeRange.addEventListener('input', handleDrag);
}

if (videoContainer) {
  init();
}
