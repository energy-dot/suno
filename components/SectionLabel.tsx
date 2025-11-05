import React from 'react';
import { Info } from 'lucide-react';
import Tooltip from './Tooltip';

interface SectionLabelProps {
  text: string;
  tooltipText?: string;
  children?: React.ReactNode;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ text, tooltipText, children }) => (
    <div className="flex items-center gap-2 mb-2">
        <label className="block text-sm font-medium text-gray-400">{text}</label>
        {tooltipText && (
            <Tooltip text={tooltipText}>
                <Info className="h-4 w-4 text-gray-500 cursor-help" />
            </Tooltip>
        )}
        {children}
    </div>
);

export default SectionLabel;