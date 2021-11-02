const video		= document.getElementsByTagName('video' )[0];
const canvas	= document.getElementsByTagName('canvas')[0];
const img		= document.getElementById('handsign');
const ctx		= canvas.getContext('2d');
const log		= document.getElementById('log' );

// hand data
var hand = {
	right:{
		points   : { x:[], y:[] }, // X/Y coordinates
		distance : { x:[], y:[] }, // distance from wrist
		normal   : { x:[], y:[] }  // normalized data
	},
	left:{
		points   : { x:[], y:[] },
		distance : { x:[], y:[] },
		normal   : { x:[], y:[] }
	}
}

function onResults(results) {

	// if a hand is being tracked...
	if(results.multiHandedness){
		console.log(results)
		// clear hand data
		hand.left  = { points: { x:[], y:[] }, distance: { x:[], y:[] }, normal: { x:[], y:[] } }
		hand.right = { points: { x:[], y:[] }, distance: { x:[], y:[] }, normal: { x:[], y:[] } }

		// for each visible hand
		results.multiHandLandmarks.forEach( function (e, i, arr) {

			// if right hand
			if(results.multiHandedness[i].label == 'Right'){
				hand.right = { points: { x:[], y:[] }, distance: { x:[], y:[] }, normal: { x:[], y:[] } }

				// get X/Y points
				var points = new Promise((resolve, reject) => {
					e.forEach((e, i, a) => {
						hand.right.points.x.push(e.x);
						hand.right.points.y.push(e.y);
						if (i === a.length -1) resolve();
					});
				});
				
				// calculate the difference between points
				var difference	= new Promise((resolve, reject) => {
					var x		= new Promise((resolve, reject) => { hand.right.points.x.forEach((e, i, a) => { hand.right.distance.x.push(diff(hand.right.points.x[0], e)); if (i === a.length -1) {resolve();} }); });
					var y		= new Promise((resolve, reject) => { hand.right.points.y.forEach((e, i, a) => { hand.right.distance.y.push(diff(hand.right.points.y[0], e)); if (i === a.length -1) {resolve();} }); });
					x.then(() => { y.then(() => { resolve() })});
				});
				
				// normalize the data from 0 to 1
				var normal		= new Promise((resolve, reject) => {
					var x		= new Promise((resolve, reject) => { hand.right.distance.x.forEach((e, i, a) => { hand.right.normal.x.push(normalize(e, Math.max(...hand.right.distance.x))); if (i === a.length -1) {resolve();} }); });
					var y		= new Promise((resolve, reject) => { hand.right.distance.y.forEach((e, i, a) => { hand.right.normal.y.push(normalize(e, Math.max(...hand.right.distance.y))); if (i === a.length -1) {resolve();} }); });
					x.then(() => { y.then(() => { resolve() })});
				});
				points.then(() => { difference.then(() => { normal.then(() => { predictFrame(hand.right.normal.x.concat(hand.right.normal.y), 'right', scale); }); }); });
				showData()
			}

			// if left hand
			if(results.multiHandedness[i].label == 'Left' ){
				hand.left  = { points: { x:[], y:[] }, distance: { x:[], y:[] }, normal: { x:[], y:[] } }

				var points = new Promise((resolve, reject) => {
					e.forEach((e, i, a) => {
						hand.left.points.x.push(flip(e.x)); // flip the X axis (now both right & left hand will return same data)
						hand.left.points.y.push(e.y);
						if (i === a.length -1) resolve();
					});
				});
				var difference	= new Promise((resolve, reject) => {
					var x		= new Promise((resolve, reject) => { hand.left.points.x.forEach((e, i, a) => { hand.left.distance.x.push(diff(hand.left.points.x[0], e)); if (i === a.length -1) {resolve();} }); });
					var y		= new Promise((resolve, reject) => { hand.left.points.y.forEach((e, i, a) => { hand.left.distance.y.push(diff(hand.left.points.y[0], e)); if (i === a.length -1) {resolve();} }); });
					x.then(() => { y.then(() => { resolve() })});
				});
				var normal		= new Promise((resolve, reject) => {
					var x		= new Promise((resolve, reject) => { hand.left.distance.x.forEach((e, i, a) => { hand.left.normal.x.push(normalize(e, Math.max(...hand.left.distance.x))); if (i === a.length -1) {resolve();} }); });
					var y		= new Promise((resolve, reject) => { hand.left.distance.y.forEach((e, i, a) => { hand.left.normal.y.push(normalize(e, Math.max(...hand.left.distance.y))); if (i === a.length -1) {resolve();} }); });
					x.then(() => { y.then(() => { resolve() })});
				});
				points.then(() => { difference.then(() => { normal.then(() => { predictFrame(hand.left.normal.x.concat(hand.left.normal.y), 'left', scale); }); }); });
				showData()
			}
		})
	}

	// draw hands
	ctx.save();
	ctx.clearRect(				 0, 0, canvas.width, canvas.height);
	ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
	if (results.multiHandLandmarks) {
		for (const landmarks of results.multiHandLandmarks) {
			drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
			drawLandmarks (ctx, landmarks, 					 {color: '#FF0000', lineWidth: 2});
		}
	}
	ctx.restore();
	
}

