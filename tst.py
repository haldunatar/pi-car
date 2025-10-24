import RPi.GPIO as GPIO
import time

# === CONFIGURATION ===
BUTTON_PIN = 17   # Push button input
RELAY_PIN  = 4    # Relay control output
ACTIVE_LOW = True # Set to True if relay triggers on LOW (most modules)

# === SETUP ===
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)  # Pull-down
GPIO.setup(RELAY_PIN, GPIO.OUT)

# Initial state
relay_state = False
GPIO.output(RELAY_PIN, GPIO.LOW if ACTIVE_LOW else GPIO.HIGH)  # Relay OFF

print("Press the button to toggle the light. Ctrl+C to exit.")

try:
    while True:
        if GPIO.input(BUTTON_PIN) == GPIO.HIGH:  # Button pressed
            time.sleep(0.2)  # Debounce
            if GPIO.input(BUTTON_PIN) == GPIO.HIGH:  # Still pressed
                # Toggle relay
                relay_state = not relay_state
                new_state = GPIO.LOW if (relay_state and ACTIVE_LOW) or (not relay_state and not ACTIVE_LOW) else GPIO.HIGH
                GPIO.output(RELAY_PIN, new_state)
                print(f"Light {'ON' if relay_state else 'OFF'}")
                
                # Wait until button released
                while GPIO.input(BUTTON_PIN) == GPIO.HIGH:
                    time.sleep(0.01)

except KeyboardInterrupt:
    print("\nStopped by user")

finally:
    GPIO.cleanup()
    print("GPIO cleaned up.")