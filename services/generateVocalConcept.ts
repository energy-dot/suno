
import { Concept } from "../types";
import { GEMINI_MODELS } from './config';
import { generateContentWithRetry } from './geminiUtils';

export async function generateVocalConcept(concept: Concept, model: string = GEMINI_MODELS.TEXT): Promise<string> {

    const prompt = `あなたは世界トップクラスのボーカルプロデューサーです。提供された楽曲コンセプトに基づき、Suno AIのStyleプロンプトに含めるための、ストーリー性豊かで感情的なボーカルコンセプトを生成してください。

# 楽曲コンセプト
- ニュアンス: ${concept.naturalLanguageNuance}
- ムード: ${concept.moods.join(', ')}
- ボーカルスタイル: ${concept.vocalStyles.join(', ')}
- ボーカル性別/声質: ${concept.vocalGenders.join(', ')}

# 指示
1. 上記のコンセプトを深く解釈し、楽曲の物語を声で表現するための具体的なボーカルディレクションを生成してください。
2. 楽曲の展開（例：ヴァース、コーラス、ブリッジ）を意識し、感情の起伏を声でどう表現するかを記述してください。
3. 息遣い、声の質感（ハスキー、クリアなど）、歌い方（囁くように、力強くなど）といった、具体的な指示を含めてください。
4. 出力は、Suno AIのプロンプトとして自然に組み込める、簡潔な自然言語のテキスト（日本語）のみとします。
5. テキストは**200文字以内**に厳密に収めてください。
6. 説明や前置きは一切不要です。

# 例
- コンセプト: 「失恋の痛みを乗り越え、再び希望を見出す力強いバラード」
- 出力例: 「Vocal Concept: ヴァースは失恋の痛みを表現するため、息遣いの多いハスキーなウィスパーボイスで。コーラスに向かって徐々に力を増し、最終コーラスでは過去を振り切るように、クリアでパワフルなベルティングで希望を歌い上げる。」
`;

    const response = await generateContentWithRetry({
        model: model,
        contents: prompt,
    });

    return `Vocal Concept: ${response.text.trim()}`;
}
