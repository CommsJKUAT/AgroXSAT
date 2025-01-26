import time
import base64
import zlib
import os
import serial
from picamera2 import Picamera2, Preview
from gpiozero import Button

# GPIO pins setup
pin_17 = Button(17, pull_up=True)  # Active-high for pin 17
pin_27 = Button(27, pull_up=True)  # Active-high for pin 27

try:
    print("Waiting for the trigger condition (Pin 17 HIGH and Pin 27 LOW)...")
    while True:
        # Check pin states: Pin 17 HIGH and Pin 27 LOW
        if pin_17.is_pressed and not pin_27.is_pressed:
            print("Trigger condition met! Capturing an image...")

            # Create an instance of Picamera2 and start the camera
            picam2 = Picamera2()
            preview_config = picam2.create_preview_configuration(main={"size": (800, 600)})
            picam2.configure(preview_config)

            # Start the preview
            picam2.start_preview(Preview.QTGL)
            picam2.start()  # Start capturing

            # Increment image numbers
            image_number = 1
            while os.path.exists(f"./images/pictureperfect{image_number}.jpg"):
                image_number += 1

            # Capture a file
            image_file = f"./images/pictureperfect{image_number}.jpg"
            metadata = picam2.capture_file(image_file)
            print(f"Image saved: {image_file}")
            print(metadata)

            # Convert image to base64 string
            with open(image_file, "rb") as file:
                image_data = file.read()
            image_string = base64.b64encode(image_data).decode('utf-8')

            # Compress the image string
            compressed_data = zlib.compress(image_string.encode('utf-8'))

            # Increment file numbers
            file_number = 1
            while os.path.exists(f"./strings/image_string_{file_number}.txt"):
                file_number += 1

            # Save the string and compressed string to files
            string_file = f"./strings/image_string_{file_number}.txt"
            compressed_file = f"./compressed/compressed_data_{file_number}.txt"

            os.makedirs("./strings", exist_ok=True)  # Ensure directory exists
            os.makedirs("./compressed", exist_ok=True)  # Ensure directory exists

            with open(string_file, "w") as file:
                file.write(image_string)

            with open(compressed_file, "wb") as file:
                file.write(compressed_data)

            print(f"Image string saved: {string_file}")
            print(f"Compressed data saved: {compressed_file}")

            # Stop the camera and close it
            picam2.close()
            print("Camera closed.")

            # Wait for the trigger condition to reset
            print("Waiting for the pins to reset...")
            while pin_17.is_pressed and not pin_27.is_pressed:
                time.sleep(0.1)  # Avoid busy-waiting
        else:
            print("Trigger condition not met (Pin 17 HIGH and Pin 27 LOW)")

        
        # Short delay to avoid excessive polling
        time.sleep(0.1)

except KeyboardInterrupt:
    print("Exiting...")
finally:
    # Ensure the camera is closed if it's still open
    try:
        picam2.close()
    except NameError:
        pass
    
