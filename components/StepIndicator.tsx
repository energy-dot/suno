import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
    currentStep: number;
    setStep: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, setStep }) => {
    const steps = ["歌詞とコンセプト", "構造化", "詳細設定", "楽曲生成", "ビジュアル生成"];
    return (
        <div className="flex items-center justify-center mb-10">
            {steps.map((name, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => setStep(index + 1)}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= index + 1 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 border-gray-600'}`}>
                            {currentStep > index + 1 ? <Check className="h-5 w-5" /> : index + 1}
                        </div>
                        <p className={`mt-2 text-sm transition-colors ${currentStep >= index + 1 ? 'text-white' : 'text-gray-400'}`}>{name}</p>
                    </div>
                    {index < steps.length - 1 && <div className={`flex-1 h-1 mx-4 transition-colors ${currentStep > index + 1 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default StepIndicator;