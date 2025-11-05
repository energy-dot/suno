
import React, { useState } from 'react';
import { Clipboard, Check, RefreshCw, Wand2, FileCode2, Save, XCircle } from 'lucide-react';
import { HistoryItem } from '../types';

interface BatchResultsProps {
    results: HistoryItem['results'] | null;
    onBack: () => void;
    onSave?: (name: string) => void;
    isNewGeneration?: boolean;
    sessionName?: string;
}

const BatchResults: React.FC<BatchResultsProps> = ({ results, onBack, onSave, isNewGeneration = false, sessionName }) => {
    const [activePresetIndex, setActivePresetIndex] = useState(0);
    const [activePromptType, setActivePromptType] = useState<'style' | 'lyrics'>('style');
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    const [historyName, setHistoryName] = useState(sessionName || '');
    const [isSaved, setIsSaved] = useState(!!sessionName);

    if (!results || results.length === 0) {
        return (
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 text-center">
                <h2 className="text-2xl font-bold text-purple-300 mb-2">生成結果がありません</h2>
                <button onClick={onBack} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500">戻る</button>
            </div>
        );
    }
    
    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedStates(prev => ({ ...prev, [key]: true }));
            setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
        });
    };

    const handleSaveClick = () => {
        if (onSave && historyName.trim() && !isSaved) {
            onSave(historyName.trim());
            setIsSaved(true);
        }
    };
    
    const activeResult = results[activePresetIndex];
    const promptToShow = activePromptType === 'style' ? activeResult.stylePrompt : activeResult.lyricsPrompt;

    return (
        <div className="bg-gray-800/50 p-4 md:p-8 rounded-xl border border-gray-700 min-h-[500px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-purple-300 mb-2 flex items-center gap-2">
                        <Wand2 /> {isNewGeneration ? '一括生成モード - 結果' : `履歴: ${sessionName}`}
                    </h2>
                    <p className="text-gray-400">各タブをクリックして、アーティスト別の生成結果を確認できます。</p>
                </div>
                <button onClick={onBack} className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" /> {isNewGeneration ? '新しいバッチを開始' : '履歴一覧へ戻る'}
                </button>
            </div>

            <div className="flex flex-col">
                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Tabs">
                        {results.map((result, index) => (
                            <button key={result.presetName} onClick={() => setActivePresetIndex(index)}
                                className={`${activePresetIndex === index ? 'border-purple-500 text-purple-300' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors focus:outline-none`}>
                                {result.presetName}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-4 bg-gray-900/50 p-4 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center border border-gray-700 rounded-lg p-0.5 bg-gray-800">
                            <button onClick={() => setActivePromptType('style')} className={`px-3 py-1 text-xs rounded-md ${activePromptType === 'style' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>Styleプロンプト</button>
                            <button onClick={() => setActivePromptType('lyrics')} className={`px-3 py-1 text-xs rounded-md ${activePromptType === 'lyrics' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>Lyricsプロンプト</button>
                        </div>
                    </div>

                    <div className="relative">
                        <textarea readOnly value={promptToShow} rows={15} className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg p-3 font-mono leading-relaxed" />
                        <button onClick={() => handleCopy(promptToShow, `${activePresetIndex}-${activePromptType}`)} className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-md text-sm flex items-center gap-2">
                            {copiedStates[`${activePresetIndex}-${activePromptType}`] ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4" />}
                            {copiedStates[`${activePresetIndex}-${activePromptType}`] ? '完了' : 'コピー'}
                        </button>
                    </div>

                    {activeResult.excludeStyles && (
                        <div className="mt-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
                            <h5 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-2"><XCircle/> 除外スタイル</h5>
                             <div className="relative">
                                <input type="text" readOnly value={activeResult.excludeStyles.keywords} className="w-full bg-gray-900/80 border border-gray-600 text-white text-xs rounded-lg p-2 pr-20 font-mono" />
                                <button onClick={() => handleCopy(activeResult.excludeStyles!.keywords, `${activePresetIndex}-exclude`)} className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                    <Clipboard className="h-3 w-3" /> {copiedStates[`${activePresetIndex}-exclude`] ? 'OK' : 'コピー'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {isNewGeneration && onSave && (
                  <div className="mt-6 p-4 bg-gray-800/70 border border-gray-700 rounded-lg animate-fade-in">
                      <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2"><Save className="h-5 w-5" /> 履歴に保存</h4>
                      <div className="flex items-center gap-2 mt-3">
                          <input type="text" value={historyName} onChange={(e) => setHistoryName(e.target.value)} placeholder="セッション名を入力..." className="flex-grow bg-gray-900/80 border border-gray-600 text-white text-sm rounded-lg p-2.5" />
                          <button onClick={handleSaveClick} disabled={!historyName.trim() || isSaved} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-500">
                               {isSaved ? <><Check className="h-5 w-5" /> 保存済み</> : <><Save className="h-5 w-5" /> 保存</>}
                          </button>
                      </div>
                  </div>
                )}
            </div>
        </div>
    );
};

export default BatchResults;
