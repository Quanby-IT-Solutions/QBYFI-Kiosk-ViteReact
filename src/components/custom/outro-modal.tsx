import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import React, { useEffect } from "react";

export function OutroModal({
  dissmissable,
  children,
  isOpen,
  onOpenChange,
  reloadDelay = 10000, // Default to 3 seconds if no delay is provided
}: {
  dissmissable: boolean;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: () => void;
  reloadDelay?: number; // Delay in milliseconds before refreshing
}) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        window.location.reload(); // Reload the page after the specified delay
      }, reloadDelay);

      // Cleanup the timer if the modal is closed or when the component unmounts
      return () => clearTimeout(timer);
    }
  }, [isOpen, reloadDelay]); // Effect runs whenever isOpen changes

  const handleClick = () => {
    window.location.reload(); // Reload the page immediately on click
  };

  return (
    <Modal
      size="full"
      hideCloseButton
      isOpen={isOpen}
      isDismissable={dissmissable}
      onOpenChange={onOpenChange}
      isKeyboardDismissDisabled={true}
      className="overflow-clip"
    >
      <ModalContent>
        <ModalBody onClick={handleClick}>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