// setup hands
const hands = new Hands({locateFile: (file) => { return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3.1632795355/${file}`; }});
hands.setOptions({  maxNumHands: 2,  minDetectionConfidence: 0.5,  minTrackingConfidence: 0.5 });
hands.onResults(onResults);

// camera setup
new Camera(video, { onFrame: async () => { await hands.send({ image: video }); }, width: 1280, height: 720 }).start();

var tempData = [];
// add listener to all buttons
document.querySelectorAll('button').forEach(btn => {
   btn.addEventListener('click', e => {
	   tempData = [];
	
	   // wait 1 second
	   setTimeout(function timer() {
		   print("starting...")

		   // push 2000 sets of data, at 25ms interval
		   for (let i = 1; i < 1000; i++) {
			 setTimeout(function timer() {
				 if(hand.left.points.x[0] ){ tempData.push(hand.left)  }
				 if(hand.right.points.x[0]){ tempData.push(hand.right) }
				 print("training... step " + (i+ 1));
				 if(i == 999){saveData()}
			 }, i * 25);
		   }
	   }, 1000);
	   
	   function saveData(){
		   print("training done")
		   exportJSON(tempData, btn.id + '.json');
	   }
	});
});

// print
function print(e){
	log.innerHTML = e;
	console.log(e);
}


// show the live data to html
function showData(){
	if(hand.right.normal.x[1]){
		hand.right.normal.x.forEach( function (e, i, arr) { document.getElementsByClassName("xcoord")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = round(e) })
		hand.right.normal.y.forEach( function (e, i, arr) { document.getElementsByClassName("ycoord")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = round(e) })
		hand.right.distance.x.forEach( function (e, i, arr) { document.getElementsByClassName("xdistanceRight")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = round(e)})
		hand.right.distance.y.forEach( function (e, i, arr) { document.getElementsByClassName("ydistanceRight")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = round(e)})
		hand.right.normal.x.forEach( function (e, i, arr) {
			document.getElementsByClassName("xnormalRight")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = round(e)
			document.getElementsByClassName("xnormalRight")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].style.opacity = e
		 })
		hand.right.normal.y.forEach( function (e, i, arr) {
			document.getElementsByClassName("ynormalRight")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = round(e)
			document.getElementsByClassName("ynormalRight")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].style.opacity = e
		 })
	}
	if(hand.left.normal.x[1]){
		hand.left.normal.y.forEach( function (e, i, arr) { document.getElementsByClassName("ycoordLeft")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = round(e)})
		hand.left.normal.x.forEach( function (e, i, arr) { document.getElementsByClassName("xcoordLeft")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = round(e)})
		hand.left.distance.y.forEach( function (e, i, arr) { document.getElementsByClassName("ydistanceLeft")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = round(e)})
		hand.left.distance.x.forEach( function (e, i, arr) { document.getElementsByClassName("xdistanceLeft")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = round(e)})
		hand.left.normal.y.forEach( function (e, i, arr) {
			document.getElementsByClassName("ynormalLeft")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = round(e)
			document.getElementsByClassName("ynormalLeft")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].style.opacity = e
		})
		hand.left.normal.x.forEach( function (e, i, arr) {
			document.getElementsByClassName("xnormalLeft")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = round(e)
			document.getElementsByClassName("xnormalLeft")[0].getElementsByTagName('td')[i].getElementsByTagName('input')[0].style.opacity = e
		})
	}
	
}

// round printed data to 2 decimals
function round(e){
	return parseFloat(e).toFixed(2)
}

	
// export json
function exportJSON(e, filename) {
	let link = document.createElement('a');
		link.setAttribute('href', 'data:application/json;charset=utf-8,'+ encodeURIComponent(JSON.stringify(e, undefined, 2)));
		link.setAttribute('download', filename);
		link.click();
}

// calculate the difference between two numbers
function diff (a, b) {
  if (a > b) { return a - b }
  else 		 { return b - a }
}

// normalize values in range of 0 to 1
function normalize(val, max) { return (val - 0) / (max - 0); }

// reverse 0-1 to 1-0, (for fliping left hand X axis data)
function flip(e) {  return (1 - 0) + ((0 - 1) / (1 - 0)) * e; };


// load the model
const loadModel = async (scale) => {
	if (scale == 'major'){
		model = await tf.loadLayersModel('models/major/model.json');
		console.log('major loaded')
	}
	else if(scale == 'chromatic'){
		model = await tf.loadLayersModel('models/chromatic/model.json');
		console.log('chromatic loaded')
	}
	else if(scale == 'minor'){
		model = await tf.loadLayersModel('models/minor/model.json');
		console.log('minor loaded')
	}
}

var handsigns
var scale
var model

var handsignsAll = ['do','di','ra','re','ri','me','mi','fa','fi','se','so','si','le','la','li','te','ti'];
									  
// midi value for each handsign
var solfegeMIDI = {	'do':0, 'di':1, 'ra':1, 're':2, 'ri':3, 'me':3, 'mi':4, 'fa':5, 'fi':6, 'se':6, 'so':7, 'si':8, 'le':8, 'la':9, 'li':10, 'te':10, 'ti':11 }

//load default (major scale)
scale = 'major'
handsigns = ['do','re','mi','fa','so','la','ti']
loadModel(scale)

//event listener for scale
document.querySelectorAll('input').forEach(btn => {
	btn.addEventListener('click', e => {
		if (btn.id == 'major'){
			scale = 'major'
			handsigns = ['do','re','mi','fa','so','la','ti']
			loadModel(scale)
		}
		else if (btn.id == 'minor'){
			scale = 'minor'
			handsigns = ['do','re','me','fa','so','le','te']
			loadModel(scale)
		}
		else if (btn.id == 'chromatic'){
			scale = 'chromatic'
			handsigns = ['do','di','ra','re','ri','me','mi','fa','fi','se','so','si','le','la','li','te','ti']
			loadModel(scale)
		}

	});
});
					  
//async function to make prediction
const predictFrame = async (pred_array, handedness, scale) => {

	// if model is loaded
	if (model){
		
		// run current data through model
		const prediction =  model.predict(tf.tensor2d(pred_array,[1,42]));
		
		// returns an array of probabilty for each hand sign
		var probabilty = prediction.dataSync();
		
		if (scale == 'chromatic'){
			// if Fa or Fi,  detect if thumb is up or down
			if(probabilty[7] > 0.8 || probabilty[8] > 0.8 ){
				if(handedness == 'left'){
					if(hand.left.points.y[4] < hand.left.points.y[17]){probabilty[7] = 0;probabilty[8] = 1;}else{probabilty[7] = 1;probabilty[8] = 0;}
				}
				else {
					if(hand.right.points.y[4] < hand.right.points.y[17]){probabilty[7] = 0;probabilty[8] = 1;}else{probabilty[7] = 1;probabilty[8] = 0;}
				}
			}
		}
		
		probabilty.forEach(
			function (e, i, arr) {
				
			if(handedness == 'left'){
				document.getElementsByClassName(handsigns[i])[1].value = (e * 100);
				document.getElementsByClassName(handsigns[i])[1].style.opacity =   e + 0.2;
				document.getElementsByClassName("probLeft")[0].getElementsByTagName('td')[handsignsAll.indexOf(handsigns[i])].getElementsByTagName('img')[0].style.opacity = e+ 0.1
			}
			else {
				document.getElementsByClassName(handsigns[i])[0].value = (e * 100);
				document.getElementsByClassName(handsigns[i])[0].style.opacity =   e + 0.2;
				document.getElementsByClassName("probRight")[0].getElementsByTagName('td')[handsignsAll.indexOf(handsigns[i])].getElementsByTagName('img')[0].style.opacity = e + 0.1
			}
		})

					
		// returns index of highest likely hand sign
		var getIndex = probabilty.indexOf(Math.max(...probabilty));
		
		showResult( getIndex, handedness)
	}
		
	// else, load the model
	else { loadModel(scale)}
}


// keep track of the current hand sign for each hand
// [current sign index, number of times in a row]
var currentLeft  = [0,0]
var currentRight = [0,0]
						  
// update <img> and play MIDI
function showResult(e, handedness){
		
	if(handedness == 'left'){

		// only play MIDI if hand has been the same sign 5 frames in a row
		if(currentLeft[1] > 5 && currentLeft[0] != e){
			document.getElementsByClassName(handsigns[currentLeft[0]])[1].style.color =  'black';
			currentLeft[0] = e;
			currentLeft[1] = 0;
			
			document.getElementById('lefthand').src = "img/" + handsigns[e] + ".png";
			document.getElementById('leftprediction').innerHTML = handsigns[e];

			leftMIDI.allNotesOff(0); // clear current MIDI note
			leftMIDI.noteOn(0, solfegeMIDI[handsigns[e]] + 60, 127); // play MIDI
			
		} else {
			currentLeft[1]++
		}
		
	}
		
	else if(handedness == 'right'){
		if(currentRight[1] >15 && currentRight[0] != e){
			document.getElementsByClassName(handsigns[currentRight[0]])[0].style.color =  'black';
			currentRight[0] = e;
			currentRight[1] = 0;
			
			document.getElementById('righthand').src = "img/" + handsigns[e] + ".png";
			document.getElementById('rightprediction').innerHTML =  handsigns[e];

			rightMIDI.allNotesOff(0);
			rightMIDI.noteOn(0, solfegeMIDI[handsigns[e]] + 60, 127);
			
		} else {
			currentRight[1]++
		}
	}
		
}
