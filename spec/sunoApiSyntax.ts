export const SUNO_AI_SPECIFICATION = `
# Suno AI メタタグ構文仕様書

## 概要

Suno AIのメタタグは、AI音楽生成において楽曲の構造、スタイル、演奏内容を制御するための指示システムです。角括弧\`[ ]\`で囲まれたキーワードを使用して、AIに具体的な指示を与えます。

## バージョン対応

- **V5.0**: デュアルプロンプト対応、高精度音質、関連づけ型指示推奨
- **現在**: V5.0が最新（2025年10月時点）

## 基本ルール

### 使用方法
- **カスタムモード**でのみ有効
- 角括弧\`[タグ名]\`の形式で記述
- 複数タグの組み合わせ可能

### V5での記述位置
- **Style Box**: ジャンル、ムード、楽器の大まかな指定
- **Lyrics Box**: 構造タグ、動的指示、歌詞の詳細制御

## メタタグ分類

### 1. 楽曲構造タグ

| タグ | 用途 |
|------|------|
| \`[Intro]\` | イントロ部分 |
| \`[Verse]\`, \`[Verse 1]\`, \`[Verse 2]\` | ヴァース部分 |
| \`[Pre-Chorus]\` | プレコーラス |
| \`[Chorus]\` | コーラス（サビ） |
| \`[Bridge]\` | ブリッジ |
| \`[Break]\` | ブレイク |
| \`[Hook]\` | フック |
| \`[Outro]\` | アウトロ |
| \`[Fade Out]\` | フェードアウト |
| \`[Instrumental]\` | インストゥルメンタル |

### 2. 感情・エネルギータグ

| タグ | 効果 |
|------|------|
| \`[Mood: Uplifting]\` | 高揚感 |
| \`[Mood: Melancholic]\` | 憂鬱 |
| \`[Mood: Intense]\` | 激しい |
| \`[Mood: Dreamy]\` | 夢想的 |
| \`[Mood: Dark]\` | 暗い |
| \`[Energy: High]\` | 高エネルギー |
| \`[Energy: Low]\` | 低エネルギー |
| \`[Energy: Medium]\` | 中程度 |
| \`[Tempo: Fast]\` | 速いテンポ |
| \`[Tempo: Slow]\` | 遅いテンポ |
| \`[Tempo: Moderate]\` | 中程度のテンポ |

### 3. ジャンル・スタイルタグ

#### 主要ジャンル
| タグ | ジャンル |
|------|---------|
| \`[Genre: Pop]\` | ポップ |
| \`[Genre: Rock]\` | ロック |
| \`[Genre: Jazz]\` | ジャズ |
| \`[Genre: Hip Hop]\` | ヒップホップ |
| \`[Genre: Electronic]\` | エレクトロニック |
| \`[Genre: Classical]\` | クラシック |
| \`[Genre: Country]\` | カントリー |
| \`[Genre: R&B]\` | R&B |
| \`[Genre: Folk]\` | フォーク |
| \`[Genre: Blues]\` | ブルース |
| \`[Genre: Reggae]\` | レゲエ |
| \`[Genre: Latin]\` | ラテン |

#### サブジャンル
| タグ | サブジャンル |
|------|-------------|
| \`[Alternative Rock]\` | オルタナティブロック |
| \`[Indie Pop]\` | インディーポップ |
| \`[Heavy Metal]\` | ヘビーメタル |
| \`[Ambient]\` | アンビエント |
| \`[Boom Bap]\` | ブームバップ |
| \`[EDM]\` | EDM |
| \`[K-pop]\` | K-ポップ |
| \`[J-pop]\` | J-ポップ |
| \`[House]\` | ハウス |
| \`[Techno]\` | テクノ |
| \`[Trap]\` | トラップ |
| \`[Lofi]\` | ローファイ |

### 4. 楽器指定タグ

#### 基本楽器
| タグ | 楽器 |
|------|------|
| \`[Instrument: Piano]\` | ピアノ |
| \`[Instrument: Guitar]\` | ギター |
| \`[Instrument: Electric Guitar]\` | エレキギター |
| \`[Instrument: Acoustic Guitar]\` | アコースティックギター |
| \`[Instrument: Bass]\` | ベース |
| \`[Instrument: Drums]\` | ドラム |
| \`[Instrument: Strings]\` | ストリングス |
| \`[Instrument: Synthesizer]\` | シンセサイザー |
| \`[Instrument: Saxophone]\` | サックス |
| \`[Instrument: Trumpet]\` | トランペット |
| \`[Instrument: Violin]\` | バイオリン |
| \`[Instrument: Cello]\` | チェロ |

#### 楽器ソロ
| タグ | ソロ楽器 |
|------|----------|
| \`[Guitar Solo]\` | ギターソロ |
| \`[Piano Solo]\` | ピアノソロ |
| \`[Drum Solo]\` | ドラムソロ |
| \`[Bass Solo]\` | ベースソロ |
| \`[Sax Solo]\` | サックスソロ |

### 5. ボーカルタグ

#### ボーカルスタイル
| タグ | スタイル |
|------|----------|
| \`[Vocal Style: Choir]\` | 合唱 |
| \`[Vocal Style: Opera]\` | オペラ調 |
| \`[Vocal Style: Rap]\` | ラップ |
| \`[Vocal Style: Whisper]\` | ささやき声 |
| \`[Vocal Style: Powerful]\` | 力強い |
| \`[Vocal Style: Smooth]\` | スムーズ |
| \`[Vocal Style: Rough]\` | ラフ |
| \`[Vocal Style: Melodic]\` | メロディック |

#### ボーカル性別・特性
| タグ | 特性 |
|------|------|
| \`[Male Vocal]\` | 男性ボーカル |
| \`[Female Vocal]\` | 女性ボーカル |
| \`[Child Vocal]\` | 子供の声 |
| \`[Deep Voice]\` | 低い声 |
| \`[High Voice]\` | 高い声 |
| \`[Falsetto]\` | ファルセット |
| \`[Vibrato]\` | ビブラート |

#### ボーカルエフェクト
| タグ | エフェクト |
|------|-----------|
| \`[Vocal Effect: Reverb]\` | リバーブ |
| \`[Vocal Effect: Auto-tune]\` | オートチューン |
| \`[Vocal Effect: Distortion]\` | ディストーション |
| \`[Vocal Effect: Delay]\` | ディレイ |
| \`[Harmonies]\` | ハーモニー |
| \`[Background Vocals]\` | バックグラウンドボーカル |

### 6. 特殊記法

#### 効果音・環境音
| 記法 | 効果音 |
|------|--------|
| \`*applause*\` | 拍手 |
| \`*rain*\` | 雨音 |
| \`*footsteps*\` | 足音 |
| \`*guitar screech*\` | ギター音 |
| \`*piano slam*\` | ピアノ音 |
| \`*scream*\` | 叫び声 |
| \`*laughter*\` | 笑い声 |
| \`*sigh*\` | ため息 |

#### 歌詞内発音指示
| 記法 | 効果 |
|------|------|
| \`Loooove\` | 母音延長 |
| \`L-O-V-E\` | 区切り記号 |
| \`Hey hey hey\` | 繰り返し |

#### 時間指定（V5新機能）
| 記法 | 指定内容 |
|------|----------|
| \`[Section: 8s]\` | セクション時間 |
| \`[BPM: 120]\` | テンポ指定 |
| \`[Key: C]\` | キー指定 |

### 7. 複合タグ（V5推奨）

#### 関連づけ型楽器指示
例: [Instruments: Slap bass lead, precise math-funk guitar, soulful brass fanfares, driving 16-beat drum groove]

#### 関連づけ型ボーカル指示
例: [Vocal: Female high voice delivering emotional dynamics — whisper verses rising into powerful falsetto choruses]

#### 複合ムード指示
例: [Mood: Melancholic but hopeful, dark verses building to bright choruses]

## 使用上の注意

### 効果的な組み合わせ
- 構造タグ + 楽器タグ: \`[Verse] [Guitar Solo]\`
- ムードタグ + ボーカルタグ: \`[Mood: Intense] [Powerful Vocal]\`
- ジャンルタグ + テンポタグ: \`[Hip Hop] [Tempo: Fast]\`

### 避けるべき組み合わせ
- 矛盾するムード: \`[Mood: Happy] [Mood: Sad]\`
- 矛盾するテンポ: \`[Tempo: Fast] [Tempo: Slow]\`
- 過度なタグ使用: 一度に10個以上のタグ

### V5での最適化
- **Style Box**: ジャンル、ムード、楽器の大まかな指定
- **Lyrics Box**: 構造タグ、動的指示、歌詞の詳細制御
- **統合記述**: 関連性のあるタグは一文で表現する

## 基本構文例

### シンプルな構造
例:
[Verse]
歌詞の内容...

[Chorus]
サビの歌詞...

### ジャンル指定
例:
[Genre: Pop] [Energy: High]
[Female Vocal] [Upbeat]

### 楽器指定
例:
[Intro: Piano only]
[Verse: Add drums and bass]
[Chorus: Full band arrangement]

この仕様書に従ってメタタグを使用することで、Suno AIの機能を最大限に活用した高品質な楽曲生成が可能になります。
`;