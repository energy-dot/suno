import { MetaData } from './types';

export const META_DATA: MetaData = {
  moods: [
    // Positive & Uplifting
    'Uplifting', 'Euphoric', 'Triumphant', 'Hopeful', 'Optimistic', 'Happy', 'Ecstatic', 'Radiant', 'Glorious', 'Celebratory',
    // Emotional & Reflective
    'Emotional', 'Reflective', 'Introspective', 'Contemplative', 'Sentimental', 'Passionate', 'Heartfelt', 'Tender', 'Vulnerable',
    // Melancholic & Nostalgic
    'Melancholic', 'Bittersweet', 'Nostalgic', 'Wistful', 'Yearning', 'Sad', 'Heartbreaking',
    // Calm & Atmospheric
    'Peaceful', 'Serene', 'Tranquil', 'Meditative', 'Spiritual', 'Dreamy', 'Ethereal', 'Floating', 'Immersive', 'Ambient',
    // Dark & Mysterious
    'Dark', 'Mysterious', 'Foreboding', 'Ominous', 'Haunting', 'Anxious', 'Tense', 'Dystopian', 'Apocalyptic', 'Nihilistic',
    // Intense & Energetic
    'Intense', 'Epic', 'Powerful', 'Cathartic', 'Driving', 'Propulsive', 'Aggressive', 'Frenetic', 'Turbulent', 'Chaotic', 'Urgent', 'Angry',
    // Groovy & Playful
    'Groovy', 'Funky', 'Playful', 'Sensual', 'Seductive', 'Lush', 'Pulsating', 'Hypnotic',
    // Thematic & Descriptive
    'Romantic', 'Cinematic', 'Industrial', 'Urban', 'Futuristic', 'Retro', 'Minimalist', 'Gritty', 'Raw', 'Primal', 'Sophisticated', 'Colorful',
    // Experimental & Complex
    'Experimental', 'Technical', 'Complex', 'Virtuosic', 'Unpredictable', 'Cerebral', 'Surreal', 'Abstract', 'Glitchy', 'Dissonant', 'Unsettling', 'Otherworldly', 'Psychedelic',
  ],
  groupedGenres: [
    {
      category: 'Heavy Metal',
      genres: ['Traditional Heavy Metal', 'Speed Metal', 'Thrash Metal', 'Death Metal', 'Black Metal', 'Doom Metal', 'Power Metal', 'Progressive Metal', 'Gothic Metal', 'Folk Metal', 'Industrial Metal', 'Alternative Metal', 'Extreme Metal']
    },
    {
      category: 'Punk Rock',
      genres: ['Proto-Punk', 'Hardcore Punk', 'Post-Hardcore', 'Pop Punk', 'Crust Punk', 'Anarcho Punk', 'Street Punk', 'Horror Punk', 'Garage Punk', 'Folk Punk', 'Grindcore', 'Digital Hardcore', 'Post-Punk', 'Riot Grrrl', 'Ska Punk', 'Christian Punk', 'Taqwacore', 'Art Punk']
    },
    {
      category: 'Alternative & Indie',
      genres: ['Grunge', 'Shoegaze', 'Indie Rock', 'Post-Rock', 'Noise Rock', 'Art Rock', 'Space Rock', 'Slowcore', 'Dream Pop', 'Industrial Rock', 'Stoner Rock', 'Garage Rock Revival', 'Post-Britpop', 'Emo Revival', 'Drone Rock', 'Chamber Pop', 'Lo-Fi', 'Queer Rock']
    },
    {
      category: 'Progressive & Experimental',
      genres: ['Classic Prog', 'Krautrock', 'Neo-Prog', 'Prog Metal', 'Psychedelic Prog', 'Experimental', 'Avant-Rock']
    },
    {
      category: 'Classic Rock, Blues & More',
      genres: ['Hard Rock', 'Classic Rock', 'Rockabilly', 'Garage Rock', 'New Wave', 'Celtic Rock', 'Christian Rock', 'Jam Rock', 'Electronic Rock', 'Fusion Rock', 'Funk Rock']
    },
    {
      category: 'Pop',
      genres: ['Traditional Pop', 'Dance Pop', 'Teen Pop', 'Alternative Pop', 'Country Pop', 'Latin Pop', 'R&B Pop', 'Power Pop', 'Schlager', 'J-Pop', 'K-POP', 'Sophisti-Pop', 'Novelty Pop', 'Christian Pop', 'Ambient Pop', 'Folk Pop', 'Psychedelic Pop', 'Glitch Pop', 'Trap Pop', 'Afro Pop', 'Reggae Pop', 'Future Pop']
    },
    {
      category: 'J-POP & K-POP',
      genres: ['J-POP', 'Anime Song', 'K-POP']
    },
    {
      category: 'Electronic Dance Music',
      genres: ['House', 'Techno', 'Breakbeat', 'Dubstep', 'Trap', 'Trance', 'Ambient', 'IDM', 'Synthwave', 'Downtempo', 'Trip Hop', 'UK Bass', 'Hardstyle', 'Bass Music', 'Phonk', 'Vaporwave']
    },
    {
      category: 'Hip-Hop',
      genres: ['Old School', 'East Coast', 'West Coast', 'South', 'Midwest', 'Alternative Hip-Hop', 'Electronic Hip-Hop', 'Pop Rap', 'Cloud Rap', 'Latin Hip-Hop', 'International Hip-Hop', 'Instrumental Hip-Hop', 'Horrorcore', 'Snap Rap', 'Christian Hip-Hop', 'Freestyle', 'Phonk']
    },
    {
      category: 'R&B, Soul & Funk',
      genres: ['Classic Soul', 'Contemporary R&B', 'Alternative R&B', 'Funk', 'Disco Funk', 'Gospel', 'Blues', 'Southern Soul', 'Reggae Soul', 'Afrobeat', 'Latin Soul', 'UK Soul', 'Electronic Soul', 'Indie Soul']
    },
    {
        category: 'Hybrid, World & Other',
        genres: ['Reggae', 'Country', 'World Electronic', 'New Age', 'AI-Generated']
    }
  ],
  subGenres: {
    // Heavy Metal
    'Traditional Heavy Metal': ['NWOBHM'],
    'Thrash Metal': ['Crossover Thrash', 'Technical Thrash'],
    'Death Metal': ['Old School Death Metal', 'Technical Death Metal', 'Brutal Death Metal', 'Melodic Death Metal', 'Progressive Death Metal', 'Atmospheric Death Metal'],
    'Black Metal': ['First Wave Black Metal', 'Norwegian Black Metal', 'Atmospheric Black Metal', 'Symphonic Black Metal', 'Depressive Black Metal', 'Post-Black Metal', 'War Metal'],
    'Doom Metal': ['Traditional Doom', 'Stoner Doom', 'Funeral Doom', 'Sludge Metal'],
    'Power Metal': ['European Power Metal', 'US Power Metal'],
    'Progressive Metal': ['Dream Theater School', 'Djent'],
    'Gothic Metal': ['Doom-Death'],
    'Folk Metal': ['Viking Metal'],
    'Industrial Metal': ['Cyber Metal'],
    'Alternative Metal': ['Nu Metal'],
    'Extreme Metal': ['Grindcore'],
    // Punk Rock
    'Proto-Punk': ['Classic Punk'],
    'Hardcore Punk': ['Straight Edge', 'Crossover Thrash'],
    'Post-Hardcore': ['Emo', 'Screamo', 'Mathcore'],
    'Pop Punk': ['Skate Punk', 'Easycore'],
    'Crust Punk': ['D-beat', 'Blackened Crust'],
    'Anarcho Punk': ['Peace Punk'],
    'Street Punk': ['Oi!'],
    'Horror Punk': ['Psychobilly'],
    'Garage Punk': ['Surf Punk'],
    'Folk Punk': ['Celtic Punk'],
    'Grindcore': ['Powerviolence'],
    'Digital Hardcore': ['Breakcore Punk'],
    'Post-Punk': ['New Wave', 'Gothic Rock', 'No Wave', 'Coldwave', 'Minimal Wave', 'Dark Wave'],
    'Riot Grrrl': ['Queercore'],
    'Ska Punk': ['Third Wave Ska'],
    'Christian Punk': ['Positive Hardcore'],
    'Taqwacore': ['Muslim Punk'],
    'Art Punk': ['Experimental Punk'],
    // Alternative & Indie
    'Grunge': ['Post-Grunge'],
    'Shoegaze': ['Nu-Gaze', 'Blackgaze'],
    'Indie Rock': ['Indie Pop', 'Math Rock'],
    'Post-Rock': ['Cinematic Post-Rock', 'Post-Metal'],
    'Noise Rock': ['Math Noise'],
    'Art Rock': ['Experimental Rock'],
    'Space Rock': ['Cosmic Rock'],
    'Slowcore': ['Sadcore'],
    'Dream Pop': ['Ethereal Wave', 'Chillwave'],
    'Industrial Rock': ['EBM Rock'],
    'Stoner Rock': ['Desert Rock'],
    'Garage Rock Revival': ['New Garage'],
    'Post-Britpop': ['New Acoustic Movement'],
    'Emo Revival': ['Midwest Emo'],
    'Drone Rock': ['Minimalist Rock'],
    'Chamber Pop': ['Baroque Pop'],
    'Lo-Fi': ['Bedroom Pop'],
    'Queer Rock': ['LGBTQ+ Rock'],
    // Progressive & Experimental
    'Classic Prog': ['Canterbury Scene'],
    'Krautrock': ['Motorik Rock'],
    'Neo-Prog': ['Modern Prog'],
    'Prog Metal': ['Technical Progressive'],
    'Psychedelic Prog': ['Space Prog'],
    'Experimental': ['Avant-Rock', 'Sound Art'],
    // Classic Rock, Blues & More
    'Hard Rock': ['Arena Rock', 'Blues Rock', 'Glam Rock'],
    'Classic Rock': ['Psychedelic Rock', 'Folk Rock', 'Surf Rock'],
    'Rockabilly': ['Psychobilly', 'Neo-Rockabilly'],
    'Garage Rock': ['Nuggets Era', 'Garage Punk'],
    'New Wave': ['Synth-pop', 'New Romantic', '2 Tone Ska'],
    'Celtic Rock': ['Folk Metal', 'Pagan Rock'],
    'Christian Rock': ['Worship Rock'],
    'Jam Rock': ['Improvisational Rock', 'Festival Rock'],
    'Electronic Rock': ['Synthwave Rock', 'Retrowave'],
    'Fusion Rock': ['Jazz Rock', 'Prog Fusion'],
    'Funk Rock': ['Rap Rock'],
    // Pop
    'Traditional Pop': ['Adult Contemporary', 'Easy Listening'],
    'Dance Pop': ['Disco', 'Eurodance', 'Electropop', 'House Pop'],
    'Teen Pop': ['Bubblegum Pop', 'Boy Band', 'Girl Group'],
    'Alternative Pop': ['Art Pop', 'Indie Pop', 'Dream Pop'],
    'Country Pop': ['Nashville Sound'],
    'Latin Pop': ['Latin Ballad', 'Reggaeton Pop'],
    'R&B Pop': ['Contemporary R&B', 'PBR&B'],
    'Power Pop': ['New Wave Pop'],
    'Schlager': ['Europop'],
    'J-Pop': ['City Pop', 'Shibuya-kei'],
    'K-POP': ['K-Pop Ballad', 'K-Pop Dance', 'K-Hip-Hop', 'K-R&B'],
    'Anime Song': ['Anisong Pop', 'Denpa Song', 'Character Song', 'Rock Anisong'],
    'Sophisti-Pop': ['Blue-Eyed Soul'],
    'Novelty Pop': ['Viral Pop'],
    'Christian Pop': ['Contemporary Christian'],
    'Ambient Pop': ['Atmospheric Pop'],
    'Folk Pop': ['Acoustic Pop'],
    'Psychedelic Pop': ['Neo-Psychedelia'],
    'Glitch Pop': ['IDM Pop'],
    'Trap Pop': ['Melodic Trap'],
    'Afro Pop': ['Afrobeats'],
    'Reggae Pop': ['Dancehall Pop'],
    'Future Pop': ['Cyberpop', 'Hyperpop'],
    // Electronic Dance Music
    'House': ['Chicago House', 'Acid House', 'Deep House', 'Tropical House', 'Tech House', 'Jackin House', 'Progressive House', 'Trance House'],
    'Techno': ['Detroit Techno', 'Minimal Techno', 'Hard Techno', 'Industrial Techno', 'Ambient Techno', 'Dub Techno'],
    'Breakbeat': ['Drum and Bass', 'Liquid DnB', 'Neurofunk', 'Jungle', 'Ragga Jungle', 'UK Garage', 'Future Garage'],
    'Dubstep': ['Brostep', 'Riddim', 'Future Bass', 'Melodic Dubstep'],
    'Trap': ['Festival Trap', 'Future Trap'],
    'Trance': ['Psytrance', 'Goa Trance', 'Uplifting Trance', 'Vocal Trance'],
    'Ambient': ['Dark Ambient', 'Drone'],
    'IDM': ['Glitch', 'Microsound'],
    'Synthwave': ['Outrun', 'Cyberpunk'],
    'Downtempo': ['Chillout', 'Lounge'],
    'Trip Hop': ['Bristol Sound', 'Illbient'],
    'UK Bass': ['Footwork', 'Juke'],
    'Hardstyle': ['Hardcore', 'Gabber'],
    'Bass Music': ['Riddim', 'Dubstep 2.0'],
    'Phonk': ['Memphis Phonk', 'Drift Phonk'],
    'Vaporwave': ['Future Funk', 'Mallsoft'],
    // Hip-Hop
    'Old School': ['Block Party', 'Turntablism'],
    'East Coast': ['Boom Bap', 'Jazz Rap', 'Hardcore Rap'],
    'West Coast': ['G-Funk', 'Hyphy', 'Gangsta Rap'],
    'South': ['Dirty South', 'Trap', 'Houston'],
    'Midwest': ['Chicago Drill'],
    'Alternative Hip-Hop': ['Conscious Rap', 'Abstract Hip-Hop'],
    'Electronic Hip-Hop': ['Electro Rap'],
    'Pop Rap': ['Commercial Hip-Hop'],
    'Cloud Rap': ['SoundCloud Rap', 'Emo Rap'],
    'Latin Hip-Hop': ['Reggaeton'],
    'International Hip-Hop': ['French Hip-Hop', 'UK Hip-Hop', 'German Hip-Hop', 'K-Hip-Hop'],
    'Instrumental Hip-Hop': ['Lo-Fi Hip-Hop'],
    'Horrorcore': ['Dark Rap'],
    'Snap Rap': ['Ringtone Rap'],
    'Christian Hip-Hop': ['Gospel Rap'],
    'Freestyle': ['Battle Rap'],
    // 'Phonk': ['Memphis Rap'], // Already defined under electronic
    // R&B, Soul & Funk
    'Classic Soul': ['Motown', 'Neo-Soul'],
    'Contemporary R&B': ['New Jack Swing', 'Quiet Storm'],
    'Alternative R&B': ['PBR&B', 'Experimental Soul'],
    'Funk': ['P-Funk', 'G-Funk'],
    'Disco Funk': ['Boogie'],
    'Gospel': ['Contemporary Gospel'],
    'Blues': ['Electric Blues'],
    'Southern Soul': ['Stax Sound'],
    'Reggae Soul': ['Lovers Rock'],
    'Afrobeat': ['Afro-Soul'],
    'Latin Soul': ['Salsa Soul'],
    'UK Soul': ['British Soul'],
    'Electronic Soul': ['Future R&B'],
    'Indie Soul': ['Bedroom Soul'],
     // Hybrid, World & Other
    'Reggae': ['Dancehall', 'Afrobeat Fusion'],
    'Country': ['Country Pop', 'Bro Country'],
    'World Electronic': ['Global Bass'],
    'New Age': ['Meditation Music'],
    'AI-Generated': ['Algorithm Music']
  },
  instruments: [
    'Piano', 'Acoustic Guitar', 'Electric Guitar', 'Bass', 'Drums', 'Strings', 'Synthesizer', 'Saxophone', 'Trumpet', 'Violin', 'Cello', 'Flute', 'Upright Bass', 'Synth Pads', '808 Bass', 'Organ',
    'Electric Piano', 'Rhodes', 'Wurlitzer', 'Hammond Organ', 'Mellotron', 'Analog Synth', 'Digital Synth', 'Lead Synth', 'Bass Synth', 'Vintage Synth', 'Modular Synth',
    'Brass Section', 'Horn Section', 'Trombone', 'French Horn', 'Clarinet', 'Oboe', 'Bassoon',
    'Drum Machine', 'Electronic Drums', 'Percussion', 'Tabla', 'Congas', 'Djembe', 'Vibraphone', 'Marimba', 'Xylophone',
    'Sitar', 'Koto', 'Didgeridoo', 'Hang Drum', 'Kalimba', 'Music Box', 'Glockenspiel',
    'Arpeggiator', 'Sequencer', 'Sampler', 'Vocoder', 'Talk Box',
    'Reese Bass', 'Moog Bass', 'Lush Pads', 'Vocal Chops', 'Pluck Synth'
  ],
  instrumentTechniques: {
    'Guitar': ['Fingerpicking', 'Tapping', 'Harmonics', 'Tremolo', 'Palm Muting', 'Slide', 'Bending', 'Arpeggios', 'Sweep Picking', 'Alternate Picking'],
    'Bass': ['Slapping', 'Popping', 'Walking', 'Chromatic', 'Fretless', 'Harmonics', 'Chords', 'Tapping'],
    'Drums': ['Shuffle', 'Linear', 'Polyrhythm', 'Ghost Notes', 'Flams', 'Rudiments', 'Blast Beats', 'Jazz Fills'],
    'Piano': ['Stride', 'Ragtime', 'Impressionist', 'Prepared Piano', 'Inside Piano', 'Clusters'],
    'Synth': ['Arpeggiated', 'Sequenced', 'Filtered', 'Modulated', 'Granular', 'FM', 'Wavetable'],
    'Strings': ['Pizzicato', 'Tremolo', 'Sul Ponticello', 'Col Legno', 'Harmonics', 'Glissando'],
    'Schism Bass': [
      'Complex 7/8 walking patterns',
      'Chromatic approach tones', 
      'Rhythmic displacement',
      'Polyrhythmic counterpoint'
    ],
    'Schism Drums': [
      '2+2+3 subdivision',
      'Linear polyrhythmic fills',
      'Ghost note complexity',
      'Metric modulation'
    ],
    'Schism Guitar': [
      'Palm-muted precision',
      'Odd-time arpeggios',
      'Mathematical intervals',
      'Rhythmic displacement'
    ]
  },
  vocalStyles: ['A cappella', 'Bright Vocals', 'Chant Vocals', 'Chest Voice', 'Choir', 'Choir Voices', 'Conversational', 'Dirty Vocals', 'Emotional', 'Emotional Vocals', 'Ethereal Vocals', 'Falsetto', 'Girl Group', 'Growl', 'Head Voice', 'Legato', 'Lounge Singer', 'Mechanical Singing', 'Melismatic', 'Mixed Voice', 'Opera', 'Powerful', 'Rap', 'Rap Battle', 'Raspy', 'Scat', 'Screaming', 'Soothing Vocals', 'Spoken', 'Sprechgesang', 'Staccato', 'Sultry Vocals', 'Sweet', 'Traditional Voice', 'Vibrato', 'Vibrato Vocals', 'Vintage Vocal', 'Vocoder Vocals', 'Whisper', 'smoky vocals', 'airy vocals', 'nasal vocals', 'warm vocals', 'velvety vocals', 'breathy vocals', 'close-mic vocals', 'intimate vocals', 'straight tone', 'gentle vibrato', 'subtle vibrato', 'soft delivery', 'hard attack', 'aggressive delivery'],
  vocalGenders: ['Male Vocal', 'Female Vocal', 'Child Vocal', 'boy Vocal', 'girl Vocal', 'Deep Voice', 'High Voice', 'Androgynous Voice', 'Alto', 'Soprano', 'Tenor', 'Bass', 'Baritone', 'twin Vocal', 'Duet Vocals', 'Male & Female Vocals', 'Vocaloid Vocal'],
  vocalEffects: ['Reverb', 'Auto-tune', 'Distortion', 'Harmonies', 'Layered Vocals', 'Vocal Chops', 'Delay', 'Chorus', 'Flanger', 'Phaser', 'Vocoder', 'Talk Box', 'Pitch Shift', 'Formant Shift'],
  soundEffects: ['birds chirping', 'rain', 'ocean waves', 'wind', 'fire crackling', 'applause', 'cheering', 'footsteps', 'bell dings', 'vinyl crackle', 'static', 'glitch', 'white noise', 'pink noise', 'tape hiss', 'record scratch', 'phone ring', 'clock ticking'],
  productionMixes: ['Stereo Wide', 'Mono', 'Heavy Bass', 'Crisp Highs', 'Compressed', 'Raw', 'Polished', 'Lo-Fi FX', '8-bit', 'Muffled', 'Vintage', 'Modern', 'Saturated', 'Clean', 'Gritty', 'Smooth', 'Mid-Range Focus', 'Bass Heavy', 'Precise Dynamics', 'Warm Analog', 'Intimate Close-Mic', 'Soft Compression', 'Bright Digital', 'Punchy Compression', 'Modern Clean', 'Balanced', 'Instrument Separation', 'Dynamic Range', 'Clean Jazz', 'Raw Precision', 'Instrument Focus', 'Dynamic Extremes', 'Analytical'],
  keys: ['C Major', 'C# Major', 'D Major', 'D# Major', 'E Major', 'F Major', 'F# Major', 'G Major', 'G# Major', 'A Major', 'A# Major', 'B Major', 'A Minor', 'A# Minor', 'B Minor', 'C Minor', 'C# Minor', 'D Minor', 'D# Minor', 'E Minor', 'F Minor', 'F# Minor', 'G Minor', 'G# Minor'],
  timeSignatures: ['4/4', '3/4', '2/4', '6/8', '9/8', '12/8', '5/4', '7/8', '5/8', '7/4', '3/8', '11/8', '13/8', 'Mixed Meter', 'Changing Time'],
  rhythmPatterns: ['Straight', 'Swing', 'Shuffle', 'Latin', 'Afro-Cuban', 'Samba', 'Bossa Nova', 'Reggae', 'Ska', 'Syncopated', 'Polyrhythm', 'Hemiola', 'Odd Time', 'Metric Modulation', 'Laid-back with subtle push-pull', 'Straight 8th with syncopated accents', 'Jazz fusion with accent displacement', 'Extreme metric modulation, 3+2+2 primary feel', 'Driving syncopated rhythm'],
  modulations: [
    'Stay in Key', 'modulate to relative major', 'modulate to relative minor', 
    'key change up semitone', 'key change up fifth', 'key change down fifth', 'modulate to parallel major', 'modulate to parallel minor',
    'circle of fifths', 'tritone substitution', 'modal interchange'
  ],
  structureTypes: ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Post-Chorus', 'Bridge', 'Guitar Solo', 'Piano Solo', 'Synth Solo', 'Break', 'Outro', 'Hook', 'Drop', 'Interlude', 'Instrumental Break', 'Vocal Break', 'Rhythm Break', 'False Ending', 'Coda'],
  energyLevels: ['Low', 'Medium', 'High', 'Very High', 'Building', 'Decreasing', 'Explosive', 'Subtle', 'Dynamic', 'Constant'],
  zutomayoPresets: {
    arrangement: [
      'Multi-layered synth pads with vintage warmth',
      'Lo-fi electronic textures with tape saturation',
      'Jazz-influenced chord progressions with 9th and 11th chords',
      'Subtle string arrangements in background',
      'Glitchy percussion elements',
      'Deep reverb-soaked atmospheres',
      'Analog synthesizer leads',
      'Electric piano with chorus effect'
    ],
    rhythm: [
      'Syncopated drum patterns',
      'Irregular kick placements',
      'Polyrhythmic elements',
      'Electronic and acoustic percussion blend',
      'Subtle tempo fluctuations'
    ],
    harmony: [
      'Extended jazz chords (9th, 11th, 13th)',
      'Modal interchange',
      'Chromatic voice leading',
      'Suspended chord resolutions',
      'Neo-soul progressions'
    ]
  },
  gesuPresets: {
    timeSignature: [
      'Frequent meter changes (7/8, 5/4, 3/4)',
      'Complex rhythmic patterns',
      'Asymmetrical phrase structures',
      'Metric modulation',
      'Polyrhythmic layering'
    ],
    arrangement: [
      'Intricate bass lines with walking patterns',
      'Jazz fusion drum complexity',
      'Contrapuntal melodic lines',
      'Experimental song structures',
      'Sudden dynamic shifts',
      'Technical instrumental virtuosity'
    ],
    harmony: [
      'Advanced jazz chord substitutions',
      'Quartal and quintal harmony',
      'Chromatic mediants',
      'Functional harmony with extensions',
      'Modal mixture and borrowed chords'
    ]
  },
  byoshinInstrumentDetails: {
    'Vintage Electric Piano': [
      'Rhodes-style warm tones',
      'Jazz 7th and 9th voicings', 
      'Subtle vibrato and chorus',
      'Tight syncopated groove',
      'Soft dynamic touch'
    ],
    'Lo-fi Drums': [
      'Brush-style snare texture',
      'Minimal kick pattern',
      'Ghost note heavy approach',
      'Vintage compression saturation',
      'Laid-back timing feel'
    ],
    'Warm Bass': [
      'Electric bass with round tone',
      'Root-focused simple lines',
      'Slight compression warmth',
      'Minimal melodic movement'
    ],
    'Atmospheric Pads': [
      'Analog synth string pads',
      'Warm sustained tones',
      'Subtle filter modulation',
      'Background harmonic support'
    ]
  },
  raskaVirtuosoTechniques: {
    'Mathematical Bass': [
      '7/8 walking patterns with chromatic sequences',
      'Metric displacement across bar lines',
      'Polyrhythmic independence from drums',
      'Instant time signature adaptation',
      'Complex harmonic progressions navigation'
    ],
    
    'Polyrhythmic Drums': [
      '3+2+2 subdivision mastery',
      'Linear fills across irregular meters',
      'Instant metric modulation execution',
      'Polyrhythmic limb independence',
      'Ghost note complexity in odd time'
    ],
    
    'Angular Piano': [
      'Extreme jazz voicings in 7/8',
      'Rhythmic displacement comping',
      'Chromatic harmonic movement',
      'Technical passage execution',
      'Experimental dissonance integration'
    ]
  },
  songVocalPresets: {
    'byoshinwoKamu': {
      primaryVocal: 'Female intimate melancholic',
      secondaryVocal: 'Emotional harmonies',
      breathingStyle: 'Natural emotional pauses',
      microphoneDistance: 'Close intimate recording',
      emotionalRange: 'Introspective to bittersweet peak',
      languageFlow: 'Natural Japanese with emotional inflection'
    },
    'crackerStyle': {
      primaryVocal: 'Female bright energetic pop',
      secondaryVocal: 'Colorful backing vocals',
      articulationStyle: 'Crisp modern pronunciation',
      energyLevel: 'High but controlled sophistication',
      emotionalRange: 'Playful optimism with dynamic contrast'
    },
    'parallelSpec': {
      primaryVocal: 'Male jazz-influenced technical',
      rhythmicComplexity: 'Syncopated phrasing mastery',
      jazzTechnique: 'Improvisation-style ornaments',
      grooveInteraction: 'Complex rhythmic interplay with band'
    },
    'raska': {
      primaryVocal: 'Male experimental virtuoso',
      timeSignatureMastery: '7/8 vocal phrasing adaptation',
      technicalRequirement: 'Extreme rhythmic precision',
      avantGardeExpression: 'Mathematical emotion fusion'
    }
  },
  CODE_PROGRESSION_PATTERNS: {
    'J-Pop/Rock': [
        { name: 'カノン進行', progression: ['C', 'G', 'Am', 'Em', 'F', 'C', 'F', 'G'], description: '王道、安定感のある進行' },
        { name: '王道進行', progression: ['F', 'G', 'Em', 'Am'], description: 'エモーショナルな定番' },
        { name: '小室進行', progression: ['Am', 'F', 'G', 'C'], description: 'ポップス定番' },
        { name: 'Just The Two of Us進行', progression: ['Fmaj7', 'E7', 'Am7', 'Gm7', 'C7'], description: 'ジャジーでおしゃれ' },
    ],
    '洋楽ポップス': [
        { name: 'Four Chords Song', progression: ['C', 'G', 'Am', 'F'], description: '最も多用される進行' },
        { name: '50s Progression', progression: ['C', 'Am', 'F', 'G'], description: 'クラシックロック' },
        { name: 'Sensitive Progression', progression: ['Am', 'G', 'C', 'F'], description: 'センチメンタル' },
        { name: 'Andalusian Cadence', progression: ['Am', 'G', 'F', 'E'], description: 'ドラマチック' },
    ],
    'ジャズ/ブルース': [
        { name: '2-5-1 (Major)', progression: ['Dm7', 'G7', 'Cmaj7'], description: 'ジャズの基本' },
        { name: '2-5-1 (Minor)', progression: ['Bm7b5', 'E7', 'Am7'], description: 'マイナーキーの基本' },
        { name: '12-Bar Blues', progression: ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'G7'], description: 'ブルースの定番' },
        { name: 'Rhythm Changes', progression: ['Cmaj7', 'Am7', 'Dm7', 'G7'], description: 'スウィングジャズ' },
    ],
    'エモ/ロック': [
        { name: 'Emotional Ballad', progression: ['Em', 'C', 'G', 'D'], description: 'エモーショナルなバラード' },
        { name: 'Classic Rock', progression: ['A', 'G', 'D'], description: 'クラシックロック' },
        { name: 'Punk Power', progression: ['C', 'F', 'G'], description: 'パワフルなパンク' },
        { name: 'Sad Acoustic', progression: ['Am', 'C', 'G', 'F'], description: 'アコースティック系' },
    ],
    'Progressive Metal': [
      { name: 'Schism Style', progression: ['Dm', 'F', 'C', 'Bb', 'F', 'C'], description: 'Tool "Schism"風のダークで内省的な進行' }
    ]
  },
  CHORD_TYPES: {
    'メジャーコード': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    'マイナーコード': ['Am', 'Bm', 'Cm', 'Dm', 'Em', 'Fm', 'Gm'],
    'セブンスコード': ['C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7', 'Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7', 'Am7', 'Bm7', 'Cm7', 'Dm7', 'Em7', 'Fm7', 'Gm7'],
    'サスペンデッド': ['Csus4', 'Dsus4', 'Esus4', 'Fsus4', 'Gsus4', 'Asus4', 'Bsus4', 'Csus2', 'Dsus2', 'Esus2', 'Fsus2', 'Gsus2', 'Asus2', 'Bsus2'],
    'エクステンデッド': ['C9', 'Cm9', 'Cmaj9', 'C11', 'Cm11', 'C13', 'Cadd9', 'Cadd11'],
    'オルタード': ['Cdim', 'Caug', 'C7b5', 'C7#5'],
  },
  TEMPO_RANGES: {
    'Very Slow (60-70)': ['バラード', 'アンビエント'],
    'Slow (80-95)': ['ジャズ', 'R&B', 'ソウル'],
    'Medium (100-120)': ['ポップ', 'ロック', 'フォーク'],
    'Fast (130-150)': ['ダンス', 'パンク', 'ファンク'],
    'Very Fast (160+)': ['メタル', 'ハードコア', 'EDM'],
  }
};

