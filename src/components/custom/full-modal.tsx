import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import React from "react";

export function FullModal({
  dissmissable,
  children,
  isOpen,
  onOpenChange,
}: {
  dissmissable: boolean;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
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
        {(onClose) => <ModalBody onClick={onClose}>{children}</ModalBody>}
      </ModalContent>
    </Modal>
  );
}
