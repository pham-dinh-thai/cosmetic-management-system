import React from "react";
import { Button } from "./Primitives";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[#fcfcf7] border border-[#1c3a13] rounded-2xl p-6 w-[90%] max-w-[400px] shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-[20px] text-[#1c3a13] font-medium">{title}</h3>
          <p className="text-[14px] text-[#666666] leading-relaxed">{message}</p>
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button 
            variant="primary" 
            onClick={onConfirm}
            className={isDestructive ? "bg-red-600 text-white hover:bg-red-700 border-transparent" : ""}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
