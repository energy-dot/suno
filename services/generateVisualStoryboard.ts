
import { Type } from "@google/genai";
import { AppData, VisualStoryboard } from "../types";
import { generateContentWithRetry } from "./geminiUtils";
import { GEMINI_MODELS } from "./config";

export async function generateVisualStoryboard(data: AppData, visualInstructions: string = '', model: string = GEMINI_MODELS.TEXT): Promise<VisualStoryboard> {
    const songExplanationContext = data.songExplanation
        ? `
# 【最重要コンテキスト】 AIの制作ノート:
以下のノートは、楽曲を制作したAI自身によるものです。これは、楽曲が意図する雰囲気、感情の起伏、芸術的な狙いを知るための最も重要な情報源です。あなたのストーリーボードは、このノートを忠実に映像へと翻訳するものでなければなりません。他の情報と矛盾がある場合は、このノートを最優先してください。
---
${data.songExplanation}
---
`
        : '';
    
    const userInstructionsContext = visualInstructions.trim()
        ? `
# 【超最優先指示】 ユーザーからのビジュアル指示:
以下の指示は、ユーザーから直接与えられたビジュアルテーマに関する指示です。他のどの情報よりもこれを最優先し、あなたの創造的な解釈の中心に据えてストーリーボードを構築してください。
---
${visualInstructions}
---
`
        : '';

    const prompt = `
あなたは卓越したミュージックビデオ監督であり、視覚的な物語作家です。あなたの任務は、提供された楽曲データを分析し、リスナーの心を掴むビジュアルストーリーボードを作成することです。出力は日本語でお願いします。

${userInstructionsContext}

${songExplanationContext}

# 楽曲データ (補足コンテキスト)

## 全体コンセプト
- **ジャンル:** ${[...data.concept.mainGenres, ...data.concept.subGenres].join(', ')}
- **ムード:** ${data.concept.moods.join(', ')}
- **ニュアンス:** ${data.concept.naturalLanguageNuance}

## 楽曲構成
楽曲は以下のセクションで構成されています:
${data.sections.map(s => `- **${s.type} (ID: ${s.id})**`).join('\n')}

## 歌詞全文
---
${data.rawLyrics}
---

# 指示
1.  **最優先事項:** もし「ユーザーからのビジュアル指示」があれば、それを絶対的な指針としてください。次に、「AIの制作ノート」を深く読み込み、これを映像化の核としてください。他の楽曲データは、これらの指示を補完する詳細情報として活用してください。
2.  楽曲全体を貫く**「全体的なビジュアルテーマ」**を考案してください。これは、「ネオンきらめく都市を巡る、シュールで夢のような旅」や「ある別れを、ざらついたモノクロのドキュメンタリータッチで描く」といった、ハイレベルな芸術的方針です。
3.  楽曲の各セクションについて、具体的な**「シーンディスクリプション」**を作成してください。これは、情景、光、色彩、カメラワーク、そして重要なアクションやイメージを含む、鮮やかで喚情的な、映画のような描写であるべきです。
4.  各シーンが、楽曲の感情の推移と一致する、一貫した物語を語るように構成してください。
5.  あなたの出力は、提供されたスキーマに厳密に従った**単一のJSONオブジェクト**でなければなりません。その他のテキスト、説明、マークダウン形式は一切含めないでください。
`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            overall: {
                type: Type.STRING,
                description: "ミュージックビデオ全体のビジュアルテーマと芸術的方向性を要約した、ハイレベルな記述。簡潔で喚情的な一文であるべきです。",
            },
            scenes: {
                type: Type.ARRAY,
                description: "楽曲の各セクションに対応するシーンディスクリプションの配列。",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sectionId: {
                            type: Type.STRING,
                            description: "このシーンが対応する楽曲セクションの一意のID。入力されたIDのいずれかでなければなりません。",
                        },
                        description: {
                            type: Type.STRING,
                            description: "このセクションの映像シーンに関する、鮮やかで映画的な描写。カメラワーク、光、色彩、重要なアクションやイメージを含みます。2〜3文の長さが目安です。",
                        },
                    },
                    required: ["sectionId", "description"],
                },
            },
        },
        required: ["overall", "scenes"],
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
        const parsedResult = JSON.parse(response.text);

        // Basic validation
        if (!parsedResult.overall || !Array.isArray(parsedResult.scenes)) {
            throw new Error("AI response is missing required fields 'overall' or 'scenes'.");
        }

        return parsedResult as VisualStoryboard;
    } catch (e) {
        console.error("Failed to parse visual storyboard response:", response.text, e);
        throw new Error("AIが不正な形式のストーリーボードを返しました。");
    }
}
