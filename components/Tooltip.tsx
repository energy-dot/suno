
import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  wrapperClassName?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, wrapperClassName }) => {
    const [show, setShow] = useState(false);
    return (
        <span className={wrapperClassName || "relative flex items-center"} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            {children}
            {show && (
                <div className="absolute bottom-full right-0 mb-2 w-80 max-w-sm bg-gray-900 text-white text-xs rounded-lg p-3 border border-gray-600 z-50 shadow-lg whitespace-pre-wrap">
                    {text}
                </div>
            )}
        </span>
    );
};

export default Tooltip;