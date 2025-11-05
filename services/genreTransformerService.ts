import { GEMINI_DEFAULT_MODEL } from './config';
import { generateContentWithRetry } from './geminiUtils';
import { Type } from "@google/genai";
import { SUNO_AI_SPECIFICATION } from "../spec/sunoApiSyntax";
import { SUNO_AI_MUSIC_THEORY_GUIDE } from "../guides/musicTheory";
import { LYRIC_WRITING_THEORY_GUIDE } from "../guides/songwritingPrinciples";
import { VOCAL_FLOW_STYLES_GUIDE } from "../guides/vocalFlowStyles";
import { ADVANCED_TECHNIQUES_GUIDE } from "../guides/advancedTechniques";
import { GenreTransformationConfig } from '../data/genreTransformationConfigs';
import { GRAB_ATTENTION_TECHNIQUES_GUIDE } from '../guides/grabAttentionTechniques';

export async function transformLyricsAndNuanceByGenre(
    originalLyrics: string, 
    originalNuance: string,
    lyricsInstructions: string, // New parameter
    config: GenreTransformationConfig,
    allowLyricModification: boolean,
    grabAttentionEnabled: boolean,
    model: string = GEMINI_DEFAULT_MODEL
): Promise<{ lyrics: string, nuance: string }> {

    const lyricsInstruction = allowLyricModification
        ? `1.  **歌詞の再構築**: **「オリジナルの楽曲ニュアンス」の意図を完全に維持**しつつ、${config.lyricsInstructions}`
        : `1.  **歌詞の変更禁止**: **歌詞は一切変更しないでください。** 提供された「オリジナルの歌詞」を、JSON出力の \`lyrics\` フィールドにそのままコピー＆ペーストしてください。`;

    const grabAttentionInstruction = grabAttentionEnabled ? `
# 【超最重要】冒頭15秒の最適化
以下の「冒頭15秒でリスナーを掴む」テクニック学習資料を熟読し、これから${config.name}スタイルに変換する歌詞と楽曲ニュアンスが、冒頭からリスナーを強力に引きつけるよう設計してください。${config.name}の文脈における効果的な冒頭のフックを創造してください。
---
${GRAB_ATTENTION_TECHNIQUES_GUIDE}
---
` : '';

    const userLyricsInstructionPrompt = lyricsInstructions.trim()
        ? `\n\n## ユーザーからの歌詞生成指示（最優先指示）\n---${lyricsInstructions}\n---\n上記指示も考慮して歌詞を再構築してください。`
        : '';

    const prompt = `
${config.aiRole} あなたの任務は、提供されたオリジナルの歌詞と**【最重要】楽曲ニュアンス**を、以下の理論と仕様書に基づいて、**${config.name}スタイルへと昇華させること**です。元のコンセプトを無視してはいけません。

# 良い歌詞の解剖学（作詞の最重要理論）
${LYRIC_WRITING_THEORY_GUIDE}

# ${config.name}ヒットの設計図（ジャンル特化理論）
${config.guide}

# Suno AI メタタグ仕様書（参照）
${SUNO_AI_SPECIFICATION}

# Suno AI 高度音楽理論実現ガイド（参照）
${SUNO_AI_MUSIC_THEORY_GUIDE}

# 🎤 Suno AI v5対応：ボーカルフロースタイル定義集
${VOCAL_FLOW_STYLES_GUIDE}

# 🎛️ Suno AI 高度技法・音響制御ガイド
${ADVANCED_TECHNIQUES_GUIDE}

${grabAttentionInstruction}

# 変換対象
## オリジナルの歌詞
---
${originalLyrics}
---
## 【最重要】オリジナルの楽曲ニュアンス (このコンセプトを核としてください)
---
${originalNuance || '指定なし'}
---
${userLyricsInstructionPrompt}

# 厳格な指示
${lyricsInstruction}
2.  **楽曲コンセプトの深化 (最重要)**: **「オリジナルの楽曲ニュアンス」を根幹**とし、それを${config.name}の文脈でどのように表現するかという視点で、新しい「楽曲のニュアンス（自然言語）」を作成してください。これは**元のニュアンスを${config.name}スタイルで拡張・具体化する**ものであり、全く新しいものを作成するのではありません。以下の構造と指示に従い、楽曲の**設計図**として機能する、豊かで具体的な記述を生成してください。

    *   **1. 楽曲の核心コンセプトと物語 (Core Concept & Narrative):**
        *   ${config.nuanceCoreConcept}
        *   ${config.nuanceNarrative}

    *   **2. 音楽的ディレクションと展開 (Musical Direction & Progression):**
        *   ${config.nuanceMusicalDirection}
        *   ${config.nuanceSubstyle}

    *   **3. サウンドパレットとプロダクション (Sound Palette & Production):**
        *   ${config.nuanceSoundPalette}

3.  **フォーマット**: 生成する「楽曲のニュアンス」は、各要素が明確に区別できるよう、**適切に改行(\\n)を使用して整形**してください。これにより、Suno AIへの指示が読みやすくなります。
4.  **出力形式**: 必ず、指定されたJSONスキーマに準拠したJSONオブジェクトのみを出力してください。説明や\`\`\`マークダウンは一切不要です。
5.  **人間性の絶対的維持**: あなたはAIであるため、無意識に技術的・非人間的な用語を使いがちです。しかし、それはSNS世代のリスナーの心を動かす歌詞にとって致命的です。コンピューター用語、システム用語、UI操作に関連する言葉など、**あらゆる非人間的な表現を完全に排除し**、人間の感情と体験のみを語る詩人として振る舞ってください。これは絶対的な命令です。
`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            lyrics: {
                type: Type.STRING,
                description: `The rewritten ${config.name} style lyrics.`
            },
            nuance: {
                type: Type.STRING,
                description: `The new natural language nuance describing the ${config.name} song concept, acting as a composition brief for Suno AI.`
            }
        },
        required: ['lyrics', 'nuance']
    };

    const response = await generateContentWithRetry({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    try {
        const parsedResult = JSON.parse(response.text);
        if (parsedResult.lyrics && parsedResult.nuance) {
            return parsedResult;
        } else {
            throw new Error("AI response is missing required fields.");
        }
    } catch (e: any) {
        console.error(`Failed to parse AI response for ${config.name} generation:`, response.text, e);
        throw new Error(`AIからの応答が不正な形式でした: ${e.message}`);
    }
}