export const DESCRIPTIONS = {
    moods: '楽曲全体の感情的な雰囲気やテーマを設定します。Suno v5では、Styleプロンプト内の自然言語記述やJSONオブジェクトでムードを定義すると効果的です。',
    genres: '楽曲の基本的な音楽スタイルを決定します。Styleプロンプトでメインジャンルとサブジャンルを組み合わせることで、AIの方向性を明確にします。',
    productionMixes: '最終的な音の質感や聞こえ方を調整します。StyleプロンプトのJSONオブジェクトや、Lyricsプロンプト内のメタタグで指定します。',
    instruments: 'セクションで使用される楽器を指定します。Lyricsプロンプト内で、パイプ記号 | を使った「コマンドスタッキング」で詳細な指示が可能です。例：[Instrument: Electric Guitar (80s glam metal lead | heavy distortion | wide stereo)]',
    soundEffects: '楽曲に現実世界の音や特殊な効果音を追加し、情景や雰囲気を豊かにします。Lyricsプロンプト内で[rain]や[applause]のように指定します。',
    vocals: 'ボーカルの歌い方、声質、エフェクトなどを指定します。Styleプロンプトの全体設定と、Lyricsプロンプト内のセクション別指定を組み合わせます。',
    energy: 'セクションごとの盛り上がり度合いを制御します。Lyricsプロンプト内で[Energy: High/Medium/Low]のように指定します。',
    chords: '歌詞にコードを埋め込むことで、楽曲のハーモニーをAIに指示できます。Lyricsプロンプト内で[C]歌詞[G]のように指定します。',
    structure: '楽曲の構成要素です。[Intro], [Verse], [Chorus]等で楽曲の展開を制御します。Lyricsプロンプトの主要な部分です。',
    concept: '楽曲全体の基本的な設計図です。ジャンル、キー、テンポなどを最初に固めることで、Styleプロンプトの土台となり、一貫性のある楽曲が生成されます。',
    lyrics: '楽曲の土台となる歌詞やアイデアです。ここからセクションを切り出し、Lyricsプロンプトを構築していきます。',
    naturalLanguage: '楽曲のコンセプトを自然な文章で記述します。Suno v5のStyleプロンプトの中核を担い、AIの解釈に最も大きな影響を与えます。',
    codeProgression: '定番のコード進行パターンを選択するだけで、音楽理論に基づいた適切なコードを自動割り当てできます。Lyricsプロンプトに反映されます。',
    advancedStructure: 'JSON/XML風の詳細指定でプロレベルの制御を可能にする技術。Lyricsプロンプト内でメタオブジェクト形式を有効にすると使用できます。',
};

