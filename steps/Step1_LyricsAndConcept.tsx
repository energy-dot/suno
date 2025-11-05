import React, { useState, useMemo } from 'react';
import { Sparkles, Loader2, Info, RotateCcw, Wand2, BrainCircuit, Mic } from 'lucide-react';
import { AppData } from '../types';
import { META_DATA, DESCRIPTIONS, nuanceAmplifierOptions, artistTooltips, PRODUCTION_MIX_DESCRIPTIONS, MOOD_DESCRIPTIONS, VOCAL_STYLE_DESCRIPTIONS, VOCAL_GENDER_DESCRIPTIONS } from '../constants';
import { generateStructure, generateConcept, performDeepThink, generateNewLyrics } from '../services/geminiService';
import { transformLyricsAndNuanceByGenre } from '../services/genreTransformerService';
import { genreTransformationConfigs } from '../data/genreTransformationConfigs';
import SectionLabel from '../components/SectionLabel';
import TagSelector from '../components/TagSelector';
import Tooltip from '../components/Tooltip';
import { artistPresetConfigs } from '../data/artistPresets';
import { vocalFlowPresets } from '../data/vocalFlowPresets';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  setStep: (step: number) => void;
  setFeedback: (feedback: string | null) => void;
  onFullAutoGenerate: () => Promise<void>;
  isAutoGenerating: boolean;
  autoGenerationStatus: string;
  optimizePronunciation: boolean;
  setOptimizePronunciation: (value: boolean) => void;
  generateExcludeStylesEnabled: boolean;
  setGenerateExcludeStylesEnabled: (value: boolean) => void;
  allowLyricModification: boolean;
  setAllowLyricModification: (value: boolean) => void;
  grabAttentionEnabled: boolean;
  setGrabAttentionEnabled: (value: boolean) => void;
  lyricsInstructions: string; // New prop for lyrics instructions
  setLyricsInstructions: (value: string) => void; // New prop setter for lyrics instructions
}

const advancedArrangementOptions = [
    { id: 'multilayer', label: '🎹 多層アレンジメント', description: '複数のメロディラインが独立しつつも、調和して絡み合うアレンジをAIに要求します。対位法的な技術や、楽器のレイヤーを重ねることで、サウンドに厚みと複雑さをもたらします。' },
    { id: 'experimentalStructure', label: '🔬 実験的構造', description: '従来の「Verse-Chorus」のような定型的な楽曲構成から逸脱し、非伝統的なセクション配置や、予測不可能な展開（突然のブレイクやテンポチェンジなど）をAIに指示します。' },
    { id: 'complexRhythm', label: '🥁 複雑リズム', description: '楽曲の基本となる拍子やリズムパターンをより複雑にし、ポリリズムや変拍子、シンコペーションを多用した、テクニカルでグルーヴィーなリズム展開を要求します。' },
    { id: 'jazzHarmony', label: '🎷 ジャズハーモニー', description: 'テンションノート（9th, 11th, 11th）を含む複雑なコードや、代理コード、モーダルインターチェンジといった、ジャズ特有の洗練されたハーモニーを積極的に使用するよう指示します。' },
];

