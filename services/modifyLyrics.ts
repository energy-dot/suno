import { generateContentWithRetry } from './geminiUtils';
import { GEMINI_MODELS } from './config';

export async function modifyLyrics(
    originalLyrics: string,
    generationPrompt: string,
    userInstruction: string,
    model: string = GEMINI_MODELS.TEXT
): Promise<string> {
    const prompt = `
あなたは優秀な作詞家です。提供された「元の歌詞」を、「修正指示」に厳密に従って書き換えてください。元の歌詞のテーマやスタイルは維持しつつ、指示された変更点を反映した、より優れた歌詞を生成してください。

# 元の歌詞
---
${originalLyrics}
---

# 修正指示
---
${userInstruction}
---

# 参考：元の生成プロンプト
---
${generationPrompt}
---

# 出力形式
修正後の歌詞のテキストのみを返してください。説明や前置き、マークダウンは一切含めないでください。
`;
    const response = await generateContentWithRetry({ model, contents: prompt });
    return response.text.trim();
}
