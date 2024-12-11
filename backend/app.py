from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit
from escpos.printer import Usb
import OPi.GPIO as GPIO
import time
import csv
import json
import os
from datetime import datetime 

app = Flask(__name__)
socketio = SocketIO(app)

GPIO.setmode(GPIO.BOARD)

VENDOR_ID = 0x20d1
PRODUCT_ID = 0x7009

# Initialize the printer object
printer = Usb(VENDOR_ID, PRODUCT_ID)

COIN_SENSOR_PIN = 3  # GPIO pin connected to the coin acceptor
ENABLE_PIN = 5

coin_count = 0  # Total value of coins inserted
pulse_count = 0  # To count pulses for determining coin type
last_pulse_time = time.time()  # Tracks the time of the last pulse

# Load vouchers from CSV file
def load_vouchers():
    vouchers = {}
    try:
        with open("vouchers.csv", mode='r', newline='') as file:
            csv_reader = csv.reader(file)
            for row in csv_reader:
                amount = int(row[0])
                voucher_code = row[1]
                if amount in vouchers:
                    vouchers[amount].append(voucher_code)
                else:
                    vouchers[amount] = [voucher_code]
    except FileNotFoundError:
        print("Error: vouchers.csv file not found!")
    return vouchers
    
# Save vouchers back to the CSV file
def save_vouchers(vouchers):
    with open("vouchers.csv", mode='w', newline='') as file:
        csv_writer = csv.writer(file)
        for amount, codes in vouchers.items():
            for code in codes:
                csv_writer.writerow([amount, code])

# Print the total count of vouchers per amount
def print_voucher_totals(vouchers):
    print("Available vouchers:")
    for amount, codes in vouchers.items():
        print(f"{amount} pesos: {len(codes)}")
    print()

vouchers = load_vouchers()
print_voucher_totals(vouchers)  # Print initial voucher totals

# Append log entry to logs.json
def log_voucher_use(amount, voucher_code):
    log_entry = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "time": datetime.now().strftime("%H:%M:%S"),
        "amount": amount,
        "voucher_code": voucher_code
    }
    try:
        if os.path.exists("logs.json"):
            with open("logs.json", mode='r') as file:
                logs = json.load(file)
        else:
            logs = []

        logs.append(log_entry)

        with open("logs.json", mode='w') as file:
            json.dump(logs, file, indent=4)
        print("Log entry added:", log_entry)
    except FileNotFoundError:
        print("Error: File not found")
    except Exception as e:
        print("Error writing to logs.json:", e)

def coin_inserted(channel):
    global last_pulse_time, pulse_count, coin_count
    current_time = time.time()
    pulse_count += 1
    last_pulse_time = current_time

# Set up the GPIO pin for the coin sensor
GPIO.setup(COIN_SENSOR_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(ENABLE_PIN, GPIO.OUT)
GPIO.output(ENABLE_PIN, GPIO.LOW)

# Add event detection for coin insertion
GPIO.add_event_detect(COIN_SENSOR_PIN, GPIO.RISING, callback=coin_inserted, bouncetime=50)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('start_coin_acceptance')
def start_coin_acceptance():
    global pulse_count, coin_count, last_pulse_time

    GPIO.output(ENABLE_PIN, GPIO.HIGH)
    print("Waiting for coins to be inserted...")
    emit('message', {'status': 'Coin acceptance started'})

    try:
        while True:
            current_time = time.time()
            if pulse_count > 0 and current_time - last_pulse_time > 0.5:
                if pulse_count == 1:
                    coin_value = 1
                    print("1 peso inserted")
                elif pulse_count == 5:
                    coin_value = 5
                elif pulse_count == 10:
                    coin_value = 10
                else:
                    coin_value = 0

                coin_count += coin_value
                print(f"Current total: {coin_count} pesos")

                pulse_count = 0

                emit('coin_update', {'coin_count': coin_count}, broadcast=True)
                
               # Enable buttons based on the total coin count
                emit('update_buttons', {'coin_count': coin_count})

                if coin_count >= 20:
                    GPIO.output(ENABLE_PIN, GPIO.LOW)
                    break
            socketio.sleep(0.1)

    except KeyboardInterrupt:
        GPIO.cleanup()

    return jsonify({'message': 'Coin acceptance completed', 'coin_count': coin_count})

@socketio.on('voucher_button_click')
def voucher_button_click(amount):
    global coin_count
    print(f"Amount received: {amount} pesos")
    print(f"Current coin count: {coin_count} pesos")
    
    if amount in vouchers and vouchers[amount]:
        voucher_code = vouchers[amount].pop(0)  # Retrieve the voucher code
        print(f"Dispensing voucher code: {voucher_code}")
        
        # Save updated vouchers to CSV
        save_vouchers(vouchers)
        
        # Log the usage of the voucher
        log_voucher_use(amount, voucher_code)
        
        # Print updated voucher totals
        print_voucher_totals(vouchers)
        
        # Print voucher code
        printer.text(f"Voucher Code: {voucher_code}\n")
        printer.cut()

        # Reset coin count and pulse count
        coin_count -= amount
        emit('voucher_dispensed', {'voucher_code': voucher_code})
        emit('message', {'status': 'Please get your voucher code'})

        if coin_count == 0:
            GPIO.output(ENABLE_PIN, GPIO.LOW)
            # Reset button states and coin count display
            emit('reset_ui', {'coin_count': coin_count})
        else:
            emit('coin_update', {'coin_count': coin_count}, broadcast=True)
            # Enable buttons based on the total coin count
            emit('update_buttons', {'coin_count': coin_count})
    else:
        emit('voucher_dispensed', {'voucher_code': 'No vouchers available for this amount'})
        print("No vouchers available for this amount.")

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=4000, debug=True)
