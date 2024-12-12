"use client";

import React from "react";
import { Button } from "@nextui-org/react";

export function BuyButton({
  isActive,
  onClick,
  className,
}: {
  isActive: boolean;
  onClick: () => void;
  className?: string; // Optional className prop
}) {
  return (
    <Button
      variant="solid"
      radius="lg"
      onPress={onClick}
      disabled={!isActive}
      disableRipple
      className={`w-64 h-fit ${
        isActive
          ? "bg-gradient-to-t from-[#3A1852] to-[#8236B8]"
          : "bg-gray-300"
      } ${className}`}
    >
      <p className="py-4 px-16 text-3xl text-white font-medium">Buy</p>
    </Button>
  );
}
