
// pianos
var leftMIDI  = JZZ.input.Kbd({at:'leftMIDI' , from:'C5', to:'B5', onCreate:function() {}});
var rightMIDI = JZZ.input.Kbd({at:'rightMIDI', from:'C5', to:'B5', onCreate:function() {}});
var synth = JZZ.synth.Tiny();

rightMIDI.connect(synth);
leftMIDI.connect(synth);

// midi out
var midi_out = JZZ.gui.SelectMidiOut({ at: 'midi_out' });
rightMIDI.connect(midi_out);
leftMIDI.connect(midi_out);
