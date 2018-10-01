class Predator {
 constructor(x, y) {
   this.acceleration = createVector(0, 0);
   this.velocity = createVector(0, -2);
   this.position = createVector(x, y);
   this.r = 4;
   this.maxspeed = random(4,6);
   this.maxforce = 0.5;

   this.health = 1;

   this.dna = [];
   this.dna[0] = random(0, 5);
   //this.dna[0] = 5;
   this.dna[2] = random(40, 200);
   //this.dna[2] = 500;
 }

 // Method to update location
 update() {

   this.health -= 0.006;
   // Update velocity
   this.velocity.add(this.acceleration);
   // Limit speed
   this.velocity.limit(this.maxspeed);
   this.position.add(this.velocity);
   // Reset accelerationelertion to 0 each cycle
   this.acceleration.mult(0);
 }

 behaviors(prey){
   let foodSteer = this.eat(prey, 0.75, this.dna[2]);
   //let poisonSteer =  this.eat(bad, -0.2, this.dna[3]);
   //console.log(foodSteer);
   foodSteer.mult(this.dna[0]);
   //poisonSteer.mult(this.dna[1]);

   this.applyForce(foodSteer);
   //this.applyForce(poisonSteer);
 }

 applyForce(force) {
   // We could add mass here if we want A = F / M
   this.acceleration.add(force);
 }

 clone(){
   if (random(1) < 0.007 && 0.5 < this.health){
     let child = new Predator(this.position.x, this.position.y);
     child.maxspeed = this.maxspeed * random(0.80, 1.2);
     child.dna[0] = this.dna[0] * random(0.80, 1.2);
     //child.dna[1] = this.dna[1] * random(0.80, 1.2);
     child.dna[2] = this.dna[2] * random(0.80, 1.2);
     //child.dna[3] = this.dna[3] * random(0.80, 1.2);
     return child;
     this.health /= 2;
   }
   else{
     return null;
   }
 }

 eat(list, nutrition, perception){
   let record = Infinity;
   let closestIndex = -1;
   for (let i = 0; i < list.length; i++){
     let v1 = createVector(list[i].position.x, list[i].position.y);
     //let d = dist(this.position.x, this.position.y, list[i].position.x, list[i].position.y);
     let d = this.position.dist(v1);
    // console.log(d);
     if (d < record && d < perception){
       record = d;
       closestIndex = i;

     }
   }

   if (record < 5){
     list.splice(closestIndex, 1);
     console.log("eaten", list.length, "vehicles left");
     this.health += nutrition;
     if (this.health > 1){
       this.health = 1;
     }
   }
   else if (closestIndex > -1){
     return this.seek(list[closestIndex]);
   }

     return createVector(0, 0);

 }

 // A method that calculates a steering force towards a target
 // STEER = DESIRED MINUS VELOCITY
 seek(target) {

   let prey = createVector(target.position.x, target.position.y)
   let desired = p5.Vector.sub(prey, this.position); // A vector pointing from the location to the target

   // Scale to maximum speed
   desired.setMag(this.maxspeed);

   // Steering = Desired minus velocity
   let steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce); // Limit to maximum steering force

   return steer;
 }

 dead(){
   return (this.health < 0);
 }

 display() {
   // Draw a triangle rotated in the direction of velocity
   let theta = this.velocity.heading() + PI / 2;

   let gr = color(0,0,255);
   let rd = color(255,0,0);

   let col = lerpColor(rd, gr, this.health);

   fill(col);
   stroke(col);
   strokeWeight(1);
   push();
   translate(this.position.x, this.position.y);
   rotate(theta);
   beginShape();
   vertex(0, -this.r * 2);
   vertex(-this.r, this.r * 2);
   vertex(this.r, this.r * 2);
   endShape(CLOSE);

   stroke(0, 255, 0);
   noFill();
   line(0,0,0, this.dna[0] * -20);
   ellipse(0, 0, this.dna[2] * 2)
   stroke(255, 0, 0);
   noFill();
   //line(0,0,0, this.dna[1] * -20);
  //ellipse(0,0,this.dna[3] * 2);


   pop();
 }

 boundaries() {

   let d = 25;
   let desired = null;

   if (this.position.x < d) {
     desired = createVector(this.maxspeed, this.velocity.y);
   } else if (this.position.x > width - d) {
     desired = createVector(-this.maxspeed, this.velocity.y);
   }

   if (this.position.y < d) {
     desired = createVector(this.velocity.x, this.maxspeed);
   } else if (this.position.y > height - d) {
     desired = createVector(this.velocity.x, -this.maxspeed);
   }

   if (desired !== null) {
     desired.normalize();
     desired.mult(this.maxspeed);
     let steer = p5.Vector.sub(desired, this.velocity);
     steer.limit(this.maxforce);
     this.applyForce(steer);
   }
 }

}
