"use client";

import React from "react";
import { Button } from "@nextui-org/react";

export const CardPackage = ({
  time,
  amount,
  dimmed,
  highlighted,
  onClick,
}: {
  time: string;
  amount: number;
  dimmed: boolean; // Control dimming
  highlighted: boolean; // Highlight selected package
  onClick: () => void; // Handle click events
}) => {
  return (
    <Button
      variant="ghost"
      radius="lg"
      onClick={onClick}
      className={`w-64 h-fit transition-all duration-300 hover:bg-gray-100 border-pink-500 ${
        dimmed ? "opacity-50 pointer-events-auto" : "opacity-100"
      } ${
        highlighted
          ? "scale-110 shadow-lg border-4 border-none bg-gradient-to-t from-[#3A1852] to-[#C70655]"
          : ""
      }`}
    >
      <div className="flex flex-col p-4 gap-14">
        <div>
          <p className={`pt-4 text-3xl font-medium ${highlighted ? "text-white font-black" : "text-black font-medium"}`}>{time}</p>
        </div>
        <div
          className={`w-56 py-4 px-16  rounded-2xl ${
            highlighted
              ? "text-black bg-white"
              : "text-white bg-gradient-to-t from-[#3A1852] to-[#C70655]"
          }`}
        >
          <p className="text-3xl font-medium">P {amount}.00</p>
        </div>
      </div>
    </Button>
  );
};
