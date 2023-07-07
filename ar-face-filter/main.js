const video = document.getElementById('webcam')
const liveView = document.getElementById('live-view')
const loading = document.getElementById("loading")
loading.addEventListener("transitionend", ()=>{
  loading.remove()
})

const images = document.querySelectorAll(".mask-selector__image")
for(let i = 0; i < images.length; i++) {
  images[i].addEventListener("click", ()=>{
    for(let j = 0; j < images.length; j++) {
      images[j].classList.remove("mask-selector__image--selected")
    }
    images[i].classList.add("mask-selector__image--selected")
  })
}

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
  video.addEventListener('loadeddata', detectFaces)
})


let model = undefined
blazeface.load().then((loadedModel)=>{
  model = loadedModel
})

let children = []

function drawFilter(pred) {
  for (let i = 0; i < children.length; i++) {
    liveView.removeChild(children[i])
  }
  children.splice(0)

  const scaleFactor = window.innerHeight / video.videoHeight;

  const image = document.createElement("img")
  image.src = document.querySelector(".mask-selector__image--selected").src
  image.style.position = "absolute"
  image.style.left = (scaleFactor * pred.topLeft[0]) + "px"
  image.style.top = (scaleFactor * pred.topLeft[1] - 80 * scaleFactor) + "px"
  image.style.width = (1.5 * scaleFactor * (pred.bottomRight[1] - pred.topLeft[1])) + "px"
  image.style.height = (1.5 * scaleFactor * (pred.bottomRight[0] - pred.topLeft[0])) + "px"

  liveView.appendChild(image)
  children.push(image)
}

function detectFaces() {
  console.log(loading)
  if(loading !== null) {
    loading.className = "loading--hidden"
  }

  model.estimateFaces(video, false)
  .then((predictions)=>{
    if (predictions.length > 0) {
      for(let i = 0; i < predictions.length; i++) {
        drawFilter(predictions[i]);
      }
    }
  
    requestAnimationFrame(detectFaces)
  })  
}