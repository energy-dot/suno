
import { AppData, Section } from "../types";
import { SUNO_AI_SPECIFICATION } from "../spec/sunoApiSyntax";
import { SUNO_AI_MUSIC_THEORY_GUIDE } from "../guides/musicTheory";
import { VOCAL_FLOW_STYLES_GUIDE } from "../guides/vocalFlowStyles";
import { ADVANCED_TECHNIQUES_GUIDE } from "../guides/advancedTechniques";
import { GEMINI_MODELS } from './config';
import { artistPresetConfigs } from '../data/artistPresets';
import { generateContentWithRetry } from './geminiUtils';
import { Type } from "@google/genai";
import { GRAB_ATTENTION_TECHNIQUES_GUIDE } from "../guides/grabAttentionTechniques";

export async function generateStructure(data: AppData, grabAttentionEnabled: boolean, model: string = GEMINI_MODELS.TEXT): Promise<{ newSections: Section[], feedback: string }> {
    const grabAttentionInstruction = grabAttentionEnabled ? `
# 【超最重要】冒頭15秒の構造設計
以下の「冒頭15秒でリスナーを掴む」テクニック学習資料を熟読し、提案する楽曲構造が冒頭からリスナーを強力に引きつけるよう設計してください。ゼロイントロ構造（いきなりサビ）、インパクトのある短いイントロ、ボーカルや楽器のフックを冒頭に配置するなど、具体的な構造レベルでの提案を最優先してください。
---
${GRAB_ATTENTION_TECHNIQUES_GUIDE}
---
` : '';
    
    const prompt = `あなたは優秀な音楽プロデューサーであり、Suno v5の仕様書と高度音楽理論ガイドを完全に理解しています。音楽理論に基づいた厳格な楽曲構造を提案してください。

# Suno v5仕様書（最重要情報）
${SUNO_AI_SPECIFICATION}

# Suno AI 高度音楽理論実現ガイド v4.5+
${SUNO_AI_MUSIC_THEORY_GUIDE}

# 🎤 Suno AI v5対応：ボーカルフロースタイル定義集
${VOCAL_FLOW_STYLES_GUIDE}

# 🎛️ Suno AI 高度技法・音響制御ガイド
${ADVANCED_TECHNIQUES_GUIDE}

${grabAttentionInstruction}

# 高度アレンジメント対応：楽曲構造の音楽理論的ルール

## アーティストスタイル別構造特性
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

## V5新機能：変拍子、転調、動的指示の活用
- **変拍子/転調**: 楽曲展開上効果的ならばセクション単位での拍子変更や転調（平行調、属調、同主調など）を積極的に提案してください。
- **【最重要】動的指示の埋め込み**: Suno v5は歌詞内に \`[Bridge: 15s soaring accordion solo]\` のような動的な指示を埋め込むことで、より詳細な制御が可能です。arrangementSuggestionには、単なる楽器指定だけでなく、このような**時間指定を含む具体的な演奏指示**を積極的に盛り込んでください。これはプロンプトの品質を飛躍的に向上させます。

## 高度アレンジメント要素の活用
${data.concept.advancedArrangement.multilayer ? '- **多層アレンジメント**: 複数楽器の重層的配置、対位法的な絡み合い' : ''}
${data.concept.advancedArrangement.experimentalStructure ? '- **実験的構造**: 非従来的なセクション配置、突然の展開変化' : ''}
${data.concept.advancedArrangement.complexRhythm ? `- **複雑リズム**: ${data.concept.timeSignature}拍子、${data.concept.rhythmPattern}パターンの効果的活用` : ''}
${data.concept.advancedArrangement.jazzHarmony ? '- **ジャズハーモニー**: エクステンデッドコード、代理和音の積極的使用' : ''}

## 楽器指定の具体化 (Ultra-Specificity of Instrument Designation)
- **【最重要・厳守】**: 各セクションで提案する楽器は、**絶対に**単に楽器名をリストアップするだけでは不十分です。Suno AIが高品質な楽曲を生成するためには、**セクションごと、かつ、楽器ごと**に、その**演奏スタイル（例：アルペジオ、カッティング、スラップ）、音色（例：歪んだ、暖かい、クリアな）、セクション内での役割（例：メインリフを演奏、ハーモニーを支える、グルーヴを牽引する）、感情表現**を具体的かつ詳細に記述することが**必須**です。
- **良い例**: [Instrument: Electric Guitar (Distorted, aggressive palm-muted riffs, playing the main theme)], [Instrument: Piano (melancholic, soft arpeggiated chords, providing harmonic support)], [Instrument: Bass (Funky, syncopated slap bassline, driving the groove)]
- **悪い例**: [Instrument: Guitar, Piano, Bass]

## セクションタイプの機能と特性（高度版）
**Intro**: 楽曲への導入。4-8小節。雰囲気設定。
**Verse**: メインストーリー。16-32小節。物語性重視。
**Pre-Chorus**: サビへの橋渡し。8-16小節。緊張感の構築。
**Chorus**: 楽曲の核心。16-32小節。エネルギー最高潮。
**Bridge**: 楽曲の転換点。16-24小節。新しい視点、**転調や変拍子の最適セクション**。
**Solo**: 楽器表現。16-32小節。テクニカルな演奏。
**Outro**: 楽曲の終結。8-16小節。印象の完結。

# 楽曲構成における最重要目標
- **全体の一貫性の維持**: 楽曲全体で指定された「楽曲のニュアンス」から逸脱しない、一貫した音楽テーマを維持することが最重要課題です。歌詞をセクションに分割する際、特に曲の後半（ブリッジやアウトロなど）が前半の雰囲気から乖離しないように注意深く設計してください。各セクションの分割と配置は、全体の統一された物語や感情の流れを強化するために存在すべきです。

# 楽曲コンセプト
- アーティストプリセット: ${data.concept.artistPresets.join(', ') || '指定なし'}
- ジャンル: ${[...data.concept.mainGenres, ...data.concept.subGenres].filter(Boolean).join(', ') || '指定なし'}
- ムード: ${data.concept.moods.join(', ') || '指定なし'}
- 基本キー: ${data.concept.key}
- 基本テンポ: ${data.concept.tempo} BPM
- 基本拍子: ${data.concept.timeSignature}
- 楽曲ニュアンス: ${data.concept.naturalLanguageNuance || '指定なし'}
${Object.values(data.concept.nuanceAmplifiers).some(v => v) ? `
# ニュアンス増幅指示（最重要）
以下の指示を最優先で考慮し、楽曲構造を提案してください。
${data.concept.nuanceAmplifiers.amplifyEmotion ? '- **感情の増幅**: 楽曲構造全体で、増幅された感情の起伏（より劇的な静と動の対比など）を表現してください。\n' : ''}${data.concept.nuanceAmplifiers.emphasizeUniqueness ? '- **独自性の強調**: 伝統的な「Verse-Chorus」形式に囚われず、より実験的で予測不可能なセクション展開を提案してください。\n' : ''}${data.concept.nuanceAmplifiers.deepenNarrative ? '- **物語性の深化**: 歌詞の物語性が最も効果的に伝わるよう、起承転結を意識したセクション配置（例：明確なクライマックスとしてのBridge、物語の結末を示すOutro）を行ってください。\n' : ''}${data.concept.nuanceAmplifiers.visualizeScenery ? '- **情景描写の具体化**: 情景を描写する歌詞の部分には、サウンドエフェクトや特定の楽器を多用する「Instrumental Break」や「Interlude」を挟むなど、音による風景描写を重視した構成を提案してください。\n' : ''}
` : ''}

# 歌詞全体
---
${data.rawLyrics}
---

# 厳格な指示
1. **必須**: 歌詞の内容と感情の流れを詳細分析し、最適な構造、転調、変拍子を提案。
2. **必須**: アーティストプリセットと高度アレンジメント設定を反映。
3. **必須**: 各セクションの音楽的機能（導入、展開、クライマックス、転換、終結）を明確化。
4. **超重要**: 最終プロンプトが長くなりすぎないよう、セクションは**最大10つ**に厳密に制限してください。
5. **禁止**: Sunoで歌われる可能性のある説明文は一切含めない。
6. **重要**: arrangementSuggestionにはSunoメタタグ形式の文字列のみ記載し、提案がない場合は空文字列にしてください。
7. **必須**: 必ず、指定されたJSONスキーマに準拠したJSON配列を出力してください。説明や\`\`\`マークダウンは一切不要です。
`;

    const schema = {
      type: Type.ARRAY,
      description: "An array of objects, where each object represents a structured section of the song.",
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "The type of the section (e.g., Intro, Verse, Chorus)." },
          lyrics: { type: Type.STRING, description: "The lyrics assigned to this section." },
          energySuggestion: { type: Type.STRING, description: "The suggested energy level for this section." },
          keySuggestion: { type: Type.STRING, nullable: true, description: "The suggested key for this section, if different from the main key. Should be null if no change." },
          timeSignatureSuggestion: { type: Type.STRING, nullable: true, description: "The suggested time signature for this section, if different from the main one. Should be null if no change." },
          musicReason: { type: Type.STRING, description: "The music theory-based reason for this structural choice." },
          sectionFunction: { type: Type.STRING, description: "The function of this section within the song (e.g., Introduction, Climax)." },
          arrangementSuggestion: { type: Type.STRING, description: "Sunoメタタグ形式での楽器、サウンドエフェクト、プロダクションの提案。【最重要・厳守】: 各楽器について、演奏スタイル、音色、セクション内での役割を詳細に記述すること（例: [Instrument: Electric Guitar (Distorted, aggressive palm-muted riffs)]）。単なる楽器名の羅列は禁止。可能な限り具体的に。提案がない場合は空文字列にすること。" }
        },
        required: ['type', 'lyrics', 'energySuggestion', 'keySuggestion', 'timeSignatureSuggestion', 'musicReason', 'sectionFunction', 'arrangementSuggestion']
      }
    };

    const response = await generateContentWithRetry({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    
    const parsedStructure = JSON.parse(response.text);

    if (!Array.isArray(parsedStructure)) {
        throw new Error("AIからの応答が配列形式ではありませんでした。");
    }

    const newSections: Section[] = parsedStructure.map((s: any) => ({
      id: Date.now() + Math.random(),
      type: s.type || 'Verse',
      lyrics: s.lyrics || '',
      energy: s.energySuggestion || 'Medium',
      key: s.keySuggestion || data.concept.key,
      modulation: 'Stay in Key',
      timeSignature: s.timeSignatureSuggestion || data.concept.timeSignature,
      rhythmPattern: data.concept.rhythmPattern,
      instruments: [],
      instrumentDetails: {},
      vocals: { 
        style: data.concept.vocalStyles || [], 
        gender: data.concept.vocalGenders || [], 
        effect: [] 
      },
      soundEffects: [],
      advancedDescription: s.arrangementSuggestion || '',
      useMetaObject: true
    }));
    
    const reasonsText = parsedStructure.map((s: any) => 
      `🎵 ${s.type} [${s.energySuggestion}]${s.keySuggestion ? ` [Key: ${s.keySuggestion}]` : ''}${s.timeSignatureSuggestion ? ` [Time: ${s.timeSignatureSuggestion}]` : ''}\n📝 ${s.musicReason}\n🎯 機能: ${s.sectionFunction || '楽曲構成要素'}${s.arrangementSuggestion ? `\n🎼 アレンジ: ${s.arrangementSuggestion}` : ''}`
    ).join('\n\n');

    const feedback = `【AI高度音楽理論解析】楽曲構造の提案が完了しました。\n\n${reasonsText}\n\n転調や変拍子を含む高度なアレンジメントが設計されています。ステップ2・3で確認・編集してください。`;

    return { newSections, feedback };
}
