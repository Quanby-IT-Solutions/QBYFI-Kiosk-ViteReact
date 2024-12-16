import { Modal, ModalContent, ModalBody } from "@nextui-org/modal";
import React from "react";

export function IntroModal({
  dissmissable,
  children,
  isOpen,
  onOpenChange,
  setShowModal,
}: {
  dissmissable: boolean;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: () => void;
  setShowModal?: (show: boolean) => void;
}) {
  const handleClick = (onClose: () => void) => {
    onClose();
    if (setShowModal) {
      setShowModal(false);
    }
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
      disableAnimation
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody onClick={() => handleClick(onClose)}>{children}</ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
