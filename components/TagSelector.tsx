
import React from 'react';
import Tooltip from './Tooltip';

interface TagSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  descriptions?: { [key: string]: string };
}

const TagSelector: React.FC<TagSelectorProps> = ({ options, selected, onChange, descriptions }) => {
  const handleToggle = (option: string) => {
    onChange(selected.includes(option) ? selected.filter(item => item !== option) : [...selected, option]);
  };

  return (
    <div className="flex flex-wrap gap-2">
        {options.map(option => {
            const button = (
                <button key={option} type="button" onClick={() => handleToggle(option)} className={`px-3 py-1 text-sm rounded-full transition-colors ${selected.includes(option) ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                    {option}
                </button>
            );
            if (descriptions && descriptions[option]) {
                return <Tooltip key={option} text={descriptions[option]}>{button}</Tooltip>;
            }
            return button;
        })}
    </div>
  );
};

export default TagSelector;
