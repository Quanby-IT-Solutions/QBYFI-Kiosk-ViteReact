<template>
  <Modal
    size="full"
    :hide-close-button="true"
    :is-open="isOpen"
    :is-dismissable="dissmissable"
    :on-open-change="onOpenChange"
    :is-keyboard-dismiss-disabled="true"
    class="overflow-clip"
  >
    <ModalContent>
      <ModalBody @click="onClose">
        <slot></slot>
      </ModalBody>
    </ModalContent>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Modal, ModalContent, ModalBody } from '@nextui-org/react';

export default defineComponent({
  props: {
    dissmissable: {
      type: Boolean,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    onOpenChange: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
});
</script>
