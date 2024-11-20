export class QuadTree {
  constructor(w1, w2, h1, h2, maxDepth=7, maxCompacity=4) {
    this.w1 = w1;
    this.w2 = w2;
    this.h1 = h1;
    this.h2 = h2;
  
    this.maxDepth = maxDepth;
    this.compacity = 0;
    this.maxCompacity = maxCompacity;
    this.sep = false;
    this.child = [];
    this.member = [];
  }

  add(obj) {
    if (!this.isContain(obj)) {
      return;
    } 

    if (this.maxDepth === 0) {
      this.member.push(obj);
      return;
    } 

    if (this.compacity >= this.maxCompacity) {
      if (this.child.length === 0) {
        let tl = new QuadTree(this.w1, (this.w2+this.w1)/2, this.h1, (this.h2+this.h1)/2, this.maxDepth-1, this.compacity);
        let tr = new QuadTree((this.w2+this.w1)/2, this.w2, this.h1, (this.h2+this.h1)/2, this.maxDepth-1, this.compacity);
        let bl = new QuadTree(this.w1, (this.w2+this.w1)/2, (this.h2+this.h1)/2, this.h2, this.maxDepth-1, this.compacity);
        let br = new QuadTree((this.w2+this.w1)/2, this.w2, (this.h2+this.h1)/2, this.h2, this.maxDepth-1, this.compacity);

        this.child.push(tl);
        this.child.push(tr);
        this.child.push(bl);
        this.child.push(br);

        this.child.forEach(c => {
          this.member.forEach(m => {
            c.add(m);
          })
        })
        this.member = [];
      }

      this.child.forEach(c => {
        c.add(obj);
      })

    } else {
      this.compacity += 1;
      this.member.push(obj);
    }
  }

  get(obj) {
    let temp = [];
    if (!this.isContain(obj)) return temp;
    
    this.member.forEach(m => {
      temp.push(m);
    })

    this.child.forEach(c => {
      c.get(obj).forEach(t => {
        temp.push(t);
      });
    })

    return temp; 
  }

  isContain(obj) {
    if (obj.x <= this.w2 && obj.x > this.w1 && obj.y <= this.h2 && obj.y > this.h1) return true;
    return false;
  }

  draw(p5) {
    p5.stroke("red");
    p5.strokeWeight(2);

    p5.line(this.w1, this.h1, this.w1, this.h2);
    p5.line(this.w1, this.h2, this.w2, this.h2);
    p5.line(this.w2, this.h2, this.w2, this.h1);
    p5.line(this.w2, this.h1, this.w1, this.h1);

    this.child.forEach(c => {
      c.draw(p5);
    })

    p5.stroke("black");
  }
}