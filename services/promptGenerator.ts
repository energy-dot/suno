
import { AppData } from '../types';
import { generateVocalConcept, deconstructArtistNuance } from './geminiService';
import { GEMINI_MODELS } from './config';
import { generateContentWithRetry } from './geminiUtils';
import { Type } from "@google/genai";
import { ADVANCED_TECHNIQUES_GUIDE } from '../guides/advancedTechniques';

/**
 * Generates a high-level prompt for Suno AI's "Style" box.
 * This function generates a single, comprehensive JSON object in English,
 * encapsulating the song's narrative, vocal concepts, and technical details.
 * The resulting JSON string is designed to be under 1000 characters.
 * @param data The application data.
 * @returns A Promise that resolves to a JSON string for the "Style" box.
 */
export const generateStylePrompt = async (data: AppData): Promise<string> => {
    const { concept } = data;
    const styleTags = [...concept.mainGenres, ...concept.subGenres].filter(Boolean).join(', ');

    // 1. Get Japanese descriptions from other services
    const deconstructedNuanceJP = await deconstructArtistNuance(concept.naturalLanguageNuance);
    const vocalConceptJP = await generateVocalConcept(concept);

    // 2. Create a prompt to generate the final English JSON
    const prompt = `
あなたはSuno AIのプロンプトを専門とする、世界トップクラスの音楽プロデューサーです。
提供された楽曲コンセプト情報を分析し、Suno AI v5の「Style」ボックスに最適化された、**単一のJSONオブジェクト**を**英語で**生成してください。このJSONは、AIへの指示の曖昧さを最小限にするため、極めて構造的かつ精密でなければなりません。

# 楽曲コンセプト情報
---
- **物語的コンセプト:** ${deconstructedNuanceJP}
- **ボーカルコンセプト:** ${vocalConceptJP.replace('Vocal Concept: ', '')}
- **ジャンル:** ${styleTags || "指定なし"}
- **ムード:** ${concept.moods.join(', ') || "指定なし"}
- **BPM:** ${concept.tempo}
- **キー:** ${concept.key}
- **ボーカルプロファイル:** ${[...(concept.vocalStyles || []), ...(concept.vocalGenders || [])].join(', ') || "指定なし"}
- **プロダクションミックス:** ${concept.productionMixes.join(', ') || "指定なし"}
---

# 厳格な指示
1.  **出力言語:** 生成するJSONの全てのキーと値は、**必ず英語**にしてください。
2.  **出力形式:** **単一のJSONオブジェクトのみ**を出力してください。説明、\`\`\`json マークダウンは一切含めないでください。
3.  **JSON構造:** 以下のキー構造と制約に厳密に従ってください。
    - \`genre\`: 楽曲の主要なジャンルを簡潔な文字列で記述。
    - \`mood\`: 楽曲のムードを最も代表する**最大3つ**の英語キーワード配列で記述。
    - \`elements\`: **【最重要】** 物語的・ボーカルコンセプトから、楽曲を構成する音楽的要素を**最大3つの詳細な記述**に集約してください。個別の単語を羅列するのではなく、複数の要素（楽器、奏法、雰囲気など）を**連鎖的に組み合わせた、情景が浮かぶような豊かな表現**にしてください。例: 単に \`["female vocal", "piano", "sad"]\` とするのではなく、\`["Intimate female vocals with breathy delivery over a melancholic solo piano"]\` のように、一つの要素に情報を集約する。
    - \`bpm\`: BPMを数値で記述。
    - \`key\`: キーを英語で記述。
    - \`vocalProfile\`: ボーカルの特性を簡潔な文字列で記述。
    - \`productionMix\`: プロダクションの特性を最も代表する**最大5つ**の英語キーワード配列で記述。
4.  **【最重要】文字数と情報密度:**
    - 生成されるJSON全体の文字列長は、**絶対に1000文字を超えてはなりません。**
    - ただし、Suno v5で高品質な楽曲を生成する鍵は、この1000文字という制限の中で**可能な限り詳細で豊かな情報**をAIに与えることです。
    - したがって、単に短くするのではなく、**常に1000文字の上限に近づけることを意識し**、提供されたコンセプト情報を余すことなく、かつ簡潔に\`elements\`配列などに盛り込んでください。情報密度を最大化することがあなたの最優先事項です。
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        genre: { type: Type.STRING },
        mood: { type: Type.ARRAY, items: { type: Type.STRING } },
        elements: { type: Type.ARRAY, items: { type: Type.STRING } },
        bpm: { type: Type.NUMBER },
        key: { type: Type.STRING },
        vocalProfile: { type: Type.STRING },
        productionMix: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['genre', 'mood', 'elements', 'bpm', 'key', 'vocalProfile', 'productionMix']
    };

    const response = await generateContentWithRetry({
        model: GEMINI_MODELS.TEXT,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
    });

    const jsonString = response.text;

    try {
        // Final validation and formatting without spaces
        return JSON.stringify(JSON.parse(jsonString));
    } catch (e) {
        console.error("The final prompt string could not be parsed as JSON:", jsonString);
        return jsonString; // Fallback
    }
};


/**
 * Generates the detailed prompt for Suno AI's "Lyrics" box.
 * This focuses on the song structure, lyrics, and embedded dynamic instructions.
 * @param data The application data.
 * @returns A string for the "Lyrics" box.
 */
export const generateLyricsPrompt = (data: AppData): string => {
    let prompt = '';

    let lastKey = data.concept.key;
    data.sections.forEach(section => {
        if (section.useMetaObject) {
            prompt += `<${section.type.toUpperCase()}>\n`;
        } else {
            prompt += `[${section.type}]\n`;
        }

        let details = [];
        if (section.energy && section.energy !== 'Medium') details.push(`[Energy: ${section.energy}]`);

        if (section.modulation && section.modulation !== 'Stay in Key') {
            details.push(`[${section.modulation}]`);
        }
        if (section.key && section.key !== lastKey) {
            details.push(`[Key: ${section.key}]`);
            lastKey = section.key;
        }

        if (section.timeSignature && section.timeSignature !== data.concept.timeSignature) details.push(`[Time Signature: ${section.timeSignature}]`);
        if (section.rhythmPattern && section.rhythmPattern !== data.concept.rhythmPattern) details.push(`[Rhythm: ${section.rhythmPattern}]`);

        section.vocals.style.forEach(style => details.push(`[Vocal Style: ${style}]`));
        section.vocals.gender.forEach(gender => details.push(`[${gender}]`));
        section.vocals.effect.forEach(effect => details.push(`[Vocal Effect: ${effect}]`));

        section.instruments.forEach(inst => {
            const detail = section.instrumentDetails[inst];
            details.push(`[Instrument: ${inst}${detail ? ` (${detail})` : ''}]`);
        });
        section.soundEffects.forEach(fx => details.push(`[${fx}]`));

        if (section.advancedDescription) {
            details.push(section.advancedDescription);
        }

        if (details.length > 0) prompt += `${details.join(' ')}\n`;
        if (section.lyrics) prompt += `${section.lyrics}\n`;
        if (section.useMetaObject) prompt += `</${section.type.toUpperCase()}>\n`;
        prompt += '\n';
    });

    return prompt.trim();
};
