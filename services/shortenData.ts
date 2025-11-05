
import { AppData, Section } from "../types";
import { GEMINI_MODELS } from './config';
import { generateContentWithRetry } from './geminiUtils';
import { Type } from "@google/genai";
import { generateLyricsPrompt } from './promptGenerator';

export async function shortenDataForPrompt(data: AppData, stylePrompt: string, model: string = GEMINI_MODELS.TEXT): Promise<Section[]> {
    
    const currentPrompt = generateLyricsPrompt(data);
    const currentLength = currentPrompt.length;

    const prompt = `あなたはSuno AIプロンプトの編集専門家であり、卓越した音楽的感性を持つ「天才音楽家」です。
あなたの任務は、提供された楽曲データから生成されるプロンプトが文字数制限を超えている問題を、楽曲の**音楽的・構造的な核心を絶対に損なうことなく**解決することです。

# 現状と目標
- **現在のプロンプト文字数:** ${currentLength}文字
- **目標:** 5000文字以内（可能な限り4800文字程度を目指し、安全マージンを確保）
- **削減目標:** 約${currentLength - 4800}文字以上

# 編集対象
各セクションの **歌詞(コード含む)** と **高度な指示 (advancedDescription)** のみ。

# 楽曲コンセプト（編集の羅針盤）
このコンセプトが、何を残し、何を削るべきかを判断する上での絶対的な指針です。
---
- **ジャンル:** ${[...data.concept.mainGenres, ...data.concept.subGenres].join(', ')}
- **ムード:** ${data.concept.moods.join(', ')}
- **ニュアンス:** ${data.concept.naturalLanguageNuance}
- **高度なアレンジメント:** ${Object.entries(data.concept.advancedArrangement).filter(([, value]) => value).map(([key]) => key).join(', ') || 'なし'}
---

# 【最重要コンテキスト】Styleプロンプト
以下のStyleプロンプトは、楽曲全体の「魂」を定義しています。Lyricsプロンプトのどの部分が音楽的に重要かを判断するための**絶対的な指針**としてください。
---
${stylePrompt}
---

# 【最重要】編集における絶対原則
- **構造と物語性の維持:** 楽曲のセクション構成（Intro, Verse, Chorus...）、歌詞の物語の核、感情の起伏は**絶対に維持**してください。キーや拍子、転調といった構造的要素も変更禁止です。
- **音楽性の維持:** 楽曲の個性を定義するユニークなコード進行、特徴的な楽器の音色や奏法は**最大限尊重**してください。

# 削減戦略（この優先順位を厳守してください）

1.  **優先度【高】：冗長性と重複の排除**
    *   \`advancedDescription\` 内の自然言語による説明的な部分を、より簡潔なSunoメタタグ形式（例：\`(sad melody)\`）に要約・変換します。
    *   楽曲コンセプト全体で指定されている内容が、セクション内で具体性なく繰り返されている場合は削除します。（例：コンセプトが「ロック」なのに、各セクションで毎回「ロック風に」と書かれている場合など）
    *   物語の核心と直接関係のない、補助的なサウンドエフェクト（例：効果の薄い環境音）を削除します。

2.  **優先度【中】：表現の統合と簡潔化**
    *   多層的な楽器アレンジ（例：\`[Instrument: Synth (Layer 1)]\`, \`[Instrument: Synth (Layer 2)]\`）を、コマンドスタッキングを使って一つの指示に統合します。（例：\`[Instrument: Synth (Warm Pad | Bright Arpeggio)]\`）
    *   \`advancedDescription\` 内の演奏指示（例：\`a guitar plays a complex riff\`）を、楽器指定の括弧内に簡潔に移動させます。（例：\`[Instrument: Guitar (complex riff)]\`）

3.  **優先度【低】：音楽的色彩の微調整（目標達成のための最終手段）**
    *   目標文字数を達成するためにやむを得ない場合に限り、音楽的雰囲気を大きく損なわない範囲で、歌詞内のコードのテンションノートを簡略化します。（例：\`Cmaj9\` → \`Cmaj7\`, \`Am11\` -> \`Am7\`）
    *   これは音楽性をわずかに損なうため、**最後の手段**としてのみ実行してください。

# 思考と実行のプロセス
1.  **削減目標の確認**: まず、削減が必要な文字数（${currentLength - 4800}文字以上）を正確に把握してください。
2.  **削減候補のリストアップと見積もり**: 提供された「削減戦略」の優先度に従い、各セクションのどの部分をどのように変更すれば何文字削減できるかを具体的にリストアップし、合計削減文字数を見積もってください。
3.  **実行**: 見積もりが削減目標を達成することを確認した上で、リストアップした変更を実際に実行してください。見積もりが不足している場合は、優先度の低い戦略（例：音楽的色彩の微調整）を適用することも検討してください。
4.  **最終確認**: 変更後のテキストが音楽的・物語的核心を維持していることを再確認してください。

# 【禁止事項】
-   歌詞の物語性を破壊するような単語やフレーズの削除。
-   楽曲の個性を定義するユニークなコード進行や転調の変更。
-   セクションの削除や順序変更。

# 厳格な指示
-   **出力**: 編集後のセクションデータのみをJSON配列として出力してください。説明、言い訳、マークダウンは一切含めないでください。
-   **構造維持**: セクションのIDとタイプは絶対に維持してください。
-   **JSONスキーマ**: 以下のスキーマに厳密に従ってください。

# 編集対象データ
---
${JSON.stringify(data.sections.map(s => ({
    id: s.id,
    type: s.type,
    lyrics: s.lyrics,
    advancedDescription: s.advancedDescription,
})), null, 2)}
---
`;

    const schema = {
        type: Type.ARRAY,
        description: "An array of section objects that have been edited to reduce character count. Only id, lyrics, and advancedDescription should be returned for each section.",
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.NUMBER },
            lyrics: { type: Type.STRING },
            advancedDescription: { type: Type.STRING }
          },
          required: ['id', 'lyrics', 'advancedDescription']
        }
      };

    const response = await generateContentWithRetry({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
    });

    const shortenedParts = JSON.parse(response.text) as {id: number, lyrics: string, advancedDescription: string}[];

    const updatedSections = data.sections.map(originalSection => {
        const shortenedPart = shortenedParts.find(s => s.id === originalSection.id);
        if (shortenedPart) {
            return {
                ...originalSection,
                lyrics: shortenedPart.lyrics,
                advancedDescription: shortenedPart.advancedDescription,
            };
        }
        return originalSection;
    });

    return updatedSections;
}
