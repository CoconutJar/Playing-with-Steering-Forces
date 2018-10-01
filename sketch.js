// Implements Craig Reynold's autonomous steering behaviors
// One vehicle "seeks"
// See: http://www.red3d.com/cwr/
let v = [];
let p = [];
let food = [];
let poison = [];
let ground = [[]];

function setup() {
  createCanvas(1650, 825);
  for (let i = 0; i < 10; i++){
    let x = random(width);
    let y = random(height);
    v[i] = new Vehicle(x, y);
  }
  for (let i = 0; i < 5; i++){
    let x = random(width);
    let y = random(height);
    p[i] = new Predator(x, y);
  }
  for (let i = 0; i < 30; i++){
    let x = random(width);
    let y = random(height);
    food.push(createVector(x, y));
  }
  for (let i = 0; i < 40; i++){
    let x = random(width);
    let y = random(height);
    poison.push(createVector(x, y));
  }
}

function draw() {
  background(51);

  if (random(1) < 0.15){
    let x = random(width);
    let y = random(height);
    food.push(createVector(x, y));
  }

  if (random(1) < 0.05){
    let x = random(width);
    let y = random(height);
    poison.push(createVector(x, y));
  }

  let mouse = createVector(mouseX, mouseY);

  // Draw an ellipse at the mouse position
  fill(127);
  stroke(200);
  strokeWeight(2);
  ellipse(mouse.x, mouse.y, 48, 48);

  for (let i = 0; i < food.length; i++){
    fill(0,255,0);
    noStroke();
    ellipse(food[i].x, food[i].y, 8, 8);
  }

  for (let i = 0; i < poison.length; i++){
    fill(255,0,0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 8, 8);
  }

  // Call the appropriate steering behaviors for our agents
  for (let i = v.length-1; i >= 0; i--){
    v[i].boundaries();
    v[i].behaviors(food, poison);
    v[i].update();
    v[i].display();

    let newV = v[i].clone();
    if (newV != null){
      v.push(newV);
    }

    if (v[i].dead()){
      let x = v[i].position.x;
      let y = v[i].position.y;
      food.push(createVector(x, y));
      v.splice(i,1);
    }

  }

  for (let i = p.length-1; i >= 0; i--){
    p[i].boundaries();
    p[i].behaviors(v);
    p[i].update();
    p[i].display();

    let newV = p[i].clone();
    if (newV != null){
      p.push(newV);
    }

    if (p[i].dead()){
      let x = p[i].position.x;
      let y = p[i].position.y;
      food.push(createVector(x, y));
      p.splice(i,1);
      console.log(p.length, "Predators left");
    }

  }

}
