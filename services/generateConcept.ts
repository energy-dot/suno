
import { Concept } from "../types";
import { META_DATA } from '../constants';
import { SUNO_AI_SPECIFICATION } from "../spec/sunoApiSyntax";
import { SUNO_AI_MUSIC_THEORY_GUIDE } from "../guides/musicTheory";
import { ADVANCED_TECHNIQUES_GUIDE } from "../guides/advancedTechniques";
import { GEMINI_MODELS } from './config';
import { generateContentWithRetry } from './geminiUtils';
import { Type } from "@google/genai";
import { GRAB_ATTENTION_TECHNIQUES_GUIDE } from '../guides/grabAttentionTechniques';

export async function generateConcept(rawLyrics: string, naturalLanguageNuance: string, nuanceAmplifiers: Concept['nuanceAmplifiers'], grabAttentionEnabled: boolean, model: string = GEMINI_MODELS.TEXT): Promise<Partial<Concept>> {
    const allSubGenres = Object.values(META_DATA.subGenres).flat();

    const grabAttentionInstruction = grabAttentionEnabled ? `
# 【超最重要】冒頭15秒の最適化
以下の「冒頭15秒でリスナーを掴む」テクニック学習資料を熟読し、提案するコンセプトが楽曲の冒頭からリスナーを強力に引きつけるよう設計してください。特に構造、最初のボーカルや楽器のインパクトに反映させてください。
---
${GRAB_ATTENTION_TECHNIQUES_GUIDE}
---
` : '';

    const prompt = `あなたは優秀な音楽プロデューサーです。提供された歌詞と「楽曲のニュアンス」、そして以下の仕様書とガイドを分析し、最も先進的で音楽理論的に深みのある、最適な音楽コンセプトを提案してください。

# Suno AI メタタグ仕様書（基本編）
${SUNO_AI_SPECIFICATION}

# Suno AI 高度音楽理論実現ガイド v4.5+
${SUNO_AI_MUSIC_THEORY_GUIDE}

# 🎛️ Suno AI 高度技法・音響制御ガイド
${ADVANCED_TECHNIQUES_GUIDE}

${grabAttentionInstruction}

# 選択肢 (必ずこの中から選択してください)
- **メインジャンル**: ${META_DATA.groupedGenres.flatMap(g => g.genres).join(', ')}
- **サブジャンル**: ${allSubGenres.join(', ')}
- **ムード**: ${META_DATA.moods.join(', ')}
- **キー**: ${META_DATA.keys.join(', ')}
- **拍子**: ${META_DATA.timeSignatures.join(', ')}
- **リズムパターン**: ${META_DATA.rhythmPatterns.join(', ')}
- **プロダクション・ミックス**: ${META_DATA.productionMixes.join(', ')}

# 分析対象
## 歌詞
---
${rawLyrics || '歌詞がありません。'}
---
## 楽曲のニュアンス
---
${naturalLanguageNuance}
---
${Object.values(nuanceAmplifiers).some(v => v) ? `
# ニュアンス増幅指示（最重要）
以下の指示を最優先で考慮し、楽曲コンセプトを決定してください。
${nuanceAmplifiers.amplifyEmotion ? '- **感情の増幅**: 記述された感情を、より極端で強烈なものとして解釈し、音楽コンセプトに反映させてください。例えば「悲しい」は「胸が張り裂けるほど悲痛な」レベルで表現してください。\n' : ''}${nuanceAmplifiers.emphasizeUniqueness ? '- **独自性の強調**: 記述されたニュアンスを、ありきたりな解釈ではなく、実験的で独創的な視点から再構築してください。予期せぬジャンルの融合や、珍しい楽器の組み合わせなど、ユニークな提案をしてください。\n' : ''}${nuanceAmplifiers.deepenNarrative ? '- **物語性の深化**: 記述されたニュアンスを一つの物語の始まりと捉え、その物語の展開や結末を想像させるような、深みのある音楽コンセプトを構築してください。楽曲全体で一つの物語が進行するような、構成的な視点を取り入れてください。\n' : ''}${nuanceAmplifiers.visualizeScenery ? '- **情景描写の具体化**: 記述された情景を、音で鮮明に描き出すことを最優先してください。特定の音（風の音、街の喧騒など）や、空間的な広がり（広い、狭い、反響など）を表現するためのプロダクションや楽器の選定を重視してください。\n' : ''}
` : ''}

# 創作哲学 (Creative Philosophy)
あなたの提案は、楽曲の核心にある感情や物語を、最高の形で表現することを唯一の目的としなければなりません。シンプルさと複雑さ、定型と実験性を、楽曲の目的に応じて自在に使い分ける、音楽的に最適化されたアプローチを追求してください。
- **ハーモニー（和声）**: 楽曲のテーマや感情に最も寄り添う、最適化された和声を構築する。王道のコード進行が持つ普遍的な力と、拡張和音や借用和音がもたらす色彩的な表現力の両方を尊重し、最も効果的なものを選択する。
- **リズム**: 楽曲のグルーヴとエネルギーを最大化する、機能的なリズムを設計する。安定したビートが持つ心地よさと、変拍子などがもたらす緊張感の両方を、楽曲の展開に応じて戦略的に使い分ける。
- **楽器と演奏 (Instruments and Performance)**: 各楽器を単なる音の要素ではなく、個性と技巧を持つ「演奏家」として扱う。奏法（アルペジオ、ゴーストノートなど）、音色、楽器間の対話を考慮し、その演奏を最も魅力的に捉えるプロダクションを意識する。
- **ボーカルと表現 (Vocal and Expression)**: ボーカルを単なるメロディの伝達役ではなく、楽曲の物語を語る「主演俳優」として捉える。感情の機微（囁き、叫び、息遣いなど）、歌唱技術（ビブラート、フレージングなど）、声質やキャラクターを通して、歌詞の言葉を超えた深い感情を表現する。
- **サウンドと空間 (Sound and Space)**: 楽曲全体を包む「音響空間」をデザインする。音の質感（生々しい、磨き上げられたなど）、空間表現（ワイドなステレオ感、親密な距離感など）、そして時代感や空気感を定義し、リスナーをその世界へ完全に没入させる。
- **構成**: リスナーの感情を導き、物語を最も効果的に伝えるための、動的な楽曲構成を意識する。定型的な構成が持つ親しみやすさと、実験的な構成がもたらす驚きの両方を、楽曲全体の完成度を高めるために選択する。

# 厳格な指示
1. 歌詞、ニュアンス、**そしてニュアンス増幅指示**から、楽曲の全体像（雰囲気、情景、感情）を深く理解してください。
2. 上記の「創作哲学」と「選択肢」を基に、最もふさわしい値を各項目に割り当ててください。
3. **テンポ (BPM)**: ニュアンスに合う具体的な数値を提案してください (40〜200の間)。
4. **ジャンル選択の制約**: ユーザーからの明示的な指示（「楽曲のニュアンス」や「歌詞」に "Jazz" や "ジャズ" といった単語が含まれる場合など）がない限り、**絶対に "Jazz" をメインジャンルまたはサブジャンルに含めないでください**。他の多くのジャンルが利用可能です。
5. **戻り値**: 指定されたJSONスキーマに準拠したJSONオブジェクトのみを出力してください。他のテキストや説明、\`\`\`マークダウンは一切含めないでください。
`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            mainGenres: { type: Type.ARRAY, items: { type: Type.STRING } },
            subGenres: { type: Type.ARRAY, items: { type: Type.STRING } },
            moods: { type: Type.ARRAY, items: { type: Type.STRING } },
            key: { type: Type.STRING },
            tempo: { type: Type.NUMBER },
            timeSignature: { type: Type.STRING },
            rhythmPattern: { type: Type.STRING },
            productionMixes: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['mainGenres', 'subGenres', 'moods', 'key', 'tempo', 'timeSignature', 'rhythmPattern', 'productionMixes']
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
        const parsedConcept = JSON.parse(response.text);
        return parsedConcept as Partial<Concept>;
    } catch (e) {
        console.error("Failed to parse AI concept response:", response.text);
        throw new Error("AIからの応答が不正なJSON形式でした。");
    }
}
