const recorderContainer = document.getElementById('jsRecordContainer');
const recordButton = document.getElementById('jsRecordButton');
const videoPreview = document.getElementById('jsVideoPreview');

let streamObject;
let videoRecorder;

const handleVideoData = (event) => {
  const { data: videoFile } = event;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(videoFile);
  link.download = 'recored.webm';
  document.body.appendChild(link);
  link.click();
};

const startRecording = () => {
  videoRecorder = new MediaRecorder(streamObject);
  videoRecorder.start();
  videoRecorder.addEventListener('dataavailable', handleVideoData);
  recordButton.addEventListener('click',stopRecording);
};

const stopRecording = () => {
  videoRecorder.stop();
  recordButton.removeEventListener('click', stopRecording);
  recordButton.addEventListener('click', getVideo);
  recordButton.innerHTML = 'Start Recording';
};

const getVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 980 },
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    recordButton.innerHTML = "Stop Recording";
    streamObject = stream;
    startRecording();
  } catch(err) {
    recordButton.innerHTML = "Can't Record";
    recordButton.removeEventListener('click', getVideo);
  } finally {
    recordButton.removeEventListener('click', getVideo);
  }
};

function init() {
  recordButton.addEventListener('click', getVideo);
}

if (recorderContainer) {
  init();
}
