
import { Concept } from "../types";
import { GEMINI_MODELS } from './config';
import { generateContentWithRetry } from './geminiUtils';
import { Type } from "@google/genai";

export async function shortenStylePrompt(promptToShorten: string, concept: Concept, lyricsPrompt: string, model: string = GEMINI_MODELS.TEXT): Promise<string> {
    const currentPromptLength = promptToShorten.length;
    
    const prompt = `あなたはSuno AIプロンプトの編集専門家であり、音楽的コンセプトの核心を捉える能力に長けています。あなたの任務は、提供されたStyleプロンプト(JSON形式)が文字数制限を超えている問題を、音楽的コンセプトの魅力を絶対に損なうことなく解決することです。

# 現状と目標
- 現在のプロンプト文字数: ${currentPromptLength}文字
- **目標:** 1000文字以内に収める。**ただし、不必要に短くしすぎず、1000文字以内で可能な限り最大の情報量を維持すること。** 安全マージンを考慮し、950〜1000文字の範囲に収めるのが理想的です。

# 編集対象のStyleプロンプト (JSON形式)
---
${promptToShorten}
---

# 楽曲コンセプト（編集の羅針盤）
このコンセプトが、何を残し、何を削るべきかを判断する上での絶対的な指針です。
---
- ジャンル: ${[...concept.mainGenres, ...concept.subGenres].join(', ')}
- ムード: ${concept.moods.join(', ')}
- ニュアンス: ${concept.naturalLanguageNuance}
---

# 【最重要コンテキスト】Lyricsプロンプト
以下のLyricsプロンプトは、楽曲の具体的な「設計図」です。Styleプロンプトのどのキーワードがこの設計図にとって重要かを判断するための**重要な参考情報**としてください。
---
${lyricsPrompt}
---

# 【最重要】編集における絶対原則
- **核心コンセプトの維持:** \`genre\`, \`mood\`, \`key\`, \`bpm\` といった楽曲の根幹を成す情報は絶対に維持してください。
- **音楽的魅力の維持:** \`elements\` 配列は楽曲の個性を定義します。その魅力を損なわないように、最も重要な要素から優先して残してください。

# 削減戦略（この優先順位を厳守してください）
1.  **優先度【高】：\`elements\` 配列の要約**
    - \`elements\` 配列内の各要素を、より短く、よりキーワード的な表現に書き換えます。（例："A very emotional and powerful vocal performance" -> "powerful emotional vocals"）
    - 複数の要素が同じ概念を指している場合、それらを一つに統合します。
    - 優先度の低い要素を削除します。

2.  **優先度【中】：他の文字列値の簡略化**
    - \`vocalProfile\` の文字列をより簡潔にします。
    - \`productionMix\` 配列から、優先度の低いキーワードを削除します。

# 禁止事項
- 楽曲のジャンルやムードといった根幹を成すキーワードの削除。
- JSONの構造を破壊すること。

# 厳格な指示
- **出力**: 編集後のStyleプロンプトを、元のJSONオブジェクトの構造を維持したまま返してください。説明、言い訳、マークダウンは一切含めないでください。
- **【最重要】文字数と情報密度:** 出力は**絶対に1000文字以内**でなければなりません。しかし、単に短くするのではなく、音楽的コンセプトの核心を維持しながら**情報量を最大化**することを最優先してください。
- **フォーマット**: 出力は、JSONとしてパース可能なオブジェクトである必要があります。`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        genre: { type: Type.STRING },
        mood: { type: Type.ARRAY, items: { type: Type.STRING } },
        elements: { type: Type.ARRAY, items: { type: Type.STRING } },
        bpm: { type: Type.NUMBER },
        key: { type: Type.STRING },
        vocalProfile: { type: Type.STRING },
        productionMix: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['genre', 'mood', 'elements', 'bpm', 'key', 'vocalProfile', 'productionMix']
    };


    const response = await generateContentWithRetry({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        }
    });

    const jsonString = response.text.trim();
    try {
        // Final validation and formatting without spaces to ensure compactness
        return JSON.stringify(JSON.parse(jsonString));
    } catch (e) {
        console.error("The shortened prompt string could not be parsed as JSON:", jsonString);
        return jsonString; // Fallback
    }
}
