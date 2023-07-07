// Cargar el modelo de detección facial
async function loadFaceLandmarkModel() {
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    const detectorConfig = {
      runtime: 'tfjs',
    };
    const detector = await faceDetection.createDetector(model, detectorConfig);
    return detector;
  }
  
  // Dibujar el filtro en el rostro detectado
  function drawFilter(faceLandmarks) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
  
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Dibujar el filtro en el rostro
    // Aquí puedes implementar tu propia lógica para dibujar el filtro deseado
    // Por ejemplo, puedes usar las coordenadas de los landmarks para ajustar el filtro correctamente
  
    // Ejemplo: Dibujar un círculo rojo en la nariz
    const nose = faceLandmarks.scaledMesh[4];
    const radius = Math.abs(nose[0][0] - nose[9][0]) * 0.3;
    const centerX = nose[5][0];
    const centerY = nose[5][1];
  
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.lineWidth = 3;
    context.strokeStyle = 'red';
    context.stroke();
  }
  
  async function runFaceDetection() {
    const model = await loadFaceLandmarkModel();
  
    // Obtener el contexto de dibujo del canvas
    const canvas = document.getElementById('canvas');
    const canvasContext = canvas.getContext('2d');
    canvasContext.fillStyle = '#000000';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  
    async function detectFaces() {
      const video = document.getElementById('video'); // Obtener el elemento HTMLVideoElement
      const predictions = await model.estimateFaces({
        input: video,
        predictIrises: false,
      });
  
      if (predictions.length > 0) {
        const faceLandmarks = predictions[0].faceLandmarks;
        drawFilter(faceLandmarks);
      }
  
      requestAnimationFrame(detectFaces);
    }
  
    detectFaces(); // Agregado para iniciar la detección de caras
  }
  
  const video = document.getElementById('video');
  
  function getUserMediaSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  
  if (!getUserMediaSupported()) {
    console.warn('getUserMedia() is not supported by your browser');
    alert('This program is not supported by your browser');
  } else {
    const constraints = {
      video: true,
    };
  
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      video.srcObject = stream;
      video.addEventListener('loadeddata', runFaceDetection);
    });
  }
  