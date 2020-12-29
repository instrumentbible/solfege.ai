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



## Hand Signs

| hand sign | name | pitch class <br>(distance from C) | equivalent note |
| :-: | :-: |:-: |:-: |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/do.png?raw=true" width="100" height="100" /> | do | 0  | C  |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/di.png?raw=true" width="100" height="100" /> | di | 1  | C# |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/ra.png?raw=true" width="100" height="100" /> | ra | 1  | Db |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/re.png?raw=true" width="100" height="100" /> | re | 2  | D  |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/ri.png?raw=true" width="100" height="100" /> | ri | 3  | D# | 
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/me.png?raw=true" width="100" height="100" /> | me | 3  | Eb |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/mi.png?raw=true" width="100" height="100" /> | mi | 4  | E  |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/fa.png?raw=true" width="100" height="100" /> | fa | 5  | F  |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/fi.png?raw=true" width="100" height="100" /> | fi | 6  | F# |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/se.png?raw=true" width="100" height="100" /> | se | 6  | Gb |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/so.png?raw=true" width="100" height="100" /> | so | 7  | G  |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/si.png?raw=true" width="100" height="100" /> | si | 8  | G# |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/le.png?raw=true" width="100" height="100" /> | le | 8  | Ab |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/la.png?raw=true" width="100" height="100" /> | la | 9  | A  |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/li.png?raw=true" width="100" height="100" /> | li | 10 | A# |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/te.png?raw=true" width="100" height="100" /> | te | 10 | Bb |
|<img src="https://github.com/instrumentbible/solfege/blob/main/img/ti.png?raw=true" width="100" height="100" /> | ti | 11 | B  |