const Step1_LyricsAndConcept: React.FC<Props> = ({ data, setData, setStep, setFeedback, onFullAutoGenerate, isAutoGenerating, autoGenerationStatus, optimizePronunciation, setOptimizePronunciation, generateExcludeStylesEnabled, setGenerateExcludeStylesEnabled, allowLyricModification, setAllowLyricModification, grabAttentionEnabled, setGrabAttentionEnabled, lyricsInstructions, setLyricsInstructions }) => {
  const [isGeneratingStructure, setIsGeneratingStructure] = useState(false);
  const [isGeneratingConcept, setIsGeneratingConcept] = useState(false);
  const [isApplyingStyle, setIsApplyingStyle] = useState<keyof typeof genreTransformationConfigs | null>(null);
  const [isDeepThinking, setIsDeepThinking] = useState(false);
  const [selectedVocalFlow, setSelectedVocalFlow] = useState<string | null>(null);
  const [isRegeneratingLyrics, setIsRegeneratingLyrics] = useState(false); // New loading state

  const initialConceptState = useMemo(() => ({
    mainGenres: [],
    subGenres: [],
    moods: [],
    key: 'C Major',
    tempo: 120,
    timeSignature: '4/4',
    rhythmPattern: 'Straight',
    productionMixes: [],
    vocalStyles: [],
    vocalGenders: [],
    naturalLanguageNuance: '',
    artistPresets: [],
    artistPreset: undefined,
    advancedArrangement: {
      multilayer: false,
      experimentalStructure: false,
      complexRhythm: false,
      jazzHarmony: false,
    },
    nuanceAmplifiers: {
      amplifyEmotion: false,
      emphasizeUniqueness: false,
      deepenNarrative: false,
      visualizeScenery: false,
    },
  }), []);

  const handleResetConcept = () => {
      setData(prevData => ({
          ...prevData,
          concept: {
              ...initialConceptState,
              naturalLanguageNuance: prevData.concept.naturalLanguageNuance,
          }
      }));
      setSelectedVocalFlow(null);
  };

  const handleSelectArtistPreset = (preset: string) => {
    const presetConfig = artistPresetConfigs[preset];
    if (!presetConfig) return;

    setData(prevData => {
        const isAlreadySelected = prevData.concept.artistPresets.includes(preset);
        
        if (isAlreadySelected) {
            // Clicked the same preset again: deselect it and reset the form.
            return {
                ...prevData,
                concept: {
                    ...initialConceptState,
                    naturalLanguageNuance: prevData.concept.naturalLanguageNuance,
                }
            };
        } else {
            // Clicked a new preset: select it and apply its config.
            return {
                ...prevData,
                concept: {
                    ...prevData.concept,
                    ...presetConfig,
                    artistPresets: [preset],
                    artistPreset: preset, // Also set the singular for service compatibility
                }
            };
        }
    });
  };

    const handleVocalFlowSelect = (presetId: string) => {
        const preset = vocalFlowPresets.find(p => p.id === presetId);
        if (!preset) return;

        setData(prevData => {
            const currentNuance = prevData.concept.naturalLanguageNuance;
            const newNuance = (currentNuance ? currentNuance + '\n\n' : '') + preset.basePrompt;
            return {
                ...prevData,
                concept: {
                    ...prevData.concept,
                    naturalLanguageNuance: newNuance,
                }
            };
        });
        setSelectedVocalFlow(presetId);
        setFeedback(`「${preset.name}」のプロンプトをニュアンスに追加しました。`);
    };

    const handleMainGenreToggle = (genre: string) => {
        setData(prev => {
            const currentMainGenres = prev.concept.mainGenres;
            const newMainGenres = currentMainGenres.includes(genre)
                ? currentMainGenres.filter(g => g !== genre)
                : [...currentMainGenres, genre];
            return {
                ...prev,
                concept: {
                    ...prev.concept,
                    mainGenres: newMainGenres,
                },
            };
        });
    };

    const handleSubGenreChange = (newSubGenres: string[]) => {
        setData(prev => ({
            ...prev,
            concept: {
                ...prev.concept,
                subGenres: newSubGenres,
            },
        }));
    };

  const handleAiConceptGeneration = async () => {
    if (!data.concept.naturalLanguageNuance.trim()) {
      setFeedback("コンセプトを生成するには、まず「楽曲のニュアンス」を入力してください。");
      return;
    }
    setIsGeneratingConcept(true);
    setFeedback(null);
    try {
      const aiConcept = await generateConcept(data.rawLyrics, data.concept.naturalLanguageNuance, data.concept.nuanceAmplifiers, grabAttentionEnabled);
      setData(prevData => ({
        ...prevData,
        concept: {
          ...prevData.concept,
          ...aiConcept,
        }
      }));
      setFeedback("AIが楽曲コンセプトを提案しました。各項目を確認・調整してください。");
    } catch (error: any) {
      console.error("AI concept generation failed:", error);
      setFeedback(`コンセプトの生成中にエラーが発生しました：${error.message}`);
    } finally {
      setIsGeneratingConcept(false);
    }
  };

  const handleDeepThink = async () => {
    if (!data.rawLyrics.trim() || !data.concept.naturalLanguageNuance.trim()) {
        setFeedback("DeepThinkを実行するには、歌詞と楽曲ニュアンスの両方を入力してください。");
        return;
    }
    setIsDeepThinking(true);
    setFeedback(null);
    try {
        const { lyrics, nuance, analysis } = await performDeepThink(data.rawLyrics, data.concept.naturalLanguageNuance, lyricsInstructions, allowLyricModification, grabAttentionEnabled);
        setData(prevData => ({
            ...prevData,
            rawLyrics: lyrics,
            concept: {
                ...prevData.concept,
                naturalLanguageNuance: nuance
            }
        }));
        setFeedback(`【DeepThink分析結果】\n\n${analysis}\n\n上記の分析に基づき、楽曲ニュアンスを更新しました。${allowLyricModification ? " 歌詞も提案に合わせて更新されています。" : ""}`);
    } catch (error: any) {
        console.error("DeepThink failed:", error);
        setFeedback(`DeepThinkの実行中にエラーが発生しました：${error.message}`);
    } finally {
        setIsDeepThinking(false);
    }
  };

  const handleApplyStyle = async (style: keyof typeof genreTransformationConfigs) => {
    if (!data.rawLyrics.trim()) {
        const styleName = genreTransformationConfigs[style]?.name || style;
        setFeedback(`${styleName}化を適用するには、まず歌詞を入力してください。`);
        return;
    }
    setIsApplyingStyle(style);
    setFeedback(null);
    try {
        const config = genreTransformationConfigs[style];
        if (!config) {
            throw new Error(`Unsupported style: ${style}`);
        }

        const { lyrics, nuance } = await transformLyricsAndNuanceByGenre(data.rawLyrics, data.concept.naturalLanguageNuance, lyricsInstructions, config, allowLyricModification, grabAttentionEnabled);
        setData(prevData => ({
            ...prevData,
            rawLyrics: lyrics,
            concept: {
                ...prevData.concept,
                naturalLanguageNuance: nuance
            }
        }));
        setFeedback(`楽曲のニュアンスを${config.name}スタイルに変換しました！${allowLyricModification ? " 歌詞も提案に合わせて更新されています。" : ""}`);
    } catch (error: any) {
        console.error(`${style} style application failed:`, error);
        const styleName = genreTransformationConfigs[style]?.name || style;
        setFeedback(`${styleName}化の適用中にエラーが発生しました：${error.message}`);
    } finally {
        setIsApplyingStyle(null);
    }
  };

  const handleRegenerateLyrics = async () => {
    if (!data.rawLyrics.trim()) {
        setFeedback("歌詞を再生成するには、まず既存の歌詞を入力してください。");
        return;
    }
    if (!allowLyricModification) {
        setFeedback("歌詞の再生成は、AIによる歌詞の変更を許可する場合にのみ実行できます。");
        return;
    }
    setIsRegeneratingLyrics(true);
    setFeedback(null);
    try {
        const newLyrics = await generateNewLyrics(data.rawLyrics, data.concept.naturalLanguageNuance, lyricsInstructions, allowLyricModification, grabAttentionEnabled);
        setData(prevData => ({ ...prevData, rawLyrics: newLyrics }));
        setFeedback("AIが歌詞を再生成しました！");
    } catch (error: any) {
        console.error("Lyrics regeneration failed:", error);
        setFeedback(`歌詞の再生成中にエラーが発生しました：${error.message}`);
    } finally {
        setIsRegeneratingLyrics(false);
    }
  };

  const handleAiStructureGeneration = async () => {
    if (!data.rawLyrics.trim()) {
      setFeedback("構造を生成するには、まず歌詞を入力してください。");
      return;
    }
    setIsGeneratingStructure(true);
    setFeedback(null);
    try {
      const { newSections, feedback } = await generateStructure(data, grabAttentionEnabled);
      setData({ ...data, sections: newSections });
      setFeedback(feedback);
      setStep(2);
    } catch (error: any) {
      console.error("AI structure generation failed:", error);
      setFeedback(`エラーが発生しました：${error.message}`);
    } finally {
      setIsGeneratingStructure(false);
    }
  };
  
  const getTempoInfo = (bpm: number): { classification: string; genres: string } | null => {
    if (bpm >= 60 && bpm <= 70) return { classification: 'Very Slow', genres: 'バラード、アンビエント' };
    if (bpm >= 80 && bpm <= 95) return { classification: 'Slow', genres: 'ジャズ、R&B' };
    if (bpm >= 100 && bpm <= 120) return { classification: 'Medium', genres: 'ポップ、ロック' };
    if (bpm >= 130 && bpm <= 150) return { classification: 'Fast', genres: 'ダンス、パンク' };
    if (bpm >= 160) return { classification: 'Very Fast', genres: 'メタル、ハードコア' };
    return null;
  };

  const tempoInfo = getTempoInfo(data.concept.tempo);
  
  const handleAdvancedArrangementChange = (id: string, checked: boolean) => {
    setData(prevData => ({
      ...prevData,
      concept: {
        ...prevData.concept,
        advancedArrangement: {
          ...prevData.concept.advancedArrangement,
          [id]: checked
        }
      }
    }));
  };

  const handleNuanceAmplifierChange = (id: string, checked: boolean) => {
    setData(prevData => ({
      ...prevData,
      concept: {
        ...prevData.concept,
        nuanceAmplifiers: {
          ...prevData.concept.nuanceAmplifiers,
          [id]: checked,
        }
      }
    }));
  };

  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
              <div className="flex items-center justify-between mb-2">
                <SectionLabel text="1. 歌詞を書く" tooltipText={DESCRIPTIONS.lyrics} />
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <button
                      onClick={() => handleApplyStyle('kpop')}
                      disabled={!!isApplyingStyle || isAutoGenerating || isGeneratingConcept || isGeneratingStructure || isDeepThinking || isRegeneratingLyrics || !data.rawLyrics.trim()}
                      className="text-xs bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                      title="AIで現在の歌詞とニュアンスをK-POPスタイルに変換します"
                  >
                      {isApplyingStyle === 'kpop' ? <Loader2 className="animate-spin h-4 w-4"/> : <Wand2 className="h-4 w-4" />}
                      K-POP適用
                  </button>
                  <button
                      onClick={() => handleApplyStyle('pos')}
                      disabled={!!isApplyingStyle || isAutoGenerating || isGeneratingConcept || isGeneratingStructure || isDeepThinking || isRegeneratingLyrics || !data.rawLyrics.trim()}
                      className="text-xs bg-stone-700 hover:bg-stone-600 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                      title="AIで現在の歌詞とニュアンスをPain of Salvationスタイルに変換します"
                  >
                      {isApplyingStyle === 'pos' ? <Loader2 className="animate-spin h-4 w-4"/> : <Wand2 className="h-4 w-4" />}
                      PoS適用
                  </button>
                  <button
                      onClick={() => handleApplyStyle('dualipa')}
                      disabled={!!isApplyingStyle || isAutoGenerating || isGeneratingConcept || isGeneratingStructure || isDeepThinking || isRegeneratingLyrics || !data.rawLyrics.trim()}
                      className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                      title="AIで現在の歌詞とニュアンスをDua Lipaスタイルに変換します"
                  >
                      {isApplyingStyle === 'dualipa' ? <Loader2 className="animate-spin h-4 w-4"/> : <Wand2 className="h-4 w-4" />}
                      Dua Lipa適用
                  </button>
                   <button
                      onClick={() => handleApplyStyle('techno')}
                      disabled={!!isApplyingStyle || isAutoGenerating || isGeneratingConcept || isGeneratingStructure || isDeepThinking || isRegeneratingLyrics || !data.rawLyrics.trim()}
                      className="text-xs bg-slate-600 hover:bg-slate-500 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                      title="AIで現在の歌詞とニュアンスをTechnoスタイルに変換します"
                  >
                      {isApplyingStyle === 'techno' ? <Loader2 className="animate-spin h-4 w-4"/> : <Wand2 className="h-4 w-4" />}
                      Techno適用
                  </button>
                  <button
                      onClick={() => handleApplyStyle('edm')}
                      disabled={!!isApplyingStyle || isAutoGenerating || isGeneratingConcept || isGeneratingStructure || isDeepThinking || isRegeneratingLyrics || !data.rawLyrics.trim()}
                      className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                      title="AIで現在の歌詞とニュアンスをEDMスタイルに変換します"
                  >
                      {isApplyingStyle === 'edm' ? <Loader2 className="animate-spin h-4 w-4"/> : <Wand2 className="h-4 w-4" />}
                      EDM適用
                  </button>
                  <button
                      onClick={() => handleApplyStyle('tiesto')}
                      disabled={!!isApplyingStyle || isAutoGenerating || isGeneratingConcept || isGeneratingStructure || isDeepThinking || isRegeneratingLyrics || !data.rawLyrics.trim()}
                      className="text-xs bg-purple-700 hover:bg-purple-600 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                      title="AIで現在の歌詞とニュアンスをTiëstoスタイルに変換します"
                  >
                      {isApplyingStyle === 'tiesto' ? <Loader2 className="animate-spin h-4 w-4"/> : <Wand2 className="h-4 w-4" />}
                      Tiësto適用
                  </button>
                  <button
                      onClick={() => handleApplyStyle('diva')}
                      disabled={!!isApplyingStyle || isAutoGenerating || isGeneratingConcept || isGeneratingStructure || isDeepThinking || isRegeneratingLyrics || !data.rawLyrics.trim()}
                      className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                      title="AIで現在の歌詞とニュアンスをDivaスタイル（Adele, Amy Winehouseなど）に変換します"
                  >
                      {isApplyingStyle === 'diva' ? <Loader2 className="animate-spin h-4 w-4"/> : <Wand2 className="h-4 w-4" />}
                      ディーバ適用
                  </button>
                  <button
                      onClick={() => handleApplyStyle('disclosure')}
                      disabled={!!isApplyingStyle || isAutoGenerating || isGeneratingConcept || isGeneratingStructure || isDeepThinking || isRegeneratingLyrics || !data.rawLyrics.trim()}
                      className="text-xs bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                      title="AIで現在の歌詞とニュアンスをDisclosureスタイルに変換します"
                  >
                      {isApplyingStyle === 'disclosure' ? <Loader2 className="animate-spin h-4 w-4"/> : <Wand2 className="h-4 w-4" />}
                      Disclosure適用
                  </button>
                  <button
                      onClick={() => handleApplyStyle('thexx')}
                      disabled={!!isApplyingStyle || isAutoGenerating || isGeneratingConcept || isGeneratingStructure || isDeepThinking || isRegeneratingLyrics || !data.rawLyrics.trim()}
                      className="text-xs bg-slate-500 hover:bg-slate-400 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                      title="AIで現在の歌詞とニュアンスをThe xxスタイルに変換します"
                  >
                      {isApplyingStyle === 'thexx' ? <Loader2 className="animate-spin h-4 w-4"/> : <Wand2 className="h-4 w-4" />}
                      The xx適用
                  </button>
                  <button
                      onClick={() => handleApplyStyle('tameimpala')}
                      disabled={!!isApplyingStyle || isAutoGenerating || isGeneratingConcept || isGeneratingStructure || isDeepThinking || isRegeneratingLyrics || !data.rawLyrics.trim()}
                      className="text-xs bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                      title="AIで現在の歌詞とニュアンスをTame Impalaスタイルに変換します"
                  >
                      {isApplyingStyle === 'tameimpala' ? <Loader2 className="animate-spin h-4 w-4"/> : <Wand2 className="h-4 w-4" />}
                      Tame Impala適用
                  </button>
                  <button
                      onClick={() => handleApplyStyle('minimalism')}
                      disabled={!!isApplyingStyle || isAutoGenerating || isGeneratingConcept || isGeneratingStructure || isDeepThinking || isRegeneratingLyrics || !data.rawLyrics.trim()}
                      className="text-xs bg-gray-500 hover:bg-gray-400 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                      title="AIで現在の歌詞とニュアンスをミニマリズム音楽（Steve Reich, Philip Glassなど）のスタイルに変換します"
                  >
                      {isApplyingStyle === 'minimalism' ? <Loader2 className="animate-spin h-4 w-4"/> : <Wand2 className="h-4 w-4" />}
                      Reich/Glass適用
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                  <input
                      type="checkbox"
                      id="allow-lyric-modification"
                      checked={allowLyricModification}
                      onChange={(e) => setAllowLyricModification(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="allow-lyric-modification" className="cursor-pointer">AIによる歌詞の変更を許可する</label>
                  <Tooltip text="オフにすると、「K-POP適用」や「DeepThink」などの機能が楽曲ニュアンスのみを更新し、既存の歌詞は変更しなくなります。">
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </Tooltip>
              </div>
              <textarea value={data.rawLyrics} onChange={e => setData(prevData => ({...prevData, rawLyrics: e.target.value}))} rows={10} placeholder="ここに自由に歌詞やアイデアを書き出してください..." className="w-full bg-gray-800 border border-gray-700 text-white text-base rounded-lg p-4 font-mono leading-relaxed" />
              
              <div className="flex items-center justify-between mb-2 mt-4">
                <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-gray-400">歌詞の生成指示（任意）</label>
                    <Tooltip text="「AIで歌詞を再生成」ボタンや「DeepThink」、「xx適用」機能が、この指示を参考に歌詞を生成・修正します。">
                        <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </Tooltip>
                </div>
                <button
                    onClick={handleRegenerateLyrics}
                    disabled={isRegeneratingLyrics || isAutoGenerating || isGeneratingConcept || isGeneratingStructure || isDeepThinking || !!isApplyingStyle || !data.rawLyrics.trim() || !allowLyricModification}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                    title="AIで現在の歌詞を再生成します。指示欄と楽曲ニュアンスを参照します。"
                >
                    {isRegeneratingLyrics ? <Loader2 className="animate-spin h-4 w-4"/> : <Sparkles className="h-4 w-4" />}
                    AIで歌詞を再生成
                </button>
              </div>
              <textarea value={lyricsInstructions} onChange={e => setLyricsInstructions(e.target.value)} rows={5} placeholder="例：この歌詞をより詩的に、または特定のテーマを強調して書き直してください。" className="w-full bg-gray-800 border border-gray-700 text-white text-base rounded-lg p-4 leading-relaxed" />
          </div>
          <div>
              <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                      <label className="block text-sm font-medium text-gray-400">楽曲のニュアンス（自然言語）</label>
                      <Tooltip text={DESCRIPTIONS.naturalLanguage}>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                      </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                        onClick={handleDeepThink}
                        disabled={isDeepThinking || isGeneratingConcept || isAutoGenerating || !!isApplyingStyle || isRegeneratingLyrics || !data.rawLyrics.trim() || !data.concept.naturalLanguageNuance.trim()}
                        className="text-xs bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                        title="AIが歌詞とニュアンスを深く分析し、より洗練されたバージョンを提案します"
                    >
                        {isDeepThinking ? <Loader2 className="animate-spin h-4 w-4"/> : <BrainCircuit className="h-4 w-4" />}
                        DeepThink
                    </button>
                    <button
                        onClick={handleAiConceptGeneration}
                        disabled={isGeneratingConcept || isAutoGenerating || !!isApplyingStyle || isDeepThinking || isRegeneratingLyrics || !data.concept.naturalLanguageNuance.trim()}
                        className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
                        title="AIで楽曲のコンセプトを提案します"
                    >
                        {isGeneratingConcept ? <Loader2 className="animate-spin h-4 w-4"/> : <Sparkles className="h-4 w-4" />}
                        AIでコンセプト提案
                    </button>
                  </div>
              </div>
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                  <input
                      type="checkbox"
                      id="grab-attention-enabled"
                      checked={grabAttentionEnabled}
                      onChange={(e) => setGrabAttentionEnabled(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="grab-attention-enabled" className="cursor-pointer">冒頭15秒でリスナーを掴む</label>
                  <Tooltip text="楽曲の冒頭にフックを集中させ、リスナーの注意を即座に引きつける構成をAIに優先させます。「いきなりサビ」や印象的なイントロリフなどが生成されやすくなります。">
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </Tooltip>
              </div>
              <textarea value={data.concept.naturalLanguageNuance} onChange={e => setData(prevData => ({...prevData, concept: {...prevData.concept, naturalLanguageNuance: e.target.value}}))} rows={8} placeholder="例：雨上がりの朝、窓から差し込む光を感じるような、静かで希望に満ちたピアノバラード" className="w-full bg-gray-800 border border-gray-700 text-white text-base rounded-lg p-4 leading-relaxed" />
              <details className="mt-4 bg-gray-900/50 p-3 rounded-md border border-gray-700">
                <summary className="text-sm font-medium text-gray-400 cursor-pointer">
                  💡 ニュアンス増幅オプション
                </summary>
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-600">
                  {nuanceAmplifierOptions.map(option => (
                    <div key={option.id} className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={data.concept.nuanceAmplifiers[option.id] || false} 
                          onChange={e => handleNuanceAmplifierChange(option.id, e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-gray-300">{option.label}</span>
                      </label>
                      <Tooltip text={option.description}>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </details>
          </div>
           <div className="pt-6 border-t border-gray-700/50">
                <div className="flex justify-between items-center mb-4">
                  <SectionLabel text="2. 全体のコンセプト" tooltipText={DESCRIPTIONS.concept} />
                   <Tooltip text="コンセプト設定をすべてリセットします。">
                        <button onClick={handleResetConcept} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-700 transition-colors">
                            <RotateCcw className="h-3 w-3" />
                            コンセプトをリセット
                        </button>
                    </Tooltip>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                    <div className="space-y-2">
                        <SectionLabel text="ジャンル" tooltipText={DESCRIPTIONS.genres} />
                        {META_DATA.groupedGenres.map(group => (
                            <details key={group.category} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 group" open={false}>
                                <summary className="text-sm font-semibold text-gray-300 cursor-pointer list-none flex items-center gap-2">
                                    <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-gray-500 transform transition-transform group-open:rotate-90">▶</span>
                                    {group.category}
                                </summary>
                                <div className="mt-3 pt-3 border-t border-gray-600 space-y-3">
                                  {group.genres.map(mainGenre => {
                                      const subgenresForMain = META_DATA.subGenres[mainGenre] || [];
                                      return (
                                          <div key={mainGenre}>
                                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                                                  <button
                                                      type="button"
                                                      onClick={() => handleMainGenreToggle(mainGenre)}
                                                      className={`px-3 py-1 text-sm rounded-full font-semibold transition-colors ${
                                                          data.concept.mainGenres.includes(mainGenre)
                                                              ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                                                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                      }`}
                                                  >
                                                      {mainGenre}
                                                  </button>
                                                  
                                                  {subgenresForMain.map(subGenre => (
                                                      <button
                                                          key={subGenre}
                                                          type="button"
                                                          onClick={() => {
                                                              const currentSubGenres = data.concept.subGenres;
                                                              const newSubGenres = currentSubGenres.includes(subGenre)
                                                                  ? currentSubGenres.filter(g => g !== subGenre)
                                                                  : [...currentSubGenres, subGenre];
                                                              handleSubGenreChange(newSubGenres);
                                                          }}
                                                          className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                                                              data.concept.subGenres.includes(subGenre)
                                                                  ? 'bg-teal-600 text-white'
                                                                  : 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                                                          }`}
                                                      >
                                                          {subGenre}
                                                      </button>
                                                  ))}
                                              </div>
                                          </div>
                                      );
                                  })}
                                </div>
                            </details>
                        ))}
                    </div>
                    
                    <div>
                        <SectionLabel text="ムード" tooltipText={DESCRIPTIONS.moods} />
                        <TagSelector 
                            options={META_DATA.moods} 
                            selected={data.concept.moods} 
                            onChange={val => setData({...data, concept: {...data.concept, moods: val}})}
                            descriptions={MOOD_DESCRIPTIONS}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">キー</label>
                        <select value={data.concept.key} onChange={e => setData({...data, concept: {...data.concept, key: e.target.value}})} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-2.5 w-full">
                            {META_DATA.keys.map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                        <p className="text-xs text-gray-400 mt-1">メジャーキー（Major）は明るく、マイナーキー（Minor）は暗く悲しい響きが特徴です。</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">拍子</label>
                        <select value={data.concept.timeSignature} onChange={e => setData({...data, concept: {...data.concept, timeSignature: e.target.value}})} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-2.5 w-full">
                            {META_DATA.timeSignatures.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                        </select>
                        <p className="text-xs text-gray-400 mt-1">4/4が最も一般的です。3/4はワルツなど。</p>
                      </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">テンポ (BPM): {data.concept.tempo}</label>
                        <input type="range" min={40} max={200} value={data.concept.tempo} onChange={e => setData({...data, concept: {...data.concept, tempo: parseInt(e.target.value)}})} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                        {tempoInfo ? (
                          <div className="mt-2 bg-gray-700/50 p-2 rounded-md text-xs text-gray-300">
                            <p><span className="font-semibold">分類:</span> {tempoInfo.classification}</p>
                            <p><span className="font-semibold">適用ジャンル:</span> {tempoInfo.genres}</p>
                          </div>
                        ) : (
                          <p className="mt-2 text-xs text-gray-500">現在のテンポは主要な分類の範囲外です。</p>
                        )}
                    </div>
                    <div>
                        <SectionLabel text="リズムパターン" tooltipText="楽曲のリズムの基本的なフィーリングを設定します。変拍子やポリリズムなど高度なリズムも選択可能です。" />
                        <select value={data.concept.rhythmPattern} onChange={e => setData({...data, concept: {...data.concept, rhythmPattern: e.target.value}})} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-2.5 w-full">
                            {META_DATA.rhythmPatterns.map(rp => <option key={rp} value={rp}>{rp}</option>)}
                        </select>
                    </div>
                    <div>
                        <SectionLabel text="プロダクション・ミックス" tooltipText={DESCRIPTIONS.productionMixes} />
                        <TagSelector 
                            options={META_DATA.productionMixes} 
                            selected={data.concept.productionMixes} 
                            onChange={val => setData({...data, concept: {...data.concept, productionMixes: val}})}
                            descriptions={PRODUCTION_MIX_DESCRIPTIONS}
                        />
                    </div>
                    <div>
                        <SectionLabel text="ボーカルスタイル" tooltipText={DESCRIPTIONS.vocals} />
                        <TagSelector 
                            options={META_DATA.vocalStyles} 
                            selected={data.concept.vocalStyles || []} 
                            onChange={val => setData({...data, concept: {...data.concept, vocalStyles: val}})}
                            descriptions={VOCAL_STYLE_DESCRIPTIONS}
                        />
                    </div>
                    <div>
                        <SectionLabel text="ボーカル性別/声質" tooltipText={DESCRIPTIONS.vocals} />
                        <TagSelector 
                            options={META_DATA.vocalGenders} 
                            selected={data.concept.vocalGenders || []} 
                            onChange={val => setData({...data, concept: {...data.concept, vocalGenders: val}})}
                            descriptions={VOCAL_GENDER_DESCRIPTIONS}
                        />
                    </div>
                    <details className="bg-gray-900/50 p-3 rounded-md border border-gray-700" open>
                      <summary className="text-sm font-medium text-gray-400 cursor-pointer">
                        🔧 高度なアレンジメント設定
                      </summary>
                      <div className="mt-4 space-y-3 pt-4 border-t border-gray-600">
                        {advancedArrangementOptions.map(option => (
                          <div key={option.id} className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={data.concept.advancedArrangement[option.id] || false} 
                                onChange={e => handleAdvancedArrangementChange(option.id, e.target.checked)}
                                className="rounded"
                              />
                              <span className="text-gray-300">{option.label}</span>
                            </label>
                            <Tooltip text={option.description}>
                                <Info className="h-4 w-4 text-gray-500 cursor-help" />
                            </Tooltip>
                          </div>
                        ))}
                      </div>
                    </details>
                </div>
          </div>
        </div>
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700 rounded-lg p-4">
              <div className="flex justify-between items-center">
                  <SectionLabel text="🎤 アーティストプリセット" tooltipText="クリックでコンセプトを自動入力します。もう一度クリックするとリセットされます。" />
                  {data.concept.artistPresets.length > 0 && (
                      <Tooltip text="選択を解除し、コンセプトをリセットします。">
                          <button onClick={() => handleSelectArtistPreset(data.concept.artistPresets[0])} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-2 px-2 py-1 rounded-md hover:bg-gray-700 transition-colors">
                              <RotateCcw className="h-3 w-3" />
                              リセット
                          </button>
                      </Tooltip>
                  )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {Object.keys(artistPresetConfigs).map(artist => {
                  const isSelected = data.concept.artistPresets.includes(artist);
                  const button = (
                    <button key={artist} onClick={() => handleSelectArtistPreset(artist)} className={`p-3 text-xs md:text-sm rounded-lg transition-all w-full flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white border-2 border-blue-400 shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'}`}>
                      {artist}
                    </button>
                  );
                  const tooltipText = artistTooltips[artist];
                  return tooltipText ? <Tooltip key={artist} text={tooltipText} wrapperClassName="relative flex w-full">{button}</Tooltip> : button;
                })}
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-900/30 to-gray-900/30 border border-teal-700 rounded-lg p-4">
                <SectionLabel text="🎙️ ボーカルフロースタイル・プリセット" tooltipText="クリックで、特定のボーカルスタイルを実現するための基本プロンプトを下の「楽曲のニュアンス」に追加します。" />
                <div className="grid grid-cols-1 gap-2">
                    {vocalFlowPresets.map(preset => {
                        const button = (
                            <button key={preset.id} onClick={() => handleVocalFlowSelect(preset.id)} className={`p-3 text-sm rounded-lg transition-all w-full text-left flex items-center ${selectedVocalFlow === preset.id ? 'bg-teal-600 text-white border-2 border-teal-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'}`}>
                                <Mic className="h-4 w-4 mr-3 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold">{preset.name}</span>
                                </div>
                            </button>
                        );
                        return <Tooltip key={preset.id} text={preset.description} wrapperClassName="relative flex w-full">{button}</Tooltip>;
                    })}
                </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-800 to-indigo-800 rounded-lg border border-purple-600 text-center">
                <h4 className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2"><Wand2 /> フルオート作曲</h4>
                <p className="text-xs text-purple-200 mb-3">歌詞とニュアンスから、AIがコンセプト・構造・コード等を自動生成します。</p>
                 <div className="flex items-center justify-center gap-2 mb-2 text-sm text-purple-200">
                    <input
                        type="checkbox"
                        id="generate-exclude-styles"
                        checked={generateExcludeStylesEnabled}
                        onChange={(e) => setGenerateExcludeStylesEnabled(e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <label htmlFor="generate-exclude-styles" className="cursor-pointer">除外スタイルを生成</label>
                    <Tooltip text="AIが意図しない音楽的要素を排除するためのキーワードを自動生成します。楽曲の方向性をより明確にします。">
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </Tooltip>
                </div>
                 <div className="flex items-center justify-center gap-2 mb-4 text-sm text-purple-200">
                    <input
                        type="checkbox"
                        id="optimize-pronunciation"
                        checked={optimizePronunciation}
                        onChange={(e) => setOptimizePronunciation(e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <label htmlFor="optimize-pronunciation" className="cursor-pointer">発音を最適化する</label>
                    <Tooltip text="Suno AIが日本語の歌詞を正しく発音するよう、ひらがなやローマ字に変換します。オフにすると、漢字のままプロンプトが生成されます。">
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </Tooltip>
                </div>
                <button
                    onClick={onFullAutoGenerate}
                    disabled={isAutoGenerating || isGeneratingConcept || isGeneratingStructure || !!isApplyingStyle || isDeepThinking || isRegeneratingLyrics || !data.rawLyrics.trim() || !data.concept.naturalLanguageNuance.trim()}
                    className="w-full font-bold bg-white text-purple-800 px-3 py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-purple-100 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                    {isAutoGenerating ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                    AIで楽曲を最後まで自動生成
                </button>
                {isAutoGenerating && (
                    <p className="text-purple-200 mt-3 text-sm animate-pulse">{autoGenerationStatus}</p>
                )}
            </div>
            
            <button onClick={handleAiStructureGeneration} disabled={isGeneratingStructure || isAutoGenerating || !!isApplyingStyle || isDeepThinking || isRegeneratingLyrics} className="w-full text-sm bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-md flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isGeneratingStructure ? <Loader2 className="animate-spin h-4 w-4"/> : <Sparkles className="h-4 w-4" />}
                AIで歌詞の構造を提案
            </button>
        </div>
      </div>
  );
};

export default Step1_LyricsAndConcept;
