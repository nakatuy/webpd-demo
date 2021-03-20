Tone.Transport.bpm.value = 120;

const lpfilter = new Tone.Filter(1800, "lowpass");
const bpfilter = new Tone.Filter(1600, "bandpass");
const feedbackDelay = new Tone.FeedbackDelay("4n", 0.4);
const pingPong = new Tone.PingPongDelay("4n.", 0.2);
const preVol = new Tone.Volume(-26);
const freeverb = new Tone.Freeverb().toDestination();

freeverb.dampening = 1000;
freeverb.roomSize = 0.9;
freeverb.wet = 0.7;

//シンセ生成
const Synth_1 = new Tone.PolySynth(Tone.Synth).chain(preVol, feedbackDelay, freeverb);
const Synth_2 = new Tone.PolySynth(Tone.DuoSynth).chain(lpfilter, preVol, feedbackDelay, freeverb);
const Synth_3 = new Tone.PolySynth(Tone.Synth).chain(bpfilter, preVol, pingPong, freeverb);

// シンセ実行
function playSynth(){
    Pd.receive('midiNo', function(args) {
        Synth_1.triggerAttackRelease(args, "8n")
        Synth_2.triggerAttackRelease(args, "4n")
        Synth_3.triggerAttackRelease(args*6, "2n")
    })
}

const loop = new Tone.Loop((time) => {
    playSynth();
}, 20000).start(0);


function display(){
    Pd.receive('midiNo', function(args) {
        outfreq = "Frequency：" + Math.floor(args*100)/100 + " Hz";
        document.getElementById("pdMidi").innerHTML = outfreq;
    })
}
setInterval('display()',500);