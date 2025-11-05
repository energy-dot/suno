
export interface VocalFlowPreset {
  id: string;
  name: string;
  description: string;
  basePrompt: string;
}

export const vocalFlowPresets: VocalFlowPreset[] = [
  {
    id: 'breathless',
    name: 'Breathless Legato Flow',
    description: '息継ぎを最小限に、流れるように歌い続ける緊張感のあるスタイル。',
    basePrompt: `Minimal Trap with K-Hip-Hop influence. Near-breathless male vocals with seamless legato flow, smooth melodic rap phrasing, minimal pauses between phrases, continuous forward motion. Cool and restrained emotional tone. Modern clean mix with heavy sub bass and crisp hi-hats.`
  },
  {
    id: 'staccato',
    name: 'Staccato Sync Flow',
    description: '音節を切ってビートに精密同期する高速ラップスタイル。',
    basePrompt: `Aggressive Hip-Hop with Electro Trap production. Fast staccato vocal delivery tightly locked to the beat, every syllable hitting like a percussion element. Rhythmic sync precision, confident and assertive tone, crisp consonant articulation. Modern K-pop production polish with punchy drums.`
  },
  {
    id: 'whisper',
    name: 'Whisper Flow',
    description: '囁き・息遣い主体のASMR的親密ボーカル。',
    basePrompt: `Dreamy R&B with Minimal Trap elements. Intimate ASMR-style whisper vocals, close-mic'd recording technique, breathy tone with audible breath between lines, subtle delay and reverb for depth. Focus on vocal texture and proximity. Soft dynamics with modern stereo width.`
  },
  {
    id: 'swell',
    name: 'Dynamic Swell Flow',
    description: '声量・テンションを波のように変化させるダイナミックスタイル。',
    basePrompt: `Melodic Pop with R&B elements. Dynamic vocal swells with intensity rising and falling naturally like ocean waves. Soft falsetto transitioning to powerful belting within single phrases. Smooth emotional arc with cinematic dynamics and high contrast mixing. Expressive and emotional delivery.`
  },
  {
    id: 'melismatic',
    name: 'Melismatic Glide Flow',
    description: '1音節を滑らかに複数の音に伸ばすR&B・Trap Soulスタイル。',
    basePrompt: `R&B Trap Soul style. Smooth melismatic vocal runs with seamless glides, sliding between notes within single syllables. Expressive falsetto delivery with natural vibrato, lush vocal harmonies layered throughout. Soulful and warm vocal tone with emotional depth.`
  }
];
