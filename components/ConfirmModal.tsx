"use client";

import { useEffect, useState } from "react";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  type = "default",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  const getConfirmButtonStyles = () => {
    if (type === "danger") {
      return "bg-black text-white hover:bg-white hover:text-black border-black";
    }
    return "bg-white text-black hover:bg-black hover:text-white border-black";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleCancel}
      />

      <div
        className={`
          relative bg-white border-2 border-black p-6 max-w-md w-full
          transition-all duration-200 ease-out
          ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
        style={{
          fontFamily: "Press Start 2P",
          boxShadow: "6px 6px 0px #000000",
        }}
      >
        <div className="text-center">
          <h3 className="text-[12px] text-black mb-4">{title.toUpperCase()}</h3>
          <p className="text-[10px] text-black mb-6 leading-relaxed">
            {message.toUpperCase()}
          </p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all text-[10px] cursor-pointer"
              style={{
                fontFamily: "Press Start 2P",
                boxShadow: "3px 3px 0px #000000",
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 border-2 transition-all text-[10px] cursor-pointer ${getConfirmButtonStyles()}`}
              style={{
                fontFamily: "Press Start 2P",
                boxShadow: "3px 3px 0px #000000",
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
