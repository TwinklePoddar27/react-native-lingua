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
    ],
    phrases: [
      {
        id: 'es-p-1',
        text: '¿Cómo estás?',
        translation: 'How are you?',
        pronunciation: 'KO-mo ehs-TAHS',
        context: 'A friendly greeting to ask about someone\'s well-being.',
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
        type: 'fill_blank',
        prompt: 'Fill in the blank to say "Good morning"',
        questionText: 'Buenos ______',
        options: ['noches', 'tardes', 'días', 'gusto'],
        correctAnswer: 'días',
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
    ],
    aiPrompt: {
      teacherName: 'Sofía',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      voiceId: 'es-ES-Neural2-F',
      systemPrompt: 'You are Sofía, a friendly barista. Help the user order a drink.',
      initialMessage: '¡Hola! Bienvenidos. ¿Qué te pongo hoy?',
      scenarioDescription: 'Practice ordering a coffee from Sofía.',
    },
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
    title: 'At the Café',
    description: 'Master coffee shop conversations and vocabulary.',
    order: 3,
    xp: 20,
    type: 'video',
    goals: [
      {
        id: 'es-goal-5',
        description: 'Master cafe ordering and interactions',
        targetSkill: 'speaking',
      },
    ],
    activities: [
      {
        id: 'es-act-7',
        type: 'multiple_choice',
        prompt: 'How do you say "Un café, por favor" in English?',
        options: ['A coffee, please', 'A tea, please', 'Thank you', 'Goodbye'],
        correctAnswer: 'A coffee, please',
      },
    ],
  },
  {
    id: 'es-u1-l4',
    unitId: 'es-unit-1',
    title: 'Travel & Directions',
    description: 'Learn how to ask for and understand simple directions.',
    order: 4,
    xp: 15,
    type: 'audio',
    goals: [
      {
        id: 'es-goal-14',
        description: 'Understand left, right, and straight directions',
        targetSkill: 'listening',
      },
    ],
    activities: [
      {
        id: 'es-act-14',
        type: 'multiple_choice',
        prompt: 'What is the Spanish word for "Left"?',
        options: ['Derecha', 'Izquierda', 'Derecho', 'Girar'],
        correctAnswer: 'Izquierda',
      },
    ],
  },
  {
    id: 'es-u1-l5',
    unitId: 'es-unit-1',
    title: 'Shopping',
    description: 'Learn terms for clothing items and asking for prices.',
    order: 5,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'es-goal-15',
        description: 'Ask for prices and name clothes',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'es-act-15',
        type: 'multiple_choice',
        prompt: 'How do you ask "How much is it?" in Spanish?',
        options: ['¿Cuánto cuesta?', '¿Dónde está?', '¿Qué es esto?', 'Mucho gusto'],
        correctAnswer: '¿Cuánto cuesta?',
      },
    ],
  },
  {
    id: 'es-u1-l6',
    unitId: 'es-unit-1',
    title: 'Family & Friends',
    description: 'Introduce family members and describe relationships.',
    order: 6,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'es-goal-16',
        description: 'Identify family members',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'es-act-16',
        type: 'multiple_choice',
        prompt: 'What is the Spanish word for "Mother"?',
        options: ['Padre', 'Madre', 'Hermano', 'Amigo'],
        correctAnswer: 'Madre',
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
    ],
    activities: [
      {
        id: 'es-act-10',
        type: 'multiple_choice',
        prompt: 'What does "Gira a la izquierda" mean?',
        options: ['Go straight ahead', 'Turn right', 'Turn left', 'Stop here'],
        correctAnswer: 'Turn left',
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
    ],
    activities: [
      {
        id: 'fr-act-1',
        type: 'multiple_choice',
        prompt: 'Select the correct translation for "Bonjour"',
        options: ['Goodbye', 'Thank you', 'Please', 'Hello'],
        correctAnswer: 'Hello',
      },
    ],
  },
  {
    id: 'fr-u1-l2',
    unitId: 'fr-unit-1',
    title: 'Daily Life',
    description: 'Learn to talk about your daily routines in simple French.',
    order: 2,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'fr-goal-2',
        description: 'Discuss basic routines',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'fr-act-2',
        type: 'multiple_choice',
        prompt: 'How do you say "Goodnight" in French?',
        options: ['Bonjour', 'Bonsoir', 'Bonne nuit', 'Salut'],
        correctAnswer: 'Bonne nuit',
      },
    ],
  },
  {
    id: 'fr-u1-l3',
    unitId: 'fr-unit-1',
    title: 'At the Café',
    description: 'Practice ordering croissants and café au lait in Paris.',
    order: 3,
    xp: 20,
    type: 'chat',
    goals: [
      {
        id: 'fr-goal-3',
        description: 'Order food and drinks at a café',
        targetSkill: 'chat',
      },
    ],
    aiPrompt: {
      teacherName: 'Chloé',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      systemPrompt: 'You are Chloé, a friendly Parisian barista. Help the user order a croissant.',
      initialMessage: 'Bonjour! Bienvenue. Qu\'est-ce que je vous sers?',
      scenarioDescription: 'Order coffee and a pastry at a beautiful Parisian café.',
    },
    activities: [
      {
        id: 'fr-act-3',
        type: 'multiple_choice',
        prompt: 'What does "S\'il vous plaît" mean?',
        options: ['Thank you', 'Please', 'Excuse me', 'Hello'],
        correctAnswer: 'Please',
      },
    ],
  },
  {
    id: 'fr-u1-l4',
    unitId: 'fr-unit-1',
    title: 'Travel & Directions',
    description: 'Learn to navigate around French cities and transit stations.',
    order: 4,
    xp: 15,
    type: 'audio',
    goals: [
      {
        id: 'fr-goal-4',
        description: 'Ask for and follow directions',
        targetSkill: 'listening',
      },
    ],
    activities: [
      {
        id: 'fr-act-4',
        type: 'multiple_choice',
        prompt: 'How do you say "Where is the station?" in French?',
        options: ['Où est la gare ?', 'Où est l\'hôtel ?', 'C\'est combien ?', 'Merci'],
        correctAnswer: 'Où est la gare ?',
      },
    ],
  },
  {
    id: 'fr-u1-l5',
    unitId: 'fr-unit-1',
    title: 'Shopping',
    description: 'Practice shopping for clothes and souvenirs in French boutiques.',
    order: 5,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'fr-goal-5',
        description: 'Ask for sizes and prices',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'fr-act-5',
        type: 'multiple_choice',
        prompt: 'Translate: "Ça coûte combien ?"',
        options: ['Where is it?', 'How much does it cost?', 'What is this?', 'Goodbye'],
        correctAnswer: 'How much does it cost?',
      },
    ],
  },
  {
    id: 'fr-u1-l6',
    unitId: 'fr-unit-1',
    title: 'Family & Friends',
    description: 'Talk about your family members and introduce your friends.',
    order: 6,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'fr-goal-6',
        description: 'Describe family members',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'fr-act-6',
        type: 'multiple_choice',
        prompt: 'What is the French word for "Brother"?',
        options: ['Père', 'Mère', 'Frère', 'Sœur'],
        correctAnswer: 'Frère',
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
    activities: [
      {
        id: 'ja-act-1',
        type: 'multiple_choice',
        prompt: 'Select the translation for "こんにちは (Konnichiwa)"',
        options: ['Goodbye', 'Hello', 'Thank you', 'Excuse me'],
        correctAnswer: 'Hello',
      },
    ],
  },
  {
    id: 'ja-u1-l2',
    unitId: 'ja-unit-1',
    title: 'Daily Life',
    description: 'Understand everyday words for routines and times.',
    order: 2,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'ja-goal-2',
        description: 'Discuss basic routines',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'ja-act-2',
        type: 'multiple_choice',
        prompt: 'How do you say "Good morning" politely in Japanese?',
        options: ['こんにちは (Konnichiwa)', 'おやすみなさい (Oyasuminasai)', 'おはようございます (Ohayou gozaimasu)', 'さようなら (Sayounara)'],
        correctAnswer: 'おはようございます (Ohayou gozaimasu)',
      },
    ],
  },
  {
    id: 'ja-u1-l3',
    unitId: 'ja-unit-1',
    title: 'At the Café',
    description: 'Practice ordering green tea and delicious desserts in Kyoto.',
    order: 3,
    xp: 20,
    type: 'chat',
    goals: [
      {
        id: 'ja-goal-3',
        description: 'Order food politely',
        targetSkill: 'chat',
      },
    ],
    aiPrompt: {
      teacherName: 'Kenji',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Kenji, a helpful server. Help the user order green tea.',
      initialMessage: 'いらっしゃいませ！ご注文はお決まりですか？',
      scenarioDescription: 'Order a cup of green tea (ocha) in Japanese.',
    },
    activities: [
      {
        id: 'ja-act-3',
        type: 'multiple_choice',
        prompt: 'How do you say "Please give me water"?',
        options: ['お水をください (Omizu o kudasai)', 'こんにちは (Konnichiwa)', 'ありがとう (Arigatou)', 'さようなら (Sayounara)'],
        correctAnswer: 'お水をください (Omizu o kudasai)',
      },
    ],
  },
  {
    id: 'ja-u1-l4',
    unitId: 'ja-unit-1',
    title: 'Travel & Directions',
    description: 'Learn directions and how to ask for locations in Tokyo.',
    order: 4,
    xp: 15,
    type: 'audio',
    goals: [
      {
        id: 'ja-goal-4',
        description: 'Navigate using transit and directions',
        targetSkill: 'listening',
      },
    ],
    activities: [
      {
        id: 'ja-act-4',
        type: 'multiple_choice',
        prompt: 'What does "駅はどこですか？ (Eki wa doko desu ka?)" mean?',
        options: ['Where is the station?', 'Where is the hotel?', 'Where is the bathroom?', 'How much is it?'],
        correctAnswer: 'Where is the station?',
      },
    ],
  },
  {
    id: 'ja-u1-l5',
    unitId: 'ja-unit-1',
    title: 'Shopping',
    description: 'Learn how to ask for prices and buy souvenirs in Akihabara.',
    order: 5,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'ja-goal-5',
        description: 'Inquire about prices',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'ja-act-5',
        type: 'multiple_choice',
        prompt: 'How do you ask "How much is this?" in Japanese?',
        options: ['これはいくらですか？ (Kore wa ikura desu ka?)', 'これは何ですか？ (Kore wa nan desu ka?)', 'すみません (Sumimasen)', 'ありがとう (Arigatou)'],
        correctAnswer: 'これはいくらですか？ (Kore wa ikura desu ka?)',
      },
    ],
  },
  {
    id: 'ja-u1-l6',
    unitId: 'ja-unit-1',
    title: 'Family & Friends',
    description: 'Describe family members and introducing someone.',
    order: 6,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'ja-goal-6',
        description: 'Name basic family roles',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'ja-act-6',
        type: 'multiple_choice',
        prompt: 'What is the Japanese word for "Father" when talking to others?',
        options: ['父 (Chichi)', '母 (Haha)', '友達 (Tomodachi)', '先生 (Sensei)'],
        correctAnswer: '父 (Chichi)',
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
    activities: [
      {
        id: 'ko-act-1',
        type: 'multiple_choice',
        prompt: 'Select the correct translation for "안녕하세요 (Annyeonghaseyo)"',
        options: ['Goodbye', 'Thank you', 'Hello', 'Please'],
        correctAnswer: 'Hello',
      },
    ],
  },
  {
    id: 'ko-u1-l2',
    unitId: 'ko-unit-1',
    title: 'Daily Life',
    description: 'Learn common daily words and simple time phrases.',
    order: 2,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'ko-goal-2',
        description: 'Discuss basic routines',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'ko-act-2',
        type: 'multiple_choice',
        prompt: 'How do you say "Goodnight" in polite Korean?',
        options: ['안녕하세요 (Annyeonghaseyo)', '안녕히 주무세요 (Annyeonghi jumuseyo)', '감사합니다 (Gamsahabnida)', '죄송합니다 (Joesonghabnida)'],
        correctAnswer: '안녕히 주무세요 (Annyeonghi jumuseyo)',
      },
    ],
  },
  {
    id: 'ko-u1-l3',
    unitId: 'ko-unit-1',
    title: 'At the Café',
    description: 'Practice ordering standard treats like iced americano in Seoul.',
    order: 3,
    xp: 20,
    type: 'chat',
    goals: [
      {
        id: 'ko-goal-3',
        description: 'Order drinks at a coffee shop',
        targetSkill: 'chat',
      },
    ],
    aiPrompt: {
      teacherName: 'Minjun',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Minjun, a friendly barista in Seoul. Help the user order an iced americano.',
      initialMessage: '어서 오세요! 어떤 걸로 주문하시겠어요?',
      scenarioDescription: 'Order an iced americano (아아) in Korean.',
    },
    activities: [
      {
        id: 'ko-act-3',
        type: 'multiple_choice',
        prompt: 'How do you say "Iced Americano, please"?',
        options: ['아이스 아메리카노 주세요 (Aiseu amerikanoh juseyo)', '물 주세요 (Mul juseyo)', '안녕하세요 (Annyeonghaseyo)', '감사합니다 (Gamsahabnida)'],
        correctAnswer: '아이스 아메리카노 주세요 (Aiseu amerikanoh juseyo)',
      },
    ],
  },
  {
    id: 'ko-u1-l4',
    unitId: 'ko-unit-1',
    title: 'Travel & Directions',
    description: 'Learn directions and how to ask for places in Korea.',
    order: 4,
    xp: 15,
    type: 'audio',
    goals: [
      {
        id: 'ko-goal-4',
        description: 'Navigate transit locations',
        targetSkill: 'listening',
      },
    ],
    activities: [
      {
        id: 'ko-act-4',
        type: 'multiple_choice',
        prompt: 'What does "지하철역이 어디예요? (Jihachyeol-yeogi eodiyeyo?)" mean?',
        options: ['Where is the subway station?', 'Where is the restroom?', 'Where is the hotel?', 'How much is it?'],
        correctAnswer: 'Where is the subway station?',
      },
    ],
  },
  {
    id: 'ko-u1-l5',
    unitId: 'ko-unit-1',
    title: 'Shopping',
    description: 'Learn shopping phrases for cosmetics and fashion items.',
    order: 5,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'ko-goal-5',
        description: 'Ask for prices and make payments',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'ko-act-5',
        type: 'multiple_choice',
        prompt: 'How do you ask "How much is this?" in Korean?',
        options: ['이거 얼마예요? (Igeo eolmayeyo?)', '이게 뭐예요? (Ige moyeyo?)', '도와주세요 (Dowajuseyo)', '고맙습니다 (Gomapseumnida)'],
        correctAnswer: '이거 얼마예요? (Igeo eolmayeyo?)',
      },
    ],
  },
  {
    id: 'ko-u1-l6',
    unitId: 'ko-unit-1',
    title: 'Family & Friends',
    description: 'Describe family members and talk about relationships.',
    order: 6,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'ko-goal-6',
        description: 'Name core family relationships',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'ko-act-6',
        type: 'multiple_choice',
        prompt: 'What is the Korean word for "Mother"?',
        options: ['어머니 (Eomeoni)', '아버지 (Abeoji)', '동생 (Dongsaeng)', '친구 (Chingu)'],
        correctAnswer: '어머니 (Eomeoni)',
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
  {
    id: 'de-u1-l2',
    unitId: 'de-unit-1',
    title: 'Daily Life',
    description: 'Learn vocabulary for daily activities and routines.',
    order: 2,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'de-goal-2',
        description: 'Introduce daily routine terms',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'de-act-2',
        type: 'multiple_choice',
        prompt: 'How do you say "Goodnight" in German?',
        options: ['Guten Morgen', 'Guten Abend', 'Gute Nacht', 'Tschüss'],
        correctAnswer: 'Gute Nacht',
      },
    ],
  },
  {
    id: 'de-u1-l3',
    unitId: 'de-unit-1',
    title: 'At the Café',
    description: 'Practice ordering coffee or beer and pretzels in Munich.',
    order: 3,
    xp: 20,
    type: 'chat',
    goals: [
      {
        id: 'de-goal-3',
        description: 'Order food and drinks',
        targetSkill: 'chat',
      },
    ],
    aiPrompt: {
      teacherName: 'Lukas',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Lukas, a friendly Munich waiter. Help the user order a beer.',
      initialMessage: 'Hallo! Willkommen. Was kann ich Ihnen bringen?',
      scenarioDescription: 'Order a local beer (Bier) in German.',
    },
    activities: [
      {
        id: 'de-act-3',
        type: 'multiple_choice',
        prompt: 'How do you say "A beer, please"?',
        options: ['Ein Bier, bitte', 'Ein Kaffee, bitte', 'Danke', 'Guten Tag'],
        correctAnswer: 'Ein Bier, bitte',
      },
    ],
  },
  {
    id: 'de-u1-l4',
    unitId: 'de-unit-1',
    title: 'Travel & Directions',
    description: 'Learn directions and asking how to get to train stations.',
    order: 4,
    xp: 15,
    type: 'audio',
    goals: [
      {
        id: 'de-goal-4',
        description: 'Navigate transit locations',
        targetSkill: 'listening',
      },
    ],
    activities: [
      {
        id: 'de-act-4',
        type: 'multiple_choice',
        prompt: 'Translate: "Wo ist der Bahnhof?"',
        options: ['Where is the station?', 'Where is the hotel?', 'Where is the restroom?', 'How much is it?'],
        correctAnswer: 'Where is the station?',
      },
    ],
  },
  {
    id: 'de-u1-l5',
    unitId: 'de-unit-1',
    title: 'Shopping',
    description: 'Learn basic terms for currency, clothing, and purchasing.',
    order: 5,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'de-goal-5',
        description: 'Ask for prices',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'de-act-5',
        type: 'multiple_choice',
        prompt: 'Translate: "Wie viel kostet das?"',
        options: ['How much does this cost?', 'Where is the hotel?', 'What is that?', 'Goodbye'],
        correctAnswer: 'How much does this cost?',
      },
    ],
  },
  {
    id: 'de-u1-l6',
    unitId: 'de-unit-1',
    title: 'Family & Friends',
    description: 'Describe your parents, siblings, and friends.',
    order: 6,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'de-goal-6',
        description: 'Describe family members',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'de-act-6',
        type: 'multiple_choice',
        prompt: 'What is the German word for "Brother"?',
        options: ['Vater', 'Mutter', 'Bruder', 'Schwester'],
        correctAnswer: 'Bruder',
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
  {
    id: 'zh-u1-l2',
    unitId: 'zh-unit-1',
    title: 'Daily Life',
    description: 'Learn names of common daily objects and time concepts.',
    order: 2,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'zh-goal-2',
        description: 'Discuss routines and items',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'zh-act-2',
        type: 'multiple_choice',
        prompt: 'How do you say "Goodnight" in Chinese?',
        options: ['早上好 (Zǎoshang hǎo)', '晚安 (Wǎn\'ān)', '谢谢 (Xièxiè)', '再见 (Zàijiàn)'],
        correctAnswer: '晚安 (Wǎn\'ān)',
      },
    ],
  },
  {
    id: 'zh-u1-l3',
    unitId: 'zh-unit-1',
    title: 'At the Café',
    description: 'Practice ordering hot Chinese tea and delicious snacks.',
    order: 3,
    xp: 20,
    type: 'chat',
    goals: [
      {
        id: 'zh-goal-3',
        description: 'Order tea at a tea house',
        targetSkill: 'chat',
      },
    ],
    aiPrompt: {
      teacherName: 'Mei',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      systemPrompt: 'You are Mei, a friendly tea house server in Beijing. Help the user order green tea.',
      initialMessage: '您好！欢迎光临。请问您要喝点什么茶？',
      scenarioDescription: 'Order a cup of green tea (绿茶) in Chinese.',
    },
    activities: [
      {
        id: 'zh-act-3',
        type: 'multiple_choice',
        prompt: 'How do you say "Green tea, please"?',
        options: ['请给我绿茶 (Qǐng gěi wǒ lǜchá)', '请给我水 (Qǐng gěi wǒ shuǐ)', '谢谢 (Xièxiè)', '您好 (Nǐ hǎo)'],
        correctAnswer: '请给我绿茶 (Qǐng gěi wǒ lǜchá)',
      },
    ],
  },
  {
    id: 'zh-u1-l4',
    unitId: 'zh-unit-1',
    title: 'Travel & Directions',
    description: 'Learn directions and how to navigate subway stations in China.',
    order: 4,
    xp: 15,
    type: 'audio',
    goals: [
      {
        id: 'zh-goal-4',
        description: 'Ask for locations and directions',
        targetSkill: 'listening',
      },
    ],
    activities: [
      {
        id: 'zh-act-4',
        type: 'multiple_choice',
        prompt: 'Translate: "地铁站在哪里？ (Dìtiězhàn zài nǎlǐ?)"',
        options: ['Where is the subway station?', 'Where is the hotel?', 'Where is the toilet?', 'How much is it?'],
        correctAnswer: 'Where is the subway station?',
      },
    ],
  },
  {
    id: 'zh-u1-l5',
    unitId: 'zh-unit-1',
    title: 'Shopping',
    description: 'Practice asking for prices and checking out items.',
    order: 5,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'zh-goal-5',
        description: 'Ask about prices and items',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'zh-act-5',
        type: 'multiple_choice',
        prompt: 'How do you ask "How much is this?" in Chinese?',
        options: ['这个多少钱？ (Zhège duōshǎo qián?)', '这个是什么？ (Zhège shì shénme?)', '谢谢您 (Xièxiè nín)', '对不起 (Duìbùqǐ)'],
        correctAnswer: '这个多少钱？ (Zhège duōshǎo qián?)',
      },
    ],
  },
  {
    id: 'zh-u1-l6',
    unitId: 'zh-unit-1',
    title: 'Family & Friends',
    description: 'Talk about your family members and describe relationships.',
    order: 6,
    xp: 15,
    type: 'vocabulary',
    goals: [
      {
        id: 'zh-goal-6',
        description: 'Talk about siblings and parents',
        targetSkill: 'vocabulary',
      },
    ],
    activities: [
      {
        id: 'zh-act-6',
        type: 'multiple_choice',
        prompt: 'What is the Chinese word for "Older Brother"?',
        options: ['哥哥 (Gēge)', '弟弟 (Dìdi)', '姐姐 (Jiějie)', '妹妹 (Mèimei)'],
        correctAnswer: '哥哥 (Gēge)',
      },
    ],
  },
];
