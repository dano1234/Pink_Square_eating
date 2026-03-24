let rectangles = [];
let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

let pizzaImg;
let score = 0;
let startTime;
let gameDuration = 60; // 60 seconds

function preload() {
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(options);
  pizzaImg = loadImage('slice.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
  startTime = millis();

  for (let i = 0; i < 100; i++) {
    let myJSON = {
      x: random(0, width),
      y: random(0, height),
      xdir: random(-1, 1),
      ydir: random(-1, 1),
      size: random(10, 30),
      color: color("#FF69B4"),
    };

    rectangles.push(myJSON);
  }
}

function draw() {
  let currentTime = Math.max(0, gameDuration - Math.floor((millis() - startTime) / 1000));
  
  if (currentTime <= 0) {
    background(0);
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Game Over! Score: " + score, width/2, height/2);
    return;
  }

  push();        //these three lines mirror the picure, for easier eating
  translate(width, 0);  
  scale(-1, 1);
 
  image(video, 0, 0, width, height);
  filter(INVERT);
  let mouthX, mouthY;

  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    
    let upperLip = face.keypoints[13];
    let lowerLip = face.keypoints[14];
    mouthX = (upperLip.x + lowerLip.x) / 2;
    mouthY = (upperLip.y + lowerLip.y) / 2;

    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(random(255), random(255), random(255));
      noStroke();
      circle(keypoint.x, keypoint.y, 9);
    }
  }

 
  for (let i = rectangles.length - 1; i >= 0; i--) {
    let obj = rectangles[i];

    obj.x += obj.xdir;
    obj.y += obj.ydir;

    if (obj.x > width || obj.x < 0) obj.xdir *= -1;
    if (obj.y > height || obj.y < 0) obj.ydir *= -1;

   
    if (
      mouthX > obj.x &&
      mouthX < obj.x + obj.size &&
      mouthY > obj.y &&
      mouthY < obj.y + obj.size
    ) {
      rectangles.splice(i, 1); 
      score++;
      continue; 
    }

    image(pizzaImg, obj.x, obj.y, obj.size * 2, obj.size * 2);
  }
  
  pop(); // restore transform so text isn't mirrored
  
  fill(255, 255, 0);
  noStroke();
  textSize(40);
  textAlign(LEFT, TOP);
  text("Score: " + score, 20, 20);
  text("Time: " + currentTime, 20, 70);
}


function gotFaces(results) {
  faces = results;
}
