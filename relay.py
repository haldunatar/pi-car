import RPi.GPIO as GPIO
import time

# Relay pin (use BCM numbering)
RELAY_PIN = 18  # Change to your relay GPIO pin

# Setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(RELAY_PIN, GPIO.OUT)

def motor_on():
    GPIO.output(RELAY_PIN, GPIO.HIGH)  # Relay ON (check your relay module)

def motor_off():
    GPIO.output(RELAY_PIN, GPIO.LOW)   # Relay OFF

try:
    print("Motor Control - Press Ctrl+C to stop")
    
    # Turn motor on for 5 seconds
    motor_on()
    print("Motor ON")
    time.sleep(5)
    
    # Turn motor off
    motor_off()
    print("Motor OFF")
    
    # Simple loop example
    while True:
        motor_on()
        print("Motor ON")
        time.sleep(2)
        
        motor_off()
        print("Motor OFF")
        time.sleep(2)

except KeyboardInterrupt:
    print("\nStopping...")
finally:
    motor_off()  # Ensure motor is off
    GPIO.cleanup()