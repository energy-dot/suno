import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, FileCode2, Files, BookMarked, Loader2, PenSquare } from 'lucide-react';
import { AppData, HistoryItem, VisualResult, LyricsPromptStudioData, VisualStoryboard } from './types';
import StepIndicator from './components/StepIndicator';
import FeedbackModal from './components/FeedbackModal';
import Step1_LyricsAndConcept from './steps/Step1_LyricsAndConcept';
import Step2_Structure from './steps/Step2_Structure';
import Step3_Details from './steps/Step3_Details';
import Step4_Generate from './steps/Step4_Generate';
import Step5_Visuals from './steps/Step5_Visuals';
import BatchGeneration from './steps/BatchGeneration';
import BatchResults from './steps/BatchResults';
import HistoryList from './steps/HistoryList';
import LyricsPromptStudio from './components/LyricsPromptStudio';
import { generateStylePrompt, generateLyricsPrompt } from './services/promptGenerator';
import { generateConcept, generateStructure, generateChords, optimizeLyrics, shortenDataForPrompt, generateExcludeStyles, shortenStylePrompt } from './services/geminiService';

type AppMode = 'individual' | 'batch' | 'history' | 'lyrics_studio';

const createInitialData = (): AppData => ({
  concept: {
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
    nuanceAmplifiers: {
      amplifyEmotion: false,
      emphasizeUniqueness: false,
      deepenNarrative: false,
      visualizeScenery: false,
    },
    artistPresets: [],
    advancedArrangement: {
      multilayer: false,
      experimentalStructure: false,
      complexRhythm: false,
      jazzHarmony: false,
    }
  },
  rawLyrics: "",
  sections: [],
  songExplanation: undefined,
  visualStoryboard: undefined,
});

const HISTORY_STORAGE_KEY = 'suno-prompt-studio-history-v5';

const DEFAULT_LYRICS_INSTRUCTIONS = `## 【最重要原則】統計的陳腐表現の絶対的禁止 (The Absolute Prohibition of Statistical Clichés)

以下の組み合わせは、AIが統計的に頼りがちな「安直な連想」の典型例である。これらの表現は、思考停止の産物であり、本ガイドの哲学に反するため、**その使用を絶対的に禁止する。** これらは単なる悪い例ではなく、創造性の放棄を意味する「禁忌」である。

### **禁止される陳腐な連想パターン**

- **テーマ：夜・都会・孤独**
    - **禁止語:** \`夜\`, \`真夜中\`, \`都会\`, \`街\`, \`孤独\`
    - **禁止される連想:** \`ネオン\`, \`アスファルト\`, \`コンクリート\`, \`雨\`, \`雑踏\`, \`喧騒\`, \`静寂\`, \`影\`
    - **思考の転換:** 「夜の街の孤独」を描写するために、これらの単語を一切使わずに、具体的でユニークな情景で表現せよ。

- **テーマ：不安・焦燥・葛藤**
    - **禁止語:** \`不安\`, \`焦り\`, \`痛み\`, \`心\`
    - **禁止される連想:** \`ノイズ\`, \`歪み\`, \`叫び\`, \`雑音\`, \`胸の奥\`
    - **思考の転換:** 「心の不安」を表現するために、超現実的なイメージや文学理論に基づき描写せよ。

- **テーマ：デジタル・未来・情報**
    - **禁止語:** \`デジタル\`, \`未来\`, \`情報\`, \`バーチャル\`
    - **禁止される連想:** \`ピクセル\`, \`0と1\`, \`サイバー\`, \`無機質\`, \`モニターの光\`
    - **思考の転換:** 「デジタルの無機質さ」を表現するために、人間的な行為と結びついた具体的なディテールで描写せよ。`;

