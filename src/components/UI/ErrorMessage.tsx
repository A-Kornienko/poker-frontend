import React, { useEffect, useState } from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 bg-zinc-800 border-l-4 border-red-500 text-red-400 px-4 py-2 rounded shadow animate-fade-in flex items-center"
      style={{ minWidth: "250px", maxWidth: "350px" }}
    >
      <span className="font-semibold mr-2">Error:</span> {message}
      <button
        className="ml-auto text-red-400 hover:text-red-600 font-bold px-2"
        onClick={() => setVisible(false)}
        aria-label="Close error"
      >
        ×
      </button>
    </div>
  );
};

export default ErrorMessage;
