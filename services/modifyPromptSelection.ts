
import { AppData } from "../types";
import { SUNO_AI_SPECIFICATION } from "../spec/sunoApiSyntax";
import { SUNO_AI_MUSIC_THEORY_GUIDE } from "../guides/musicTheory";
import { VOCAL_FLOW_STYLES_GUIDE } from "../guides/vocalFlowStyles";
import { ADVANCED_TECHNIQUES_GUIDE } from "../guides/advancedTechniques";
import { GEMINI_MODELS } from './config';
import { generateContentWithRetry } from './geminiUtils';

export async function modifyPromptSelection(
    data: AppData, 
    fullPrompt: string, 
    contextPrompt: string,
    selectedText: string, 
    userInstruction: string, 
    promptType: 'style' | 'lyrics',
    model: string = GEMINI_MODELS.TEXT
): Promise<string> {
    const prompt = `あなたはSuno AI楽曲制作のプロンプトエンジニアリング専門家です。Suno AI v4.5仕様書と高度音楽理論ガイドに厳格に従い、ユーザーの指示に基づいてプロンプトの一部を修正してください。

# Suno AI 仕様書v4.5（最重要ルール）
${SUNO_AI_SPECIFICATION}

# Suno AI 高度音楽理論実現ガイド v4.5+
${SUNO_AI_MUSIC_THEORY_GUIDE}

# 🎤 Suno AI v5対応：ボーカルフロースタイル定義集
${VOCAL_FLOW_STYLES_GUIDE}

# 🎛️ Suno AI 高度技法・音響制御ガイド
${ADVANCED_TECHNIQUES_GUIDE}

# 【最重要ルール】楽器指定の具体化
- 修正の結果、楽器に関する記述が含まれる場合、**絶対に**単に楽器名をリストアップするだけでは不十分です。
- **セクションごと、かつ、楽器ごと**に、その**演奏スタイル、音色、役割、感情表現**を具体的かつ詳細に記述することが**必須**です。
- **良い例**: [Instrument: Electric Guitar (Distorted, aggressive palm-muted riffs)]
- **悪い例**: [Instrument: Guitar]
- このルールはSuno AIの品質に直結するため、厳格に遵守してください。

# 楽曲全体のコンセプト
- アーティストプリセット: ${data.concept.artistPresets.join(', ') || 'N/A'}
- ジャンル: ${[...data.concept.mainGenres, ...data.concept.subGenres].join(', ') || 'N/A'}
- ムード: ${data.concept.moods.join(', ') || 'N/A'}
- キー: ${data.concept.key}
- テンポ: ${data.concept.tempo} BPM
- 拍子: ${data.concept.timeSignature}
- リズムパターン: ${data.concept.rhythmPattern}
- 自然言語ニュアンス: ${data.concept.naturalLanguageNuance || 'N/A'}
${Object.values(data.concept.nuanceAmplifiers).some(v => v) ? `
# ニュアンス増幅指示（参考）
以下の増幅設定が有効になっています。修正の際にこの文脈を考慮してください。
${data.concept.nuanceAmplifiers.amplifyEmotion ? '- **感情の増幅**: より感情的に。\n' : ''}${data.concept.nuanceAmplifiers.emphasizeUniqueness ? '- **独自性の強調**: よりユニークに。\n' : ''}${data.concept.nuanceAmplifiers.deepenNarrative ? '- **物語性の深化**: より物語的に。\n' : ''}${data.concept.nuanceAmplifiers.visualizeScenery ? '- **情景描写の具体化**: より情景が浮かぶように。\n' : ''}
` : ''}

# 【最重要コンテキスト】もう一方のプロンプト
修正対象のプロンプト（${promptType === 'style' ? 'Styleプロンプト' : 'Lyricsプロンプト'}）と連動する、もう一方のプロンプト（${promptType === 'style' ? 'Lyricsプロンプト' : 'Styleプロンプト'}）の全文を以下に示します。
修正を行う際は、このプロンプトの内容と矛盾が生じないよう、**必ず**文脈を考慮してください。
---
${contextPrompt}
---

# 修正対象を含むプロンプト全体 (${promptType === 'style' ? 'Styleプロンプト' : 'Lyricsプロンプト'})
---
${fullPrompt}
---

# ユーザーが選択した修正対象テキスト
---
${selectedText}
---

# ユーザーからの修正指示
---
${userInstruction}
---

# 厳格な指示
1.  **分析**: ユーザーの指示を、選択されたテキスト、プロンプト全体、**もう一方のプロンプトの文脈**、楽曲コンセプト、Suno AI仕様書の文脈の中で理解してください。
2.  **修正**: 「ユーザーが選択した修正対象テキスト」**のみ**を、指示に合わせて書き換えてください。
3.  **シンタックス維持**: 出力は、Suno AIのメタタグ構文（例: \`[Tag]\`, \`[Tag: Value]\`）に厳密に従う必要があります。
4.  **文脈維持**: 修正は、周囲のプロンプト、**もう一方のプロンプト**、楽曲コンセプトと音楽的・テーマ的に一貫している必要があります。
5.  **ジャンル変更の注意**: ユーザーの指示がジャンルの変更を示唆している場合でも、ユーザーからの明示的な指示（"Jazz" や "ジャズ" を含めるなど）がない限り、"Jazz"ジャンルを新たに追加することは固く禁止します。
6.  **出力形式**: **修正後のテキスト断片のみ**を返してください。説明、謝罪、前置き、\`\`\`のようなマークダウンは一切含めないでください。もしユーザーの指示が仕様に反する場合（例：「幸せな葬式の雰囲気で」）、その意図を汲み取り（例：「ほろ苦い」「内省的」など）、仕様に準拠した代替案を生成してください。`;

    const response = await generateContentWithRetry({
        model: model,
        contents: prompt,
    });

    return response.text.trim();
}
