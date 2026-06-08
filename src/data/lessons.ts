import { Lesson } from '../types/learning';

export const lessons: Lesson[] = [
  // ==========================================
  // SPANISH LESSONS (Unit 1: Basics & Greetings)
  // ==========================================
  {
    id: 'es-u1-l1',
    unitId: 'es-unit-1',
    title: 'Meeting & Greeting',
    description: 'Learn simple greetings, introductions, and essential words.',
    order: 1,
    xp: 10,
    type: 'vocabulary',
    goals: [
      {
        id: 'es-goal-1',
        description: 'Greet people at different times of the day',
        targetSkill: 'vocabulary',
      },
      {
        id: 'es-goal-2',
        description: 'Politely say hello and goodbye',
        targetSkill: 'vocabulary',
      },
    ],
    vocabList: [
      {
        id: 'es-v-1',
        word: 'Hola',
        translation: 'Hello',
        pronunciation: 'OH-lah',
        partOfSpeech: 'interjection',
        exampleSentence: 'Hola, ¿cómo estás?',
        exampleTranslation: 'Hello, how are you?',
      },
      {
        id: 'es-v-2',
        word: 'Adiós',
        translation: 'Goodbye',
        pronunciation: 'ah-DYOHS',
        partOfSpeech: 'interjection',
        exampleSentence: 'Adiós, nos vemos mañana.',
        exampleTranslation: 'Goodbye, see you tomorrow.',
      },
      {
        id: 'es-v-3',
        word: 'Buenos días',
        translation: 'Good morning',
        pronunciation: 'BWEH-nos DEE-ahs',
        partOfSpeech: 'phrase',
        exampleSentence: 'Buenos días, mamá.',
        exampleTranslation: 'Good morning, mom.',
      },
      {
        id: 'es-v-4',
        word: 'Buenas noches',
        translation: 'Good night',
        pronunciation: 'BWEH-nahs NOH-chehs',
        partOfSpeech: 'phrase',
        exampleSentence: 'Buenas noches y dulces sueños.',
        exampleTranslation: 'Good night and sweet dreams.',
      },
      {
        id: 'es-v-5',
        word: 'Por favor',
        translation: 'Please',
        pronunciation: 'por fah-VOR',
        partOfSpeech: 'phrase',
        exampleSentence: 'Un café, por favor.',
        exampleTranslation: 'A coffee, please.',
      },
    ],
    phrases: [
      {
        id: 'es-p-1',
        text: '¿Cómo estás?',
        translation: 'How are you?',
        pronunciation: 'KO-mo ehs-TAHS',
        context: 'A friendly greeting to ask about someone\'s well-being.',
      },
      {
        id: 'es-p-2',
        text: 'Mucho gusto',
        translation: 'Nice to meet you',
        pronunciation: 'MOO-cho GOOS-to',
        context: 'Used when meeting someone for the first time.',
      },
    ],
    activities: [
      {
        id: 'es-act-1',
        type: 'multiple_choice',
        prompt: 'Select the correct translation for "Hola"',
        options: ['Goodbye', 'Please', 'Hello', 'Thank you'],
        correctAnswer: 'Hello',
        tip: 'The "H" in Spanish is silent! It is pronounced like "OH-lah".',
      },
      {
        id: 'es-act-2',
        type: 'multiple_choice',
        prompt: 'Select the correct translation for "Adiós"',
        options: ['Good night', 'Goodbye', 'Good morning', 'Nice to meet you'],
        correctAnswer: 'Goodbye',
      },
      {
        id: 'es-act-3',
        type: 'fill_blank',
        prompt: 'Fill in the blank to say "Good morning"',
        questionText: 'Buenos ______',
        options: ['noches', 'tardes', 'días', 'gusto'],
        correctAnswer: 'días',
      },
      {
        id: 'es-act-4',
        type: 'translate',
        prompt: 'Translate the following sentence to English',
        questionText: 'Un café, por favor.',
        correctAnswer: 'A coffee, please',
      },
      {
        id: 'es-act-5',
        type: 'listen_speak',
        prompt: 'Listen and speak the phrase',
        questionText: 'Mucho gusto',
        correctAnswer: 'Mucho gusto',
      },
    ],
  },
  {
    id: 'es-u1-l2',
    unitId: 'es-unit-1',
    title: 'Order Coffee at a Cafe',
    description: 'Practice ordering items at a local cafe using AI-driven chat.',
    order: 2,
    xp: 15,
    type: 'chat',
    goals: [
      {
        id: 'es-goal-3',
        description: 'Order drinks and pastries in Spanish',
        targetSkill: 'speaking',
      },
      {
        id: 'es-goal-4',
        description: 'Maintain a natural conversation with a barista',
        targetSkill: 'chat',
      },
    ],
    aiPrompt: {
      teacherName: 'Sofía',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      voiceId: 'es-ES-Neural2-F',
      systemPrompt: 'You are Sofía, a friendly barista at a popular cafe in Madrid called "Café Central". You speak simple, conversational Spanish to help the user order a drink. If they write in English, politely ask them to try in Spanish. Correct minor mistakes with a friendly, helpful tone. Keep your responses short (1-2 sentences) and end with an encouraging question.',
      initialMessage: '¡Hola! Bienvenidos a Café Central. ¿Qué te pongo hoy?',
      scenarioDescription: 'Practice ordering a coffee and asking for a croissant from Sofía at the local Madrid cafe.',
    },
    vocabList: [
      {
        id: 'es-v-6',
        word: 'Café',
        translation: 'Coffee',
        pronunciation: 'kah-FEH',
        partOfSpeech: 'noun',
        exampleSentence: 'Quiero un café solo.',
        exampleTranslation: 'I want a black coffee.',
      },
      {
        id: 'es-v-7',
        word: 'Croissant',
        translation: 'Croissant',
        pronunciation: 'krwa-SAHN',
        partOfSpeech: 'noun',
        exampleSentence: '¿Tienes un croissant de mantequilla?',
        exampleTranslation: 'Do you have a butter croissant?',
      },
      {
        id: 'es-v-8',
        word: 'La cuenta',
        translation: 'The bill / The check',
        pronunciation: 'lah KWEHN-tah',
        partOfSpeech: 'noun',
        exampleSentence: 'La cuenta, por favor.',
        exampleTranslation: 'The check, please.',
      },
    ],
    phrases: [
      {
        id: 'es-p-3',
        text: '¿Me da un...?',
        translation: 'Can I have a...?',
        pronunciation: 'meh dah oon',
        context: 'A polite way to order something at a restaurant or shop.',
      },
    ],
    activities: [
      {
        id: 'es-act-6',
        type: 'multiple_choice',
        prompt: 'Which phrase is the most natural way to ask for the bill?',
        options: ['Hola señor', 'La cuenta, por favor', '¿Dónde está el café?', 'Mucho gusto'],
        correctAnswer: 'La cuenta, por favor',
      },
    ],
  },
  {
    id: 'es-u1-l3',
    unitId: 'es-unit-1',
    title: 'Double L (ll) & R Pronunciation',
    description: 'Learn the secrets of Spanish pronunciation with an AI Video Teacher.',
    order: 3,
    xp: 20,
    type: 'video',
    goals: [
      {
        id: 'es-goal-5',
        description: 'Correctly pronounce the double L sound',
        targetSkill: 'speaking',
      },
      {
        id: 'es-goal-6',
        description: 'Master the rolled R sound',
        targetSkill: 'speaking',
      },
    ],
    aiPrompt: {
      teacherName: 'Diego',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      voiceId: 'es-ES-Neural2-M',
      systemPrompt: 'You are Diego, a dynamic native Spanish teacher specialized in phonetics. Guide the student dynamically. Instruct them to repeat words containing "ll" (like lluvia, calle) and "rr" (like perro, carro). Emphasize mouth positioning: the tip of the tongue should tap the roof of the mouth for the rolled R. Provide instant, motivating corrections.',
      initialMessage: '¡Hola! Soy Diego. Today we will practice the double L ("ll") and the rolled R ("r" / "rr") sounds. Let\'s start by repeating: "lluvia". How does it sound?',
      scenarioDescription: 'Join Diego for an interactive video call to practice tricky Spanish phonics.',
    },
    activities: [
      {
        id: 'es-act-7',
        type: 'listen_speak',
        prompt: 'Pronounce the word "lluvia" (rain) clearly.',
        questionText: 'lluvia',
        correctAnswer: 'lluvia',
        tip: 'In Spanish, "ll" is pronounced like the "y" in English "yes" (or "sh"/"j" in some regions).',
      },
      {
        id: 'es-act-8',
        type: 'listen_speak',
        prompt: 'Pronounce the word "perro" (dog) rolling the "rr".',
        questionText: 'perro',
        correctAnswer: 'perro',
        tip: 'Roll the "rr" sound by pushing air past the tip of your tongue as it vibrates against the alveolar ridge.',
      },
      {
        id: 'es-act-9',
        type: 'multiple_choice',
        prompt: 'How is the double "ll" pronounced in most parts of the Spanish-speaking world?',
        options: ['Like "L" as in "Light"', 'Like "Y" as in "Yellow"', 'Like "H" as in "Hello"', 'Like "S" as in "Snake"'],
        correctAnswer: 'Like "Y" as in "Yellow"',
      },
    ],
  },

  // ==========================================
  // SPANISH LESSONS (Unit 2: Travel & Directions)
  // ==========================================
  {
    id: 'es-u2-l1',
    unitId: 'es-unit-2',
    title: 'Asking for Directions',
    description: 'Navigate your way through Spanish-speaking cities using directions.',
    order: 1,
    xp: 15,
    type: 'audio',
    goals: [
      {
        id: 'es-goal-7',
        description: 'Ask for the location of transit stations',
        targetSkill: 'listening',
      },
      {
        id: 'es-goal-8',
        description: 'Understand terms for right, left, and straight ahead',
        targetSkill: 'grammar',
      },
    ],
    vocabList: [
      {
        id: 'es-v-9',
        word: 'Estación',
        translation: 'Station',
        pronunciation: 'ehs-tah-SYOHN',
        partOfSpeech: 'noun',
        exampleSentence: 'La estación de metro está cerca.',
        exampleTranslation: 'The metro station is nearby.',
      },
      {
        id: 'es-v-10',
        word: 'Derecha',
        translation: 'Right',
        pronunciation: 'deh-REH-chah',
        partOfSpeech: 'adverb',
        exampleSentence: 'Gira a la derecha.',
        exampleTranslation: 'Turn to the right.',
      },
      {
        id: 'es-v-11',
        word: 'Izquierda',
        translation: 'Left',
        pronunciation: 'eeth-KYEHR-dah',
        partOfSpeech: 'adverb',
        exampleSentence: 'Está a la izquierda del hotel.',
        exampleTranslation: 'It is to the left of the hotel.',
      },
      {
        id: 'es-v-12',
        word: 'Derecho',
        translation: 'Straight ahead',
        pronunciation: 'deh-REH-cho',
        partOfSpeech: 'adverb',
        exampleSentence: 'Sigue todo derecho.',
        exampleTranslation: 'Go straight ahead.',
      },
    ],
    phrases: [
      {
        id: 'es-p-4',
        text: '¿Dónde está el baño?',
        translation: 'Where is the bathroom?',
        pronunciation: 'DON-deh ehs-TAH el BAH-nyo',
        context: 'An essential phrase when exploring a town or restaurant.',
      },
      {
        id: 'es-p-5',
        text: 'Disculpe, señor',
        translation: 'Excuse me, sir',
        pronunciation: 'dees-KOOL-peh seh-NYOR',
        context: 'A polite way to get a stranger\'s attention.',
      },
    ],
    aiPrompt: {
      teacherName: 'Mateo',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      systemPrompt: 'You are Mateo, a helpful local resident of Buenos Aires. The user is lost and will ask you for help finding places (the bathroom, the metro, or a museum). Speak in clear, friendly Argentine Spanish, and help direct them using directions like "a la derecha", "a la izquierda", or "derecho". Keep answers simple.',
      initialMessage: 'Hola, amigo. ¿Te has perdido? ¿Cómo te puedo ayudar?',
      scenarioDescription: 'Ask Mateo directions to the train station or the nearest restroom.',
    },
    activities: [
      {
        id: 'es-act-10',
        type: 'multiple_choice',
        prompt: 'What does "Gira a la izquierda" mean?',
        options: ['Go straight ahead', 'Turn right', 'Turn left', 'Stop here'],
        correctAnswer: 'Turn left',
      },
      {
        id: 'es-act-11',
        type: 'translate',
        prompt: 'Translate the phrase: "¿Dónde está la estación de metro?"',
        questionText: '¿Dónde está la estación de metro?',
        correctAnswer: 'Where is the metro station',
      },
      {
        id: 'es-act-12',
        type: 'tap_pairs',
        prompt: 'Match the words to their correct meaning',
        options: ['baño', 'estación', 'derecha', 'izquierda', 'right', 'left', 'bathroom', 'station'],
        correctAnswer: ['baño-bathroom', 'estación-station', 'derecha-right', 'izquierda-left'],
      },
    ],
  },

  // ==========================================
  // FRENCH LESSONS (Unit 1: Introduction & Essentials)
  // ==========================================
  {
    id: 'fr-u1-l1',
    unitId: 'fr-unit-1',
    title: 'First French Words',
    description: 'Learn foundational greetings and expressions in French.',
    order: 1,
    xp: 10,
    type: 'vocabulary',
    goals: [
      {
        id: 'fr-goal-1',
        description: 'Understand the basic greetings in French',
        targetSkill: 'vocabulary',
      },
    ],
    vocabList: [
      {
        id: 'fr-v-1',
        word: 'Bonjour',
        translation: 'Hello / Good morning',
        pronunciation: 'bohn-ZHOOR',
        partOfSpeech: 'interjection',
        exampleSentence: 'Bonjour, comment allez-vous?',
        exampleTranslation: 'Hello, how are you?',
      },
      {
        id: 'fr-v-2',
        word: 'Merci',
        translation: 'Thank you',
        pronunciation: 'MAIR-see',
        partOfSpeech: 'interjection',
        exampleSentence: 'Merci beaucoup pour le cadeau.',
        exampleTranslation: 'Thank you very much for the gift.',
      },
      {
        id: 'fr-v-3',
        word: 'Au revoir',
        translation: 'Goodbye',
        pronunciation: 'oh ruh-VWAR',
        partOfSpeech: 'interjection',
        exampleSentence: 'Au revoir, bonne journée!',
        exampleTranslation: 'Goodbye, have a good day!',
      },
    ],
    phrases: [
      {
        id: 'fr-p-1',
        text: 'S\'il vous plaît',
        translation: 'Please (formal/plural)',
        pronunciation: 'seel voo PLEH',
        context: 'Used when asking politely.',
      },
    ],
    activities: [
      {
        id: 'fr-act-1',
        type: 'multiple_choice',
        prompt: 'Select the correct translation for "Bonjour"',
        options: ['Goodbye', 'Thank you', 'Please', 'Hello'],
        correctAnswer: 'Hello',
      },
      {
        id: 'fr-act-2',
        type: 'fill_blank',
        prompt: 'Complete the sentence to say "Thank you very much"',
        questionText: '______ beaucoup',
        options: ['Bonjour', 'Merci', 'Au revoir', 'S\'il'],
        correctAnswer: 'Merci',
      },
    ],
  },

  // ==========================================
  // JAPANESE LESSONS (Unit 1: Hiragana & Greetings)
  // ==========================================
  {
    id: 'ja-u1-l1',
    unitId: 'ja-unit-1',
    title: 'Hiragana Greetings',
    description: 'Learn the primary Japanese greetings written in Hiragana.',
    order: 1,
    xp: 10,
    type: 'vocabulary',
    goals: [
      {
        id: 'ja-goal-1',
        description: 'Read and understand basic greetings',
        targetSkill: 'vocabulary',
      },
    ],
    vocabList: [
      {
        id: 'ja-v-1',
        word: 'こんにちは (Konnichiwa)',
        translation: 'Hello',
        pronunciation: 'kon-nee-chee-wah',
        partOfSpeech: 'interjection',
        exampleSentence: 'こんにちは、お元気ですか？',
        exampleTranslation: 'Hello, how are you?',
      },
      {
        id: 'ja-v-2',
        word: 'ありがとう (Arigatou)',
        translation: 'Thank you',
        pronunciation: 'ah-ree-gah-toh',
        partOfSpeech: 'interjection',
        exampleSentence: '手伝ってくれてありがとう。',
        exampleTranslation: 'Thank you for helping me.',
      },
      {
        id: 'ja-v-3',
        word: 'さようなら (Sayounara)',
        translation: 'Goodbye',
        pronunciation: 'sah-yoh-nah-rah',
        partOfSpeech: 'interjection',
        exampleSentence: '先生、さようなら。',
        exampleTranslation: 'Goodbye, teacher.',
      },
    ],
    activities: [
      {
        id: 'ja-act-1',
        type: 'multiple_choice',
        prompt: 'Select the translation for "こんにちは (Konnichiwa)"',
        options: ['Goodbye', 'Hello', 'Thank you', 'Excuse me'],
        correctAnswer: 'Hello',
      },
      {
        id: 'ja-act-2',
        type: 'multiple_choice',
        prompt: 'Select the translation for "ありがとう (Arigatou)"',
        options: ['Goodbye', 'Please', 'Hello', 'Thank you'],
        correctAnswer: 'Thank you',
      },
    ],
  },

  // ==========================================
  // KOREAN LESSONS (Unit 1: Hangul & Greetings)
  // ==========================================
  {
    id: 'ko-u1-l1',
    unitId: 'ko-unit-1',
    title: 'Reading Hangul',
    description: 'Learn simple Korean greetings written in Hangul.',
    order: 1,
    xp: 10,
    type: 'vocabulary',
    goals: [
      {
        id: 'ko-goal-1',
        description: 'Politely say hello and thank you in Korean',
        targetSkill: 'vocabulary',
      },
    ],
    vocabList: [
      {
        id: 'ko-v-1',
        word: '안녕하세요 (Annyeonghaseyo)',
        translation: 'Hello',
        pronunciation: 'an-nyeong-ha-se-yo',
        partOfSpeech: 'interjection',
        exampleSentence: '안녕하세요, 만나서 반갑습니다.',
        exampleTranslation: 'Hello, nice to meet you.',
      },
      {
        id: 'ko-v-2',
        word: '감사합니다 (Gamsahabnida)',
        translation: 'Thank you',
        pronunciation: 'gam-sa-ham-ni-da',
        partOfSpeech: 'interjection',
        exampleSentence: '도와주셔서 감사합니다.',
        exampleTranslation: 'Thank you for helping me.',
      },
    ],
    activities: [
      {
        id: 'ko-act-1',
        type: 'multiple_choice',
        prompt: 'Select the correct translation for "안녕하세요 (Annyeonghaseyo)"',
        options: ['Goodbye', 'Thank you', 'Hello', 'Please'],
        correctAnswer: 'Hello',
      },
      {
        id: 'ko-act-2',
        type: 'multiple_choice',
        prompt: 'Select the correct translation for "감사합니다 (Gamsahabnida)"',
        options: ['Hello', 'Thank you', 'Goodbye', 'Welcome'],
        correctAnswer: 'Thank you',
      },
    ],
  },

  // ==========================================
  // GERMAN LESSONS (Unit 1: German Basics)
  // ==========================================
  {
    id: 'de-u1-l1',
    unitId: 'de-unit-1',
    title: 'German Greetings',
    description: 'Learn the most common German greetings.',
    order: 1,
    xp: 10,
    type: 'vocabulary',
    goals: [
      {
        id: 'de-goal-1',
        description: 'Understand everyday German greetings',
        targetSkill: 'vocabulary',
      },
    ],
    vocabList: [
      {
        id: 'de-v-1',
        word: 'Hallo',
        translation: 'Hello',
        pronunciation: 'HAH-loh',
        partOfSpeech: 'interjection',
        exampleSentence: 'Hallo, wie geht es dir?',
        exampleTranslation: 'Hello, how are you?',
      },
      {
        id: 'de-v-2',
        word: 'Danke',
        translation: 'Thank you',
        pronunciation: 'DAHN-kuh',
        partOfSpeech: 'interjection',
        exampleSentence: 'Danke für das Wasser.',
        exampleTranslation: 'Thank you for the water.',
      },
    ],
    activities: [
      {
        id: 'de-act-1',
        type: 'multiple_choice',
        prompt: 'Select the correct translation for "Hallo"',
        options: ['Goodbye', 'Please', 'Hello', 'Yes'],
        correctAnswer: 'Hello',
      },
    ],
  },

  // ==========================================
  // CHINESE LESSONS (Unit 1: Pinyin & Tones)
  // ==========================================
  {
    id: 'zh-u1-l1',
    unitId: 'zh-unit-1',
    title: 'First Tones & Hello',
    description: 'Learn basic Chinese greetings and their tones.',
    order: 1,
    xp: 10,
    type: 'vocabulary',
    goals: [
      {
        id: 'zh-goal-1',
        description: 'Understand first and third tones in greetings',
        targetSkill: 'vocabulary',
      },
    ],
    vocabList: [
      {
        id: 'zh-v-1',
        word: '你好 (Nǐ hǎo)',
        translation: 'Hello',
        pronunciation: 'nee how',
        partOfSpeech: 'interjection',
        exampleSentence: '你好，很高兴认识你。',
        exampleTranslation: 'Hello, nice to meet you.',
      },
      {
        id: 'zh-v-2',
        word: '谢谢 (Xièxiè)',
        translation: 'Thank you',
        pronunciation: 'shyeh-shyeh',
        partOfSpeech: 'interjection',
        exampleSentence: '谢谢你的帮助。',
        exampleTranslation: 'Thank you for your help.',
      },
    ],
    activities: [
      {
        id: 'zh-act-1',
        type: 'multiple_choice',
        prompt: 'Select the translation for "你好 (Nǐ hǎo)"',
        options: ['Thank you', 'Hello', 'Goodbye', 'Excuse me'],
        correctAnswer: 'Hello',
      },
    ],
  },
];
