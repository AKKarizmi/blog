import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  className?: string;
}
export function Input({ icon, className = '', ...props }: InputProps) {
  return (
    <div className="relative">
      {icon &&
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      }
      <input
        className={`block w-full rounded-lg border-gray-300 border bg-white py-2 px-3 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 ${icon ? 'pl-10' : ''} ${className}`}
        {...props} />
      
    </div>);

}