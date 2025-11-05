import React, { useState } from 'react';
import { Wand2, Clipboard, Check } from 'lucide-react';

interface Props {
    prompt: string;
}

export const GeneratedPromptDisplay: React.FC<Props> = ({ prompt }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                    <Wand2 className="text-blue-400" /> AIへの指示プロンプト
                </h3>
                <button onClick={handleCopy} className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-md text-sm flex items-center gap-2">
                    {copySuccess ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4" />}
                    {copySuccess ? 'コピーしました！' : 'コピー'}
                </button>
            </div>
            <textarea readOnly value={prompt} rows={15} className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg p-4 font-mono leading-relaxed mt-2" />
        </div>
    );
};