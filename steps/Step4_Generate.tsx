import React, { useState, useEffect } from 'react';
import { Wand2, Clipboard, Sparkles, Loader2, Save, Check, XCircle, BrainCircuit } from 'lucide-react';
import { AppData } from '../types';
import { modifyPromptSelection } from '../services/geminiService';

interface Props {
  stylePrompt: string;
  lyricsPrompt: string;
  data: AppData;
  onSave?: (name: string) => void;
  isSaved?: boolean;
  sessionName?: string;
  excludeStylesProp: { keywords: string, explanation: string } | null;
  songExplanation?: string;
  onOptimizeLyrics: (promptToOptimize: string) => Promise<string>;
  onGenerateExcludeStyles: (stylePrompt: string, lyricsPrompt: string, nuance: string) => Promise<{ keywords: string, explanation: string }>;
}

const Step4_Generate: React.FC<Props> = ({ 
    stylePrompt, lyricsPrompt, data, onSave, isSaved, sessionName, 
    excludeStylesProp, songExplanation, onOptimizeLyrics, onGenerateExcludeStyles 
}) => {
    const [editableStylePrompt, setEditableStylePrompt] = useState(stylePrompt);
    const [editableLyricsPrompt, setEditableLyricsPrompt] = useState(lyricsPrompt);
    
    const [selection, setSelection] = useState<{ target: 'style' | 'lyrics', start: number; end: number; text: string } | null>(null);
    const [instruction, setInstruction] = useState('');
    const [isModifying, setIsModifying] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [historyName, setHistoryName] = useState('');

    const [excludeStyles, setExcludeStyles] = useState(excludeStylesProp);
    const [isGeneratingExclude, setIsGeneratingExclude] = useState(false);

    const [copySuccess, setCopySuccess] = useState<'style' | 'lyrics' | 'exclude' | ''>('');

    useEffect(() => setEditableStylePrompt(stylePrompt), [stylePrompt]);
    useEffect(() => setEditableLyricsPrompt(lyricsPrompt), [lyricsPrompt]);
    useEffect(() => setExcludeStyles(excludeStylesProp), [excludeStylesProp]);
    useEffect(() => { if (sessionName) setHistoryName(sessionName) }, [sessionName]);

    const copyToClipboard = (text: string, type: 'style' | 'lyrics' | 'exclude') => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(type);
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            // Handle error
        });
    };
    
    const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>, target: 'style' | 'lyrics') => {
        const textarea = e.target as HTMLTextAreaElement;
        const { selectionStart, selectionEnd } = textarea;
        setFeedback('');
        if (selectionEnd > selectionStart) {
            setSelection({
                target,
                start: selectionStart,
                end: selectionEnd,
                text: textarea.value.substring(selectionStart, selectionEnd),
            });
        } else {
            setSelection(null);
        }
    };
    
    const handleModification = async () => {
        if (!selection || !instruction) return;
        setIsModifying(true);
        setFeedback('AIが修正中です...');
        try {
            const fullPrompt = selection.target === 'style' ? editableStylePrompt : editableLyricsPrompt;
            const contextPrompt = selection.target === 'style' ? editableLyricsPrompt : editableStylePrompt;
            const promptType = selection.target;

            const modifiedSnippet = await modifyPromptSelection(data, fullPrompt, contextPrompt, selection.text, instruction, promptType);
            
            if (selection.target === 'style') {
                const newPrompt = editableStylePrompt.substring(0, selection.start) + modifiedSnippet + editableStylePrompt.substring(selection.end);
                setEditableStylePrompt(newPrompt);
            } else {
                const newPrompt = editableLyricsPrompt.substring(0, selection.start) + modifiedSnippet + editableLyricsPrompt.substring(selection.end);
                setEditableLyricsPrompt(newPrompt);
            }
            
            setFeedback('修正が完了しました！');
            setSelection(null);
            setInstruction('');
            setTimeout(() => setFeedback(''), 3000);
        } catch (error: any) {
            setFeedback(`エラーが発生しました: ${error.message}`);
        } finally {
            setIsModifying(false);
        }
    };

    const handleOptimizePrompt = async () => {
        setIsOptimizing(true);
        try {
            const optimizedPrompt = await onOptimizeLyrics(editableLyricsPrompt);
            setEditableLyricsPrompt(optimizedPrompt);
            setFeedback('発音最適化が完了しました！');
        } catch (error: any) {
            setFeedback(`エラーが発生しました: ${error.message}`);
        } finally {
            setIsOptimizing(false);
            setTimeout(() => setFeedback(''), 4000);
        }
    };
    
    const handleGenerateExcludeStyles = async () => {
        setIsGeneratingExclude(true);
        try {
            const result = await onGenerateExcludeStyles(editableStylePrompt, editableLyricsPrompt, data.concept.naturalLanguageNuance);
            setExcludeStyles(result);
            setFeedback('除外スタイルの生成が完了しました！');
        } catch (error: any) {
            setFeedback(`エラーが発生しました: ${error.message}`);
        } finally {
            setIsGeneratingExclude(false);
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    const handleSaveClick = () => {
        if (onSave && historyName.trim()) {
            onSave(historyName.trim());
        }
    };

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Wand2 className="text-blue-400"/>
                {sessionName ? `履歴: ${sessionName}` : 'Suno v5対応：デュアル・プロンプト生成'}
            </h3>

            {/* --- Style Prompt Section --- */}
            <div className="space-y-3">
                <h4 className="text-lg font-semibold text-blue-300">1. Styleプロンプト (SunoのStyleボックス用)</h4>
                <div className="relative">
                    <textarea 
                      value={editableStylePrompt} 
                      onChange={e => setEditableStylePrompt(e.target.value)}
                      onSelect={(e) => handleSelect(e, 'style')}
                      rows={10} 
                      className="w-full bg-gray-800 border border-gray-700 text-white text-base rounded-lg p-4 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 transition-shadow"
                    />
                    <button onClick={() => copyToClipboard(editableStylePrompt, 'style')} className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-md text-sm flex items-center gap-2">
                        <Clipboard className="h-4 w-4" /> {copySuccess === 'style' ? 'コピー完了' : 'コピー'}
                    </button>
                </div>
                <div className="text-sm text-right text-gray-400">文字数: {editableStylePrompt.length} / 1000</div>

                {/* --- Exclude Styles Section --- */}
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 space-y-3">
                    <div className="flex justify-between items-center">
                        <h5 className="text-md font-semibold text-red-400 flex items-center gap-2"><XCircle className="h-5 w-5" /> 除外スタイル</h5>
                        <button onClick={handleGenerateExcludeStyles} disabled={isGeneratingExclude || isModifying || isOptimizing} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-2 disabled:bg-gray-500 transition-all">
                            {isGeneratingExclude ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                            AIで生成
                        </button>
                    </div>
                    {excludeStyles && (
                        <div className="animate-fade-in">
                            <div className="relative">
                                <input 
                                  type="text"
                                  readOnly
                                  value={excludeStyles.keywords}
                                  className="w-full bg-gray-800 border border-gray-600 text-white text-xs rounded-lg p-2 pr-20 font-mono"
                                />
                                <button onClick={() => copyToClipboard(excludeStyles.keywords, 'exclude')} className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                    <Clipboard className="h-3 w-3" /> {copySuccess === 'exclude' ? 'OK' : 'コピー'}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 p-2 bg-gray-800/50 rounded-md">💡 **AI解説:** {excludeStyles.explanation}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Lyrics & Structure Prompt Section --- */}
            <div className="space-y-3">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <h4 className="text-lg font-semibold text-blue-300">2. Lyricsプロンプト (SunoのLyricsボックス用)</h4>
                    <button onClick={handleOptimizePrompt} disabled={isOptimizing || isModifying || isGeneratingExclude} className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-2 disabled:bg-gray-500 transition-all">
                        {isOptimizing ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                        発音を最適化
                    </button>
                </div>
                <div className="relative">
                    <textarea 
                      value={editableLyricsPrompt} 
                      onChange={e => setEditableLyricsPrompt(e.target.value)}
                      onSelect={(e) => handleSelect(e, 'lyrics')}
                      rows={20} 
                      className="w-full bg-gray-800 border border-gray-700 text-white text-base rounded-lg p-4 font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 transition-shadow"
                    />
                    <button onClick={() => copyToClipboard(editableLyricsPrompt, 'lyrics')} className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-md text-sm flex items-center gap-2">
                        <Clipboard className="h-4 w-4" /> {copySuccess === 'lyrics' ? 'コピー完了' : 'コピー'}
                    </button>
                </div>
                <div className="text-sm text-right text-gray-400">文字数: {editableLyricsPrompt.length} / 5000</div>
            </div>

            {feedback && <p className="text-sm text-green-400 text-center mt-2 animate-pulse">{feedback}</p>}

            {songExplanation && (
                <details className="mt-6 animate-fade-in group" open>
                    <summary className="text-lg font-semibold text-blue-300 flex items-center gap-2 cursor-pointer list-none">
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-blue-400 transform transition-transform group-open:rotate-90">▶</span>
                        <BrainCircuit className="h-5 w-5" /> AIによる楽曲・音楽理論解説
                    </summary>
                    <div className="mt-2 pl-7">
                        <div className="mt-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{songExplanation}</p>
                        </div>
                    </div>
                </details>
            )}

            {onSave && !sessionName && (
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

            {selection && (
                <div className="mt-6 p-4 bg-gray-800/70 border border-gray-700 rounded-lg animate-fade-in">
                    <h4 className="text-lg font-semibold text-purple-400 flex items-center gap-2"><Sparkles className="h-5 w-5" /> AIで選択範囲を修正</h4>
                    <div className="mt-3 bg-gray-900/50 p-3 rounded-md border border-gray-600">
                        <p className="text-xs text-gray-400 mb-1">選択中のテキスト ({selection.target === 'style' ? 'Style' : 'Lyrics'}プロンプト):</p>
                        <p className="text-sm text-gray-200 font-mono bg-transparent max-h-24 overflow-y-auto">{selection.text}</p>
                    </div>
                    <div className="mt-4">
                        <textarea value={instruction} onChange={e => setInstruction(e.target.value)} placeholder="例：この部分をもっとエモーショナルに..." rows={3} className="w-full bg-gray-900/80 border border-gray-600 text-white text-sm rounded-lg p-2.5"/>
                    </div>
                    <div className="mt-4">
                        <button onClick={handleModification} disabled={!instruction.trim() || isModifying} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-500">
                            {isModifying ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                            AIで修正
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step4_Generate;