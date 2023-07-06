const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');

function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (!getUserMediaSupported()) {
  console.warn('getUserMedia() is not supported by your browser')
  alert("This program is not supported by your browser")
}

const constraints = {
  video: true
};

navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
  video.srcObject = stream;
  video.addEventListener('loadeddata', predictWebcam)
})


var model = undefined

cocoSsd.load().then(function (loadedModel) {
  model = loadedModel
})

var children = []

function predictWebcam() {
  let timerInterval = setInterval(() => {
    model.detect(video).then(function (predictions) {
      for (let i = 0; i < children.length; i++) {
        liveView.removeChild(children[i])
      }
      children.splice(0)

      const scaleFactor = window.innerHeight / video.videoHeight;

      for (let n = 0; n < predictions.length; n++) {
        if (predictions[n].score > 0.06) {
          const p = document.createElement('p')
          p.innerText = predictions[n].class + ' - with ' + Math.round(parseFloat(predictions[n].score) * 100) + '% confidence.';
          p.style = 'margin-left: ' + predictions[n].bbox[0]*scaleFactor + 'px; margin-top: ' + (predictions[n].bbox[1]*scaleFactor - 10) + 'px; width: ' + (predictions[n].bbox[2]*scaleFactor - 10) + 'px; top: 0; left: 0;'

          const highlighter = document.createElement("div")
          highlighter.setAttribute("class", "highlighter")
          highlighter.style = 'left: ' + predictions[n].bbox[0]*scaleFactor + 'px; top: ' + predictions[n].bbox[1]*scaleFactor + 'px; width: ' +
            predictions[n].bbox[2]*scaleFactor + 'px; height: ' +
            predictions[n].bbox[3]*scaleFactor + 'px;';
          liveView.appendChild(highlighter);
          liveView.appendChild(p)
          children.push(highlighter)
          children.push(p)
        }
      }

    })
  }, 250)
}