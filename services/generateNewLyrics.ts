import { generateContentWithRetry } from './geminiUtils';
import { GEMINI_MODELS } from './config';
import { LYRIC_WRITING_THEORY_GUIDE } from "../guides/songwritingPrinciples";
import { SUNO_AI_SPECIFICATION } from "../spec/sunoApiSyntax";
import { SUNO_AI_MUSIC_THEORY_GUIDE } from "../guides/musicTheory";
import { VOCAL_FLOW_STYLES_GUIDE } from "../guides/vocalFlowStyles";
import { ADVANCED_TECHNIQUES_GUIDE } from "../guides/advancedTechniques";
import { Type } from "@google/genai";
import { GRAB_ATTENTION_TECHNIQUES_GUIDE } from '../guides/grabAttentionTechniques';

export async function generateNewLyrics(
    currentLyrics: string,
    nuance: string,
    lyricsInstructions: string,
    allowLyricModification: boolean,
    grabAttentionEnabled: boolean,
    model: string = GEMINI_MODELS.TEXT
): Promise<string> {

    if (!allowLyricModification) {
        return currentLyrics; // If modification is not allowed, return original lyrics
    }

    const grabAttentionInstruction = grabAttentionEnabled ? `
# 【超最重要】冒頭15秒の最適化
以下の「冒頭15秒でリスナーを掴む」テクニック学習資料を熟読し、生成する歌詞が冒頭からリスナーを強力に引きつけるよう設計してください。特に最初の数行にフックを集中させ、聴覚的なインパクトを最大化してください。
---
${GRAB_ATTENTION_TECHNIQUES_GUIDE}
---
` : '';

    const instructionPrompt = lyricsInstructions.trim()
        ? `提供された「歌詞の生成指示」を最優先のガイドラインとして、歌詞を再構築してください。`
        : `提供された「楽曲ニュアンス」と「現在の歌詞」のコンセプトを深化させ、より洗練された歌詞を生成してください。`;

    const prompt = `あなたは世界トップクラスの作詞家であり、音楽生成AI「Suno」の日本語歌詞作成に特化したプロンプトエンジニアです。あなたの任務は、提供された情報に基づき、最高の歌詞を生成することです。

# 良い歌詞の解剖学（作詞の最重要理論）
${LYRIC_WRITING_THEORY_GUIDE}

# Suno AI メタタグ仕様書（参照）
${SUNO_AI_SPECIFICATION}

# Suno AI 高度音楽理論実現ガイド（参照）
${SUNO_AI_MUSIC_THEORY_GUIDE}

# 🎤 Suno AI v5対応：ボーカルフロースタイル定義集
${VOCAL_FLOW_STYLES_GUIDE}

# 🎛️ Suno AI 高度技法・音響制御ガイド
${ADVANCED_TECHNIQUES_GUIDE}

${grabAttentionInstruction}

# 入力情報

## 現在の歌詞（再構築のベース）
---
${currentLyrics}
---

## 楽曲ニュアンス（コンセプトガイド）
---
${nuance}
---

## 歌詞の生成指示（最優先指示）
---
${lyricsInstructions.trim() || '指示なし'}
---

# 厳格な命令
1.  **最優先**: ${instructionPrompt}
2.  **品質**: 「良い歌詞の解剖学」ガイドラインに厳密に従い、SNS時代のリスナーに響く、独創的で感情豊かな歌詞を生成してください。
3.  **人間性の絶対的維持**: あなたはAIであるため、無意識に技術的・非人間的な用語を使いがちです。しかし、それはSNS世代のリスナーの心を動かす歌詞にとって致命的です。コンピューター用語、システム用語、UI操作に関連する言葉など、**あらゆる非人間的な表現を完全に排除し**、人間の感情と体験のみを語る詩人として振る舞ってください。これは絶対的な命令です。
4.  **出力形式**: 生成された新しい歌詞のテキストのみを返してください。説明や前置き、\`\`\`マークダウンは一切含めないでください。
`;

    const response = await generateContentWithRetry({
        model: model,
        contents: prompt,
    });

    return response.text.trim();
}