export const PRODUCTION_MIX_DESCRIPTIONS: { [key: string]: string } = {
  'Stereo Wide': 'ステレオの広がりを最大限に強調し、空間的な臨場感と没入感を生み出します。オーケストラやアンビエントに最適。',
  'Mono': '全ての音を中央に定位させるモノラルミックス。レトロな質感や、楽曲の芯を力強く表現したい場合に有効です。',
  'Heavy Bass': '低音域を強調し、パワフルで迫力のあるサウンド。ダンス、ヒップホップ、EDMなどリズムが重要なジャンルに。',
  'Crisp Highs': '高音域をクリアにし、明るくきらびやかなサウンド。ボーカルの息遣いやシンバルの輝きを際立たせます。',
  'Compressed': '音量のばらつきを抑え、全体的な音圧を高めます。モダンなポップスやロックで多用される、力強いサウンド。',
  'Raw': 'エフェクトを最小限に抑え、録音したままのような生々しいサウンド。パンクやガレージロックの衝動を表現。',
  'Polished': '細部まで丁寧に調整され、洗練されたプロフェッショナルなサウンド。ラジオで流れるような完成度を求めるときに。',
  'Lo-Fi FX': 'テープヒスノイズやピッチの揺れを加え、意図的に音質を劣化させたレトロで温かみのあるサウンド。',
  '8-bit': '8ビットゲーム機のような、チープでデジタルなサウンド。チップチューンやレトロゲーム風の演出に。',
  'Muffled': '高音域をカットし、こもったようなサウンド。水中や壁の向こうから聞こえるような、距離感の演出に使用。',
  'Vintage': '60〜70年代の機材で録音したような、温かみのあるアナログなサウンド。クラシックロックやソウルに。',
  'Modern': '現代的でクリーン、ワイドレンジなサウンド。最新のポップスやエレクトロニックミュージックの標準的な音質。',
  'Saturated': 'テープや真空管を通したような、豊かな倍音が付加された歪み感のある温かいサウンド。音に厚みと個性を与えます。',
  'Clean': 'ノイズや歪みが一切なく、非常にクリアで透明感のあるサウンド。アコースティック楽器やボーカルの美しさを引き立てます。',
  'Gritty': '砂や埃が混じったような、粗くザラザラした質感のサウンド。インダストリアルやブルースロックに最適。',
  'Smooth': '角が取れた滑らかで聴きやすいサウンド。耳障りな高音域を抑え、リラックスした雰囲気を演出。R&Bやスムースジャズに。',
  'Mid-Range Focus': '中音域（ボーカルやギターの主要帯域）を強調し、最も重要なパートが前面に出るミックス。ロックに最適。',
  'Bass Heavy': "'Heavy Bass'よりもさらに低音を強調した、サブウーファーが響くようなサウンド。トラップやダブステップに。",
  'Precise Dynamics': '音量の大小（ダイナミクス）が非常に明確で、繊細な表現から力強い表現までを忠実に再現。演奏のニュアンスが重要。',
  'Warm Analog': 'アナログ機材特有の温かみと豊かな倍音を持つサウンド。デジタル音源に生命感を与えます。',
  'Intimate Close-Mic': 'マイクに近づいて録音したような、息遣いまで聞こえる親密なサウンド。バラードやASMR的な表現に。',
  'Soft Compression': '緩やかにコンプレッションをかけ、自然なダイナミクスを保ちつつ音をまとめる。アコースティックやジャズに。',
  'Bright Digital': 'デジタル特有の明るくクリアで、エッジの効いたサウンド。現代的なEDMやハイパーポップに。',
  'Punchy Compression': 'アタック感を強調するコンプレッションで、ドラムやベースにパンチと躍動感を与える。ファンクやダンスミュージックに。',
  'Modern Clean': "'Modern'と'Clean'を組み合わせた、現代的で非常に透明感のあるサウンド。最先端のポップスやR&Bに。",
  'Balanced': '全ての帯域がバランス良く調整された、最も標準的で聴きやすいミックス。ジャンルを問わず使用可能。',
  'Instrument Separation': '各楽器の音が混ざらず、一つ一つが明確に聞こえる分離の良いミックス。複雑なアレンジに最適。',
  'Dynamic Range': '音の大小の幅が広く、表現力豊かなサウンド。クラシックやジャズ、映画音楽などダイナミクスが重要な音楽に。',
  'Clean Jazz': 'ジャズの生演奏を間近で聴いているような、クリアでダイナミクスのあるミックス。各楽器の即興演奏が聞こえるよう。',
  'Raw Precision': '生々しい衝動と、機械のような演奏の正確さを両立させたミックス。プログレッシブロックやマスロックに。',
  'Instrument Focus': '特定の楽器（例：ボーカル、ギターソロ）を意図的に前面に押し出し、他を背景に配置するミックス。',
  'Dynamic Extremes': '完全な静寂から壁のような轟音まで、極端なダイナミクスを持つミックス。ポストロックや映画音楽のクライマックスに。',
  'Analytical': '分析的に聴くのに適した、各楽器の音が分離され、周波数特性がフラットに近いミックス。音楽制作の参考に。'
};

