# relay_blink_with_button_log.py
import RPi.GPIO as GPIO
import time
import threading

# ---------- PINS ----------
RELAY  = 18   # Physical pin 12 → active-LOW relay
BUTTON = 17   # Physical pin 11 → push button

# ---------- SETUP ----------
GPIO.setmode(GPIO.BCM)

# Relay
GPIO.setup(RELAY, GPIO.OUT)
GPIO.output(RELAY, GPIO.HIGH)        # HIGH = OFF (active-low)

# Button (pull-down)
GPIO.setup(BUTTON, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

# ---------- RELAY BLINK (in background) ----------
def relay_blink():
    while True:
        GPIO.output(RELAY, GPIO.LOW)   # Lamp ON
        print("LAMP ON")
        time.sleep(5)

        GPIO.output(RELAY, GPIO.HIGH)  # Lamp OFF
        print("LAMP OFF")
        time.sleep(5)

# Start relay blinking in a separate thread
threading.Thread(target=relay_blink, daemon=True).start()

# ---------- BUTTON LOGGING (main thread) ----------
print("Button monitoring started. Press button to see logs.")
print("Relay runs independently.")

prev_state = False

try:
    while True:
        current_state = GPIO.input(BUTTON) == GPIO.HIGH

        # Detect PRESS (LOW → HIGH)
        if current_state and not prev_state:
            print("BUTTON PRESSED")

        # Detect RELEASE (HIGH → LOW)
        elif not current_state and prev_state:
            print("BUTTON RELEASED")

        prev_state = current_state
        time.sleep(0.01)  # small delay, low CPU

except KeyboardInterrupt:
    print("\nStopped by user")

finally:
    GPIO.output(RELAY, GPIO.HIGH)  # Ensure lamp OFF
    GPIO.cleanup()
    print("GPIO cleaned up. Bye!")