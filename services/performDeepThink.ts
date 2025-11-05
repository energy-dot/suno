import { generateContentWithRetry } from './geminiUtils';
import { GEMINI_MODELS } from './config';
import { Type } from "@google/genai";

import { DUA_LIPA_THEORY_GUIDE } from "../guides/genre/duaLipa";
import { KPOP_THEORY_GUIDE } from "../guides/genre/kpop";
import { TIESTO_THEORY_GUIDE } from "../guides/genre/tiesto";
import { DIVA_THEORY_GUIDE } from "../guides/genre/diva";
import { EDM_THEORY_GUIDE } from "../guides/genre/edm";
import { TECHNO_THEORY_GUIDE } from "../guides/genre/techno";
import { LYRIC_WRITING_THEORY_GUIDE } from "../guides/songwritingPrinciples";
import { SUNO_AI_SPECIFICATION } from "../spec/sunoApiSyntax";
import { SUNO_AI_MUSIC_THEORY_GUIDE } from "../guides/musicTheory";
import { VOCAL_FLOW_STYLES_GUIDE } from "../guides/vocalFlowStyles";
import { ADVANCED_TECHNIQUES_GUIDE } from "../guides/advancedTechniques";
import { MINIMALISM_THEORY_GUIDE } from "../guides/genre/minimalism";
import { GRAB_ATTENTION_TECHNIQUES_GUIDE } from '../guides/grabAttentionTechniques';
import { TAME_IMPALA_THEORY_GUIDE } from '../guides/genre/tameImpala';

async function generateDeepAnalysis(lyrics: string, nuance: string, model: string = GEMINI_MODELS.TEXT): Promise<string> {
  const prompt = `
  あなたは世界トップクラスの音楽評論家であり、楽曲分析のスペシャリストです。あなたの任務は、提供された「歌詞」と「楽曲ニュアンス」を、以下の2ステップの分析手法に基づいて徹底的に分析し、その楽曲が持つ世界観と芸術的ポテンシャルを言語化することです。

  # 分析手法

  ### ステップ1：楽曲の分解分析 (Deconstructive Analysis)
  楽曲を「歌詞」「サウンド」「構成」という客観的な要素に分解し、それぞれのパーツが持つ特徴や機能を個別に明らかにします。

  * **分析項目**:
      1.  **全体構造の把握**: 楽曲の設計図を推測します。イントロ、Aメロ、Bメロ、サビ、間奏、アウトロなど、各セクションの役割分担と曲全体の感情の流れを整理します。
      2.  **歌詞の分析**:
          * **テーマと物語**: 歌詞全体で語られている中心的なテーマや物語のあらすじを掴みます。
          * **表現技法**: 象徴的なキーワード、印象的な比喩表現、対比的な言葉などを抽出し、その言葉が持つ意味を掘り下げます。
      3.  **音楽的要素の分析（ニュアンスから推測）**:
          * **ハーモニー（和声）**: 曲の雰囲気を作るコード進行を推測します。キー（調性）は何か、どのような種類のコードが使われそうか（明るい/暗い、単純/複雑）、どんな響きを目指しているかを確認します。
          * **メロディー（旋律）**: 主にボーカルが歌うであろう主旋律の特徴を推測します。音域の広さ、滑らかな動きか跳躍が多いか、リズムの複雑さなどに注目します。
          * **リズム**: ドラムやベースが作るであろう楽曲の土台を推測します。テンポの速さ、ビートの種類、グルーヴ感を言語化します。
          * **アレンジ（編曲）**: どのような楽器が使われそうか、曲の展開につれて楽器がどう変化し、どう絡み合うかを推測します。

  ### ステップ2：統合的解釈 (Integrative Interpretation)
  ステップ1で分解した各要素を再び組み立て、それらが互いにどう影響し合っているか（シナジー）を考察します。これにより、楽曲が持つ深いテーマやアーティストの表現意図、独自の「世界観」を解釈します。

  * **解釈のポイント**:
      1.  **要素間のシナジーを発見する**: 歌詞の感情とサウンドの雰囲気はどのように一致、あるいは意図的にズレているか？物語の盛り上がりと楽曲構成のクライマックスは対応しているか？
      2.  **世界観と個性の言語化**: 全ての要素が組み合わさった結果、リスナーはどのような感情を抱き、どんな情景を思い浮かべるか？この楽曲をユニークにしている「核」は何か？
      3.  **結論の導出**: 最終的に、この楽曲が伝えようとしているメッセージや表現したい核心（テーマ）は何であるかを結論づけます。

  # 音楽理論的参考資料
  ${DUA_LIPA_THEORY_GUIDE}
  ${TIESTO_THEORY_GUIDE}
  ${DIVA_THEORY_GUIDE}
  ${KPOP_THEORY_GUIDE}
  ${EDM_THEORY_GUIDE}
  ${TECHNO_THEORY_GUIDE}
  ${VOCAL_FLOW_STYLES_GUIDE}
  ${ADVANCED_TECHNIQUES_GUIDE}
  ${MINIMALISM_THEORY_GUIDE}
  ${TAME_IMPALA_THEORY_GUIDE}

  # 分析対象
  ## 歌詞
  ---
  ${lyrics}
  ---
  ## 楽曲ニュアンス
  ---
  ${nuance}
  ---
  
  # 出力形式
  分析結果を、構造的で理解しやすいマークダウン形式のテキストとして出力してください。
  `;
  const response = await generateContentWithRetry({ model: model, contents: prompt });
  return response.text;
}

