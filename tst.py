# button_toggle_gpio4.py
import RPi.GPIO as GPIO
import time

BUTTON = 17   # Physical pin 11 → GPIO 17
RELAY  = 4    # Physical pin 7  → GPIO 4  (YOUR WORKING PIN)

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(RELAY, GPIO.OUT)

# START WITH LAMP OFF
GPIO.output(RELAY, GPIO.LOW)   # LOW = OFF (confirmed by your test)
light_on = False

print("Lamp is OFF. Press button to toggle. Ctrl-C to stop.")

try:
    while True:
        if GPIO.input(BUTTON) == GPIO.HIGH:        # Button pressed
            print("BUTTON PRESSED!")
            time.sleep(0.2)                        # debounce
            if GPIO.input(BUTTON) == GPIO.HIGH:    # still pressed
                light_on = not light_on
                # YOUR RELAY: HIGH = ON, LOW = OFF
                GPIO.output(RELAY, GPIO.HIGH if light_on else GPIO.LOW)
                print(f"Lamp -> {'ON' if light_on else 'OFF'}")
                
                # Wait for button release
                while GPIO.input(BUTTON) == GPIO.HIGH:
                    time.sleep(0.01)

except KeyboardInterrupt:
    print("\nCtrl-C detected → turning lamp OFF")
    GPIO.output(RELAY, GPIO.LOW)   # Force OFF
finally:
    GPIO.cleanup()
    print("GPIO cleaned up. Goodbye!")