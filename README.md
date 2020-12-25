# solfege
Detect solfege hand signs using machine learning ([live demo](https://instrumentbible.github.io/solfege/))
> a project by [Ryan Kemmer](https://github.com/ryankemmer) and [Josh Stovall](https://github.com/joshstovall)

## About
We have developed a system that allows the user to 'play' [solfege hand signs](https://en.wikipedia.org/wiki/Solfege) as a MIDI instrument.    This technology could have practical applications both in music education and creation.

Solfege hand signs are often used in school choirs to teach music theory concepts.  Since vocalists cannot actually see the notes on their instrument, hand signs have been developed as a teaching aid.

This system allows students to play the hand signs as an instrument -- recieving auditory feedback.  Previously, a student learning solfege would have to sing the note or play another instrument to 'hear' their hand signs.

## Libraries

This project uses [TensorFlow](https://github.com/tensorflow/tensorflow), [MediaPipe](https://google.github.io/mediapipe/solutions/hands.html), and [JZZ.js](https://github.com/jazz-soft/JZZ).

## Setup
```
cd solfege
php -S 0.0.0.0:1234
```
go to `http://localhost:1234`

## Use
### creating data sets
* make a hand sign
* click the button to create training data
* it will wait 1 second, start recording data for 30 seconds, then save a file with the data