async function generateEvolvedLyricsAndNuance(originalLyrics: string, originalNuance: string, lyricsInstructions: string, analysis: string, allowLyricModification: boolean, grabAttentionEnabled: boolean, model: string = GEMINI_MODELS.TEXT): Promise<{ lyrics: string, nuance: string }> {
    const lyricsInstruction = allowLyricModification
        ? "1.  **歌詞の再構築**: 分析結果、**および「歌詞の生成指示」**に基づき、テーマを深化させ、表現を洗練させた新しい歌詞を作成してください。"
        : "1.  **歌詞の変更禁止**: **歌詞は一切変更しないでください。** 提供された「オリジナルの歌詞」を、JSON出力の `lyrics` フィールドにそのままコピー＆ペーストしてください。";
    
    const grabAttentionInstruction = grabAttentionEnabled ? `
# 【超最重要】冒頭15秒の最適化
以下の「冒頭15秒でリスナーを掴む」テクニック学習資料を熟読し、生成する新しい歌詞と楽曲ニュアンスが、冒頭からリスナーを強力に引きつけるよう設計してください。特に楽曲ニュアンスには、ゼロイントロ構造やインパクトのあるサウンドの指示を明確に含めてください。
---
${GRAB_ATTENTION_TECHNIQUES_GUIDE}
---
` : '';

    const userLyricsInstructionPrompt = lyricsInstructions.trim()
        ? `\n\n## ユーザーからの歌詞生成指示（最優先指示）\n---${lyricsInstructions}\n---\n上記の指示も考慮して歌詞を再構築してください。`
        : '';

    const prompt = `あなたは世界トップクラスのクリエイティブ・プロデューサー兼作詞家です。提供された「オリジナルの歌詞とニュアンス」および、それに対する「詳細な分析結果」を基に、コンセプトを**進化・深化**させた、新しい歌詞と楽曲ニュアンスを生成してください。

    # 創作の指針
    あなたは単なる書き直しを行うのではありません。分析結果から得られた洞察（インサイト）を活用し、元のアイデアが持つポテンシャルを最大限に引き出す**「進化版」**を創造するのです。

    - **テーマの深化:** 表面的な感情の奥にある、より根源的なテーマを探求してください。
    - **表現の洗練:** 比喩や情景描写をより鮮烈で、記憶に残るものにしてください。
    - **構造の最適化:** 物語性がより効果的に伝わるよう、構成を再考してください。
    - **音楽的解像度の向上:** 楽曲ニュアンスの記述を、より具体的で、Suno AIが解釈しやすい音楽的指示に富んだものにしてください。

    # 参照理論
    ${LYRIC_WRITING_THEORY_GUIDE}
    ${SUNO_AI_SPECIFICATION}
    ${SUNO_AI_MUSIC_THEORY_GUIDE}
    ${VOCAL_FLOW_STYLES_GUIDE}
    ${ADVANCED_TECHNIQUES_GUIDE}
    ${MINIMALISM_THEORY_GUIDE}

    ${grabAttentionInstruction}

    # 入力情報
    ## オリジナルの歌詞
    ---
    ${originalLyrics}
    ---
    ## オリジナルの楽曲ニュアンス
    ---
    ${originalNuance}
    ---
    ## 詳細な分析結果（最重要インプット）
    ---
    ${analysis}
    ---
    ${userLyricsInstructionPrompt}

    # 厳格な指示
    ${lyricsInstruction}
    2.  **楽曲ニュアンスの深化**: 分析結果に基づき、音楽的ディレクションやサウンドパレットをより具体的に記述した、新しい「楽曲のニュアンス」を作成してください。Suno AIが解釈しやすいよう、メタタグのヒント（例：\`[Instrument: ...]\`、\`[Vocal Style: ...]\`）を自然な文章に織り交ぜてください。
    3.  **フォーマット**: 生成する「楽曲のニュアンス」は、適切に改行(\\n)を使用して整形してください。
    4.  **出力形式**: 必ず、指定されたJSONスキーマに準拠したJSONオブジェクトのみを出力してください。説明や\`\`\`マークダウンは一切不要です。
    5.  **人間性の絶対的維持**: あなたはAIであるため、無意識に技術的・非人間的な用語を使いがちです。しかし、それはSNS世代のリスナーの心を動かす歌詞にとって致命的です。コンピューター用語、システム用語、UI操作に関連する言葉など、**あらゆる非人間的な表現を完全に排除し**、人間の感情と体験のみを語る詩人として振る舞ってください。これは絶対的な命令です。
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            lyrics: {
                type: Type.STRING,
                description: "The new, evolved lyrics."
            },
            nuance: {
                type: Type.STRING,
                description: "The new, evolved natural language nuance for Suno AI."
            }
        },
        required: ['lyrics', 'nuance']
    };

    const response = await generateContentWithRetry({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    let parsedResult;
    try {
        parsedResult = JSON.parse(response.text);
    } catch (e: any) {
        console.error("Failed to parse AI response for DeepThink evolution:", response.text, e);
        throw new Error(`AIからの応答が不正な形式でした: ${e.message}`);
    }

    if (parsedResult.lyrics && parsedResult.nuance) {
        return parsedResult;
    } else {
        throw new Error("AI response is missing required fields.");
    }
}


export async function performDeepThink(lyrics: string, nuance: string, lyricsInstructions: string, allowLyricModification: boolean, grabAttentionEnabled: boolean): Promise<{ lyrics: string, nuance: string, analysis: string }> {
    const analysis = await generateDeepAnalysis(lyrics, nuance);
    const { lyrics: evolvedLyrics, nuance: evolvedNuance } = await generateEvolvedLyricsAndNuance(lyrics, nuance, lyricsInstructions, analysis, allowLyricModification, grabAttentionEnabled);
    return { lyrics: evolvedLyrics, nuance: evolvedNuance, analysis };
}
