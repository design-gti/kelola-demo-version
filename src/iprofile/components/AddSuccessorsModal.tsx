"use client";
import { useEffect, useRef } from "react";
import AddSuccessors from "../imports/AddSuccessors";

interface AddSuccessorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSuccessorsModal({ isOpen, onClose }: AddSuccessorsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        ref={modalRef}
        className="w-[400px] max-h-[90vh] shadow-2xl rounded-[8px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <AddSuccessors onClose={onClose} />
      </div>
    </div>
  );
}

