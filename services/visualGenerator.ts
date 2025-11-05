import { Modality, Type } from "@google/genai";
import { AppData, VisualResult, Section } from "../types";
import { ai } from "./client";
import { generateContentWithRetry } from "./geminiUtils";
import { GEMINI_MODELS } from "./config";

// Defined concepts for each of the three image prompts
const IMAGE_CONCEPTS = [
    {
        name: "芸術性の高い画像",
        description: "**コンセプト:** 楽曲の感情と物語の核心を捉えた、明るくカラフルで象徴的なビジュアルアートの創造。古典的な油絵の技術と現代のシュールレアリズムを融合させ、テクスチャと雰囲気の深さを追求する。鮮やかな色彩パレットとダイナミックな光の interplay が特徴。見る者に深い考察と感情的な共鳴を促す、示唆的で多様な構図や抽象的表現を探求すること。具体的な描写ではなく、あくまでコンセプトとしての方向性を示すものです。"
    },
    {
        name: "SNS世代に響く画像",
        description: "**コンセプト:** 中心に日本人の美しい女性(大人っぽい色気のある妖艶な若い女性)を配し、パワフルな感情やアクションの瞬間を捉えた、超高精細でダイナミックなビジュアルの生成。レトロフューチャーと現代の可愛らしさを融合させ、鮮やかな光の反射や魅力的な構図を用いる。日本のファッションやアニメ文化のエッセンスを取り入れつつ、写実的かつ魅力的なディテールで表現する。感情表現やシチュエーションは多様性を重視し、SNSでの共感を呼ぶような視覚的インパクトを追求すること。具体的な描写ではなく、あくまでコンセプトとしての方向性を示すものです。"
    },
    {
        name: "新海誠風デザイン",
        description: "**コンセプト:** 新海誠監督作品のような、胸を打つ郷愁と感情的な美しさを伴うアニメスタイルの風景ビジュアルを作成する。雨上がりの夕暮れ時や、夜明け前の静寂といった、日常の中の非日常的な瞬間を捉える。光の描写（薄明光線、濡れた路面の反射、レンズフレア）と空気感（舞い散る花びら、遠景の霞）に焦点を当て、高精細なディテールと豊かな色彩パレットで、見る者の心に深く残る情景を描く。憧れ、繋がり、そして儚さといったテーマを暗示する要素を組み込む。具体的な描写ではなく、あくまでコンセプトとしての方向性を示すものです。"
    },
];

export async function generateVisuals(data: AppData): Promise<VisualResult[]> {
    const results: VisualResult[] = [];

    for (let i = 0; i < IMAGE_CONCEPTS.length; i++) {
        const concept = IMAGE_CONCEPTS[i];
        const imagePromptsInstruction = `あなたは世界トップクラスのビジュアルアーティストであり、画像生成AIのプロンプト作成の専門家です。以下の楽曲情報と、あなたに与えられた「画像コンセプト」に基づき、高品質な画像生成プロンプトを1つ提案してください。この画像は、楽曲全体のビジュアルスタイルを決定する重要な基準点となります。

# 【最重要】ビジュアルストーリーボードの全体テーマ
${data.visualStoryboard?.overall || "指定なし。楽曲情報からテーマを読み取ってください。"}

# 楽曲情報 (文脈として参照)
- **ジャンル:** ${[...data.concept.mainGenres, ...data.concept.subGenres].join(', ')}
- **ムード:** ${data.concept.moods.join(', ')}
- **ニュアンス:** ${data.concept.naturalLanguageNuance}
- **歌詞の抜粋:** ${data.rawLyrics.substring(0, 300)}...

# あなたが担当する画像コンセプト
- **コンセプト名:** ${concept.name}
- **詳細:** ${concept.description}

# 指示
- **最優先事項:** 「ビジュアルストーリーボードの全体テーマ」を核として、それをあなたの担当する「画像コンセプト」のフィルターを通して解釈し、独創的なビジュアルプロンプトを考案してください。
- 生成するプロンプトは、英語で100語程度の詳細なパラグラフ形式にしてください。
- 芸術的、抽象的、またはシュールレアリスティックな要素を強く含めてください。
- 出力は、生成されたプロンプト文字列のみとしてください。説明や前置きは一切含めません。
`;

        const imagePromptResponse = await generateContentWithRetry({
            model: GEMINI_MODELS.TEXT,
            contents: imagePromptsInstruction,
        });

        const imagePrompt: string = imagePromptResponse.text.trim();
        if (!imagePrompt) {
            throw new Error(`Failed to generate image prompt for concept: ${concept.name}.`);
        }

        // Generate Image
        const imageResponse = await ai.models.generateContent({
            model: GEMINI_MODELS.IMAGE,
            contents: { parts: [{ text: imagePrompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = imageResponse.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (!imagePart?.inlineData?.data) {
            throw new Error(`Image generation failed for prompt: ${concept.name}.`);
        }
        const imageBase64 = `data:image/png;base64,${imagePart.inlineData.data}`;
        
        results.push({
            id: `visual-${Date.now()}-${i}`,
            imagePrompt: imagePrompt,
            imageBase64: imageBase64,
        });
    }
    
    return results;
}

export async function generateSceneImage(
    styleReferenceImageBase64: string,
    section: Section,
    songConcept: AppData['concept'],
    sceneDescription: string
): Promise<string> {
    const referenceImagePart = {
        inlineData: {
            mimeType: 'image/png', // Assuming png, could be dynamic
            data: styleReferenceImageBase64.split(',')[1],
        },
    };

    const textPrompt = `You are a visionary art director. Generate a new image that perfectly matches the artistic style, color palette, and overall mood of the provided reference image.

    **Reference Image Style:** [The reference image is provided as input]

    **Scene to Depict:**
    This image should be a direct visual representation of the following scene description:
    ---
    **Scene Description:** ${sceneDescription}
    ---

    For context, this scene is part of a larger story for a song with the following characteristics:
    - Section Type: ${section.type}
    - Lyrics Snippet: "${section.lyrics}"
    - Overall Song Concept: ${songConcept.naturalLanguageNuance}

    **Your primary goal is to bring the 'Scene Description' to life visually, while strictly adhering to the style of the reference image.**`;

    const textPart = {
        text: textPrompt
    };

    const response = await ai.models.generateContent({
        model: GEMINI_MODELS.IMAGE,
        contents: { parts: [referenceImagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    if (!imagePart?.inlineData?.data) {
        throw new Error(`Scene image generation failed for section ${section.type}.`);
    }
    return `data:image/png;base64,${imagePart.inlineData.data}`;
}
