import React, { useState } from 'react';
import { Sparkles, Loader2, Clipboard, Check, Wand2, BrainCircuit } from 'lucide-react';

interface Props {
    nuance: string;
    generatedLyrics: string;
    generationExplanation: string;
    isGenerating: boolean;
    onGenerate: () => void;
    isCritiquing: boolean;
    onGetCritique: (persona: any) => void;
    onModifyLyrics: (instruction: string) => void;
}

export const LyricsOutput: React.FC<Props> = ({ nuance, generatedLyrics, generationExplanation, isGenerating, onGenerate, isCritiquing, onGetCritique, onModifyLyrics }) => {
    const [copyLyricsSuccess, setCopyLyricsSuccess] = useState(false);
    const [critiquePersona, setCritiquePersona] = useState('harsh_critic');
    const [modificationInstruction, setModificationInstruction] = useState('');

    const handleCopyLyrics = () => {
        if (!generatedLyrics) return;
        navigator.clipboard.writeText(generatedLyrics).then(() => {
            setCopyLyricsSuccess(true);
            setTimeout(() => setCopyLyricsSuccess(false), 2000);
        });
    };
    
    return (
        <div className="flex flex-col">
            <button onClick={onGenerate} disabled={isGenerating || !nuance || isCritiquing} className="w-full font-bold bg-blue-600 text-white px-3 py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-blue-500 disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105">
                {isGenerating ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                {isGenerating ? '歌詞を生成中...' : 'AIで歌詞を生成'}
            </button>
            
            <div className="mt-4 flex flex-col">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2"><Sparkles className="text-blue-400" /> AIが生成した歌詞</h3>
                     <button onClick={handleCopyLyrics} disabled={!generatedLyrics} className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-md text-sm flex items-center gap-2 disabled:bg-gray-800 disabled:text-gray-500">
                        {copyLyricsSuccess ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4" />}
                        {copyLyricsSuccess ? 'コピーしました！' : 'コピー'}
                    </button>
                </div>
                 <div className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg p-4 mt-2 min-h-[200px] max-h-[30vh] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {isGenerating && <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-6 w-6 text-blue-400"/></div>}
                    {!isGenerating && generatedLyrics ? generatedLyrics : !isGenerating && <p className="text-gray-500 text-center">「AIで歌詞を生成」ボタンを押してください</p>}
                </div>
            </div>

            {generationExplanation && !isGenerating && (
                <details className="mt-4 animate-fade-in group" open>
                    <summary className="text-md font-semibold text-blue-300 flex items-center gap-2 cursor-pointer list-none">
                        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-blue-400 transform transition-transform duration-200 group-open:rotate-90">▶</span>
                        <BrainCircuit className="h-5 w-5" /> AIの制作ノート
                    </summary>
                    <div className="mt-2 pl-6">
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[20vh] overflow-y-auto">
                            {generationExplanation}
                        </div>
                    </div>
                </details>
            )}

            {generatedLyrics && !isGenerating && (
                <div className="space-y-4 mt-4 animate-fade-in">
                    {/* AI Sparring Partner */}
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <h4 className="text-md font-semibold text-blue-400 mb-3 flex items-center gap-2">
                            <Sparkles className="h-5 w-5" /> AIスパアリング・パートナー
                        </h4>
                        <div className="flex items-center gap-4">
                            <select
                                value={critiquePersona}
                                onChange={(e) => setCritiquePersona(e.target.value)}
                                className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm"
                            >
                                <option value="harsh_critic">辛辣な音楽評論家</option>
                                <option value="sensitive_poet">感受性の強い詩人</option>
                                <option value="pop_producer">ヒットメーカープロデューサー</option>
                            </select>
                            <button
                                onClick={() => onGetCritique(critiquePersona as any)}
                                disabled={isCritiquing || isGenerating}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 disabled:bg-gray-500"
                            >
                                {isCritiquing ? <Loader2 className="animate-spin h-4 w-4" /> : 'AIに批評させる'}
                            </button>
                        </div>
                    </div>

                    {/* Natural Language Modification */}
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <h4 className="text-md font-semibold text-blue-400 mb-3 flex items-center gap-2">
                            <Wand2 className="h-5 w-5" /> 自然言語で修正
                        </h4>
                        <textarea
                            value={modificationInstruction}
                            onChange={(e) => setModificationInstruction(e.target.value)}
                            rows={3}
                            placeholder="例：サビをもっと情熱的に。Aメロの情景描写を具体的に。"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2 text-sm"
                        />
                        <button
                            onClick={() => {
                                onModifyLyrics(modificationInstruction);
                                setModificationInstruction('');
                            }}
                            disabled={!modificationInstruction.trim() || isGenerating || isCritiquing}
                            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 disabled:bg-gray-500"
                        >
                            指示を反映して修正
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};