export const MOOD_DESCRIPTIONS: { [key: string]: string } = {
  // Positive & Uplifting
  'Uplifting': 'リスナーの精神を高揚させ、気分を明るくする、ポジティブなエネルギーに満ちた雰囲気。',
  'Euphoric': '幸福感や陶酔感が頂点に達したような、至福の感覚を表現。トランスやダンスミュージックで多用される。',
  'Triumphant': '勝利や達成感を祝う、壮大で力強い雰囲気。ファンファーレのようなブラスが似合う。',
  'Hopeful': '未来への希望や前向きな期待を感じさせる、明るく穏やかな雰囲気。',
  'Optimistic': '物事の明るい側面を捉える、楽観的でポジティブなムード。',
  'Happy': '純粋な喜びや楽しさを表現する、シンプルで明るい雰囲気。',
  'Ecstatic': '有頂天になるほどの、爆発的な喜びや興奮を表現。',
  'Radiant': '光り輝くような、まばゆいばかりの幸福感とポジティブなエネルギー。',
  'Glorious': '栄光や偉大さを称える、荘厳で輝かしい雰囲気。',
  'Celebratory': 'お祝いや祝祭のムード。楽しく、にぎやかで、ポジティブなエネルギーに満ちている。',
  // Emotional & Reflective
  'Emotional': '深い感情に訴えかける、感動的で心を揺さぶる雰囲気。バラードに最適。',
  'Reflective': '過去を振り返り、物思いにふけるような、静かで内省的なムード。',
  'Introspective': '自己の内面を探求するような、深く個人的で思索的な雰囲気。',
  'Contemplative': '静かに考えを巡らせる、瞑想的で落ち着いたムード。',
  'Sentimental': '過去の思い出や愛情に対する、甘く切ない感情を表現。',
  'Passionate': '情熱的で、強い愛情や欲望、怒りなどの激しい感情を表現。',
  'Heartfelt': '心からの誠実な感情を伝える、温かく感動的な雰囲気。',
  'Tender': '優しく、愛情のこもった繊細な感情を表現。',
  'Vulnerable': '傷つきやすく、脆い、無防備な心の状態を表現。',
  // Melancholic & Nostalgic
  'Melancholic': '物悲しく、憂鬱な気分。単なる悲しみではなく、美しさを伴うことが多い。',
  'Bittersweet': '喜びと悲しみが入り混じった、ほろ苦い感情。',
  'Nostalgic': '過去を懐かしむ、甘く切ない気持ち。レトロな音色が似合う。',
  'Wistful': '満たされない思いや、過去への憧憬を表現する、物思いに沈んだ雰囲気。',
  'Yearning': '何かを強く待ち焦がれる、切望の感情。',
  'Sad': '直接的な悲しみ、喪失感を表現。',
  'Heartbreaking': '胸が張り裂けるような、極めて強い悲しみや絶望。',
  // Calm & Atmospheric
  'Peaceful': '平穏で、心の安らぎを感じさせる静かな雰囲気。',
  'Serene': '澄み切った、穏やかで静かな心の状態。',
  'Tranquil': '騒音がなく、落ち着き払った静寂なムード。',
  'Meditative': '瞑想に適した、精神を集中させるための落ち着いた雰囲気。',
  'Spiritual': '精神的、宗教的な探求をテーマにした、神聖で荘厳なムード。',
  'Dreamy': '夢の中にいるような、幻想的で非現実的な雰囲気。',
  'Ethereal': '天上のもののように、この世のものとは思えないほど美しく繊細な雰囲気。',
  'Floating': '空中を漂っているかのような、軽やかで浮遊感のあるサウンド。',
  'Immersive': 'リスナーを音の世界に完全に没入させる、空間的な広がりを持つサウンド。',
  'Ambient': '環境に溶け込み、特定の雰囲気や空間を創り出すことを目的とした音楽。',
  // Dark & Mysterious
  'Dark': '暗く、重苦しい雰囲気。不安や恐怖を感じさせることが多い。',
  'Mysterious': '謎めいていて、好奇心をそそる不思議な雰囲気。',
  'Foreboding': '悪いことが起こりそうな予感を感じさせる、不吉なムード。',
  'Ominous': '脅威が迫り来るような、不気味で威圧的な雰囲気。',
  'Haunting': '忘れがたく、心に付きまとうような、美しくも悲しい、あるいは恐ろしい雰囲気。',
  'Anxious': '心配や恐怖からくる、落ち着かない不安な気持ち。',
  'Tense': '緊張感が高まり、張り詰めた空気感を表現。',
  'Dystopian': '理想郷の反対、暗黒の未来世界を描写する、冷たく非人間的な雰囲気。',
  'Apocalyptic': '世界の終わりや大災害を描写する、絶望的で壮大なムード。',
  'Nihilistic': '全ての価値や意味を否定する、虚無的で冷酷な雰囲気。',
  // Intense & Energetic
  'Intense': '非常に強く、激しい感情やエネルギーを表現。',
  'Epic': '英雄的で壮大な物語を思わせる、大規模で感動的なサウンド。',
  'Powerful': '力強く、エネルギーに満ち溢れ、圧倒的な存在感を持つ。',
  'Cathartic': '抑圧された感情を解放し、心の浄化（カタルシス）を促すような力強い表現。',
  'Driving': '前へ前へと進む、強力な推進力を持つリズム。',
  'Propulsive': 'リスナーを前進させる強い勢いとエネルギーを持つ。',
  'Aggressive': '攻撃的で、怒りや衝動を直接的に表現。',
  'Frenetic': '熱狂的で、狂乱したような非常に速く激しい動き。',
  'Turbulent': '激動の、荒れ狂うような不安定な状態。',
  'Chaotic': '混沌として、秩序がなく、予測不可能な展開。',
  'Urgent': '差し迫った、切迫感のある雰囲気。',
  'Angry': '怒りの感情を直接的に表現する、攻撃的なムード。',
  // Groovy & Playful
  'Groovy': 'リズムに乗って体が自然に動き出すような、心地よいノリ。',
  'Funky': 'ファンク音楽特有の、シンコペーションを多用した強力なグルーヴ。',
  'Playful': '遊び心にあふれた、楽しくて軽快な雰囲気。',
  'Sensual': '五感に訴えかける、官能的で魅力的なムード。',
  'Seductive': '誘惑するような、妖艶で魅力的な雰囲気。',
  'Lush': '豊かで、官能的な響きを持つ、贅沢なサウンド。',
  'Pulsating': '脈打つような、規則的で力強いビート。',
  'Hypnotic': 'リスナーを催眠術にかけるように引き込む、反復的で魅力的なリズムやメロディ。',
  // Thematic & Descriptive
  'Romantic': '恋愛や愛情をテーマにした、甘く情熱的な雰囲気。',
  'Cinematic': '映画のワンシーンを思わせる、物語性豊かでドラマティックなサウンド。',
  'Industrial': '工場の機械音などを取り入れた、冷たく硬質で無機質なサウンド。',
  'Urban': '都会の喧騒や夜景を思わせる、洗練された、あるいは雑多な雰囲気。',
  'Futuristic': '未来的な、SF的な世界観を表現する、先進的で電子的なサウンド。',
  'Retro': '過去の特定の時代（60年代、80年代など）を懐かしむ、レトロなサウンド。',
  'Minimalist': '最小限の音の要素で構成された、シンプルで抑制の効いたスタイル。',
  'Gritty': '砂や埃が混じったような、粗くザラザラした質感のサウンド。リアルで生々しい。',
  'Raw': '加工を最小限に抑えた、生々しく、ありのままのサウンド。',
  'Primal': '原始的で、本能に直接訴えかけるような力強いエネルギー。',
  'Sophisticated': '洗練されていて、知的で都会的な雰囲気。ジャズの要素と相性が良い。',
  'Colorful': '色彩豊かで、様々な音色やハーモニーが使われた、明るく活気のあるサウンド。',
  // Experimental & Complex
  'Experimental': '伝統的な音楽の形式にとらわれない、前衛的で実験的なアプローチ。',
  'Technical': '高度な演奏技術や複雑な音楽理論を駆使した、技巧的なスタイル。',
  'Complex': '複雑なリズム、ハーモニー、構造を持つ、知的な挑戦を促す音楽。',
  'Virtuosic': '超絶技巧の演奏をフィーチャーした、名人芸的なスタイル。',
  'Unpredictable': '展開が予測不可能で、常にリスナーを驚かせる構成。',
  'Cerebral': '感情よりも知性に訴えかける、論理的で構築的な音楽。',
  'Surreal': '非現実的で、夢のような、シュールレアリスム的な世界観。',
  'Abstract': '具体的な形や物語を持たない、抽象的な音の構成物。',
  'Glitchy': 'デジタルエラーやノイズを意図的に音楽に取り入れたスタイル。',
  'Dissonant': '不協和音を多用し、緊張感や不安定さを生み出す。',
  'Unsettling': 'リスナーを不安にさせたり、落ち着かない気持ちにさせる雰囲気。',
  'Otherworldly': 'この世のものとは思えない、異世界的で神秘的な雰囲気。',
  'Psychedelic': '幻覚や意識の変容を体験させるような、サイケデリックなサウンド。',
};

