from flask import Flask, request, send_from_directory
from flask_cors import CORS
import RPi.GPIO as GPIO
import os

app = Flask(__name__)
# Enable CORS for all routes, allowing requests from any origin
CORS(app)

# GPIO pins setup (using BCM numbering)
GPIO.setmode(GPIO.BCM)

# Left Motor
leftMotorF = 21
leftMotorB = 20

# Right Motor
rightMotorF = 16
rightMotorB = 12

# Lights
lights = 17

# Initialize GPIO pins
GPIO.setup(leftMotorF, GPIO.OUT)
GPIO.setup(leftMotorB, GPIO.OUT)
GPIO.setup(rightMotorF, GPIO.OUT)
GPIO.setup(rightMotorB, GPIO.OUT)
GPIO.setup(lights, GPIO.OUT)

# Motor and light control functions
def engineOn():
    GPIO.output(lights, GPIO.HIGH)

def engineOff():
    GPIO.output(lights, GPIO.LOW)

def stop():
    GPIO.output(leftMotorF, GPIO.LOW)
    GPIO.output(leftMotorB, GPIO.LOW)
    GPIO.output(rightMotorF, GPIO.LOW)
    GPIO.output(rightMotorB, GPIO.LOW)

def forward():
    GPIO.output(leftMotorB, GPIO.LOW)
    GPIO.output(rightMotorB, GPIO.LOW)
    GPIO.output(leftMotorF, GPIO.HIGH)
    GPIO.output(rightMotorF, GPIO.HIGH)

def back():
    GPIO.output(leftMotorF, GPIO.LOW)
    GPIO.output(rightMotorF, GPIO.LOW)
    GPIO.output(leftMotorB, GPIO.HIGH)
    GPIO.output(rightMotorB, GPIO.HIGH)

def left():
    stop()
    GPIO.output(rightMotorF, GPIO.HIGH)
    GPIO.output(leftMotorB, GPIO.HIGH)

def right():
    stop()
    GPIO.output(leftMotorF, GPIO.HIGH)
    GPIO.output(rightMotorB, GPIO.HIGH)

# Dictionary to map directions to functions
directions = {
    "forward": forward,
    "back": back,
    "left": left,
    "right": right,
    "stop": stop
}

# Serve static files (e.g., index.html)
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# Handle direction control
@app.route('/', methods=['POST'])
def control_direction():
    key = request.json.get('key') if request.is_json else request.form.get('key')
    if key in directions:
        print(key)
        directions[key]()
        return key
    return key or ''

# Handle engine start/stop
@app.route('/start', methods=['POST'])
def control_engine():
    key = request.json.get('key') if request.is_json else request.form.get('key')
    if key:
        print("engine started!")
        engineOn()
        return "engine started!"
    else:
        print("engine stopped!")
        engineOff()
        return "engine stopped!"

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=3000, debug=True)
        print("running on 3000")
    finally:
        # Cleanup GPIO on exit
        GPIO.cleanup()