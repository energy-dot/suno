import { generateContentWithRetry } from './geminiUtils';
import { GEMINI_MODELS } from './config';

const CRITIC_PERSONAS: { [key: string]: string } = {
    harsh_critic: "あなたは、ありきたりな表現を一切許さない、辛辣な音楽評論家です。提供された歌詞を分析し、陳腐な比喩、予測可能な展開、弱い言葉遣いを**徹底的に**指摘してください。改善点を具体的かつ容赦なく提示してください。",
    sensitive_poet: "あなたは、言葉の響きと感情の機微を何よりも大切にする、感受性の強い詩人です。提供された歌詞を読み、感情の深みが足りない部分、より美しい言葉にできる部分、読者の心に響く情景描写が欠けている点を、優しく、しかし的確に指摘してください。",
    pop_producer: "あなたは数々のヒット曲を生み出してきた商業音楽プロデューサーです。提供された歌詞を「売れるか、記憶に残るか」という観点から分析してください。フックの弱さ、SNSでシェアされにくい表現、ライブで盛り上がりにくい部分などを指摘し、よりキャッチーで商業的に成功するための具体的な改善案を提示してください。"
};

export async function generateCritique(
    lyrics: string,
    generationPrompt: string,
    persona: keyof typeof CRITIC_PERSONAS,
    model: string = GEMINI_MODELS.TEXT
): Promise<string> {
    const personaPrompt = CRITIC_PERSONAS[persona] || CRITIC_PERSONAS.harsh_critic;
    
    const prompt = `
${personaPrompt}

# 分析対象
## 生成された歌詞
---
${lyrics}
---
## 生成時の指示プロンプト
---
${generationPrompt}
---

# 指示
上記の歌詞とプロンプトを分析し、あなたのペルソナとして批評と改善提案を生成してください。出力は批評文のみとし、前置きやマークダウンは含めないでください。
`;
    const response = await generateContentWithRetry({ model, contents: prompt });
    return response.text.trim();
}
