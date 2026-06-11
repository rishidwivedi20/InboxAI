"use client";

import { useEffect, useState } from "react";

export interface NotificationProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Notification({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);

    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, [duration]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeydown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 200);
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-white text-black border-black";
      case "error":
        return "bg-black text-white border-black";
      case "warning":
        return "bg-white text-black border-black";
      case "info":
        return "bg-white text-black border-black";
      default:
        return "bg-white text-black border-black";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "!";
      case "info":
        return "i";
      default:
        return "i";
    }
  };

  return (
    <div
      className={`
        fixed z-50 p-4 border-2 min-w-[300px] max-w-[400px]
        transition-all duration-300 ease-out
        ${getTypeStyles()}
        ${
          isVisible && !isLeaving
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }
      `}
      style={{
        fontFamily: "Press Start 2P",
        boxShadow: isVisible && !isLeaving ? "4px 4px 0px #000000" : "none",
        right: "16px",
        top: `${80 + parseInt(id.slice(-1)) * 100}px`, // Better spacing for stacked notifications
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div
              className={`w-6 h-6 border-2 flex items-center justify-center text-[8px] ${
                type === "error"
                  ? "border-white bg-white text-black"
                  : "border-black bg-black text-white"
              }`}
            >
              {getIcon()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-normal mb-1">
              {title.toUpperCase()}
            </div>
            {message && (
              <div className="text-[8px] opacity-80">
                {message.toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-3 w-4 h-4 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all text-[8px] flex items-center justify-center p-0"
          style={{ boxShadow: "1px 1px 0px #000000" }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
