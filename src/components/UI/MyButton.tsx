import React from "react";

interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const MyButton: React.FC<MyButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="
        font-medium 
        px-6 
        py-2 
        bg-zinc-700 
        border-2 
        border-gray-800 
        border-solid
        hover:text-white 
        hover:bg-zinc-900
        w-full"
    >
      {children}
    </button>
  );
};

export default MyButton;
