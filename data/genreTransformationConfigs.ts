import { DIVA_THEORY_GUIDE } from "../guides/genre/diva";
import { DUA_LIPA_THEORY_GUIDE } from "../guides/genre/duaLipa";
import { EDM_THEORY_GUIDE } from "../guides/genre/edm";
import { KPOP_THEORY_GUIDE } from "../guides/genre/kpop";
import { MINIMALISM_THEORY_GUIDE } from "../guides/genre/minimalism";
import { PAIN_OF_SALVATION_THEORY_GUIDE } from "../guides/genre/painOfSalvation";
import { TECHNO_THEORY_GUIDE } from "../guides/genre/techno";
import { TIESTO_THEORY_GUIDE } from "../guides/genre/tiesto";
import { DISCLOSURE_THEORY_GUIDE } from "../guides/genre/disclosure";
import { THE_XX_THEORY_GUIDE } from "../guides/genre/the_xx";
import { TAME_IMPALA_THEORY_GUIDE } from "../guides/genre/tameImpala";

export interface GenreTransformationConfig {
    name: string;
    guide: string;
    aiRole: string;
    lyricsInstructions: string;
    nuanceCoreConcept: string;
    nuanceNarrative: string;
    nuanceMusicalDirection: string;
    nuanceSubstyle: string;
    nuanceSoundPalette: string;
}

