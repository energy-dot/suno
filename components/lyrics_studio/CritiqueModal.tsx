import React from 'react';
import { Sparkles, X, Wand2, Loader2 } from 'lucide-react';

interface CritiqueModalProps {
    critique: string | null;
    onClose: () => void;
    onApply: () => void;
    isApplying: boolean;
}

export const CritiqueModal: React.FC<CritiqueModalProps> = ({ critique, onClose, onApply, isApplying }) => {
    if (!critique) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl border border-gray-700 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2"><Sparkles className="h-5 w-5" /> AIからの批評</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
                </div>
                <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed bg-gray-900/50 p-4 rounded-md border border-gray-600">{critique}</div>
                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">
                        閉じる
                    </button>
                    <button onClick={onApply} disabled={isApplying} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-500">
                        {isApplying ? <Loader2 className="animate-spin h-5 w-5" /> : <Wand2 className="h-5 w-5" />}
                        この指摘を反映して修正
                    </button>
                </div>
            </div>
        </div>
    );
};