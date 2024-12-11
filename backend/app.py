import os
import time
import json
import RPi.GPIO as GPIO  # Replace with OrangePi.GPIO for Orange Pi compatibility
import usb.core
import usb.util
from flask import Flask, jsonify, request

app = Flask(__name__)

# GPIO configuration
COIN_PIN = 17  # Example GPIO pin for coin inserter
GPIO.setmode(GPIO.BCM)
GPIO.setup(COIN_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

# State variables
coins_inserted = 0
purchase_log = []

# Printer configuration
USB_VENDOR_ID = 0x1234  # Replace with your printer's vendor ID
USB_PRODUCT_ID = 0x5678  # Replace with your printer's product ID
printer = usb.core.find(idVendor=USB_VENDOR_ID, idProduct=USB_PRODUCT_ID)

if printer is None:
    raise ValueError("Printer not found. Check USB connection.")

# Function to initialize printer
def initialize_printer():
    printer.set_configuration()

# Function to print voucher
def print_voucher(package_time, package_amount):
    try:
        initialize_printer()
        voucher_text = f"""
        -------------------------
        Thank you for your purchase!
        Package: {package_time}
        Price: {package_amount}.00 coins
        -------------------------
        """
        # Send data to printer
        printer.write(1, voucher_text.encode('utf-8'))
        printer.write(1, b"\n\n\n")  # Add extra line feeds
        print("Voucher printed successfully.")
    except Exception as e:
        print(f"Error printing voucher: {e}")

# GPIO callback for coin insertion
def coin_inserted(channel):
    global coins_inserted
    coins_inserted += 1
    print(f"Coin detected. Total coins: {coins_inserted}")

GPIO.add_event_detect(COIN_PIN, GPIO.RISING, callback=coin_inserted, bouncetime=300)

# API endpoints
@app.route("/api/coins", methods=["GET"])
def get_coins():
    return jsonify({"coins": coins_inserted})

@app.route("/api/purchase", methods=["POST"])
def purchase():
    global coins_inserted
    data = request.json
    package_time = data.get("time")
    package_amount = data.get("amount")

    if not package_time or not package_amount:
        return jsonify({"error": "Invalid package details"}), 400

    if coins_inserted < package_amount:
        return jsonify({"error": "Insufficient coins"}), 400

    coins_inserted -= package_amount
    purchase_log.append({"time": package_time, "amount": package_amount, "timestamp": time.time()})

    # Print the voucher
    print_voucher(package_time, package_amount)

    return jsonify({"success": True, "remaining_coins": coins_inserted})

@app.route("/api/reset", methods=["POST"])
def reset():
    global coins_inserted, purchase_log
    coins_inserted = 0
    purchase_log = []
    return jsonify({"success": True})

# Run the server
if __name__ == "__main__":
    try:
        app.run(host="0.0.0.0", port=5000, debug=True)
    except KeyboardInterrupt:
        print("Server shutting down...")
    finally:
        GPIO.cleanup()
