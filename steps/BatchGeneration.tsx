

import React, { useState } from 'react';
import { Sparkles, Loader2, Info, RotateCcw } from 'lucide-react';
import { AppData, HistoryItem } from '../types';
import { generateStructure, generateChords, optimizeLyrics, shortenDataForPrompt, generateExcludeStyles } from '../services/geminiService';
import { generateStylePrompt, generateLyricsPrompt } from '../services/promptGenerator';
import SectionLabel from '../components/SectionLabel';
import Tooltip from '../components/Tooltip';
import { artistPresetConfigs } from '../data/artistPresets';
import { DESCRIPTIONS, nuanceAmplifierOptions, artistTooltips } from '../constants';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  setFeedback: (feedback: string | null) => void;
  onGenerationComplete: (results: HistoryItem['results']) => void;
}

const BatchGeneration: React.FC<Props> = ({ data, setData, setFeedback, onGenerationComplete }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState('');
    // FIX: Added state for grabAttentionEnabled.
    const [grabAttentionEnabled, setGrabAttentionEnabled] = useState(false);

    const handleToggleArtistPreset = (preset: string) => {
        setData(prevData => {
            const currentPresets = prevData.concept.artistPresets || [];
            const newPresets = currentPresets.includes(preset)
                ? currentPresets.filter(p => p !== preset)
                : [...currentPresets, preset];

            // FIX: Corrected the nested state update to avoid incorrect object structure.
            return { ...prevData, concept: { ...prevData.concept, artistPresets: newPresets }};
        });
    };

    const handleNuanceAmplifierChange = (id: string, checked: boolean) => {
        setData(prevData => ({
          ...prevData,
          concept: { ...prevData.concept, nuanceAmplifiers: { ...prevData.concept.nuanceAmplifiers, [id]: checked } }
        }));
    };
    
    const handleFullAutoGeneration = async () => {
        const presets = data.concept.artistPresets;
        if (presets.length === 0) {
            setFeedback("フルオート作曲を開始するには、少なくとも1つのアーティストプリセットを選択してください。");
            return;
        }
        if (!data.rawLyrics.trim()) {
            setFeedback("フルオート作曲を開始するには、まず歌詞を入力してください。");
            return;
        }
        if (isGenerating) return;

        setIsGenerating(true);
        setFeedback(null);
        
        const CONCURRENCY_LIMIT = 2;
        const STAGGER_MS = 1500;

        const processPreset = async (presetName: string, index: number): Promise<HistoryItem['results'][0]> => {
            const presetConfig = artistPresetConfigs[presetName];
            if (!presetConfig) throw new Error(`Preset config for "${presetName}" not found.`);

            let singlePresetData: AppData = {
                ...data,
                concept: { ...data.concept, ...presetConfig, artistPreset: presetName, artistPresets: [presetName] },
                sections: []
            };

            setStatus(`[${index + 1}/${presets.length}] ${presetName}: 構造生成中...`);
            // FIX: Pass 'grabAttentionEnabled' to generateStructure to fix incorrect argument count.
            const { newSections } = await generateStructure(singlePresetData, grabAttentionEnabled);
            singlePresetData.sections = newSections;
            
            setStatus(`[${index + 1}/${presets.length}] ${presetName}: コード生成中...`);
            const { updatedSections } = await generateChords(singlePresetData);
            singlePresetData.sections = updatedSections;

            setStatus(`[${index + 1}/${presets.length}] ${presetName}: プロンプト生成中...`);
            let lyricsPrompt = generateLyricsPrompt(singlePresetData);
            const stylePrompt = await generateStylePrompt(singlePresetData);
        
            if (lyricsPrompt.length > 5000) {
                setStatus(`[${index + 1}/${presets.length}] ${presetName}: プロンプト長を調整中...`);
                // FIX: Pass the generated stylePrompt to shortenDataForPrompt, which expects it as the second argument.
                const shortenedSections = await shortenDataForPrompt(singlePresetData, stylePrompt);
                singlePresetData.sections = shortenedSections;
                lyricsPrompt = generateLyricsPrompt(singlePresetData);
            }
            
            setStatus(`[${index + 1}/${presets.length}] ${presetName}: 除外スタイル生成中...`);
            const excludeStyles = await generateExcludeStyles(stylePrompt, lyricsPrompt, singlePresetData.concept.naturalLanguageNuance);

            setStatus(`[${index + 1}/${presets.length}] ${presetName}: 最終最適化中...`);
            const optimizedLyricsPrompt = await optimizeLyrics(lyricsPrompt, singlePresetData.rawLyrics);

            return { presetName, stylePrompt, lyricsPrompt: optimizedLyricsPrompt, excludeStyles };
        };
        
        const allGeneratedPrompts: HistoryItem['results'] = [];
        const queue = [...presets.entries()];

        const worker = async () => {
            while (queue.length > 0) {
                const item = queue.shift();
                if (item) {
                    const [index, presetName] = item;
                    try {
                        const result = await processPreset(presetName, index);
                        allGeneratedPrompts[index] = result;
                    } catch(error) {
                        console.error(`Error processing preset ${presetName}:`, error);
                        // Store error information to show to the user
                        allGeneratedPrompts[index] = {
                            presetName,
                            stylePrompt: "エラーが発生しました。",
                            lyricsPrompt: `プリセット "${presetName}" の生成中にエラーが発生しました。\n詳細: ${error instanceof Error ? error.message : String(error)}`,
                            excludeStyles: null
                        };
                    }
                }
            }
        };
        
        try {
            setStatus(`AIフルオート作曲開始... (${presets.length}プリセット)`);
            const workers = Array(CONCURRENCY_LIMIT).fill(0).map((_, i) => {
                return new Promise(resolve => setTimeout(() => resolve(worker()), i * STAGGER_MS));
            });
            await Promise.all(workers);
            onGenerationComplete(allGeneratedPrompts.filter(Boolean));
        } catch (error: any) {
            console.error("Full auto generation failed:", error);
            setFeedback(`AIフルオート作曲中にエラーが発生しました：${error.message}`);
        } finally {
            setIsGenerating(false);
            setStatus('');
        }
    };

    return (
        <div className="bg-gray-800/50 p-4 md:p-8 rounded-xl border border-gray-700 min-h-[500px]">
            <h2 className="text-2xl font-bold text-purple-300 mb-2">一括生成モード (Suno v5)</h2>
            <p className="text-gray-400 mb-6">歌詞と複数のアーティストプリセットから、一度に複数の楽曲プロンプトを生成します。</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <SectionLabel text="1. 歌詞を書く" tooltipText={DESCRIPTIONS.lyrics} />
                        <textarea value={data.rawLyrics} onChange={e => setData({ ...data, rawLyrics: e.target.value })} rows={15} placeholder="ここに自由に歌詞やアイデアを書き出してください..." className="w-full bg-gray-800 border border-gray-700 text-white text-base rounded-lg p-4 font-mono leading-relaxed" />
                    </div>
                    <div>
                        <SectionLabel text="2. 楽曲のニュアンス（任意）" tooltipText={DESCRIPTIONS.naturalLanguage} />
                        <textarea value={data.concept.naturalLanguageNuance} onChange={e => setData({ ...data, concept: { ...data.concept, naturalLanguageNuance: e.target.value } })} rows={4} placeholder="例：雨上がりの朝、窓から差し込む光を感じるような、静かで希望に満ちたピアノバラード" className="w-full bg-gray-800 border border-gray-700 text-white text-base rounded-lg p-4 leading-relaxed" />
                        
                        {/* FIX: Added UI for grabAttentionEnabled. */}
                        <div className="flex items-center gap-2 mt-4 text-sm text-gray-300">
                            <input
                                type="checkbox"
                                id="grab-attention-enabled-batch"
                                checked={grabAttentionEnabled}
                                onChange={(e) => setGrabAttentionEnabled(e.target.checked)}
                                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                            />
                            <label htmlFor="grab-attention-enabled-batch" className="cursor-pointer">冒頭15秒でリスナーを掴む</label>
                            <Tooltip text="楽曲の冒頭にフックを集中させ、リスナーの注意を即座に引きつける構成をAIに優先させます。「いきなりサビ」や印象的なイントロリフなどが生成されやすくなります。">
                                <Info className="h-4 w-4 text-gray-500 cursor-help" />
                            </Tooltip>
                        </div>
                        
                        <details className="mt-4 bg-gray-900/50 p-3 rounded-md border border-gray-700">
                            <summary className="text-sm font-medium text-gray-400 cursor-pointer">💡 ニュアンス増幅オプション</summary>
                            <div className="mt-4 space-y-3 pt-4 border-t border-gray-600">
                                {nuanceAmplifierOptions.map(option => (
                                    <div key={option.id} className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" checked={data.concept.nuanceAmplifiers[option.id] || false} onChange={e => handleNuanceAmplifierChange(option.id, e.target.checked)} className="rounded" />
                                            <span className="text-gray-300">{option.label}</span>
                                        </label>
                                        <Tooltip text={option.description}><Info className="h-4 w-4 text-gray-500 cursor-help" /></Tooltip>
                                    </div>
                                ))}
                            </div>
                        </details>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <SectionLabel text="3. アーティストプリセットを選択" tooltipText="AIに影響を与えるアーティストを複数選択してください。" />
                            {data.concept.artistPresets.length > 0 && (
                                <Tooltip text="選択したプリセットをすべてリセットします。">
                                    <button onClick={() => setData(prev => ({ ...prev, concept: { ...prev.concept, artistPresets: [] } }))} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-2 px-2 py-1 rounded-md hover:bg-gray-700 transition-colors">
                                        <RotateCcw className="h-3 w-3" /> リセット
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                            {Object.keys(artistPresetConfigs).map(artist => {
                                const isSelected = data.concept.artistPresets.includes(artist);
                                const button = (
                                    <button key={artist} onClick={() => handleToggleArtistPreset(artist)} className={`p-3 text-xs md:text-sm rounded-lg transition-all w-full flex items-center justify-center ${isSelected ? 'bg-purple-600 text-white border-2 border-purple-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'}`}>
                                        {artist}
                                    </button>
                                );
                                const tooltipText = artistTooltips[artist];
                                return tooltipText ? <Tooltip key={artist} text={tooltipText} wrapperClassName="relative flex w-full">{button}</Tooltip> : button;
                            })}
                        </div>
                        {data.concept.artistPresets.length > 0 && <div className="text-xs text-purple-200 bg-purple-900/50 p-2 rounded-md">✨ {data.concept.artistPresets.join(', ')} のスタイルに影響されます</div>}
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-800 to-indigo-800 rounded-lg border border-purple-600 text-center sticky top-4">
                        <h4 className="text-lg font-bold text-white mb-2">4. 楽曲を生成</h4>
                        <p className="text-xs text-purple-200 mb-3">下のボタンを押すと、選択したすべてのプリセットの楽曲生成が始まります。</p>
                        <button
                            onClick={handleFullAutoGeneration}
                            disabled={isGenerating || !data.rawLyrics.trim() || data.concept.artistPresets.length === 0}
                            className="w-full font-bold bg-white text-purple-800 px-3 py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-purple-100 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                        >
                            {isGenerating ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                            AIで楽曲をフルオート作曲
                        </button>
                        {isGenerating && (
                            <p className="text-purple-200 mt-3 text-sm animate-pulse">{status}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BatchGeneration;
