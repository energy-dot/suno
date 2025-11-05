// FIX: The 'Section' type was incorrectly imported from './App'. It has been defined and exported here to resolve import errors across the application.
export interface Section {
  id: number;
  type: string;
  lyrics: string;
  energy: string;
  key?: string;
  modulation: string;
  timeSignature: string;
  rhythmPattern: string;
  instruments: string[];
  instrumentDetails: { [key: string]: string };
  vocals: {
    style: string[];
    gender: string[];
    effect: string[];
  };
  soundEffects: string[];
  advancedDescription: string;
  useMetaObject: boolean;
}



export type Mode = 'quick' | 'detailed' | 'advanced';

export interface Theme {
  category: string;
  subcategory:string;
  subthemes: string[];
  weight: number;
}

export interface Hook {
  type: string;
  label: string;
  priority: number;
}

export interface EmotionArc {
  calm: number;
  build: number;
  burst: number;
  reflect: number;
}

export interface Lexicons {
  brightness: string[];
  darkness: string[];
  motion: string[];
  space: string[];
}

export interface Rhyme {
  end: boolean;
  internal: boolean;
  alliteration: boolean;
  assonance: boolean;
  multisyllabic: boolean;
}

export interface Constraints {
  avoid_cliches: boolean;
  ban_words: string;
}

export interface OutputSpec {
  ja_kana_ratio: number;
  add_furigana: boolean;
  add_romaji: boolean;
}

export interface LyricsPromptData {
  nuance: string;
  language: 'ja' | 'en' | 'ja_en';
  tone: 'poetic' | 'colloquial' | 'rap' | 'lyrical';
  pov: 'I' | 'You' | 'We' | 'I_vs_Me' | 'Third' | '';
  tense: 'present' | 'past' | 'flashback' | 'mixed' | '';
  length: 'short' | 'standard' | 'long';
  themes: Theme[];
  sections: string[];
  hooks: Hook[];
  emotion_arc: EmotionArc;
  lexicons: Lexicons;
  syllable_density: 'low' | 'medium' | 'high';
  rhyme: Rhyme;
  constraints: Constraints;
  output_spec: OutputSpec;
}

// FIX: Add missing type definitions to resolve numerous import errors.
export interface MetaData {
    moods: string[];
    groupedGenres: { category: string; genres: string[] }[];
    subGenres: { [key: string]: string[] };
    instruments: string[];
    instrumentTechniques: { [key: string]: string[] };
    vocalStyles: string[];
    vocalGenders: string[];
    vocalEffects: string[];
    soundEffects: string[];
    productionMixes: string[];
    keys: string[];
    timeSignatures: string[];
    rhythmPatterns: string[];
    modulations: string[];
    structureTypes: string[];
    energyLevels: string[];
    zutomayoPresets: { [key: string]: string[] };
    gesuPresets: { [key: string]: string[] };
    byoshinInstrumentDetails: { [key: string]: string[] };
    raskaVirtuosoTechniques: { [key: string]: string[] };
    songVocalPresets: { [key: string]: { [key: string]: string } };
    CODE_PROGRESSION_PATTERNS: { [key: string]: { name: string; progression: string[]; description: string }[] };
    CHORD_TYPES: { [key: string]: string[] };
    TEMPO_RANGES: { [key: string]: string[] };
}
  
export interface Concept {
    mainGenres: string[];
    subGenres: string[];
    moods: string[];
    key: string;
    tempo: number;
    timeSignature: string;
    rhythmPattern: string;
    productionMixes: string[];
    vocalStyles: string[];
    vocalGenders: string[];
    naturalLanguageNuance: string;
    artistPresets: string[];
    artistPreset?: string;
    advancedArrangement: {
        [key: string]: boolean;
        multilayer: boolean;
        experimentalStructure: boolean;
        complexRhythm: boolean;
        jazzHarmony: boolean;
    };
    nuanceAmplifiers: {
        [key: string]: boolean;
        amplifyEmotion: boolean;
        emphasizeUniqueness: boolean;
        deepenNarrative: boolean;
        visualizeScenery: boolean;
    };
}

export interface VisualStoryboard {
  overall: string;
  scenes: {
    sectionId: string;
    description: string;
  }[];
}
  
export interface AppData {
    rawLyrics: string;
    concept: Concept;
    sections: Section[];
    songExplanation?: string;
    visualStoryboard?: VisualStoryboard;
}
  
export interface HistoryItem {
    id: string;
    name: string;
    timestamp: number;
    mode: 'individual' | 'batch';
    data: AppData;
    results: {
        presetName: string;
        stylePrompt: string;
        lyricsPrompt: string;
        excludeStyles: { keywords: string, explanation: string } | null;
    }[];
}
  
export interface VisualResult {
    id: string;
    imagePrompt: string;
    imageBase64: string;
}
  
// Types for Lyrics Prompt Studio
export type LyricsStudioMode = 'quick' | 'detailed' | 'advanced';

export type LiteraryStyle = 'poetic' | 'colloquial' | 'monologic' | 'narrative' | 'abstract' | 'minimalist';
export type EmotionalAttitude = 'introspective' | 'passionate' | 'restrained' | 'optimistic' | 'pessimistic' | 'sarcastic' | 'cynical';
export type MusicalStyle = 'rap' | 'lyrical' | 'spoken_word';

export interface LyricsTones {
  literaryStyle: LiteraryStyle;
  emotionalAttitude: EmotionalAttitude;
  musicalStyle: MusicalStyle;
}


export interface LyricsTheme {
  category: string;
  subcategory: string;
  subthemes: string[];
  weight: number;
}

export interface LyricsHook {
  type: string;
  label: string;
  priority: number;
}

export interface LyricsEmotionArc {
  calm: number;
  build: number;
  burst: number;
  reflect: number;
}

export interface LyricsLexicons {
  brightness: string[];
  darkness: string[];
  motion: string[];
  space: string[];
}

export interface LyricsRhyme {
  end: boolean;
  internal: boolean;
  alliteration: boolean;
  assonance: boolean;
  multisyllabic: boolean;
}

export interface LyricsConstraints {
  avoid_cliches: boolean;
  ban_words: string;
}

export interface LyricsOutputSpec {
  ja_kana_ratio: number;
  add_furigana: boolean;
  add_romaji: boolean;
}

export interface LyricsPromptStudioData {
  nuance: string;
  language: 'ja' | 'en' | 'ja_en';
  tone: LyricsTones;
  persona: string;
  target: string;
  genre: string;
  pov: 'I' | 'You' | 'We' | 'I_vs_Me' | 'Third' | '';
  tense: 'present' | 'past' | 'flashback' | 'mixed' | '';
  length: 'short' | 'standard' | 'long';
  themes: LyricsTheme[];
  sections: string[];
  hooks: LyricsHook[];
  emotion_arc: LyricsEmotionArc;
  lexicons: LyricsLexicons;
  syllable_density: 'low' | 'medium' | 'high';
  rhyme: LyricsRhyme;
  constraints: LyricsConstraints;
  output_spec: LyricsOutputSpec;
}