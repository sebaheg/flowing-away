// Initialize variables
var frame2;
var frame1;

var threshold = 50; // How different must a pixel be to be a "motion" pixel
var motionX = 0;
var motionY = 0;
var lerpX = 0;
var lerpY = 0;

function setup() {
  createCanvas(320, 240);
  pixelDensity(1);
  frame2 = createCapture(VIDEO);
  frame2.size(width, height);
  // frame2.hide();
  // Create an empty image the same size as the video
  frame1 = createImage(frame2.width, frame2.height, RGB);
}

function draw() {

  frame2.loadPixels();
  frame1.loadPixels();
  image(frame1, 0, 0);

  var count = 0;
  var avgX = 0;
  var avgY = 0;

  // Begin loop to walk through every pixel
  loadPixels();
  for (var x = 0; x < frame2.width; x++) {
    for (var y = 0; y < frame2.height; y++) {

      // Step 1, what is the location into the array
      var loc = (x + y * frame2.width) * 4;

      // Step 2, what is the previous color
      var r1 = frame1.pixels[loc   ];
      var g1 = frame1.pixels[loc + 1];
      var b1 = frame1.pixels[loc + 2];

      // Step 3, what is the current color
      var r2 = frame2.pixels[loc   ];
      var g2 = frame2.pixels[loc + 1];
      var b2 = frame2.pixels[loc + 2];

      // Step 4, compare colors (previous vs. current)
      var diff = distSq(r1, g1, b1, r2, g2, b2);

      // Step 5, How different are the colors?
      // If the color at that pixel has changed, then there is motion at that pixel.
      if (diff > threshold*threshold) {
        // If motion, display black
        //stroke(255);
        //strokeWeight(1);
        //point(x, y);
        avgX += x;
        avgY += y;
        count++;
        pixels[loc] = 0;
        pixels[loc+1] = 0;
        pixels[loc+2] = 0;
        pixels[loc+3] = 255;
      } else {
        // If not, display white
        pixels[loc] = 255;
        pixels[loc+1] = 255;
        pixels[loc+2] = 255;
        pixels[loc+3] = 255;
      }
    }
  }
  updatePixels();

  // We only consider the color found if its color distance is less than 10.
  // This threshold of 10 is arbitrary and you can adjust this number depending on how accurate you require the tracking to be.
  if (count > 0) {
    motionX = avgX / count;
    motionY = avgY / count;
    // Draw a circle at the tracked pixel
  }

  lerpX = lerp(lerpX, motionX, 0.1);
  lerpY = lerp(lerpY, motionY, 0.1);

  fill(255, 0, 255);
  strokeWeight(2.0);
  stroke(0);
  ellipse(lerpX, lerpY, 50, 50);

  // Save frame for the next cycle
  frame1.copy(frame2, 0, 0, frame2.width, frame2.height, 0, 0, frame1.width, frame1.height); // Before we read the new frame, we always save the previous frame for comparison!
}

function distSq(x1, y1, z1, x2, y2, z2) {
  d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
  return d;
}
