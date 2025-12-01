import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean; // cross in the upper right corner
  closeOnBackdrop?: boolean; // close when clicking on the background (yes by default)
  closeOnEsc?: boolean; // close by ESC (yes by default)
  className?: string; // additional classes for the inner container
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title = "",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className = "",
}) => {
  // Close with ESC
  React.useEffect(() => {
    if (!closeOnEsc) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, closeOnEsc]);

  // Block page scrolling
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-zinc-900 bg-opacity-80 flex justify-center items-center z-50 px-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`
          bg-zinc-800 
          border-2 border-solid border-black 
          rounded-lg 
          shadow-1xl 
          relative 
          max-w-2xl w-full 
          mx-auto 
          ${className}
        `}
        onClick={(e) => e.stopPropagation()} // so that the click inside does not close
      >
        {/* Title + close button */}
        {(title || showCloseButton) && (
          <div className="flex justify-between items-center pb-4 pt-6 px-8 border-b-4 border-black">
            {title && (
              <h2 className="text-2xl font-bold text-gray-200">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-all text-3xl font-bold absolute top-4 right-6"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Контент */}
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
