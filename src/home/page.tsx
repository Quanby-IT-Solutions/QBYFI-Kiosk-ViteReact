"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import { CardPackage } from "@/components/custom/card-package";
import { BuyButton } from "@/components/custom/buy-button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { FullModal } from "@/components/custom/full-modal";

type PackageCards = {
  time: string;
  amount: number;
};

const packages: PackageCards[] = [
  { time: "1 hr. 30 mins.", amount: 5 },
  { time: "2 hrs.", amount: 10 },
  { time: "3 hrs.", amount: 15 },
  { time: "4 hrs.", amount: 20 },
];

const HomePage: React.FC = () => {
  const {
    isOpen: isIntroOpen,
    onOpen: onIntroOpen,
    onOpenChange: onIntroOpenChange,
  } = useDisclosure();

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();

  const {
    isOpen: isOutroOpen,
    onOpen: onOutroOpen,
    onOpenChange: onOutroOpenChange,
  } = useDisclosure();

  useEffect(() => {
    onIntroOpen(); // Open the modal when the page loads
  }, [onIntroOpen]);

  const [coinsInserted, setCoinsInserted] = useState(50); // Assume 50 coins for this example
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null); // Track the selected package

  const handleSelectPackage = (index: number) => {
    if (selectedPackage === index) {
      setSelectedPackage(null);
    } else if (packages[index].amount <= coinsInserted) {
      setSelectedPackage(index);
    }
  };

  const handleProceed = () => {
    onConfirmOpenChange(false); // Close confirmation modal
    onOutroOpen(); // Open success modal
  };

  return (
    <motion.main className="p-0 gap-10 overflow-clip">
      {/* Display the intro modal while loading */}
      <FullModal
        dissmissable={false}
        isOpen={isIntroOpen}
        onOpenChange={onIntroOpenChange}
      >
        <div className="relative w-screen h-screen">
          <div className="absolute z-10 w-full -top-28 -left-80">
            <Image
              src="/Top.png"
              width={960}
              height={540}
              alt="Task example"
              className="w-full object-cover"
            />
          </div>

          <div className="w-full h-full flex flex-col items-center justify-center gap-y-10 text-black">
            <div>
              <p className="text-5xl font-semibold">Welcom to QBYFI Kiosk</p>
            </div>
            <div className="flex w-full justify-center items-center">
              <Image
                src="/QBYFI-Logo.png"
                width={740}
                height={520}
                alt="Task example"
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <p className="text-5xl font-semibold">
                Click anywhere on the screen to start
              </p>
            </div>
          </div>

          <div className="absolute z-5 w-full -bottom-8 -right-[750] scale-150">
            <Image
              src="/Bottom.png"
              width={960}
              height={540}
              alt="Task example"
              className="w-full object-cover"
            />
          </div>
        </div>
      </FullModal>

      <div className="relative">
        <div className="absolute z-10 w-full -top-28 -left-80">
          <Image
            src="/Top.png"
            width={960}
            height={540}
            alt="Top Decoration"
            className="w-full object-cover"
          />
        </div>

        {/* Base Transaction Page */}
        <div className="w-full h-screen pt-24 flex flex-col items-center justify-top">
          <Image
            src="/Q-Logo.png"
            width={185}
            height={130}
            alt="Task example"
            className="object-cover pb-24 rounded-lg"
          />
          <div className="w-fit h-fit flex flex-col items-center justify-center gap-10 text-black">
            <div>
              <p className="text-6xl font-semibold">
                Please insert coin on the machine to start
              </p>
            </div>
            <div className="w-fit h-fit flex items-center gap-4">
              <div>
                <p className="text-3xl font-medium">Coins inserted:</p>
              </div>
              <div className="w-fit h-fit py-2 px-16 border-2 border-black rounded-xl">
                <p className="text-3xl font-extrabold">{coinsInserted}.00</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {packages.map((pkg, index) => (
                <CardPackage
                  key={index}
                  time={pkg.time}
                  amount={pkg.amount}
                  dimmed={
                    coinsInserted < pkg.amount ||
                    (selectedPackage !== null && selectedPackage !== index)
                  }
                  highlighted={selectedPackage === index}
                  onClick={() => handleSelectPackage(index)}
                />
              ))}
            </div>
            <BuyButton
              isActive={selectedPackage !== null}
              onClick={onConfirmOpen}
              className="z-10"
            />
          </div>
        </div>

        {/* Confirmation Modal */}
        <Modal
          backdrop="blur"
          isOpen={isConfirmOpen}
          onOpenChange={onConfirmOpenChange}
          isDismissable={false}
          hideCloseButton
          isKeyboardDismissDisabled
          className="text-center w-fit h-fit"
        >
          <ModalContent>
            <ModalHeader>
              You are about to purchase the following package:
            </ModalHeader>
            <ModalBody>
              <ModalBody>
                <div className="flex flex-col justify-cenetr items-center p-4">
                  {selectedPackage !== null && (
                    <CardPackage
                      time={packages[selectedPackage].time}
                      amount={packages[selectedPackage].amount}
                      dimmed={false} // No dimming for display purposes
                      highlighted={true} // Highlight the selected package
                      onClick={() => {}} // No action on click in modal
                    />
                  )}
                  <p className="mt-4">
                    Are you sure you want to proceed with this purchase?
                  </p>
                </div>
              </ModalBody>
            </ModalBody>
            <ModalFooter className="justify-around">
              <Button
                variant="ghost"
                radius="lg"
                onClick={() => onConfirmOpenChange(false)}
                className="w-64 h-fit transition-all duration-300 hover:bg-gray-100 py-4 px-16 items-center bg-[#3A1852]"
              >
                <p className="text-3xl text-white font-medium">Back</p>
              </Button>
              <Button
                variant="ghost"
                radius="lg"
                onClick={handleProceed}
                className="w-64 h-fit transition-all duration-300 hover:bg-gray-100 py-4 px-16 bg-[#C70655]"
              >
                <p className="text-3xl text-white font-medium">Proceed</p>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Outro Confirm Modal */}
        <FullModal
          dissmissable={false}
          isOpen={isOutroOpen}
          onOpenChange={onOutroOpenChange}
        >
          <div className="relative flex w-screen h-screen items-center justify-center">
            <div className="absolute z-10 w-full -top-28 -left-80">
              <Image
                src="/Top.png"
                width={960}
                height={540}
                alt="Task example"
                className="w-full object-cover"
              />
            </div>
            <div className="w-fit h-fit flex flex-col items-center justify-start">
              <Image
                src="/QBYFI-Logo.png"
                width={370}
                height={260}
                alt="Task example"
                className="object-cover pb-24 rounded-lg"
              />

              <div className="w-full h-full flex flex-col items-center justify-center gap-y-10 text-black">
                <div>
                  <p className="text-5xl font-semibold">
                    Thank you for your purchase!
                  </p>
                </div>
                <div className="flexw-full items-center">
                  <Image
                    src="/ticket.png"
                    width={370}
                    height={260}
                    alt="Task example"
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-5xl font-semibold">
                    Don’t forget to claim your ticket stub to start accessing
                    fast internet.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    // Reset state for a new session
                    setSelectedPackage(null);
                    setCoinsInserted(0);

                    // Close the outro modal and reopen the intro modal
                    onOutroOpenChange(false);
                    onIntroOpen();
                  }}
                  className={`w-fit h-fit transition-all duration-300 hover:bg-gray-100 bg-gradient-to-t from-[#3A1852] to-[#C70655] rounded-xl`}
                >
                  <p className={`py-4 px-16 text-3xl text-white font-medium`}>
                    Need another transaction?
                  </p>
                </Button>
              </div>
            </div>

            <div className="absolute z-5 w-full -bottom-8 -right-[750] scale-150">
              <Image
                src="/Bottom.png"
                width={960}
                height={540}
                alt="Task example"
                className="w-full object-cover"
              />
            </div>
          </div>
        </FullModal>

        <div className="absolute z-5 w-full -bottom-8 -right-[750] scale-150">
          <Image
            src="/Bottom.png"
            width={960}
            height={540}
            alt="Bottom Decoration"
            className="w-full object-cover"
          />
        </div>
      </div>
    </motion.main>
  );
};

export default HomePage;
