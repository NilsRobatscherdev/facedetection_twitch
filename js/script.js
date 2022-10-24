const video = document.getElementById("video")

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
]).then(startVideo)

function startVideo(){
    navigator.getUserMedia(
        {video:{}},
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displazSize = {width: video.width, height:video.height}
    faceapi.matchDimensions(canvas,displazSize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video,
            new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
           
            canvas.getContext("2d").clearRect(0,0, canvas.width, canvas.height)

            const resizeDetections = faceapi.resizeResults(detections, displazSize)
            faceapi.draw.drawDetections(canvas, resizeDetections)
    },100)
})