export const VOCAL_STYLE_DESCRIPTIONS: { [key: string]: string } = {
  'A cappella': '楽器の伴奏がない状態で独唱・合唱・重唱すること。',
  'Bright Vocals': '明るく、明瞭で、生き生きとしたボーカルスタイル。',
  'Chant Vocals': '教会音楽や聖歌のように、単調なメロディを詠唱するスタイル。',
  'Chest Voice': '胸部で共鳴させる、力強く地声に近い自然な歌声。',
  'Choir': '合唱団。複数の人間が歌う、厚みのある合唱でのボーカル。',
  'Choir Voices': '聖歌隊や合唱団のような、複数の声によるハーモニー豊かなボーカル。',
  'Conversational': '話しているかのような、自然でリラックスしたトーンの歌唱。',
  'Dirty Vocals': '暗く、ざらついた質感を持つ、少し歪んだ雰囲気のボーカル。',
  'Emotional': '感情を豊かに表現する歌い方。喜び、悲しみ、怒りなどを声に乗せる。',
  'Emotional Vocals': '感情を前面に押し出した歌唱スタイル。バラードなどで効果的。',
  'Ethereal Vocals': '天上のもののように、この世のものとは思えないほど美しく繊細な歌声。',
  'Falsetto': '裏声。特に男性が高音を出す際に使う、軽やかで息の多い声。',
  'Girl Group': '女性ボーカルグループ。キャッチーなメロディとハーモニーが特徴。',
  'Growl': 'うなるような、低く攻撃的な声。デスメタルなどで使用される。',
  'Head Voice': '頭部で共鳴させる、クリアで澄んだ高音の歌声。',
  'Legato': '音を途切れさせず、滑らかにつなげて歌うスタイル。',
  'Lounge Singer': 'ラウンジで歌う歌手のように、リラックスした雰囲気を与える歌い方。',
  'Mechanical Singing': 'ロボットのように、感情を排した機械的な歌い方。',
  'Melismatic': '1つの音節を多くの音符にのせて歌う、装飾的で技巧的なスタイル。',
  'Mixed Voice': '地声と裏声を滑らかに混ぜ合わせた、力強い高音域の歌声。',
  'Opera': 'オペラのような、クラシックで劇的な発声法。豊かな声量と表現力が特徴。',
  'Powerful': '力強く、エネルギッシュで、圧倒的な存在感を持つ歌声。',
  'Rap': 'リズミカルに話すように歌うスタイル。ヒップホップの主要素。',
  'Rap Battle': '二人のラッパーが即興でリリックを応酬し、技術を競い合うスタイル。',
  'Raspy': 'かすれた、しゃがれた声質。ロックやブルースで多用され、独特の味を出す。',
  'Scat': 'ジャズなどで用いられる、意味のない音節で即興的にメロディを歌うこと。',
  'Screaming': '叫ぶような歌声。ハードコア、メタル、エモなどのジャンルで使われる。',
  'Soothing Vocals': '心地よく、聴き手を安心させるような、うっとりする歌い方。',
  'Spoken': '歌うのではなく、セリフのように語るスタイル。',
  'Sprechgesang': '「語るような歌」。メロディと語りの中間的な表現方法。',
  'Staccato': '音を短く、歯切れよく切って歌うスタイル。リズミカルな効果を生む。',
  'Sultry Vocals': '色っぽく、官能的で、聴き手を誘惑するようなボーカル。',
  'Sweet': '甘く、優しく、聴き心地の良い歌声。',
  'Traditional Voice': '伝統的な歌い方。演歌や民謡など、特定の地域や文化に根差した古風な歌いまわし。',
  'Vibrato': '声を細かく震わせるテクニック。感情表現を豊かにし、音に深みを与える。',
  'Vibrato Vocals': '演歌などで多用される、ビブラートを効果的に効かせたボーカルスタイル。',
  'Vintage Vocal': '古い録音のような、年季の入った重厚感のある声。レトロな雰囲気を演出。',
  'Vocoder Vocals': '人間の声をシンセサイザーで加工した、ロボットのようなエフェクトボーカル。',
  'Whisper': 'ささやくような、息の多い歌声。親密さやミステリアスな雰囲気を出す。',
  'smoky vocals': 'スモーキーで、少しハスキーな質感を持つ、ジャズやソウルに適した雰囲気のある声。',
  'airy vocals': '息の成分が多く含まれた、軽やかで繊細なささやくような声。',
  'nasal vocals': '鼻腔に響かせる特徴的な声質。個性的なキャラクターを演出。',
  'warm vocals': '温かみがあり、聴き手を包み込むような心地よい声。',
  'velvety vocals': 'ベルベットのようになめらかで、リッチな響きを持つ声。',
  'breathy vocals': '息遣いが多めに混じった歌声。親密さや儚さ、セクシーさを表現。',
  'close-mic vocals': 'マイクに近づいて録音したような、息遣いまで聞こえる親密なサウンド。',
  'intimate vocals': '親密で、個人的な感情を語りかけるような歌声。',
  'straight tone': 'ビブラートをかけない、まっすぐでフラットな歌声。モダンでクールな印象を与える。',
  'gentle vibrato': 'フレーズの終わりなどに優しくかけられる、繊細なビブラート。',
  'subtle vibrato': '気づくか気づかないか程度の、非常に微妙なビブラート。自然な人間らしさを加える。',
  'soft delivery': '柔らかく、力を抜いた歌い方。優しい感情や内省的なムードを表現。',
  'hard attack': '音の立ち上がりを鋭く、力強く発声するスタイル。リズミカルな楽曲や攻撃的な表現に。',
  'aggressive delivery': '攻撃的で、感情を叩きつけるような歌い方。',
};

