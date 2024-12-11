import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io();

const App: React.FC = () => {
  const [coinCount, setCoinCount] = useState(0);
  const [status, setStatus] = useState("Idle");
  const [voucherCode, setVoucherCode] = useState("");

  // Update the status and coin count based on the messages received
  useEffect(() => {
    socket.on("message", (data) => {
      setStatus(data.status);
    });

    socket.on("coin_update", (data) => {
      setCoinCount(data.coin_count);
    });

    socket.on("voucher_dispensed", (data) => {
      setVoucherCode(data.voucher_code || "No voucher available");
      alert("Please get your voucher code");
    });

    socket.on("update_buttons", (data) => {
      const coinCount = data.coin_count;
      // Enable buttons based on coin count
      setCoinCount(coinCount);
    });

    socket.on("reset_ui", () => {
      setCoinCount(0);
    });
  }, []);

  const handleStartCoinAcceptance = () => {
    socket.emit("start_coin_acceptance");
    setStatus("Coin acceptance started");
  };

  const handleVoucherClick = (amount: number) => {
    socket.emit("voucher_button_click", amount);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">Coin Acceptor</h1>
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={handleStartCoinAcceptance}
      >
        Start Coin Acceptance
      </button>
      <p>Status: {status}</p>
      <p>Total Coins Inserted: {coinCount}</p>

      {/* Price Buttons */}
      <div className="space-x-4">
        <button
          className={`bg-green-500 text-white p-2 rounded ${
            coinCount < 5 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={coinCount < 5}
          onClick={() => handleVoucherClick(5)}
        >
          Price 5
        </button>

        <button
          className={`bg-green-500 text-white p-2 rounded ${
            coinCount < 10 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={coinCount < 10}
          onClick={() => handleVoucherClick(10)}
        >
          Price 10
        </button>

        <button
          className={`bg-green-500 text-white p-2 rounded ${
            coinCount < 15 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={coinCount < 15}
          onClick={() => handleVoucherClick(15)}
        >
          Price 15
        </button>

        <button
          className={`bg-green-500 text-white p-2 rounded ${
            coinCount < 20 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={coinCount < 20}
          onClick={() => handleVoucherClick(20)}
        >
          Price 20
        </button>
      </div>

      <p>Voucher Code: {voucherCode}</p>
    </div>
  );
};

export default App;
