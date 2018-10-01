class Grass{
  constructor(x,y){
    this.position = createVector(x,y);
    this.r = 1;
    this.health = 1;
  }

  update(){
    this.health -= 0.001;
  }

  clone(){
    
  }

  display(){
    let green = color(0,0,255);
    let brown = color(165,42,42);
    let col = lerpColor(rd, gr, this.health)
  }
}
