# button_toggle_relay.py
import RPi.GPIO as GPIO
import time

BUTTON = 17   # push-button on physical pin 11
RELAY  = 4    # relay on physical pin 26

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)   # internal pull-down
GPIO.setup(RELAY,  GPIO.OUT)

# Start with relay OFF
GPIO.output(RELAY, GPIO.LOW)
state = False

print("Ready – press the button to toggle the light (Ctrl-C to quit)")

try:
    while True:
        if GPIO.input(BUTTON) == GPIO.HIGH:
            print("BUTTON PRESSED!")      # button pressed
            time.sleep(0.2)                     # simple debounce
            if GPIO.input(BUTTON) == GPIO.HIGH:  # still pressed
                state = not state               # toggle
                GPIO.output(RELAY, GPIO.HIGH if state else GPIO.LOW)
                print("Light:", "ON" if state else "OFF")
                while GPIO.input(BUTTON) == GPIO.HIGH:
                    time.sleep(0.01)        # wait for release
except KeyboardInterrupt:
    print("\nStopped")
finally:
    GPIO.cleanup()