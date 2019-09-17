let rings;
let margin = 30;

let frame = 0;
let n = "visual1";

// load csv data
function preload() {
  rings = loadTable("data/HemlockData.csv", "csv", "header")

}

//set up
function setup() {
  createCanvas(800, 800);
  background(100);
  example();

}

//switch visualizations
function mousePressed(e) {
// Initialize values
  frame = 0;
  background(100);
  //n = visuals reconized with id from buttons
  n = e.target.id;
}

function draw() {
  //switching visualizations based on id of button pressed
  if (n == "visual1")
  {
    example();
  }
  else if (n == "visual2")
  {
    growth();
  }
  else {

     tower();
  }
}

// visual1
function example() {
  background(100);
  strokeWeight(1);
  let r = 5;
  for (let i = 0; i < rings.getRowCount(); i++) {
    const timescale = map(+rings.getRow(i).get('year'), 1579, 2000, margin, width - margin)
    const growthscale = map(+rings.getRow(i).get('RawRingWidth_mm'), 0, 2.1, height - margin, margin)
    const growthIndexScale = map(+rings.getRow(i).get('GrowthIndex'), 0, 2.1, height - margin, margin)
    //console.log(timescale, growthscale)
    noStroke();

    //RawRingWidth_mm
    fill(255);
    ellipse(timescale, growthscale, r, r);
    //GrowthIndex
    fill(50, 255, 50);
    ellipse(timescale, growthIndexScale, r, r);
    //connect dots on the same year, if RawRingWidth_mm is bigger, blue, if GrowthIndex is bigger, red
    growthscale > growthIndexScale ? stroke(0, 0, 255) : stroke(255, 0, 0);
    line(timescale, growthscale, timescale, growthIndexScale);
  }

}

//visual2
function growth() {
  background(100, 20);

// draw a ring based on RawRingWidth_mm of the year
  let growthscale = map(rings.getRow(frame).get('RawRingWidth_mm'), 0, 2.1, 0, height / 2 - margin);
  stroke(180, 95, 24, 20);
  strokeWeight(5);
  fill(14, 230, 23, 20);
  ellipse(width / 2, height / 2, growthscale);

  //time line, showing which year is currently being showed
  let timescale = map(rings.getRow(frame).get('year'), 1579, 2000, 2 * margin, width - 2 * margin)
  stroke(0);
  strokeWeight(1);
  fill(255);
  line(2 * margin, height - 2 * margin, width - 2 * margin, height - 2 * margin);
  ellipse(timescale, height - 2 * margin, 10, 10)
  text(rings.getRow(frame).get('year'), timescale - 15, height - 2 * margin - 8);

  //slow down animation by 1/5
  if (frameCount % 5 == 0) {
    frame++;
  }

//reset value when reached end of the data set
  if (frame >= rings.getRowCount()) {
    frame = 0;
    background(100);
  }
}


let growthSum = [0];
//visual3
function tower() {
  // background(100);

  //mask over time line
  noStroke();
  fill(100);
  rect(0, 0, width, margin * 3);
  //time line
  let timescale = map(rings.getRow(frame).get('year'), 1579, 2000, 2 * margin, width - 2 * margin)
  stroke(0);
  strokeWeight(1);
  fill(255);
  line(2 * margin, 2 * margin, width - 2 * margin, 2 * margin);
  ellipse(timescale, 2 * margin, 10, 10)
  text(rings.getRow(frame).get('year'), timescale - 15, 2 * margin - 8);

  //grid
  for (let i = 0; i <= height/100; i++) {
      line(0, i*100,width,i*100)
  }

  noStroke();

  //Index/ color guide
  for (let i = 0; i <= 100; i++) {
    fill(180 * i/100, 255 - 160 * i/100, 24 * i/100);
    rect(width - 3*margin, height-margin-2*i, margin, -1);
    if (i%20 ==0)
    {
      let t = i*2.1+"mm";
      text(t,width - 2*margin, height-margin-2*i);
    }
  }

// visulize sum of growth since 1579
  if (frameCount % 5 == 0) {
    let growthscale = map(rings.getRow(frame).get('RawRingWidth_mm'), 0, 2.1, 0, 1);
    growthSum.unshift(growthSum[0] + growthscale);

    //fill(180,95,24);

    for (let i = 0; i < growthSum.length; i++) {
      let g = growthSum[i]-growthSum[i+1];
      fill(180 * g, 255- 160 * g, 24 * g);
      let h = (height - margin) / rings.getRowCount();
      let growth = growthSum[i]*2;
      rect(width / 2 - growth / 2, height - i * h, growth, h);
    }

    frame++;
  }
//stop when reached end of the data set
  if (frame >= rings.getRowCount()) {
    // frame = 0;
    // background(100);
    // growthSum = [0];
    noLoop();
  }
}