export const VOCAL_GENDER_DESCRIPTIONS: { [key: string]: string } = {
  'Male Vocal': '男性の声によるボーカル。',
  'Female Vocal': '女性の声によるボーカル。',
  'Child Vocal': '子供の声によるボーカル。純粋さや無邪気さを表現。',
  'boy Vocal': '少年の声。変声期前後の独特な響きを持つ。',
  'girl Vocal': '少女の声。高く、クリアな響きが特徴。',
  'Deep Voice': '深く、低い声質。重厚感や落ち着きを表現。',
  'High Voice': '高く、軽やかな声質。明るさや繊細さを表現。',
  'Androgynous Voice': '中性的で、性別が特定しにくい声。ミステリアスな雰囲気を演出。',
  'Alto': 'アルト。女声の低い声域。落ち着きと深みがある。',
  'Soprano': 'ソプラノ。女声の高い声域。華やかで澄んだ響き。',
  'Tenor': 'テノール。男声の高い声域。情熱的で輝かしい響き。',
  'Bass': 'バス。男声の最も低い声域。重厚で安定感がある。',
  'Baritone': 'バリトン。テノールとバスの中間の声域。温かみと力強さを併せ持つ。',
  'twin Vocal': 'ツインボーカル。主に2人のボーカルが同等の立場で歌うスタイル。',
  'Duet Vocals': 'デュエット。2人での歌唱。主旋律とハーモニーの掛け合いが特徴。',
  'Male & Female Vocals': '男女のデュエット。異なる声質が織りなす対比や調和が魅力。',
  'Vocaloid Vocal': 'ボーカロイド。音声合成ソフトウェアによって作られた機械的な歌声。'
};

