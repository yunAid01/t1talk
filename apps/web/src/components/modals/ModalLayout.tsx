import { X } from "lucide-react";
import React from "react";

interface ModalLayoutProps {
  onClose: () => void;
  isOpen: boolean;
  children: React.ReactNode;
}
export default function ModalLayout({
  children,
  onClose,
}: ModalLayoutProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors duration-200 z-10"
          aria-label="모달 닫기"
        >
          <X size={32} strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>
  );
}
