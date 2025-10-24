import RPi.GPIO as GPIO
import time

# Set up GPIO
GPIO.setmode(GPIO.BCM)  # Use BCM numbering
GPIO.setup(7, GPIO.OUT) # Set pin 7 as output

try:
    while True:
        GPIO.output(7, GPIO.HIGH)  # Turn ON
        print("GPIO 7 ON")
        time.sleep(5)              # Wait 5 seconds
        
        GPIO.output(7, GPIO.LOW)   # Turn OFF
        print("GPIO 7 OFF")
        time.sleep(5)              # Wait 5 seconds

except KeyboardInterrupt:
    print("\nStopped by user")

finally:
    GPIO.cleanup()  # Clean up GPIO settings on exit