export const nuanceAmplifierOptions = [
    { id: 'amplifyEmotion', label: '❤️‍🔥 感情の増幅', description: '記述された感情を、より極端で強烈なものとしてAIに解釈させます。例：「悲しい」→「胸が張り裂けるほど悲痛な」' },
    { id: 'emphasizeUniqueness', label: '💎 独自性の強調', description: '記述されたニュアンスを、ありきたりな解釈ではなく、実験的で独創的な視点から再構築させます。予期せぬジャンルや楽器の組み合わせが提案されることがあります。' },
    { id: 'deepenNarrative', label: '📚 物語性の深化', description: '記述されたニュアンスを一つの物語の導入と捉え、その展開や結末を想像させるような、より深みのある音楽構造をAIに提案させます。' },
    { id: 'visualizeScenery', label: '🖼️ 情景描写の具体化', description: '記述された情景を、音で鮮明に描き出すことをAIに最優先させます。サウンドエフェクトや空間的な音響設計がより具体的に提案されます。' },
];

export const artistTooltips: { [key: string]: string } = {
    'Tool - Schism': 'Tool代表曲"Schism"の7/8拍子プログレッシブメタルスタイル。数学的精密性と複雑なポリリズム',
    'Reich Meets Pop': 'スティーブ・ライヒのミニマリズムとポップスの融合。フェーズ、加算プロセス、ポリリズムによる実験的EDM。',
    'Katy Perry - Firework': 'ケイティ・ペリー「Firework」風のポップアンセム。感動的なコード進行(I-ii-vi-IV)とMax Martin流のプロダクション。',
    'Katy Perry - Teenage Dream': 'ケイティ・ペリー「Teenage Dream」風のドリームポップ。トニックに解決しない浮遊感のあるハーモニーが特徴。',
    '宇多田ヒカル - One Last Kiss': '宇多田ヒカル「One Last Kiss」風のシンセポップ。解決を回避する浮遊感のあるハーモニーと多重録音コーラスが特徴。'
};