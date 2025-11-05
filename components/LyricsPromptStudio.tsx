import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { LyricsPromptStudioData, LyricsTheme, LyricsHook } from './../types';

// Import the new components
import { BasicConceptForm } from './lyrics_studio/BasicConceptForm';
import { ThemeEditor } from './lyrics_studio/ThemeEditor';
import { AdvancedSettings } from './lyrics_studio/AdvancedSettings';
import { GeneratedPromptDisplay } from './lyrics_studio/GeneratedPromptDisplay';
import { LyricsOutput } from './lyrics_studio/LyricsOutput';
import { CritiqueModal } from './lyrics_studio/CritiqueModal';


// Import guides
import { LYRIC_WRITING_THEORY_GUIDE } from '../guides/songwritingPrinciples';
import { LYRIC_INTELLIGENCE_CORE_GUIDE } from '../guides/lyricIntelligenceCore';
import { GRAB_ATTENTION_TECHNIQUES_GUIDE } from '../guides/grabAttentionTechniques';
import { generateCritique, modifyLyrics } from '../services/geminiService';
import { GENRE_DESCRIPTIONS } from '../data/lyricsStudioConstants';

// Simplified client setup
const ai = new GoogleGenAI({apiKey: process.env.API_KEY || "DUMMY_KEY_FOR_COMPILATION" });

interface Props {
    data: LyricsPromptStudioData;
    setData: React.Dispatch<React.SetStateAction<LyricsPromptStudioData>>;
    generatedLyrics: string;
    setGeneratedLyrics: React.Dispatch<React.SetStateAction<string>>;
    generationExplanation: string;
    setGenerationExplanation: React.Dispatch<React.SetStateAction<string>>;
    critique: string | null;
    setCritique: React.Dispatch<React.SetStateAction<string | null>>;
}

