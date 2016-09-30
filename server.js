const Gpio = require('onoff').Gpio;
const express =  require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(__dirname + '/.'));
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

//Gpio pins setup
const leftMotor = new Gpio(19, 'out');
const rightMotor = new Gpio(17, 'out');

const left = () => leftMotor.writeSync(1);
const right = () => rightMotor.writeSync(1);

// Resolve this with h-bridge
// const back = () => {
//     leftMotor.writeSync(1);
//     rightMotor.writeSync(1);
// };

const forward = () => {
    leftMotor.writeSync(1);
    rightMotor.writeSync(1);
};

const stop = () => {
    leftMotor.writeSync(0);
    rightMotor.writeSync(0);
};

const directions = {
    forward,
    left,
    right
};

app.get('/', (req, res) =>  res.render('./index.html'));

app.post('/', (req, res) => {
    if(req.body.key) {
        console.log(directions[req.body.key]);
        directions[req.body.key];
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

app.listen('3000', () => console.log('running on 3000'));