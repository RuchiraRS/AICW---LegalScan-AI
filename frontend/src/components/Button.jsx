import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-2.5 rounded-full font-medium transition-colors duration-200 text-sm";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-gray-800",
    secondary: "bg-gray-200 text-primary hover:bg-gray-300",
    outline: "border border-border text-primary hover:bg-gray-50",
    ghost: "text-primary hover:bg-gray-100",
    danger: "bg-error text-white hover:bg-red-600",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