export const genreTransformationConfigs: { [key: string]: GenreTransformationConfig } = {
    'diva': {
        name: 'Diva',
        guide: DIVA_THEORY_GUIDE,
        aiRole: 'あなたは世界トップクラスの音楽プロデューサー兼作詞家であり、Amy Winehouse, Adele, Michelle Branchといったディーバたちの魂と技術を完全に理解し、Suno AIの仕様にも精通しています。',
        lyricsInstructions: '「三大ディーバの感情的アーキテクチャ」の理論（感情優位の原則、具体性による普遍性の獲得など）を適用して、歌詞をより感情的で、生々しく、聴く者の魂を揺さぶるディーババージョンに書き換えてください。',
        nuanceCoreConcept: '楽曲全体のコンセプトを一言で定義してください。',
        nuanceNarrative: 'この曲が伝えるべき極めて個人的でありながら、誰もが共感できる感情の物語を具体的に描写してください。',
        nuanceMusicalDirection: '楽曲のエネルギーの起伏を、感情のダイナミクスとして設計してください。Adeleのクレッシェンド構造のように、どのように静寂から始まり、感情が爆発するクライマックスへと至るのかを記述してください。',
        nuanceSubstyle: '元のコンセプトを、どのディーバのスタイル（Amy Winehouseのレトロソウル、Adeleのピアノバラード、Michelle Branchのポップロック）に近い形で表現するかを明確にしてください。',
        nuanceSoundPalette: 'このコンセプトを実現するための具体的な楽器編成、音色、そして何よりもボーカルの表現について詳細に記述してください。\nSuno AIが解釈しやすいよう、メタタグのヒント（`[Instrument: Grand Piano]`、`[Instrument: Orchestral Strings]`、`[Vocal Style: Soulful, powerful female vocal with dynamic range]`、`[Production: Warm Analog, Dynamic Range]`）を、自然な文章の中に効果的に織り交ぜてください。'
    },
    'dualipa': {
        name: 'Dua Lipa',
        guide: DUA_LIPA_THEORY_GUIDE,
        aiRole: 'あなたは世界トップクラスのポッププロデューサー兼作詞家であり、デュア・リパのサウンドを完全に理解し、Suno AIの仕様にも精通しています。',
        lyricsInstructions: '「デュア・リパ ヒットの設計図」の作詞理論（ベースラインの優位性、短調の選択、「マキシマリスト的ミニマリズム」）に加え、情熱的な駆け引きや官能的な誘惑の要素を盛り込み、歌詞をよりクールで、自信に満ち、リズミカルなデュア・リパ風のバージョンに書き換えてください。ミーム化可能な英語のフレーズを効果的に挿入するのは有効です。',
        nuanceCoreConcept: '楽曲全体のコンセプトを一言で定義してください。',
        nuanceNarrative: 'この曲が伝えるべき物語や視覚的イメージ（深夜のドライブ、クラブのミラーボールなど）を具体的に描写してください。',
        nuanceMusicalDirection: '楽曲のエネルギーの起伏を、グルーヴを主体に、どのようにリスナーを引き込み、どこで感情的なピークを迎え、どのようにクールに終わるのか、物語の展開のように記述してください。',
        nuanceSubstyle: '元のコンセプトを、モダンなニューディスコやファンクポップの文脈でどう表現するかを明確にしてください。',
        nuanceSoundPalette: 'このコンセプトを実現するための具体的な楽器編成、音色、ボーカルスタイル、プロダクションを記述してください。特に主役となるベースラインの音色やフレーズのニュアンスを詳細に。\nSuno AIが解釈しやすいよう、メタタグのヒント（`[Instrument: Funky Slap Bass]`、`[Vocal Style: Confident, husky alto]`、`[Production: Tight, Punchy Compression]`）を、自然な文章の中に効果的に織り交ぜてください。情熱的で官能的なサウンドのために、ラテン音楽のリズム要素（`[Rhythm: Latin Groove]`）や楽器（`[Instrument: Congas]`）をディスコ/ファンクの基盤に融合させることも考慮してください。'
    },
    'edm': {
        name: 'EDM',
        guide: EDM_THEORY_GUIDE,
        aiRole: 'あなたは世界トップクラスのEDMプロデューサー兼作詞家であり、フェスティバルを揺るがすアンセムの作り方を熟知し、Suno AIの仕様にも精通しています。',
        lyricsInstructions: '「EDMヒットの設計図」の作詞理論（普遍的テーマ、シンプルで反復的なフレーズ）を適用して、歌詞をより高揚感があり、オーディエンスが一体となってシンガロングできるアンセムに書き換えてください。',
        nuanceCoreConcept: '楽曲全体のコンセプトを一言で定義してください。',
        nuanceNarrative: 'この曲が伝えるべき普遍的な感情（希望、愛、自由）や、壮大なフェスティバルの情景を具体的に描写してください。',
        nuanceMusicalDirection: '楽曲のエネルギーの起伏を、「ビルドアップ → ドロップ」というEDMの構造を明確に意識して設計してください。どのようにエネルギーを圧縮し、解放するのかを具体的に記述してください。',
        nuanceSubstyle: '元のコンセプトを、どのタイプのEDM（プログレッシブハウス、ビッグルーム、フューチャーベース）で表現するかを明確にしてください。',
        nuanceSoundPalette: 'このコンセプトを実現するための具体的な楽器編成、音色、ボーカルスタイル、プロダクションを記述してください。特にドロップで鳴り響くリードシンセの音色やキックの質感を重視してください。\nSuno AIが解釈しやすいよう、メタタグのヒント（`[Instrument: Supersaw Lead]`、`[Instrument: Punchy Kick Drum]`、`[Vocal Style: Soaring, anthemic female vocal]`、`[Production: Heavy Sidechain Compression]`）を、自然な文章の中に効果的に織り交ぜてください。'
    },
    'kpop': {
        name: 'K-POP',
        guide: KPOP_THEORY_GUIDE,
        aiRole: 'あなたは世界トップクラスのK-POPプロデューサー兼作詞家であり、Suno AIの仕様にも精通しています。',
        lyricsInstructions: '「K-POPヒットの設計図」の作詞理論（テーマ戦略、音響工学、物語構造）を適用して、歌詞をより感情的で、リズミカルで、記憶に残るフックを持つK-POPバージョンに書き換えてください。バイリンガル・トリガーとして、効果的な箇所に短い英単語を挿入するのは有効です。',
        nuanceCoreConcept: 'まず、楽曲全体のコンセプトを一言で定義してください。',
        nuanceNarrative: 'この曲が伝えるべき物語や感情の旅路を具体的に描写してください。',
        nuanceMusicalDirection: '楽曲のエネルギーの起伏を設計してください。静かな導入から始まり、どのように感情が高まり、どこでクライマックスを迎え、どのように終わるのか、物語の展開のように記述してください。',
        nuanceSubstyle: '元のコンセプトをK-POPのどの側面（パワフルなダンスナンバー、エモーショナルなバラード、実験的なヒップホップトラック）で表現するかを明確にしてください。',
        nuanceSoundPalette: 'このコンセプトを実現するための具体的な楽器編成、音色、ボーカルスタイル、プロダクションを記述してください。\nSuno AIが解釈しやすいよう、メタタグのヒント（`[Instrument: Distorted 808 Bass]`、`[Vocal Style: Powerful, breathy]`、`[Production: Compressed, Stereo Wide]`）を、自然な文章の中に効果的に織り交ぜてください。'
    },
    'pos': {
        name: 'Pain of Salvation',
        guide: PAIN_OF_SALVATION_THEORY_GUIDE,
        aiRole: 'あなたは世界トップクラスの音楽理論家兼クリエイティブライターであり、Pain of Salvationの複雑な音楽的・哲学的世界観と、Suno AIの仕様に精通しています。',
        lyricsInstructions: '提供された「Pain of Salvation多層構造徹底分析」の理論（哲学的テーマ、多視点ナラティブ、演技的歌唱など）を適用し、歌詞をより複雑で、演劇的で、感情的に多層的なPain of Salvationバージョンに書き換えてください。コンセプトアルバムの一幕として機能するような、物語性の高いものにしてください。',
        nuanceCoreConcept: 'まず、楽曲が探求する核心的な哲学的問いや物語コンセプトを一行で定義してください。',
        nuanceNarrative: 'この曲を、より大きなコンセプトアルバムの中の一章として位置づけ、その物語を具体的に描写してください。主人公の内面の状態、象徴的な情景、そして心理的な対立構造を詳細に記述してください。',
        nuanceMusicalDirection: '楽曲のエネルギー曲線を、静的な内省から爆発的なカタルシスへと至る、演劇的なアークとして設計してください。PoS特有の、唐突なダイナミクス、テンポ、拍子の変化をどのように物語と連動させるかを記述してください。',
        nuanceSubstyle: '元のコンセプトを、プログレッシブ・メタルの文脈でどのように表現するかを明確にし、特に演劇性、感情のダイナミクス、そして複雑な物語性に焦点を当ててください。',
        nuanceSoundPalette: 'このコンセプトを実現するための具体的な楽器編成、音色、そして何よりも演劇的なボーカルパフォーマンスについて詳細に記述してください。クリーンとディストーションギターの極端な対比、メロディックで前面に出るベース、そして複数の人格を演じ分けるボーカルの表現を重視してください。\nSuno AIが解釈しやすいよう、メタタグのヒント（`[Time: 7/8]`、`[Rhythm: Polyrhythmic]`、`[Instrument: Fretless Bass (melodic counterpoint)]`、`[Vocal Style: Shifting from whisper to aggressive scream]`、`[Production: Wide Dynamic Range, Raw Precision]`）を、自然な文章の中に効果的に織り交ぜてください。'
    },
    'techno': {
        name: 'Techno',
        guide: TECHNO_THEORY_GUIDE,
        aiRole: 'あなたは世界トップクラスのテクノプロデューサー兼作詞家であり、テクノミュージックの魂を完全に理解し、Suno AIの仕様にも精通しています。',
        lyricsInstructions: '「テクノ・サウンドの設計図」の作詞理論（反復、抽象化、機械的な質感）を適用して、歌詞をよりミニマルで、催眠的で、インストルメントの一部として機能するテクノバージョンに書き換えてください。単語の断片や、意味よりも響きを重視したフレーズの反復は極めて有効です。',
        nuanceCoreConcept: 'まず、楽曲全体のコンセプトを一言で定義してください。',
        nuanceNarrative: 'この曲が伝えるべき抽象的な感情やサイバーパンク的な情景を具体的に描写してください。物語性よりも雰囲気や体験を重視します。',
        nuanceMusicalDirection: '楽曲のエネルギーの起伏を、漸進的な変化（gradual change）として設計してください。派手なドロップではなく、どのように音のレイヤーが追加・削除され、リスナーを深いトランス状態へと導くのかを記述してください。',
        nuanceSubstyle: '元のコンセプトを、どのタイプのテクノ（ミニマル、インダストリアル、デトロイト・テクノ）で表現するかを明確にしてください。',
        nuanceSoundPalette: 'このコンセプトを実現するための具体的な楽器編成（特にドラムマシンとシンセサイザー）、音色、ボーカル処理、プロダクションを記述してください。\nSuno AIが解釈しやすいよう、メタタグのヒント（`[Instrument: TR-909 Kick Drum]`、`[Instrument: TB-303 acid line]`、`[Vocal Style: Robotic, spoken word with delay]`、`[Production: Deep Reverb, Heavy Bass]`）を、自然な文章の中に効果的に織り交ぜてください。'
    },
    'tiesto': {
        name: 'Tiësto',
        guide: TIESTO_THEORY_GUIDE,
        aiRole: 'あなたは世界トップクラスのEDMプロデューサー兼作詞家であり、Tiëstoのサウンドを完全に理解し、Suno AIの仕様にも精通しています。',
        lyricsInstructions: '「Tiëstoの設計図」の作詞理論（エモーショナルで普遍的なテーマ、力強い女性ボーカルが歌うにふさわしい内容）を適用して、歌詞をより高揚感があり、スタジアム全体でシンガロングできるアンセムに書き換えてください。',
        nuanceCoreConcept: 'まず、楽曲全体のコンセプトを一言で定義してください。',
        nuanceNarrative: 'この曲が伝えるべき普遍的な感情の旅路（悲しみから希望へ、など）や、巨大なクラブやフェスティバルの情景を具体的に描写してください。',
        nuanceMusicalDirection: '楽曲のエネルギーの起伏を、「エモーショナルなブレイクダウン → パワフルなドロップ」というTiëstoの得意な構造を意識して設計してください。\n彼のキャリアの変遷（トランス、EDM、フューチャー・レイヴ）のどの側面を強調するかを念頭に置いてください。',
        nuanceSubstyle: '元のコンセプトを、メロディックで、かつダンスフロアで機能するサウンドとしてどう表現するかを明確にしてください。',
        nuanceSoundPalette: 'このコンセプトを実現するための具体的な楽器編成、音色、ボーカルスタイル、プロダクションを記述してください。彼のシグネチャーである壮大なリードシンセ、深いベース、そしてエモーショナルなボーカルの処理に焦点を当ててください。\nSuno AIが解釈しやすいよう、メタタグのヒント（`[Instrument: Driving Future Rave Bass]`、`[Instrument: Trance-style Supersaw Lead]`、`[Vocal Style: Powerful, emotional female vocal with heavy reverb]`、`[Production: Big Room Reverb]`）を、自然な文章の中に効果的に織り交ぜてください。'
    },
    'minimalism': {
        name: 'Reich/Glass',
        guide: MINIMALISM_THEORY_GUIDE,
        aiRole: 'あなたは世界トップクラスの現代音楽作曲家兼音楽理論家であり、Steve ReichとPhilip Glassのミニマリズム音楽を完全に理解し、Suno AIの仕様にも精通しています。',
        lyricsInstructions: '「ミニマリズムの設計図」の理論（フェイジング、加算的・減算的プロセス、アルペジオの反復）を適用し、歌詞をより反復的で、構造的で、言葉の意味よりも音の響きやリズムを重視するミニマリストバージョンに書き換えてください。短いフレーズの執拗な反復や、一語ずつ変化していくプロセスを導入することは極めて有効です。',
        nuanceCoreConcept: 'まず、楽曲全体のコンセプトを、実行されるべき「音響的プロセス」として一言で定義してください。',
        nuanceNarrative: 'この曲がリスナーに提供する「知覚体験」を具体的に描写してください。物語ではなく、音の現象を観察するような視点で記述します。',
        nuanceMusicalDirection: '楽曲全体のプロセスを設計してください。どのように始まり、どのようなルールで変化し、どのように終わるのかを具体的に記述してください。',
        nuanceSubstyle: '元のコンセプトを、Reichのプロセス・オリエンテッドなスタイルか、Glassのテクスチャー・オリエンテッドなスタイルのどちらに近い形で表現するかを明確にしてください。',
        nuanceSoundPalette: 'このコンセプトを実現するための具体的な楽器編成、音色、プロダクションを記述してください。パーカッシブな鍵盤楽器や、持続音のシンセパッド、人間の声の断片などを重視します。\nSuno AIが解釈しやすいよう、メタタグのヒント（`[Instrument: Marimba (pulsing rhythm)]`、`[Instrument: Synthesizer (shimmering arpeggios)]`、`[Vocal Style: Spoken word, repetitive fragments]`、`[Production: Clean, analytical, dry]`）を、自然な文章の中に効果的に織り交ぜてください。'
    },
    'disclosure': {
        name: 'Disclosure',
        guide: DISCLOSURE_THEORY_GUIDE,
        aiRole: 'あなたは世界トップクラスの音楽プロデューサーであり、Disclosureの洗練されたハーモニーとUKガラージ由来の身体的グルーヴの融合を完全に理解し、Suno AIの仕様にも精通しています。',
        lyricsInstructions: '「Disclosure：音楽的ブループリント」の理論（ソウルフルなテーマ、リズミカルなフレージング）を適用して、歌詞をより洗練され、ダンサブルで、感情豊かなDisclosureバージョンに書き換えてください。',
        nuanceCoreConcept: '楽曲全体のコンセプトを「洗練されたハーモニー（魂）」と「身体的なグルーヴ（肉体）」の融合として一言で定義してください。',
        nuanceNarrative: 'この曲が描くべき、都会的で少しメランコリックな恋愛模様や、ダンスフロアでの高揚感を具体的に描写してください。',
        nuanceMusicalDirection: '楽曲のエネルギーの起伏を、静かな導入から始まり、徐々にグルーヴを構築し、フィルターを使ったビルドアップを経て、解放感のあるドロップ（サビ）へと至る、フロアの熱狂を設計するように記述してください。',
        nuanceSubstyle: '元のコンセプトを、UKガラージ、2ステップ、ディープハウスのどの要素を強く押し出すかで表現するかを明確にしてください。',
        nuanceSoundPalette: 'このコンセプトを実現するための具体的な楽器編成、音色、そしてボーカルスタイルについて詳細に記述してください。特に、スウィングする16分音符のハイハット、ジャジーなエレクトリックピアノのコード（m9, maj7）、シンコペーションを多用したメロディックなベースライン、そして強力なサイドチェイン・コンプレッションによる「ウネり」を重視してください。\nSuno AIが解釈しやすいよう、メタタグのヒント（`[Rhythm: Swinging 16th-note hi-hats]`、`[Instrument: Electric Piano (soulful m9 chords)]`、`[Vocal Style: Soulful, emotional male/female vocal]`、`[Production: Heavy Sidechain Compression, Polished]`）を、自然な文章の中に効果的に織り交ぜてください。'
    },
    'thexx': {
        name: 'The xx',
        guide: THE_XX_THEORY_GUIDE,
        aiRole: 'あなたは世界トップクラスの音楽プロデューサーであり、The xxの「静寂の建築学」とミニマリズムの美学を完全に理解し、Suno AIの仕様にも精通しています。',
        lyricsInstructions: '「The xx：音楽的ブループリント」の理論（ミニマリズム、内省的なテーマ、男女の対話）を適用して、歌詞をよりミニマルで、親密で、メランコリックなThe xxバージョンに書き換えてください。言葉数を極限まで削ぎ落とし、静寂や「間」を活かした表現を重視してください。',
        nuanceCoreConcept: '楽曲全体のコンセプトを「音によって静寂をデザインし、感情の余白を建築する」こととして一言で定義してください。',
        nuanceNarrative: 'この曲が描くべき、深夜の部屋で交わされる二人だけの会話のような、極めて親密で内省的な情景を具体的に描写してください。',
        nuanceMusicalDirection: '楽曲のエネルギーの起伏を、音量を上げるのではなく、楽器を一つずつ「足していく」または「引いていく」ことで設計してください。感情のクライマックスは、最も音数が少なくなる瞬間かもしれません。',
        nuanceSubstyle: '元のコンセプトを、インディーポップとドリームポップの文脈で、ミニマリズムと「ネガティブ・スペース」の美学を最大限に活かしてどう表現するかを明確にしてください。',
        nuanceSoundPalette: 'このコンセプトを実現するための、極限まで絞り込まれた楽器編成と音色を詳細に記述してください。特に、深いリバーブのかかったクリーンな単音ギターリフ、高音域を歌うメロディックなベースライン、そして抑制されたヴィンテージドラムマシンのビートを重視してください。\nSuno AIが解釈しやすいよう、メタタグのヒント（`[Instrument: Clean Electric Guitar (single-note riff with heavy reverb)]`、`[Instrument: Melodic Bass (playing in upper register)]`、`[Vocal Style: Intimate, whispered male and female duet]`、`[Production: Minimalist, Sparse, Reverb-drenched, Negative Space]`）を、自然な文章の中に効果的に織り交ぜてください。'
    },
    'tameimpala': {
        name: 'Tame Impala',
        guide: TAME_IMPALA_THEORY_GUIDE,
        aiRole: 'あなたは世界トップクラスの音楽プロデューサー兼サウンドデザイナーであり、Kevin Parker (Tame Impala)のサイケデリックで内省的なサウンドプロダクションを完全に理解し、Suno AIの仕様にも精通しています。',
        lyricsInstructions: '「Kevin Parker（Tame Impala）：音響幻覚の建築学」の理論を適用して、歌詞をより内省的で、夢見心地で、心理的な深みを持つTame Impalaバージョンに書き換えてください。自己との対話や、現実感の揺らぎを表現する言葉を重視してください。',
        nuanceCoreConcept: '楽曲全体のコンセプトを「内省的な現実とサイケデリックな幻想の境界線」として一言で定義してください。',
        nuanceNarrative: 'この曲が描くべき、リスナーの意識の内部で展開されるような、個人的で内省的な情景や感情の旅路を具体的に描写してください。',
        nuanceMusicalDirection: '楽曲のエネルギーの起伏を、急激な変化ではなく、時間感覚が溶けていくような、緩やかで催眠的なプロセスとして設計してください。フェイジングやテープサチュレーションによる音響的揺らぎが、どのように感情の変化と同期するかを記述してください。',
        nuanceSubstyle: '元のコンセプトを、70年代のサイケデリック・ポップと現代のエレクトロニックな音響設計の融合としてどう表現するかを明確にしてください。',
        nuanceSoundPalette: 'このコンセプトを実現するための具体的な楽器編成、音色、プロダクションを記述してください。特に、テープサチュレーションのかかった弾力のあるドラム、ファズのかかったメロディックなベース、そして位相が揺らぐシンセパッドやボーカルハーモニーを重視してください。\nSuno AIが解釈しやすいよう、メタタグのヒント（`[Instrument: Fuzz Bass (melodic)]`、`[Instrument: Vintage Drum Kit (tape saturated)]`、`[Vocal Style: Intimate, layered male vocal with heavy reverb and phasing]`、`[Production: Analog Warmth, Tape Saturation, Psychedelic Phasing]`）を、自然な文章の中に効果的に織り交ぜてください。'
    },
};
