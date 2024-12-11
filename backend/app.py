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

# GPIO setup
GPIO.setmode(GPIO.BOARD)
VENDOR_ID = 0x20d1
PRODUCT_ID = 0x7009
COIN_SENSOR_PIN = 3
ENABLE_PIN = 5

coin_count = 0
pulse_count = 0
last_pulse_time = time.time()

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

# Print the total count of vouchers per amount
def print_voucher_totals(vouchers):
    print("Available vouchers:")
    for amount, codes in vouchers.items():
        print(f"{amount} pesos: {len(codes)}")
    print()

vouchers = load_vouchers()
print_voucher_totals(vouchers)

# Coin insert detection
def coin_inserted(channel):
    global last_pulse_time, pulse_count, coin_count
    current_time = time.time()
    pulse_count += 1
    last_pulse_time = current_time

GPIO.setup(COIN_SENSOR_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(ENABLE_PIN, GPIO.OUT)
GPIO.output(ENABLE_PIN, GPIO.LOW)

# Set up the GPIO pin for the coin sensor
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
                elif pulse_count == 5:
                    coin_value = 5
                elif pulse_count == 10:
                    coin_value = 10
                else:
                    coin_value = 0

                coin_count += coin_value
                pulse_count = 0
                emit('coin_update', {'coin_count': coin_count}, broadcast=True)
                emit('update_buttons', {'coin_count': coin_count})

                if coin_count >= 20:
                    GPIO.output(ENABLE_PIN, GPIO.LOW)
                    break
            socketio.sleep(0.1)
    except KeyboardInterrupt:
        GPIO.cleanup()

@socketio.on('voucher_button_click')
def voucher_button_click(amount):
    global coin_count
    if amount in vouchers and vouchers[amount]:
        voucher_code = vouchers[amount].pop(0)
        emit('voucher_dispensed', {'voucher_code': voucher_code})
        coin_count -= amount
        print_voucher_totals(vouchers)
    else:
        emit('voucher_dispensed', {'voucher_code': 'No vouchers available for this amount'})

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=4000, debug=True)