export default function App() {
  const [mode, setMode] = useState<AppMode>('lyrics_studio');
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AppData>(createInitialData);
  const [feedback, setFeedback] = useState<string | null>(null);

  const initialLyricsStudioData = useMemo((): LyricsPromptStudioData => ({
      nuance: '',
      language: 'ja',
      tone: {
          literaryStyle: 'poetic',
          emotionalAttitude: 'introspective',
          musicalStyle: 'lyrical',
      },
      persona: '',
      target: '[日本向け] Z世代 (SNSネイティブ)',
      genre: '',
      pov: '',
      tense: '',
      length: 'standard',
      themes: [],
      sections: [],
      hooks: [],
      emotion_arc: { calm: 25, build: 50, burst: 100, reflect: 75 },
      lexicons: { brightness: [], darkness: [], motion: [], space: [] },
      syllable_density: 'medium',
      rhyme: { end: true, internal: false, alliteration: false, assonance: false, multisyllabic: false },
      constraints: { avoid_cliches: true, ban_words: '' },
      output_spec: { ja_kana_ratio: 0.5, add_furigana: false, add_romaji: false },
  }), []);

  // Lyrics Studio States
  const [lyricsStudioData, setLyricsStudioData] = useState<LyricsPromptStudioData>(initialLyricsStudioData);
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [generationExplanation, setGenerationExplanation] = useState('');
  const [critique, setCritique] = useState<string | null>(null);


  const [batchResults, setBatchResults] = useState<HistoryItem['results'] | null>(null);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [viewingHistoryItem, setViewingHistoryItem] = useState<HistoryItem | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [autoGenerationStatus, setAutoGenerationStatus] = useState('');
  const [optimizePronunciation, setOptimizePronunciation] = useState(true);
  const [generateExcludeStylesEnabled, setGenerateExcludeStylesEnabled] = useState(true);
  const [allowLyricModification, setAllowLyricModification] = useState(true);
  const [grabAttentionEnabled, setGrabAttentionEnabled] = useState(false);
  const [lyricsInstructions, setLyricsInstructions] = useState(DEFAULT_LYRICS_INSTRUCTIONS); // New state for lyrics instructions
  
  const [finalPrompts, setFinalPrompts] = useState<{ style: string, lyrics: string, exclude: { keywords: string, explanation: string } | null } | null>(null);

  const [displayPrompts, setDisplayPrompts] = useState<{style: string, lyrics: string}>({style: '', lyrics: ''});
  const [isGeneratingDisplayPrompts, setIsGeneratingDisplayPrompts] = useState(false);
  const [visuals, setVisuals] = useState<VisualResult[] | null>(null);
  const [sceneImages, setSceneImages] = useState<{ [key: string]: { imageBase64: string; isLoading: boolean; } }>({});

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (error) { console.error("Failed to load history:", error); }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) { console.error("Failed to save history:", error); }
  }, [history]);

  useEffect(() => {
    if (step === 4 && !finalPrompts && mode === 'individual' && !viewingHistoryItem) {
        const generateForDisplay = async () => {
            setIsGeneratingDisplayPrompts(true);
            try {
                let style = await generateStylePrompt(data);
                const lyrics = generateLyricsPrompt(data);
                
                if (style.length > 1000) {
                    style = await shortenStylePrompt(style, data.concept, lyrics);
                }

                setDisplayPrompts({ style, lyrics });
            } catch (error: any) {
                console.error("Error generating display prompts:", error);
                setFeedback(`プロンプトの生成中にエラーが発生しました: ${error.message}`);
            } finally {
                setIsGeneratingDisplayPrompts(false);
            }
        };
        generateForDisplay();
    }
  }, [step, data, finalPrompts, mode, viewingHistoryItem]);


  const resetStateForNew = () => {
    setData(createInitialData());
    setStep(1);
    setBatchResults(null);
    setViewingHistoryItem(null);
    setCurrentSessionId(null);
    setFeedback(null);
    setFinalPrompts(null);
    setIsAutoGenerating(false);
    setAutoGenerationStatus('');
    setOptimizePronunciation(true);
    setGenerateExcludeStylesEnabled(true);
    setAllowLyricModification(true);
    setGrabAttentionEnabled(false);
    setLyricsInstructions(DEFAULT_LYRICS_INSTRUCTIONS); // Reset new state
    setDisplayPrompts({style: '', lyrics: ''});
    setVisuals(null);
    setSceneImages({});
  };
  
  const handleSwitchMode = (newMode: AppMode) => {
    // Only reset to a clean state when moving from viewing a history item to any of the creation modes.
    // This preserves the user's work when switching between 'Lyrics Prompt', 'Individual', and 'Batch' modes.
    if (viewingHistoryItem && ['individual', 'batch', 'lyrics_studio'].includes(newMode)) {
        resetStateForNew();
        setLyricsStudioData(initialLyricsStudioData);
    }
    setMode(newMode);
  };

  const handleNextStepClick = () => {
    if (step >= 5) {
      if (window.confirm('すべての編集内容がリセットされます。本当に最初からやり直しますか？')) {
        resetStateForNew();
        setMode('individual');
      }
    } else {
      setStep(s => s + 1);
    }
  };

  const handleGenerationComplete = (results: HistoryItem['results']) => {
      setBatchResults(results);
      setFeedback(`【AIフルオート作曲 完了】\n\n${results.length}曲のプロンプト生成が完了しました。`);
  };

  const handleFullAutoGeneration = async () => {
    if (!data.rawLyrics.trim() || !data.concept.naturalLanguageNuance.trim()) {
      setFeedback("フルオート作曲には「歌詞」と「楽曲のニュアンス」の両方が必要です。");
      return;
    }
    
    setIsAutoGenerating(true);
    setFeedback(null);
    setFinalPrompts(null);
    let currentData = JSON.parse(JSON.stringify(data)); 
    let combinedFeedback = '';
  
    try {
        setAutoGenerationStatus("楽曲コンセプトを生成中...");
        const concept = await generateConcept(currentData.rawLyrics, currentData.concept.naturalLanguageNuance, currentData.concept.nuanceAmplifiers, grabAttentionEnabled);
        currentData = { ...currentData, concept: { ...currentData.concept, ...concept } };
        
        setAutoGenerationStatus("楽曲構造を生成中...");
        const { newSections, feedback: structureFeedback } = await generateStructure(currentData, grabAttentionEnabled);
        currentData = { ...currentData, sections: newSections };
        combinedFeedback += structureFeedback;
        
        setAutoGenerationStatus("コード進行を生成中...");
        const { updatedSections, feedback: chordsFeedback } = await generateChords(currentData);
        currentData = { ...currentData, sections: updatedSections };
        combinedFeedback += `\n\n${chordsFeedback}`;

        setAutoGenerationStatus("両プロンプトを生成中...");
        let stylePrompt = await generateStylePrompt(currentData);
        let lyricsPrompt = generateLyricsPrompt(currentData);
        
        setAutoGenerationStatus("プロンプト長を検証・調整中...");
        if (stylePrompt.length > 1000) {
            combinedFeedback += `\n\n**情報:** Styleプロンプトが${stylePrompt.length}文字を超えたため、AIによる自動短縮を実行します。`;
            stylePrompt = await shortenStylePrompt(stylePrompt, currentData.concept, lyricsPrompt);
            combinedFeedback += `\n**結果:** Styleプロンプトを${stylePrompt.length}文字に短縮しました。`;
        }
        
        if (lyricsPrompt.length > 5000) {
            combinedFeedback += `\n\n**情報:** Lyricsプロンプトが${lyricsPrompt.length}文字を超えたため、AIによる自動短縮を実行します。`;
            const shortenedSections = await shortenDataForPrompt(currentData, stylePrompt);
            currentData = { ...currentData, sections: shortenedSections };
            lyricsPrompt = generateLyricsPrompt(currentData);
            combinedFeedback += `\n**結果:** Lyricsプロンプトを${lyricsPrompt.length}文字に短縮しました。`;
        }
  
        let finalExclude = null;
        if (generateExcludeStylesEnabled) {
            setAutoGenerationStatus("除外スタイルを生成中...");
            finalExclude = await generateExcludeStyles(stylePrompt, lyricsPrompt, currentData.concept.naturalLanguageNuance);
            combinedFeedback += `\n\n**情報:** 除外スタイルが生成されました。`;
        }

        if (optimizePronunciation) {
            setAutoGenerationStatus("歌詞の発音を最適化中...");
            lyricsPrompt = await optimizeLyrics(lyricsPrompt, currentData.rawLyrics);
            combinedFeedback += `\n\n**情報:** 歌詞の発音最適化が実行されました。`;
        }
        
        currentData.songExplanation = combinedFeedback;
        setData(currentData);
        setFeedback("フルオート作曲が完了しました！ステップ4で結果と音楽理論の解説を確認してください。");
        setFinalPrompts({ style: stylePrompt, lyrics: lyricsPrompt, exclude: finalExclude });
        setStep(4);
        
    } catch (error: any) {
        setFeedback(`フルオート作曲中にエラーが発生しました: ${error.message}`);
    } finally {
        setIsAutoGenerating(false);
        setAutoGenerationStatus('');
    }
  };

  const handleSaveToHistory = (name: string) => {
    const newId = `session_${Date.now()}`;
    if (!finalPrompts) return;

    const newHistoryItem: HistoryItem = {
      id: newId,
      name,
      timestamp: Date.now(),
      mode: 'individual',
      data,
      results: [{ 
        presetName: 'Individual Prompt', 
        stylePrompt: finalPrompts.style, 
        lyricsPrompt: finalPrompts.lyrics,
        excludeStyles: finalPrompts.exclude
      }],
    };
    setHistory(prev => [newHistoryItem, ...prev]);
    setCurrentSessionId(newId);
    setFeedback("セッションを履歴に保存しました！");
  };
  
  const handleViewHistoryItem = (id: string) => {
    const itemToView = history.find(item => item.id === id);
    if (itemToView) {
      resetStateForNew();
      setViewingHistoryItem(itemToView);
      if (itemToView.mode === 'individual') {
        setMode('individual');
        setData(itemToView.data);
        const result = itemToView.results[0];
        setFinalPrompts({ style: result.stylePrompt, lyrics: result.lyricsPrompt, exclude: result.excludeStyles });
        setStep(4);
      } else {
        setMode('batch');
        setBatchResults(itemToView.results);
      }
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    if (window.confirm("この履歴を完全に削除しますか？この操作は取り消せません。")) {
      setHistory(prev => prev.filter(item => item.id !== id));
      setFeedback("履歴を削除しました。");
    }
  };
  
  const handleUpdateHistoryItemName = (id: string, newName: string) => {
    setHistory(prev => prev.map(item => item.id === id ? { ...item, name: newName } : item));
  };
  
  const isCurrentSessionSaved = !!currentSessionId && history.some(h => h.id === currentSessionId);
  
  const renderContent = () => {
    if (mode === 'lyrics_studio') {
      return <LyricsPromptStudio 
                data={lyricsStudioData} 
                setData={setLyricsStudioData}
                generatedLyrics={generatedLyrics}
                setGeneratedLyrics={setGeneratedLyrics}
                generationExplanation={generationExplanation}
                setGenerationExplanation={setGenerationExplanation}
                critique={critique}
                setCritique={setCritique}
             />;
    }
    
    if (mode === 'history') {
      return <HistoryList history={history} onView={handleViewHistoryItem} onDelete={handleDeleteHistoryItem} onRename={handleUpdateHistoryItemName} />;
    }

    if (mode === 'individual') {
      return (
        <>
          <StepIndicator currentStep={step} setStep={setStep} />
          <div className="bg-gray-800/50 p-4 md:p-8 rounded-xl border border-gray-700 min-h-[500px]">
            {step === 1 && <Step1_LyricsAndConcept data={data} setData={setData} setStep={setStep} setFeedback={setFeedback} onFullAutoGenerate={handleFullAutoGeneration} isAutoGenerating={isAutoGenerating} autoGenerationStatus={autoGenerationStatus} optimizePronunciation={optimizePronunciation} setOptimizePronunciation={setOptimizePronunciation} generateExcludeStylesEnabled={generateExcludeStylesEnabled} setGenerateExcludeStylesEnabled={setGenerateExcludeStylesEnabled} allowLyricModification={allowLyricModification} setAllowLyricModification={setAllowLyricModification} grabAttentionEnabled={grabAttentionEnabled} setGrabAttentionEnabled={setGrabAttentionEnabled} lyricsInstructions={lyricsInstructions} setLyricsInstructions={setLyricsInstructions} />}
            {step === 2 && <Step2_Structure data={data} setData={setData} />}
            {step === 3 && <Step3_Details data={data} setData={setData} setFeedback={setFeedback} />}
            {step === 4 && (
              isGeneratingDisplayPrompts && !finalPrompts ? (
                <div className="flex justify-center items-center h-full min-h-[300px]">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-400" />
                  <p className="ml-4 text-gray-300">プロンプトを生成中...</p>
                </div>
              ) : (
                <Step4_Generate 
                  stylePrompt={finalPrompts?.style || displayPrompts.style}
                  lyricsPrompt={finalPrompts?.lyrics || displayPrompts.lyrics}
                  excludeStylesProp={finalPrompts?.exclude || null}
                  data={data}
                  songExplanation={data.songExplanation}
                  onSave={handleSaveToHistory}
                  isSaved={isCurrentSessionSaved}
                  sessionName={viewingHistoryItem?.name}
                  onOptimizeLyrics={(promptToOptimize) => optimizeLyrics(promptToOptimize, data.rawLyrics)}
                  onGenerateExcludeStyles={(stylePrompt, lyricsPrompt, nuance) => generateExcludeStyles(stylePrompt, lyricsPrompt, nuance)}
                />
              )
            )}
            {step === 5 && (
              <Step5_Visuals
                  data={data}
                  setData={setData}
                  visuals={visuals}
                  setVisuals={setVisuals}
                  setFeedback={setFeedback}
                  sceneImages={sceneImages}
                  setSceneImages={setSceneImages}
              />
            )}
          </div>
          <div className="mt-8 flex justify-between items-center">
              <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">戻る</button>
              <button onClick={handleNextStepClick} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition-colors flex items-center gap-2">
                  {step >= 5 ? '最初からやり直す' : '次のステップへ'} <ArrowRight className="h-5 w-5" />
              </button>
          </div>
        </>
      );
    }

    if (mode === 'batch') {
      if (batchResults || viewingHistoryItem?.mode === 'batch') {
        const resultsToShow = batchResults || viewingHistoryItem?.results;
        return (
          <BatchResults 
            results={resultsToShow || null}
            onBack={() => {
                if (viewingHistoryItem) {
                    handleSwitchMode('history');
                } else {
                    resetStateForNew();
                    setMode('batch');
                }
            }}
            onSave={(name) => {
                if (!batchResults) return;
                const newId = `session_${Date.now()}`;
                const newHistoryItem: HistoryItem = { id: newId, name, timestamp: Date.now(), mode: 'batch', data, results: batchResults };
                setHistory(prev => [newHistoryItem, ...prev]);
                setCurrentSessionId(newId);
                setFeedback("セッションを履歴に保存しました！");
            }}
            isNewGeneration={!viewingHistoryItem}
            sessionName={viewingHistoryItem?.name}
          />
        )
      }
      return <BatchGeneration data={data} setData={setData} setFeedback={setFeedback} onGenerationComplete={handleGenerationComplete} />;
    }
  };
 
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans p-4 md:p-8">
      <FeedbackModal feedback={feedback} onClose={() => setFeedback(null)} />
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Suno AI Prompt Studio v5</h1>
            <p className="text-gray-400 mt-2">Suno v5対応 - 音楽理論に基づくデュアル・プロンプト生成</p>
        </header>

        <div className="mb-8 flex justify-center border-b border-gray-700">
            <button onClick={() => handleSwitchMode('lyrics_studio')} className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors ${mode === 'lyrics_studio' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}><PenSquare className="h-5 w-5" /> 歌詞プロンプト</button>
            <button onClick={() => handleSwitchMode('individual')} className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors ${mode === 'individual' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}><FileCode2 className="h-5 w-5" /> 個別設定モード</button>
            <button onClick={() => handleSwitchMode('batch')} className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors ${mode === 'batch' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}><Files className="h-5 w-5" /> 一括生成モード</button>
            <button onClick={() => handleSwitchMode('history')} className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors ${mode === 'history' ? 'border-b-2 border-green-500 text-white' : 'text-gray-400 hover:text-white'}`}><BookMarked className="h-5 w-5" /> 生成履歴</button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}