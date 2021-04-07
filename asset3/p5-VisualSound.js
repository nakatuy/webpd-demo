let polySynth;
let canvas;
var outMidiNo;
var dispfreq;

function canvasSetup(){
  polySynth = new p5.PolySynth();
  delay = new p5.Delay();
  fft = new p5.FFT();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  canvasSetup();
}

function setup() {
  canvas = createCanvas(windowWidth,windowHeight);//2Dの場合は引数にWEBGLは要らない
  //canvas.position(0,0);//canvasをページの原点に固定
  canvas.style('z-index','-1');//canvasを後ろに移動する

  canvasSetup();
}

function draw() {
  frameRate(30);
  blendMode(BLEND);
  background(0, 0, 0, 50);
  noFill();
  blendMode(SCREEN);

  let waveform = fft.waveform();
  beginShape();
  stroke(10);

  for (let i = 0; i < waveform.length; i++){
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }

  for (var i = 1; i < 8; ++i) {
    strokeWeight(i * 0.5);
    stroke(164 - (i * 14), 240, 245, 250 - (i * 10));
  }
  endShape();

  fill(9);
  noStroke();
  textSize(windowWidth/14);

  text(dispfreq, 40, windowHeight*0.9);

}

function soundPlay() {
  userStartAudio();

  Pd.receive('midiNo', function(args) {
    outMidiNo = args*1.0;
    dispfreq = "Frequency：" + Math.floor(args*100)/100 + " Hz";
    document.getElementById("pdMidi").innerHTML = dispfreq;
    
    polySynth.play(outMidiNo, 0.3, 0, 0.2);
    polySynth.play(outMidiNo*6, 0.4, 0.2, 0.6);
    delay.process(polySynth, 0.32, .5, 2300);
  });
}


