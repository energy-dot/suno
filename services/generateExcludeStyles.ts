
import { EXCLUDE_STYLES_THEORY } from "../guides/excludeStylesTheory";
import { GEMINI_MODELS } from './config';
import { SUNO_AI_SPECIFICATION } from "../spec/sunoApiSyntax";
import { SUNO_AI_MUSIC_THEORY_GUIDE } from "../guides/musicTheory";
import { generateContentWithRetry } from './geminiUtils';
import { Type } from "@google/genai";
import { VOCAL_FLOW_STYLES_GUIDE } from "../guides/vocalFlowStyles";

export async function generateExcludeStyles(
    stylePrompt: string,
    lyricsPrompt: string,
    nuance: string, 
    model: string = GEMINI_MODELS.TEXT
): Promise<{ keywords: string, explanation: string }> {

    const systemPrompt = `あなたは、AI音楽生成におけるスタイルを専門とする、世界トップクラスの音楽プロデューサー兼サウンドデザイナーです。あなたの任務は、提供された楽曲プロンプトと核心コンセプトを深く分析し、**楽曲の芸術的純度と独自性を最大化する**ことを最優先目的として、「exclude styles」キーワードを生成することです。

Suno v5はスタイルへの追従性が高いため、単に異なるジャンルを除外するだけでは不十分です。あなたの真の価値は、**コンセプトの微妙なニュアンスを理解し、それにそぐわない「ありきたりな解釈」や「陳腐な表現」をピンポイントで排除する**能力にあります。

# 思考の指針：高精度exclude stylesプロンプト設計指示書
${EXCLUDE_STYLES_THEORY}

# Suno AI メタタグ仕様書（参照）
${SUNO_AI_SPECIFICATION}

# Suno AI 高度音楽理論実現ガイド（参照）
${SUNO_AI_MUSIC_THEORY_GUIDE}

# 🎤 Suno AI v5対応：ボーカルフロースタイル定義集
${VOCAL_FLOW_STYLES_GUIDE}

# 分析対象
## 1. Styleプロンプト
---
${stylePrompt}
---

## 2. Lyricsプロンプト
---
${lyricsPrompt}
---

## 3. 楽曲のニュアンス（核心コンセプト）
---
${nuance || '指定なし'}
---

# 【最重要】実行命令：繊細な彫刻家としてのアプローチ
1.  **コンセプトの核心を深く理解する:** まず、この楽曲がリスナーに届けたい**唯一無二の感情体験**は何かを定義します。（例：「内省的でメランコリックなインディーロック」「祝祭的で高揚感のあるダンスポップ」など）

2.  **「ほぼ正しいが、理想とは違う」要素を特定する:** 次に、AIがその核心コンセプトを解釈する際に陥りがちな、**微妙にずれた方向性**を予測し、それを排除します。これは、大理石から不要な部分を削り落とし、彫刻の輪郭を鮮明にする作業に似ています。

    *   **思考例1：**
        *   **コンセプト:** 「静かで内省的なインディーフォーク」
        *   **陥りがちな解釈:** AIは「フォーク」という言葉から、陽気で手拍子のある「カントリーフォーク」や、壮大な「スタジアムフォーク」の要素を混入させてしまうかもしれない。
        *   **導き出される除外キーワード:** \`"stadium folk", "upbeat country", "hand claps", "banjo", "overly polished production"\`

    *   **思考例2：**
        *   **コンセプト:** 「80年代のダークで冷たいシンセウェイヴ」
        *   **陥りがちな解釈:** AIは「80年代シンセ」から、明るく派手な「シンセポップ」や、現代的なEDMの要素を加えてしまうかもしれない。
        *   **導き出される除外キーワード:** \`"bright synths", "happy synth-pop", "modern EDM drums", "uplifting melodies", "major key"\`

3.  **キーワードの具体化:** 分析に基づき、排除すべき具体的な音楽スタイル、楽器の奏法、プロダクション技術、感情表現を英語キーワードでリストアップしてください。

4.  **解説の生成:** なぜこれらのキーワードを除外することが、この楽曲の**独自の芸術性**を洗練させるために重要なのか、日本語で簡潔に（150文字程度で）解説を生成してください。

5.  **出力形式の厳守:**
    *   keywordsは、カンマ区切りの英語の文字列で、**絶対に230文字以内**にしてください。
    *   explanationは、日本語の解説文字列です。
    *   必ず、指定されたJSONスキーマに準拠したJSONオブジェクトのみを出力してください。説明、前置き、言い訳、\`\`\`マークダウンは一切含めないでください。

思考プロセスを内部で実行し、最終的な出力は指定されたJSONオブジェクトのみとしてください。`;
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            keywords: {
                type: Type.STRING,
                description: "Comma-separated English keywords to exclude, max 230 characters."
            },
            explanation: {
                type: Type.STRING,
                description: "A brief explanation in Japanese (around 150 characters) about why these keywords are excluded."
            }
        },
        required: ['keywords', 'explanation']
    };

    const response = await generateContentWithRetry({
        model: model,
        contents: systemPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    try {
        const parsedResult = JSON.parse(response.text);
        if (parsedResult.keywords && parsedResult.explanation) {
            return parsedResult;
        } else {
            throw new Error("AI response for exclude styles is missing required fields.");
        }
    } catch (e: any) {
        console.error("Failed to parse AI response for exclude styles generation:", response.text, e);
        throw new Error(`AIからの応答が不正な形式でした: ${e.message}`);
    }
}
