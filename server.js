const Gpio = require('onoff').Gpio;
const express =  require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(__dirname + '/.'));
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

//Gpio pins setup
/*** Left  Motor ***/
const leftMotorF = new Gpio(21, 'out');
const leftMotorB = new Gpio(20, 'out');

/*** Right  Motor ***/
const rightMotorF = new Gpio(16, 'out');
const rightMotorB = new Gpio(12, 'out');

/*** Lights ***/
const lights = new Gpio(17, 'out');

const engineOn = () =>  lights.writeSync(1);
const engineOff = () =>  lights.writeSync(0);

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
    leftMotorB.writeSync(1);
};

const right = () => {
    stop();
    leftMotorF.writeSync(1);
    rightMotorB.writeSync(1);
};

const directions = {
    forward,
    back,
    left,
    right,
    stop
};

app.get('/', (req, res) =>  res.render('./index.html'));

app.post('/', (req, res) => {
    if(req.body.key) {
        console.log(req.body.key);

        directions[req.body.key]();
        res.send(req.body.key);
    } else {
        res.send(req.body.key);
    }
});

app.post('/start', (req, res) => {
    if(req.body.key) {
        console.log('engine started!');

        engineOn();
        res.send('engine started!');
    } else {
        console.log('engine stopped!');

        engineOff();
        res.send('engine stopped!');
    }
});

app.listen('3000', () => console.log('running on 3000'));