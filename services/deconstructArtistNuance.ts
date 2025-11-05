
import { GEMINI_MODELS } from './config';
import { generateContentWithRetry } from './geminiUtils';
// FIX: Import missing genre theory guides
import { DUA_LIPA_THEORY_GUIDE } from "../guides/genre/duaLipa";
import { KPOP_THEORY_GUIDE } from "../guides/genre/kpop";
import { TIESTO_THEORY_GUIDE } from "../guides/genre/tiesto";
import { DIVA_THEORY_GUIDE } from "../guides/genre/diva";
import { EDM_THEORY_GUIDE } from "../guides/genre/edm";
import { TECHNO_THEORY_GUIDE } from "../guides/genre/techno";
import { DISCLOSURE_THEORY_GUIDE } from "../guides/genre/disclosure";
import { THE_XX_THEORY_GUIDE } from "../guides/genre/the_xx";
import { TAME_IMPALA_THEORY_GUIDE } from '../guides/genre/tameImpala';

// Comprehensive list of keywords that might trigger deconstruction
const artistKeywords = [
    'Dua Lipa', 'K-POP', 'Tiësto', 'Diva', 'Amy Winehouse', 'Adele', 'Michelle Branch', 
    'Avicii', 'Swedish House Mafia', 'Hardwell', 'Martin Garrix', 'Skrillex', 'Chainsmokers', 
    'Marshmello', 'Tiesto', 'ずとまよ', 'Zutomayo', 'ゲスの極み乙女', 'King Gnu', 'Vaundy', 
    'Creepy Nuts', 'YOASOBI', 'Metallica', 'Tool', 'Limp Bizkit', 'Slipknot', 'Nine Inch Nails', 
    'Daft Punk', 'Reich', 'Katy Perry', '宇多田ヒカル', 'Ricardo Villabolos', 'Luciano', 'Jonsi',
    'Santana', 'Disclosure', 'The xx', 'Tame Impala', 'Kevin Parker'
];

export async function deconstructArtistNuance(nuance: string, model: string = GEMINI_MODELS.TEXT): Promise<string> {
    const containsArtist = artistKeywords.some(keyword => 
        // Case-insensitive check
        nuance.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!containsArtist) {
        return nuance;
    }

    const prompt = `あなたは世界トップクラスの音楽評論家であり、クリエイティブライターです。あなたの任務は、提供された楽曲のコンセプト説明（ニュアンス）を分析し、**特定のアーティスト名、バンド名、曲名を一切使わずに**、その音楽的・感情的なエッセンスを保持、あるいはさらに強調した新しい説明文に書き換えることです。

# コンテキスト
この出力は、AI音楽生成ツール（Suno AI）の「Style」プロンプトで使用されます。AIは、著作権の問題や安易な模倣につながる可能性のある特定のアーティスト名にバイアスされることなく、音楽的な特徴を理解する必要があります。

# 指示
1.  提供された「オリジナルのニュアンス」を分析します。
2.  アーティスト、バンド、曲の固有名詞（例：「Dua Lipa」「ずとまよ」「One Last Kiss」）を特定します。
3.  あなたの深い音楽知識と、提供された参考資料に基づき、言及されたアーティスト/曲のスタイルを、その根源的な音楽的特徴（ジャンルの融合、楽器編成、リズム、ハーモニー、ボーカルスタイル、プロダクション技術、全体的なムード）に分解します。
4.  元の名前を使わずに、そのエッセンスを捉えた、喚情的で新しい説明文に書き換えます。
5.  **出力は、書き換え後のテキストのみ**とします。説明、前置き、マークダウンは一切含めないでください。

# 音楽理論的参考資料 (アーティストスタイルの分解に活用してください)
---
${DISCLOSURE_THEORY_GUIDE}
${THE_XX_THEORY_GUIDE}
${TAME_IMPALA_THEORY_GUIDE}
${DUA_LIPA_THEORY_GUIDE}
${TIESTO_THEORY_GUIDE}
${DIVA_THEORY_GUIDE}
${KPOP_THEORY_GUIDE}
${EDM_THEORY_GUIDE}
${TECHNO_THEORY_GUIDE}
---

# 思考プロセス例
- **オリジナル:** 「Dua Lipaのような、ニューディスコとパワフルで自信に満ちた女性ボーカルを組み合わせたトラック。」
- **分解:** Dua Lipa = ニューディスコ、ファンク風ベース、自信、カリスマ、ハスキーなアルト、洗練されたプロダクション。
- **書き換え後:** 「モダンなニューディスコのグルーヴと、ファンクに影響されたベースラインを融合させたトラック。自信に満ちたカリスマ的な女性ボーカルが特徴で、豊かで少しハスキーなアルトの声質が、クールで力強い態度を表現する。全体は洗練され、パンチの効いたプロダクションで仕上げる。」

- **オリジナル:** 「ずとまよサウンドの核は、ピアノ、ベース、ドラムが一体となって疾走するアンサンブル。」
- **分解:** ずとまよ = テクニカルなピアノ、メロディックなベース、複雑なドラム、疾走感、アートロック、ジャズハーモニー。
- **書き換え後:** 「テクニカルなピアノ、メロディックで攻撃的なベースライン、そして複雑なドラムが一体となって前進する、エネルギーの奔流のようなアンサンブル。サウンドはアートロックとジャズハーモニーが密に融合し、スリリングで緻密な緊迫感を生み出す。」

# 処理対象のオリジナルニュアンス
---
${nuance}
---
`;

    const response = await generateContentWithRetry({
        model: model,
        contents: prompt,
    });

    return response.text.trim();
}
