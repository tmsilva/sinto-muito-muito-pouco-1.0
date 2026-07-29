import React from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import Stack from '../Layout/Stack';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isConfirmLoading?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isConfirmLoading = false
}) => {
  const footer = (
    <Stack direction="horizontal" gap={3} justify="end">
      <Button variant="secondary" onClick={onClose} disabled={isConfirmLoading}>
        {cancelText}
      </Button>
      <Button variant="danger" onClick={onConfirm} isLoading={isConfirmLoading}>
        {confirmText}
      </Button>
    </Stack>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.5 }}>
        {description}
      </p>
    </Modal>
  );
};
export default Dialog;
