
import { AppData, Section } from "../types";
import { SUNO_AI_SPECIFICATION } from "../spec/sunoApiSyntax";
import { SUNO_AI_MUSIC_THEORY_GUIDE } from "../guides/musicTheory";
import { VOCAL_FLOW_STYLES_GUIDE } from "../guides/vocalFlowStyles";
import { ADVANCED_TECHNIQUES_GUIDE } from "../guides/advancedTechniques";
import { GEMINI_MODELS } from './config';
import { artistPresetConfigs } from '../data/artistPresets';
import { generateContentWithRetry } from './geminiUtils';
import { Type } from "@google/genai";

export async function generateChords(data: AppData, model: string = GEMINI_MODELS.TEXT): Promise<{ updatedSections: Section[], feedback: string }> {
    const lyricalSections = data.sections.filter(s => s.lyrics.trim() !== '');
    if (lyricalSections.length === 0) {
        throw new Error("コードを提案するには、歌詞が割り当てられたセクションが少なくとも1つ必要です。");
    }

    const prompt = `あなたはSuno AI楽曲制作の音楽理論スペシャリストです。あなたの最優先タスクは、提供された**「楽曲のニュアンス（自然言語）」**を深く解釈し、その感情や物語性を音楽理論的に完璧に表現するコード進行を生成することです。

# Suno AI 音楽理論・コード仕様v4.5（重要）
${SUNO_AI_SPECIFICATION}

# Suno AI 高度音楽理論実現ガイド v4.5+
${SUNO_AI_MUSIC_THEORY_GUIDE}

# 🎤 Suno AI v5対応：ボーカルフロースタイル定義集
${VOCAL_FLOW_STYLES_GUIDE}

# 🎛️ Suno AI 高度技法・音響制御ガイド
${ADVANCED_TECHNIQUES_GUIDE}

# 高度アレンジメント対応：厳格な音楽理論ルール

## アーティストスタイル別コード特性
${(() => {
    if (data.concept.artistPreset && artistPresetConfigs[data.concept.artistPreset]) {
        const preset = artistPresetConfigs[data.concept.artistPreset];
        return `
**${data.concept.artistPreset}スタイル**:
${preset.naturalLanguageNuance}
`;
    }
    return '';
})()}

## 転調と変拍子の考慮
- **最重要**: 各セクションは独自のキーと拍子を持つ可能性があります。指定されたセクションのキーと拍子に厳密に従ってください。
- **転調**: キーが変更されるセクションでは、スムーズな移行を意識したコード（例: ピボットコード、共通和音）を選択してください。平行調、属調、三全音代理などの音楽理論に基づいた選択をしてください。
- **変拍子**: 7/8や5/4などの変拍子では、拍の強弱（例：7/8なら3+2+2など）を考慮したコード配置を行ってください。

## 高度アレンジメント別コード選択ルール
${data.concept.advancedArrangement.jazzHarmony ? '- **ジャズハーモニー**: 7th, 9th, 13th, 代理コード, 借用和音を積極的に活用' : ''}
${data.concept.advancedArrangement.complexRhythm ? `- **複雑リズム**: 指定された拍子に基づき、シンコペーションやポリリズムと調和するコード配置` : ''}


## 目標
情報密度を最大化し、可能な限り高品質で音楽的に複雑な楽曲を生成することを目指す。全ての提案は、楽曲全体の芸術性を高めるためのものでなければなりません。

- **全体の一貫性の維持**: 楽曲全体で「楽曲のニュアンス」から逸脱しないよう、一貫した音楽的テーマを維持することが最重要課題です。特に、曲の後半（ブリッジやアウトロなど）が前半の雰囲気から乖離しないように注意深く設計してください。各セクションは、全体の統一されたテーマの中でその役割を果たすべきです。
- **コード密度の最適化**: 歌詞の短いフレーズにも音楽的に意味のあるコードを積極的に配置し、プロンプトの情報量を最大化してください。ただし、歌唱のリズムを不自然にしないよう、単語の途中には挿入しないでください。
- **ハーモニーの深化**: 単純なトライアド（C, Amなど）を避け、可能な限りテンションノート（7th, 9th, 11th, 13th）やオルタードコード（C7(b9), G7(#5)など）を含む拡張コードを積極的に使用してください。特に「モーダルインターチェンジ」が有効な場合は、リハーモナイゼーションや代理コードの概念も取り入れてください。
- **音楽的表現の豊かさ**: 歌詞の感情や物語の展開に合わせて、コードの響きがどのように変化するかを意識してください。例えば、感動的な部分ではメジャーセブンスやadd9を、緊張感のある部分ではドミナントセブンスやディミニッシュコードを効果的に使用してください。

# 楽曲コンセプト（最重要解釈の指針）
## 楽曲のニュアンス（自然言語）
**このニュアンスが、以下の全ての音楽的要素を解釈するための最も重要なコンテキストです。**
---
${data.concept.naturalLanguageNuance}
---
${Object.values(data.concept.nuanceAmplifiers).some(v => v) ? `
### ニュアンス増幅指示（最重要）
「楽曲のニュアンス」を、以下の指示に基づいてさらに強調して解釈してください。
${data.concept.nuanceAmplifiers.amplifyEmotion ? '- **感情の増幅**: 歌詞の感情が最高潮に達する部分で、より感情的な響きを持つコード（例：テンションを多く含むコード、解決を遅らせるサスペンデッドコード）を多用してください。\n' : ''}${data.concept.nuanceAmplifiers.emphasizeUniqueness ? '- **独自性の強調**: 一般的なコード進行パターンを避け、モーダルインターチェンジや意外な転調など、音楽理論的に高度でユニークなハーモニーを積極的に提案してください。\n' : ''}${data.concept.nuanceAmplifiers.deepenNarrative ? '- **物語性の深化**: 物語の転換点となるセクション（特にBridge）では、キーを転調させたり、ハーモニーの雰囲気を大きく変えることで、物語の進行をドラマチックに演出してください。\n' : ''}${data.concept.nuanceAmplifiers.visualizeScenery ? '- **情景描写の具体化**: 情景を描写する歌詞には、その雰囲気を表現する特定の響きを持つコード（例：森の静けさにはオープンな響きのadd9、都市の喧騒には複雑なテンションコード）を選択してください。\n' : ''}
` : ''}

## その他の音楽的要素
- アーティストプリセット: ${data.concept.artistPresets.join(', ') || '指定なし'}
- ジャンル: ${[...data.concept.mainGenres, ...data.concept.subGenres].join(', ')}
- ムード: ${data.concept.moods.join(', ')}
- 基本キー: ${data.concept.key}
- 高度アレンジメント: ${Object.entries(data.concept.advancedArrangement).filter(([, value]) => value).map(([key]) => key).join(', ') || 'なし'}

# 対象セクション
${JSON.stringify(lyricalSections.map(s => ({
    id: String(s.id), 
    type: s.type, 
    lyrics: s.lyrics,
    energy: s.energy,
    key: s.key || data.concept.key,
    timeSignature: s.timeSignature || data.concept.timeSignature,
})), null, 2)}

# 厳格な指示
1.  **最重要解釈**: 「楽曲のニュアンス（自然言語）」を全ての解釈の出発点とし、その感情や物語をコード進行で表現することを最優先する。
2.  **技術的要件**: 指定されたキー、拍子、アーティストスタイル、高度アレンジメント設定を完全に反映する。
3.  **出力形式**: [C9]歌詞[Am7]の形式で正確に挿入する。
4.  **コード配置**: 日本語の単語の途中にコードを挿入しない（例：「感[Cmaj9]動的」はNG）。
5.  **ハーモニー**: 単純なトライアドの多用を避け、可能な限り複雑な拡張コードを優先する。
6.  **禁止事項**: コード以外の技術説明、メタタグ、言い訳、解説、\`\`\`マークダウンは最終出力に絶対に含めない。
7.  **最終形式**: 指定されたJSONスキーマに準拠したJSONオブジェクトのみを出力する。
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        chordResults: {
          type: Type.ARRAY,
          description: "An array of objects, each containing a section ID and its lyrics with embedded chords.",
          items: {
            type: Type.OBJECT,
            properties: {
              sectionId: {
                type: Type.STRING,
                description: "The ID of the section."
              },
              lyricsWithChords: {
                type: Type.STRING,
                description: "The lyrics for the section with chord annotations."
              }
            },
            required: ['sectionId', 'lyricsWithChords']
          }
        },
        feedback: {
          type: Type.STRING,
          description: "A detailed explanation of the chord choices based on music theory. Should be around 600 characters."
        }
      },
      required: ['chordResults', 'feedback']
    };

    const response = await generateContentWithRetry({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
    });
    
    const parsedResult = JSON.parse(response.text);
    const chordResults = parsedResult.chordResults;
    const feedbackText = parsedResult.feedback;
    
    if (!chordResults || !feedbackText || !Array.isArray(chordResults)) {
        throw new Error("AIからの応答に必要なデータが含まれていないか、形式が間違っています。");
    }

    const updatedSections = data.sections.map(s => {
      const result = chordResults.find((r: any) => r.sectionId === String(s.id));
      return result ? { ...s, lyrics: result.lyricsWithChords } : s;
    });

    const feedback = `【AI音楽理論解説】\n\n${feedbackText}\n\n各セクションのコードを確認し、必要に応じて微調整してください。`;

    return { updatedSections, feedback };
}
