const audioElement = document.querySelector("audio");
const canvasElement = document.querySelector("canvas");
const canvasCtx = canvasElement.getContext("2d");
const audio = document.querySelector("audio");
const randomHeights = [];


var totalDuration = 0;
var WIDTH = canvasElement.clientWidth;
var HEIGHT = canvasElement.clientHeight;

const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");


canvasElement.addEventListener("mousedown", getMousePosition);
playButton.addEventListener("click", playMusic);
pauseButton.addEventListener("click", pauseMusic);

pauseButton.style.display = "none";

audio.onloadedmetadata = () => {
  totalDuration = Math.ceil(audio.duration);
  for (var i = 0; i < totalDuration; i++) {
    randomHeights[i] = Math.floor(Math.random() * 201) - 100;
  }
  canvasCtx.canvas.width = totalDuration * 15;
  WIDTH = totalDuration * 15;
  draw();
};

function playMusic(e) {
  e.preventDefault();
  playButton.style.display = "none";
  pauseButton.style.display = "block";
  document.getElementById("player").play();
}
function pauseMusic(e) {
  e.preventDefault();
  pauseButton.style.display = "none";
  playButton.style.display = "block";
  document.getElementById("player").pause();
}
function scaleToOutput(num, out_min, out_max) {
  const in_min = 0;
  const in_max = totalDuration;
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
function scaleToInput(val, out_min, out_max) {
  const in_min = 0;
  const in_max = totalDuration;
  return ((val - out_min) * (in_max - in_min)) / (out_max - out_min) + in_min;
}

function draw() {
  canvasCtx.fillStyle = "rgb(2, 2, 2)";
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  const barWidth = 15;
  let barHeight;
  let x = 0;
  for (let i = 0; i < randomHeights.length; i++) {
    barHeight = randomHeights[i];
    if (x < scaleToOutput(audioElement.currentTime, 0, totalDuration * 15)) {
      canvasCtx.fillStyle = `rgb(255,255,255)`;
    } else {
      canvasCtx.fillStyle = `rgb(100,100,100)`;
    }
    canvasCtx.fillRect(x, 100, 10, barHeight);
    x += barWidth;
  }
  insertMusicPoints(
    scaleToOutput(totalDuration / 4, 0, totalDuration * 15),
    "point1",
    "red"
  );
  insertMusicPoints(
    scaleToOutput(totalDuration / 3, 0, totalDuration * 15),
    "point2",
    "blue"
  );
  insertMusicPoints(
    scaleToOutput(totalDuration / 2, 0, totalDuration * 15),
    "point3",
    "green"
  );
  requestAnimationFrame(draw);
}

function getMousePosition(event) {
  let rect = canvasElement.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  audioElement.currentTime = scaleToInput(x, 0, totalDuration * 15);
}

function insertMusicPoints(xPoint, name, bgColor) {
  canvasCtx.lineWidth = 6;
  canvasCtx.beginPath();
  canvasCtx.moveTo(xPoint, 80);
  canvasCtx.lineTo(xPoint, 20);
  canvasCtx.strokeStyle = bgColor;
  canvasCtx.stroke();
  canvasCtx.fillStyle = bgColor;
  canvasCtx.fillRect(xPoint - 20, 20, 40, 20);
  canvasCtx.font = "15px Arial";
  canvasCtx.fillStyle = "white";
  canvasCtx.fillText(name, xPoint - 20, 35);
}
