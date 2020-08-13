//////////////////////////////////
// Setup
//////////////////////////////////

//See audio buffering example: https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer

console.log('Warning: assuming fs=44100. Double-check system abilities! Then delete this warning.');
var fs = 44100;

const button = document.querySelector('button');
const myScript = document.querySelector('script');

let AudioContext = window.AudioContext || window.webkitAudioContext;
let aud_ctx;
let source;

//Mono
let channels = 1;

function init() {
  aud_ctx = new AudioContext();
}



//////////////////////////////////
// Tone scramble generating functions
//////////////////////////////////

//Create array containing tone scramble waveform from array containing sequence of frequencies
function freqs_2_wave(freqs) {
    //Parameters
    let pip_duration = 0.0650;
    let pip_len      = Math.ceil(fs * pip_duration);
    let ramp_dur     = 0.0225;
    let r            = Math.ceil(ramp_dur * fs);

    //Create the ramp-damp mask
    let damp = sv_prod(1/2, sv_sum(1, cos_vec(sv_prod(Math.PI / r, Array.from(Array(r).keys())))));
    let ramp = sv_sum(1, sv_prod(-1, damp));
    let mask = ramp.concat(ones(pip_len - 2 * r).concat(damp));

    //Create scramble waveform
    var waveform = new Array;
    for (let f = 0; f < freqs.length; f++) {
        if (Number.isNaN(freqs[f])) {
            waveform = waveform.concat(sv_prod(0, ones(pip_len)));
        }else{
            waveform = waveform.concat(ew_prod(mask, cos_vec(sv_prod(2 * Math.PI * freqs[f] / fs, Array.from(Array(pip_len).keys())))))
        }
    }
    return waveform;
}

//Create array containing sequence of frequencies from an array containing a sequence of semitone distances from tonic, assuming TET    
function seq_2_freqs(seq, f_I) {
    let result = new Array(seq.length);
    for (let k = 0; k < seq.length; k++) {
        result[k] = f_I * Math.pow(2, seq[k] / 12);
    }
    return result;
}

//Create a sequence for the tone scramble
function gen_seq(stim_type) {
    //Semitone value of the target
    tgt = (stim_type == "minor" ? 3 : 4);

    //Number of pips per frequency (minimum 2)
    let n_each = 3;
    
    //Put all the notes in a vector
    var SEQ = zeros(n_each).concat(sv_prod(tgt, ones(n_each))).concat(sv_prod(7, ones(n_each))).concat(sv_prod(12, ones(n_each)));
    
    //Scramble the vector
    SEQ = v_i(SEQ, randperm(SEQ.length));
    
    //Done
    return SEQ;
}



//////////////////////////////////
// Play a tone scramble
//////////////////////////////////
function play_scramble(scramble_type) {
    //scramble_type : 1 (minor, same), 2 (major, different)
    //same_diff     : boolean. true when the task is a same-different task
    //reference     : the type of the first scramble (1: minor, 2: major)
    
    //Create audio context if it hasn't been made already (some browsers will prevent the audio context from being created before user input)
    if(!aud_ctx) {
        init();
    }
    
    //Always use 783.99 Hz as the tonic (as in Chubb et al, 2013)
    let f_I = 783.99;
    
    //Generate stimulus based on task type
    var seq;
    var freqs;
    var scramble;

    //Create the tone scramble waveform / PCM data
    seq      = gen_seq(scramble_type);
    freqs    = seq_2_freqs(seq, f_I);
    scramble = freqs_2_wave(freqs);
        
    //Initialize the audio buffer for playback
    let frame_count = scramble.length;
    let arr_buf = aud_ctx.createBuffer(channels, frame_count, aud_ctx.sampleRate);

    //Fill the buffer with the tone scramble waveform
    for (let channel = 0; channel < channels; channel++) {
      //This gives us the actual array that contains the data
      let now_buffering = arr_buf.getChannelData(channel);
      for (let k = 0; k < frame_count; k++) {
          now_buffering[k] = scramble[k];
      }
    }

    //Get an AudioBufferSourceNode; this is the AudioNode to use when we want to play an AudioBuffer
    source = aud_ctx.createBufferSource();
    source.buffer = arr_buf;             //Set the buffer in the AudioBufferSourceNode
    source.connect(aud_ctx.destination); //Connect the AudioBufferSourceNode to the destination so we can hear the sound
    source.start();                      //Start the source playing

    //Print a message to the console when the sound is done playing
    /*source.onended = () => {
        console.log('Sound finished.');
    }*/
    
    //Playback initiated, return an object with all the scramble parameters
    var trial_obj = new Object();
    trial_obj.seq = seq;
    trial_obj.freqs = freqs;
    trial_obj.f_I = f_I;
    return trial_obj;
}

//End playback of tone scramble if subject responds early
// TODO: ending early often causes a click to be heard (playback is immediately halted). Ideally, the playback would be ramped down.
function stop_scramble() {
    source.stop();
}