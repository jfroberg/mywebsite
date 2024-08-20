let cols, rows;
let scale = 20;
let fluid;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / scale);
  rows = floor(height / scale);
  fluid = new Fluid(cols, rows, scale);
}

function draw() {
  background(0);
  fluid.update();
  fluid.display();
}

function mouseDragged() {
  let x = floor(mouseX / scale);
  let y = floor(mouseY / scale);
  fluid.addDensity(x, y, 100);
  fluid.addVelocity(x, y, (mouseX - pmouseX) * 0.1, (mouseY - pmouseY) * 0.1);
}

class Fluid {
  constructor(cols, rows, scale) {
    this.cols = cols;
    this.rows = rows;
    this.scale = scale;
    this.density = new Array(cols * rows).fill(0);
    this.velocityX = new Array(cols * rows).fill(0);
    this.velocityY = new Array(cols * rows).fill(0);
  }

  addDensity(x, y, amount) {
    let index = x + y * this.cols;
    if (index >= 0 && index < this.density.length) {
      this.density[index] += amount;
    }
  }

  addVelocity(x, y, amountX, amountY) {
    let index = x + y * this.cols;
    if (index >= 0 && index < this.velocityX.length) {
      this.velocityX[index] += amountX;
      this.velocityY[index] += amountY;
    }
  }

  update() {
    for (let i = 0; i < this.density.length; i++) {
      this.density[i] *= 0.99; // Damping
      this.velocityX[i] *= 0.99;
      this.velocityY[i] *= 0.99;
    }
  }

  display() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let index = x + y * this.cols;
        let d = this.density[index];
        fill(d);
        noStroke();
        rect(x * this.scale, y * this.scale, this.scale, this.scale);
      }
    }
  }
}