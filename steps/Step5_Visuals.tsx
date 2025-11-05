import React, { useState } from 'react';
import { Sparkles, Loader2, Image as ImageIcon, HelpCircle, Check, Wand2, Download, Film } from 'lucide-react';
import { AppData, VisualResult, Section, VisualStoryboard } from '../types';
import { generateVisuals, generateSceneImage, generateVisualStoryboard } from '../services/geminiService';
import Tooltip from '../components/Tooltip';
import SectionLabel from '../components/SectionLabel';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  visuals: VisualResult[] | null;
  setVisuals: (visuals: VisualResult[] | null) => void;
  setFeedback: (feedback: string | null) => void;
  sceneImages: { [key: string]: { imageBase64: string; isLoading: boolean; } };
  setSceneImages: React.Dispatch<React.SetStateAction<{ [key: string]: { imageBase64: string; isLoading: boolean; } }>>;
}

const IMAGE_CONCEPTS_LABELS = [
    "芸術性の高いテーマ",
    "SNS世代向けテーマ",
    "新海誠風テーマ",
];

const Step5_Visuals: React.FC<Props> = ({ data, setData, visuals, setVisuals, setFeedback, sceneImages, setSceneImages }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false);
    const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(null);
    const [visualInstructions, setVisualInstructions] = useState('');

    const downloadImage = (base64Data: string, filename: string) => {
        const link = document.createElement("a");
        link.href = base64Data;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleGenerateStoryboard = async () => {
        setIsGeneratingStoryboard(true);
        setVisuals(null);
        setSceneImages({});
        setSelectedStyleIndex(null);
        setData(prev => ({ ...prev, visualStoryboard: undefined }));
        try {
            const result = await generateVisualStoryboard(data, visualInstructions);
            setData(prev => ({ ...prev, visualStoryboard: result }));
        } catch (error: any) {
            console.error("Storyboard generation failed:", error);
        } finally {
            setIsGeneratingStoryboard(false);
        }
    };

    const handleGenerateInitialImages = async () => {
        if (!data.visualStoryboard) {
            console.warn("Please generate the visual storyboard first.");
            return;
        }
        setIsGenerating(true);
        setVisuals(null);
        setSceneImages({});
        setSelectedStyleIndex(null);
        try {
            const results = await generateVisuals(data);
            setVisuals(results);
        } catch (error: any) {
            console.error("Visual generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };


    const handleGenerateSceneImage = async (section: Section) => {
        if (selectedStyleIndex === null || !visuals || !data.visualStoryboard) return;

        const sceneDescObj = data.visualStoryboard.scenes.find(s => s.sectionId === String(section.id));
        if (!sceneDescObj) {
            console.error(`Error: Storyboard for section ID ${section.id} not found.`);
            return;
        }

        setSceneImages(prev => ({ ...prev, [String(section.id)]: { imageBase64: '', isLoading: true } }));

        try {
            const styleReferenceImage = visuals[selectedStyleIndex].imageBase64;
            const newImageBase64 = await generateSceneImage(styleReferenceImage, section, data.concept, sceneDescObj.description);
            setSceneImages(prev => ({ ...prev, [String(section.id)]: { imageBase64: newImageBase64, isLoading: false } }));
        } catch (error: any) {
            console.error(`Scene image generation failed for section ${section.id}:`, error);
            setSceneImages(prev => ({ ...prev, [String(section.id)]: { imageBase64: prev[String(section.id)]?.imageBase64 || '', isLoading: false } }));
        }
    };

    const isAnySceneGenerating = Object.values(sceneImages).some((s: { isLoading: boolean; }) => s.isLoading);
    
    const resetAll = () => {
        setVisuals(null);
        setSceneImages({});
        setSelectedStyleIndex(null);
        setData(prev => ({...prev, visualStoryboard: undefined}));
        setFeedback(null);
        setVisualInstructions('');
    }

    const renderContent = () => {
        // Step 1: Generate Storyboard
        if (!data.visualStoryboard) {
            return (
                <div className="space-y-4">
                    <SectionLabel 
                        text="ビジュアルテーマに関する指示（任意）"
                        tooltipText="ストーリーボード生成時にAIに与える追加の指示を自然言語で入力します。例：「全体的に水彩画のような淡いタッチで」「登場人物を猫に置き換えてシュールレアリスム的に」など。"
                    />
                    <textarea
                        value={visualInstructions}
                        onChange={(e) => setVisualInstructions(e.target.value)}
                        rows={3}
                        placeholder="例：全体的に水彩画のような淡いタッチで。登場人物は猫に置き換えてシュールレアリスム的に。"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2"
                    />
                    <button onClick={handleGenerateStoryboard} disabled={isGeneratingStoryboard} className="w-full text-lg bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 rounded-md flex items-center justify-center gap-3 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all">
                        {isGeneratingStoryboard ? <Loader2 className="animate-spin h-6 w-6" /> : <Film className="h-6 w-6" />}
                        {isGeneratingStoryboard ? 'ストーリーを作成中...' : '1. ビジュアルストーリーボードを作成'}
                    </button>
                </div>
            );
        }

        // Step 2: Display storyboard and button to generate base images
        return (
            <div className="space-y-8 animate-fade-in">
                <details className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 group" open>
                    <summary className="text-lg font-semibold text-blue-300 cursor-pointer list-none flex items-center gap-2">
                        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-blue-400 transform transition-transform duration-200 group-open:rotate-90">▶</span>
                        <Film className="h-5 w-5" /> ビジュアルストーリーボード
                    </summary>
                    <div className="mt-3 pl-6 space-y-3">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed"><strong className="text-blue-300">全体テーマ:</strong> {data.visualStoryboard.overall}</p>
                        <div className="text-sm text-gray-400 space-y-1">
                            {data.visualStoryboard.scenes.map(scene => {
                                const sectionType = data.sections.find(s => s.id.toString() === scene.sectionId)?.type || 'Unknown';
                                return <p key={scene.sectionId}><strong className="text-gray-300">{sectionType}:</strong> {scene.description}</p>;
                            })}
                        </div>
                    </div>
                </details>
                
                {isGenerating && !visuals ? (
                     <div className="text-center">
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="animate-spin h-10 w-10 text-purple-400" />
                        </div>
                        <p className="text-gray-300">3つのベースイメージを生成中です...</p>
                    </div>
                ) : !visuals ? (
                    <button onClick={handleGenerateInitialImages} disabled={isGenerating} className="w-full text-lg bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-3 rounded-md flex items-center justify-center gap-3 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all">
                        <ImageIcon className="h-6 w-6" />
                        2. 3つのベースイメージを生成
                    </button>
                ) : (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h4 className="text-lg font-semibold text-blue-300 mb-3">3. アートスタイルを選択</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {visuals.map((result, index) => (
                                    <div key={result.id} className="relative group">
                                        <div className={`relative cursor-pointer overflow-hidden rounded-lg border-4 transition-all ${selectedStyleIndex === index ? 'border-blue-500 scale-105' : 'border-transparent group-hover:border-blue-700'}`} onClick={() => setSelectedStyleIndex(index)}>
                                            <img src={result.imageBase64} alt={result.imagePrompt.substring(0, 50)} className="w-full h-full object-cover aspect-square" />
                                            <div className={`absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg transition-opacity ${selectedStyleIndex !== index && 'opacity-0 group-hover:opacity-100'}`}>
                                                <h5 className="font-bold text-white text-sm">{IMAGE_CONCEPTS_LABELS[index]}</h5>
                                            </div>
                                            {selectedStyleIndex === index && (
                                                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1.5 shadow-lg">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => downloadImage(result.imageBase64, `style-reference-${index + 1}.png`)} className="absolute top-2 left-2 bg-gray-800/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity" title="Download Image">
                                            <Download className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedStyleIndex !== null && (
                            <div className="animate-fade-in">
                                <h4 className="text-lg font-semibold text-blue-300 mb-3">4. シーンごとの画像を生成</h4>
                                <div className="space-y-4">
                                    {data.sections.map(section => {
                                        const scene = sceneImages[String(section.id)];
                                        const sceneDesc = data.visualStoryboard?.scenes.find(s => s.sectionId === String(section.id))?.description;
                                        return (
                                            <div key={section.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                                <div className="md:col-span-2">
                                                    <h5 className="font-bold text-white">{section.type}</h5>
                                                    {sceneDesc && <p className="text-xs text-gray-400 mt-1 line-clamp-2"><strong className="text-gray-300">シーン: </strong>{sceneDesc}</p>}
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-32 h-32 bg-gray-700/50 rounded-md flex items-center justify-center overflow-hidden relative group/scene">
                                                        {scene?.isLoading && <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />}
                                                        {scene?.imageBase64 && !scene.isLoading && <img src={scene.imageBase64} alt={`Scene for ${section.type}`} className="w-full h-full object-cover" />}
                                                        {!scene && <ImageIcon className="h-6 w-6 text-gray-500" />}
                                                        {scene?.imageBase64 && !scene.isLoading && (
                                                            <button onClick={() => downloadImage(scene.imageBase64, `scene-${section.type.replace(/\s+/g, '_')}-${section.id}.png`)} className="absolute top-1 right-1 bg-gray-800/70 text-white rounded-full p-2 opacity-0 group-hover/scene:opacity-100 transition-opacity" title="Download Scene Image">
                                                                <Download className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <button onClick={() => handleGenerateSceneImage(section)} disabled={isAnySceneGenerating} className="w-full text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1.5 rounded-md flex items-center justify-center gap-1 disabled:bg-gray-500 disabled:cursor-not-allowed">
                                                        <Wand2 className="h-3 w-3" /> 生成
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        
                        <button onClick={resetAll} disabled={isGenerating || isAnySceneGenerating || isGeneratingStoryboard} className="w-full mt-8 text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed">
                            <Sparkles className="h-4 w-4" />
                            全てをリセットしてやり直す
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold flex items-center gap-2"><ImageIcon className="text-blue-400"/>楽曲ビジュアル生成</h3>
                <Tooltip text="楽曲コンセプトと「AIの制作ノート」に基づき、AIがミュージックビデオのストーリーボードを作成します。次に、そのテーマに沿った3つのアートスタイルを生成し、一つを選択。最後に、選択したスタイルで曲の各シーンのイメージを創造します。">
                    <HelpCircle className="h-5 w-5 text-gray-500 cursor-help" />
                </Tooltip>
            </div>
            <p className="text-gray-400 -mt-4">楽曲の物語をビジュアル化します。まずストーリーボードを作成し、次にアートスタイルを生成・選択、最後に各シーンを生成するというワークフローです。</p>
            {renderContent()}
        </div>
    );
};

export default Step5_Visuals;