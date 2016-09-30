const Gpio = require('onoff').Gpio;
const express =  require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(__dirname + '/.'));
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

//Gpio pins setup
const leftMotorF = new Gpio(20, 'out');
const leftMotorB = new Gpio(21, 'out');

const rightMotorF = new Gpio(12, 'out');
const rightMotorB = new Gpio(16, 'out');

const stop = () => {
    leftMotorB.writeSync(0);
    leftMotorF.writeSync(0);
    rightMotorF.writeSync(0);
    rightMotorB.writeSync(0);
};

const forward = () => {
    leftMotorB.writeSync(0);
    rightMotorB.writeSync(0);

    leftMotorF.writeSync(1);
    rightMotorF.writeSync(1);
};

const back = () => {
    leftMotorF.writeSync(0);
    rightMotorF.writeSync(0);

    leftMotorB.writeSync(1);
    rightMotorB.writeSync(1);
};

const left = () => {
    stop();
    rightMotorF.writeSync(1);
};

const right = () => {
    stop();
    leftMotorF.writeSync(1);
};

const directions = {
    forward,
    back,
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