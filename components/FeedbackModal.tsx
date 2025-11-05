
import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface FeedbackModalProps {
    feedback: string | null;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ feedback, onClose }) => {
    if (!feedback) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl border border-gray-700 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2"><Sparkles className="h-5 w-5" />AIからの提案</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
                </div>
                <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{feedback}</div>
                <button onClick={onClose} className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                    閉じる
                </button>
            </div>
        </div>
    );
};

export default FeedbackModal;
