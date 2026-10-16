"use client";
import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  isDestructive = true,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? "danger" : "primary"}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
