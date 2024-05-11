let canvas = document.querySelector(".canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.getBoundingClientRect().width;
let canvasHeight = canvas.getBoundingClientRect().height;
let canvasVertexes = [{x:0, y:0}, {x:canvasWidth, y:0}, {x:canvasWidth, y:canvasHeight}, {x:0, y:canvasHeight}];

let cursor = new Cursor(canvasWidth/2, canvasHeight/2, canvas);

let polygons = [];
polygons.push(
  new Polygon([{x: 30, y: 70}, {x: 100, y: 130}, {x: 230, y: 155}, {x: 100, y: 300}]),
  new Polygon([{x: 550, y: 350}, {x: 450, y: 440}, {x: 420, y:210}]),
  new Polygon([{x: 100, y: 450}, {x: 130, y: 410}, {x: 300, y: 500}, {x: 210, y: 550}, {x:110, y:492}]),
);


render();

function render() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawPolygon(ctx, polygons);
  drawRay(ctx, cursor, polygons);
  cursor.draw(ctx, polygons);
  requestAnimationFrame(render);
}


function drawPolygon(ctx, p, {fill: color, lineWidth: wid, stroke: str}={}) {
  for (let i=0; i<p.length; i++) {
    p[i].draw(ctx,  {fill: color, lineWidth: wid, stroke: str});
  }
}


function drawRay(ctx, cur, pol) {
  if (!cur.visible) return;
  let R = canvasHeight + canvasWidth;
  let eps = 1e-12;
  let intersectList = [];
  
  pol.forEach(p => {
    for(let i=0; i<p.vertexes.length; i++) {
      let line = scale(subtract(p.vertexes[i], cur), R);
      let angle = Math.atan2(line.y, line.x);
      let linePlus = {x: R*Math.cos(angle + eps), y: R*Math.sin(angle + eps)};
      let lineMinus = {x: R*Math.cos(angle - eps), y: R*Math.sin(angle - eps)};
      intersectList.push(findIntersection(cur, line, pol));
      intersectList.push(findIntersection(cur, linePlus, pol));
      intersectList.push(findIntersection(cur, lineMinus, pol));
    }
  })

  for(let i=0; i<canvasVertexes.length; i++) {
    let tempRay = {x: R*(canvasVertexes[i].x - cur.x), y: R*(canvasVertexes[i].y - cur.y)};
    intersectList.push(findIntersection(cur, tempRay, pol));
  }

  intersectList.sort((a, b) => {
    return Math.atan2(a.y - cur.y, a.x - cur.x) - Math.atan2(b.y - cur.y, b.x - cur.x);
  })



  for (let i=0; i<intersectList.length; i++) {
    drawPolygon(
      ctx,
      [new Polygon([intersectList[i % intersectList.length], intersectList[(i+1) % intersectList.length], cur])],
      { fill: "rgb(213, 213, 213)", lineWidth: 1, stroke: "rgb(213, 213, 213)" }
    )
    // drawLine(ctx, cur, intersectList[i], `hsl(${i * 10}, 80%, 50%)`)
  }
    
}


function findIntersection(cur, ray, polys) {
  let t = 1;
  let pt = ray;
  polys.forEach(poly => {
    for(let i=0; i<poly.vertexes.length; i++) {
      let a = poly.vertexes[i % poly.vertexes.length];
      let b = poly.vertexes[(i+1) % poly.vertexes.length];
      let temp = getIntersection(cur, add(cur, ray), a, b);
      if (temp && temp[1] < t) {
        t = temp[1];
        pt = temp[0];
      }
    }
  })

  for(let i=0; i<canvasVertexes.length; i++) {
    let a = canvasVertexes[i%canvasVertexes.length];
    let b = canvasVertexes[(i+1)%canvasVertexes.length];
    let temp = getIntersection(cursor, add(cur, ray), a, b);
    if (temp && temp[1] < t) {
      t = temp[1];
      pt = temp[0];
    }
  }

  return pt;
}
