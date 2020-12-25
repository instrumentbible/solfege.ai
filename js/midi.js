/*
JZZ.synth.Tiny().noteOn(0, 'C5', 127)
   .wait(500).noteOn(0, 'E5', 127)
   .wait(500).noteOn(0, 'G5', 127);
   .wait(500).noteOff(0, 'C5').noteOff(0, 'E5').noteOff(0, 'G5');
*/



var leftMIDI =JZZ.input.Kbd({at:'leftMIDI', from:'C5', to:'B5', onCreate:function() {}});
var rightMIDI = JZZ.input.Kbd({at:'rightMIDI', from:'C5', to:'B5', onCreate:function() {}});
	var synth = JZZ.synth.Tiny();



rightMIDI.connect(synth);
leftMIDI.connect(synth);


synth.noteOn(0, 'C5', 127)
  .wait(500).noteOn(0, 'E5', 127)
  .wait(500).noteOn(0, 'G5', 127)
  .wait(500).noteOff(0, 'C5').noteOff(0, 'E5').noteOff(0, 'G5');
