Tone.Transport.bpm.value = 120;

const lpfilter = new Tone.Filter(1800, "lowpass");
const bpfilter = new Tone.Filter(1600, "bandpass");
const feedbackDelay = new Tone.FeedbackDelay("4n", 0.4);
const pingPong = new Tone.PingPongDelay("4n.", 0.4);
const vol_1 = new Tone.Volume(-3);
const freeverb = new Tone.Freeverb().toDestination();

freeverb.dampening = 1000;
freeverb.roomSize = 0.9;
freeverb.wet = 0.9;

//シンセ生成
const Synth_1 = new Tone.PolySynth(Tone.Synth).chain(feedbackDelay, freeverb);
const Synth_2 = new Tone.PolySynth(Tone.DuoSynth).chain(lpfilter, feedbackDelay, vol_1, freeverb);
const Synth_3 = new Tone.PolySynth(Tone.Synth).chain(bpfilter, pingPong, freeverb);

// シンセ実行
function playSynth(){
    Pd.receive('midiNo', function(args) {
        Synth_1.triggerAttackRelease(args+7, "8n")
        Synth_2.triggerAttackRelease(args, "4n")
        Synth_3.triggerAttackRelease(args*6, "2n")
    })
}

const loop = new Tone.Loop((time) => {
    playSynth();
}, 20000).start(0);

Tone.Transport.start();

function audioPlay(){
    Tone.Transport.start();
}

function display(){
    Pd.receive('midiNo', function(args) {
        document.getElementById("pdMidi").innerHTML = args;
    })
}
setInterval('display()',500);