const LyricsPromptStudio: React.FC<Props> = ({ 
    data, 
    setData,
    generatedLyrics,
    setGeneratedLyrics,
    generationExplanation,
    setGenerationExplanation,
    critique,
    setCritique
}) => {
    const [isSuggestingThemes, setIsSuggestingThemes] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCritiquing, setIsCritiquing] = useState(false);
    const [showCritiqueModal, setShowCritiqueModal] = useState(false);


    const handleUpdate = <K extends keyof LyricsPromptStudioData>(key: K, value: LyricsPromptStudioData[K]) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const handleNestedUpdate = <K extends keyof LyricsPromptStudioData, NK extends keyof LyricsPromptStudioData[K]>(key: K, nestedKey: NK, value: LyricsPromptStudioData[K][NK]) => {
        setData(prev => ({
            ...prev,
            [key]: {
                ...(prev[key] as object),
                [nestedKey]: value
            }
        }));
    };

    const addTheme = () => {
        handleUpdate('themes', [...data.themes, { category: '', subcategory: '', subthemes: [], weight: 1.0 }]);
    };
    const removeTheme = (index: number) => {
        handleUpdate('themes', data.themes.filter((_, i) => i !== index));
    };
    const updateTheme = <K extends keyof LyricsTheme>(index: number, key: K, value: LyricsTheme[K]) => {
        const newThemes = [...data.themes];
        newThemes[index] = { ...newThemes[index], [key]: value };
        if (key === 'category') {
            newThemes[index].subcategory = '';
        }
        handleUpdate('themes', newThemes);
    };

    const addHook = () => {
        handleUpdate('hooks', [...data.hooks, { type: 'メロディ主導型', label: '', priority: 5 }]);
    };
    const removeHook = (index: number) => {
        handleUpdate('hooks', data.hooks.filter((_, i) => i !== index));
    };
    const updateHook = <K extends keyof LyricsHook>(index: number, key: K, value: LyricsHook[K]) => {
        const newHooks = [...data.hooks];
        newHooks[index] = { ...newHooks[index], [key]: value };
        handleUpdate('hooks', newHooks);
    };

    const handleSuggestThemes = async () => {
        if (!data.nuance) {
            alert("「楽曲のニュアンス」を入力してください。");
            return;
        }
        setIsSuggestingThemes(true);
        try {
            const prompt = `楽曲のコンセプト: "${data.nuance}"
            
            このコンセプトに最も適したテーマを3つ提案してください。各テーマには、大テーマ、中テーマ、サブテーマのリスト、そして重要度（0.1〜2.0）を含めてください。
            
            厳格な指示：以下のJSONスキーマに準拠したJSONオブジェクトのみを出力してください。説明やマークダウンは一切含めないでください。`;

            const schema = {
                type: Type.OBJECT,
                properties: {
                    themes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                category: { type: Type.STRING, description: "大テーマ (例: 愛)" },
                                subcategory: { type: Type.STRING, description: "中テーマ (例: 失恋)" },
                                subthemes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "サブテーマのリスト (例: ['後悔', '思い出'])" },
                                weight: { type: Type.NUMBER, description: "テーマの重要度 (0.1〜2.0)" }
                            },
                            required: ["category", "subcategory", "subthemes", "weight"]
                        }
                    }
                },
                required: ["themes"]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });

            const result = JSON.parse(response.text);
            if (result.themes && Array.isArray(result.themes)) {
                handleUpdate('themes', result.themes);
            }

        } catch (error) {
            console.error("Error suggesting themes:", error);
            alert("テーマの提案中にエラーが発生しました。");
        } finally {
            setIsSuggestingThemes(false);
        }
    };

    const system_prompt = `あなたは世界トップクラスの作詞家であり、詩人です。提供された以下のガイドをあなたの創作哲学の根幹として厳格に守り、ユーザーからの詳細な指示に基づいて、芸術的で商業的にも成功する可能性のある歌詞を生成してください。

# ガイド

## 完全歌詞作成ガイド
${LYRIC_WRITING_THEORY_GUIDE}

## Lyric Intelligence Core v1.0
${LYRIC_INTELLIGENCE_CORE_GUIDE}

## 冒頭15秒でリスナーを掴むテクニック
${GRAB_ATTENTION_TECHNIQUES_GUIDE}`;

    const handleGenerateLyrics = async () => {
        if (!data.nuance) {
            alert("「楽曲のニュアンス」を入力してください。");
            return;
        }
        setIsGenerating(true);
        setGeneratedLyrics('');
        setGenerationExplanation('');
        try {
            const prompt = `${system_prompt}\n\n## ユーザーからの指示\n${generatedPrompt}\n\n## 【最重要】実行命令\n上記のガイドとユーザー指示に厳密に従い、以下の2つの要素を含むJSONオブジェクトを生成してください。\n\n1.  **lyrics**: 指示に基づいて生成された完全な歌詞。\n2.  **explanation**: あなたがどのようにユーザーの指示（ニュアンス、テーマ、構成、感情アークなど）を解釈し、それを歌詞の各部分（Aメロ、サビなど）に反映させたかを具体的に解説した文章。プロの作詞家が制作ノートを書くように、創造的な意図を明確に説明してください。\n\n厳格な指示：出力は指定されたJSONスキーマに準拠したJSONオブジェクトのみとし、説明やマークダウンは一切含めないでください。`;

            const schema = {
                type: Type.OBJECT,
                properties: {
                    lyrics: {
                        type: Type.STRING,
                        description: "生成された歌詞の全文。"
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "AIがどのように指示を解釈し、歌詞に反映させたかの解説文。"
                    }
                },
                required: ["lyrics", "explanation"]
            };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });

            try {
                const result = JSON.parse(response.text);
                if (result.lyrics && result.explanation) {
                    setGeneratedLyrics(result.lyrics);
                    setGenerationExplanation(result.explanation);
                } else {
                    setGeneratedLyrics(response.text);
                    setGenerationExplanation("AIからの解説の取得に失敗しました。応答が予期せぬ形式でした。");
                }
            } catch (e) {
                console.error("Failed to parse lyrics generation response as JSON", e);
                setGeneratedLyrics(response.text);
                setGenerationExplanation("AIからの解説の取得に失敗しました。応答がJSON形式ではありませんでした。");
            }

        } catch (error) {
            console.error("Error generating lyrics:", error);
            alert("歌詞の生成中にエラーが発生しました。");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGetCritique = async (persona: 'harsh_critic' | 'sensitive_poet' | 'pop_producer') => {
        if (!generatedLyrics) return;
        setIsCritiquing(true);
        setCritique(null);
        try {
            const critiqueText = await generateCritique(generatedLyrics, generatedPrompt, persona);
            setCritique(critiqueText);
            setShowCritiqueModal(true);
        } catch (error) {
            console.error("Error getting critique:", error);
            alert("批評の生成中にエラーが発生しました。");
        } finally {
            setIsCritiquing(false);
        }
    };
    
    const handleRegenerateWithCritique = async () => {
        if (!critique) return;
        setShowCritiqueModal(false);
        setIsGenerating(true);
        setGeneratedLyrics('');
        setGenerationExplanation('');
        try {
            const critiqueInstruction = `\n\n## AI批評家からの改善指示（最優先）\n以下の批評を**絶対に**反映させ、歌詞を全面的に改善してください。\n---\n${critique}\n---`;
            const finalPrompt = `${system_prompt}\n\n## ユーザーからの指示\n${generatedPrompt}${critiqueInstruction}\n\n## 【最重要】実行命令\n上記のガイドとユーザー指示に厳密に従い、以下の2つの要素を含むJSONオブジェクトを生成してください。\n\n1.  **lyrics**: 指示に基づいて生成された完全な歌詞。\n2.  **explanation**: あなたがどのようにユーザーの指示（ニュアンス、テーマ、構成、感情アークなど）を解釈し、それを歌詞の各部分（Aメロ、サビなど）に反映させたかを具体的に解説した文章。プロの作詞家が制作ノートを書くように、創造的な意図を明確に説明してください。\n\n厳格な指示：出力は指定されたJSONスキーマに準拠したJSONオブジェクトのみとし、説明やマークダウンは一切含めないでください。`;
            
            const schema = {
                type: Type.OBJECT,
                properties: {
                    lyrics: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                },
                required: ["lyrics", "explanation"]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: finalPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });

            const result = JSON.parse(response.text);
            setGeneratedLyrics(result.lyrics);
            setGenerationExplanation(result.explanation);
            setCritique(null);

        } catch (error) {
            console.error("Error regenerating with critique:", error);
            alert("批評を反映した再生成中にエラーが発生しました。");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleModifyLyrics = async (instruction: string) => {
        if (!generatedLyrics || !instruction) return;
        setIsGenerating(true);
        try {
            const newLyrics = await modifyLyrics(generatedLyrics, generatedPrompt, instruction);
            setGeneratedLyrics(newLyrics);
            setGenerationExplanation(`ユーザー指示:「${instruction}」\n\n上記の指示に基づき、歌詞を修正しました。`);
        } catch (error) {
            console.error("Error modifying lyrics:", error);
            alert("歌詞の修正中にエラーが発生しました。");
        } finally {
            setIsGenerating(false);
        }
    };

    const generatedPrompt = useMemo(() => {
        let prompt = `以下の詳細な指示に基づいて歌詞を生成してください：\n\n`;
        prompt += `## 基本コンセプト\n`;
        prompt += `- **楽曲のニュアンス:** ${data.nuance || '指定なし'}\n`;
        if (data.persona) {
            prompt += `- **ペルソナ（語り手）:** ${data.persona}\n`;
        }
        if (data.genre) {
            prompt += `- **音楽ジャンル:** ${data.genre}\n`;
            if (GENRE_DESCRIPTIONS[data.genre]) {
                prompt += `  - **ジャンルの特徴:** ${GENRE_DESCRIPTIONS[data.genre]}\n`;
            }
        }
        if (data.target) {
            prompt += `- **ターゲット層:** ${data.target}\n`;
        }
        prompt += `- **言語:** ${data.language}\n`;
        prompt += `- **文体:** ${data.tone.literaryStyle}\n`;
        prompt += `- **感情の態度:** ${data.tone.emotionalAttitude}\n`;
        prompt += `- **音楽的スタイル:** ${data.tone.musicalStyle}\n`;
        prompt += `- **歌詞の長さ:** ${data.length}\n`;
        prompt += `- **視点(POV):** ${data.pov || 'AIにおまかせ'}\n`;
        prompt += `- **時制:** ${data.tense || 'AIにおまかせ'}\n`;


        if(data.themes.length > 0) {
            prompt += `\n## テーマ\n`;
            data.themes.forEach((theme, index) => {
                prompt += `${index + 1}. **${theme.category || '未分類'} > ${theme.subcategory || '未分類'}** (重要度: ${theme.weight})\n`;
                if(theme.subthemes.length > 0 && theme.subthemes[0] !== '') {
                    prompt += `   - サブテーマ: ${theme.subthemes.join(', ')}\n`;
                }
            });
        }

        prompt += `\n## 構成とフック\n`;
        if (data.sections.length > 0 && data.sections[0] !== '') {
             prompt += `- **楽曲構成:** ${data.sections.join(' -> ')}\n`;
        } else {
             prompt += `- **楽曲構成:** AIにおまかせ\n`;
        }
        if (data.hooks.length > 0) {
            data.hooks.forEach(hook => {
                prompt += `- **フック (${hook.type}):** ${hook.label} (優先度: ${hook.priority})\n`;
            });
        } else {
             prompt += `- **フック:** 指定なし\n`;
        }

        prompt += `\n## 感情の起伏（エモーション・アーク）\n`;
        prompt += `静かな始まり(${data.emotion_arc.calm}%) → 盛り上がり(${data.emotion_arc.build}%) → 感情のピーク(${data.emotion_arc.burst}%) → 余韻・考察(${data.emotion_arc.reflect}%) の流れ。\n`;
        
        prompt += `\n## 上級スタイル指定\n`;
        prompt += `- **音節の密度:** ${data.syllable_density}\n`;
        
        const rhymeStyles = [
            `脚韻 (${data.rhyme.end})`,
            `内部韻 (${data.rhyme.internal})`,
            `頭韻 (${data.rhyme.alliteration})`,
            `母音韻 (${data.rhyme.assonance})`,
            `多音節韻 (${data.rhyme.multisyllabic})`,
        ];
        prompt += `- **音韻スタイル（押韻）:** ${rhymeStyles.join(', ')}\n`;

        prompt += `- **語彙:**\n`;
        prompt += `  - 光・明: ${data.lexicons.brightness.join(', ') || '指定なし'}\n`;
        prompt += `  - 闇・暗: ${data.lexicons.darkness.join(', ') || '指定なし'}\n`;
        prompt += `  - 動き: ${data.lexicons.motion.join(', ') || '指定なし'}\n`;
        prompt += `  - 空間: ${data.lexicons.space.join(', ') || '指定なし'}\n`;
        prompt += `- **制約:** 陳腐な表現を避ける (${data.constraints.avoid_cliches}), 禁止単語: ${data.constraints.ban_words || 'なし'}\n`;
        if (data.language.startsWith('ja')) {
            prompt += `- **日本語出力:** かな比率 (${data.output_spec.ja_kana_ratio}), ふりがな追加 (${data.output_spec.add_furigana}), ローマ字追加 (${data.output_spec.add_romaji})\n`;
        }
        

        return prompt;
    }, [data]);

    return (
        <div className="bg-gray-800/50 p-4 md:p-8 rounded-xl border border-gray-700 min-h-[500px]">
            <CritiqueModal 
                critique={critique}
                onClose={() => setShowCritiqueModal(false)}
                onApply={handleRegenerateWithCritique}
                isApplying={isGenerating}
            />

            <h2 className="text-2xl font-bold text-blue-300 mb-2">歌詞プロンプト・スタジオ</h2>
            <p className="text-gray-400 mb-6">Suno等の歌詞生成AIへ渡す、高再現性プロンプトを組み立てます。</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side: Controls */}
                <div className="space-y-6">
                    <BasicConceptForm
                        data={data}
                        onUpdate={handleUpdate}
                        onNestedUpdate={handleNestedUpdate}
                    />
                    <ThemeEditor
                        themes={data.themes}
                        nuance={data.nuance}
                        isSuggesting={isSuggestingThemes}
                        onAdd={addTheme}
                        onRemove={removeTheme}
                        onUpdate={updateTheme}
                        onSuggest={handleSuggestThemes}
                    />
                    <AdvancedSettings
                        data={data}
                        onUpdate={handleUpdate}
                        onNestedUpdate={handleNestedUpdate}
                        onAddHook={addHook}
                        onRemoveHook={removeHook}
                        onUpdateHook={updateHook}
                    />
                </div>

                {/* Right side: Generated Prompt & Lyrics */}
                <div className="space-y-4">
                    <GeneratedPromptDisplay
                        prompt={generatedPrompt}
                    />
                    <LyricsOutput
                        nuance={data.nuance}
                        generatedLyrics={generatedLyrics}
                        generationExplanation={generationExplanation}
                        isGenerating={isGenerating}
                        onGenerate={handleGenerateLyrics}
                        isCritiquing={isCritiquing}
                        onGetCritique={handleGetCritique}
                        onModifyLyrics={handleModifyLyrics}
                    />
                </div>
            </div>
        </div>
    );
};

export default LyricsPromptStudio;