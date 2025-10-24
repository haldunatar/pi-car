# button_toggle_stop_off.py
import RPi.GPIO as GPIO
import time

BUTTON = 17   # physical pin 11
RELAY  = 7    # physical pin 26

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(RELAY,  GPIO.OUT)

# ----- START OFF -----
GPIO.output(RELAY, GPIO.LOW)   # relay OFF
light_on = False

print("Ready – press button to toggle, Ctrl-C to stop (relay will turn OFF)")

try:
    while True:
        if GPIO.input(BUTTON) == GPIO.HIGH:          # button down
            print("BUTTON PRESSED!")
            time.sleep(0.2)                         # debounce
            if GPIO.input(BUTTON) == GPIO.HIGH:      # still down
                light_on = not light_on
                GPIO.output(RELAY, GPIO.HIGH if light_on else GPIO.LOW)
                print(f"Relay -> {'ON' if light_on else 'OFF'}")
                while GPIO.input(BUTTON) == GPIO.HIGH:  # wait release
                    time.sleep(0.01)

except KeyboardInterrupt:          # <-- Ctrl-C
    print("\nCtrl-C received → turning relay OFF")
    GPIO.output(RELAY, GPIO.LOW)   # **force OFF**
    raise                          # let finally run

finally:
    GPIO.cleanup()
    print("GPIO cleaned up. Bye!")