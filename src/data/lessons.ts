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
      { id: 'es-goal-1', description: 'Greet people at different times of the day', targetSkill: 'vocabulary' },
      { id: 'es-goal-2', description: 'Politely say hello and goodbye', targetSkill: 'vocabulary' },
    ],
    aiPrompt: {
      teacherName: 'Sofía',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      systemPrompt: 'You are Sofía, an energetic Spanish teacher. Today you are teaching basic greetings: "Hola" (Hello), "Adiós" (Goodbye), and "Buenos días" (Good morning). Keep it simple, speak mostly English, and be very encouraging! Ask the student to repeat words frequently.',
      initialMessage: '¡Hola! I\'m Sofía, and I\'m so excited to be your teacher today! We\'re going to start with something fun: greetings. Let\'s try saying "Hola", which means "Hello". Can you try saying "Hola" for me?',
      scenarioDescription: 'Learn simple greetings and introductions with Sofía.',
    },
    vocabList: [
      { id: 'es-v-1', word: 'Hola', translation: 'Hello', pronunciation: 'OH-lah', partOfSpeech: 'interjection', exampleSentence: 'Hola, ¿cómo estás?', exampleTranslation: 'Hello, how are you?' },
      { id: 'es-v-2', word: 'Adiós', translation: 'Goodbye', pronunciation: 'ah-DYOHS', partOfSpeech: 'interjection', exampleSentence: 'Adiós, nos vemos mañana.', exampleTranslation: 'Goodbye, see you tomorrow.' },
      { id: 'es-v-3', word: 'Buenos días', translation: 'Good morning', pronunciation: 'BWEH-nos DEE-ahs', partOfSpeech: 'phrase', exampleSentence: 'Buenos días, mamá.', exampleTranslation: 'Good morning, mom.' },
    ],
    phrases: [
      { id: 'es-p-1', text: '¿Cómo estás?', translation: 'How are you?', pronunciation: 'KO-mo ehs-TAHS', context: 'A friendly greeting to ask about someone\'s well-being.' },
    ],
    activities: [
      { id: 'es-act-1', type: 'multiple_choice', prompt: 'Select the correct translation for "Hola"', options: ['Goodbye', 'Please', 'Hello', 'Thank you'], correctAnswer: 'Hello' },
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
    goals: [{ id: 'es-goal-3', description: 'Order drinks and pastries in Spanish', targetSkill: 'speaking' }],
    aiPrompt: {
      teacherName: 'Sofía',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      systemPrompt: 'You are Sofía, a friendly and energetic barista. Help the user order a drink. Encourage them to use "Por favor" (Please). Speak mostly English but introduce Spanish words slowly.',
      initialMessage: '¡Hola! Welcome to our little café! I\'m Sofía. I\'d love to help you order a drink. Let\'s start by saying "Un café, por favor", which means "A coffee, please". Can you give that a try?',
      scenarioDescription: 'Practice ordering a coffee from Sofía at a lively café.',
    },
    activities: [
      { id: 'es-act-6', type: 'multiple_choice', prompt: 'Which phrase is the most natural way to ask for the bill?', options: ['Hola señor', 'La cuenta, por favor', '¿Dónde está el café?', 'Mucho gusto'], correctAnswer: 'La cuenta, por favor' },
    ],
  },
  {
    id: 'es-u2-l2',
    unitId: 'es-unit-2',
    title: 'Taking the Metro',
    description: 'Learn to ask for metro directions and buy tickets.',
    order: 2,
    xp: 20,
    type: 'audio',
    goals: [{ id: 'es-goal-8', description: 'Ask for metro directions', targetSkill: 'speaking' }],
    aiPrompt: {
      teacherName: 'Sofía',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      systemPrompt: 'You are Sofía, helping the student at a Madrid metro station. Teach "Metro" and "¿Dónde está?".',
      initialMessage: '¡Hola! Let\'s navigate the Madrid Metro! To ask where it is, say "¿Dónde está el metro?". Can you try that?',
      scenarioDescription: 'Navigate the Madrid metro station with Sofía.',
    },
  },

  // ==========================================
  // ENGLISH LESSONS (Unit 1: English Essentials)
  // ==========================================
  {
    id: 'en-u1-l1',
    unitId: 'en-unit-1',
    title: 'Hello & Welcome',
    description: 'Learn to greet people and introduce yourself in English.',
    order: 1,
    xp: 10,
    type: 'audio',
    goals: [{ id: 'en-goal-1', description: 'Use standard English greetings', targetSkill: 'vocabulary' }],
    aiPrompt: {
      teacherName: 'Alex',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Alex, a friendly English teacher. Teach basic greetings like "Hello", "Hi", and "Welcome". Use natural conversational English and ask the student to repeat after you.',
      initialMessage: 'Hi there! I\'m Alex, and I\'m excited to be your English teacher! Let\'s start with a simple "Hello". Can you say it?',
      scenarioDescription: 'Learn basic English greetings with Alex.',
    },
    vocabList: [
      { id: 'en-v-1', word: 'Hello', translation: 'Hello', pronunciation: 'hel-OH', partOfSpeech: 'interjection', exampleSentence: 'Hello, how can I help you?', exampleTranslation: 'Hello, how can I help you?' },
    ],
  },
  {
    id: 'en-u1-l2',
    unitId: 'en-unit-1',
    title: 'Daily Coffee',
    description: 'Practice ordering coffee and small talk at a modern cafe.',
    order: 2,
    xp: 15,
    type: 'audio',
    goals: [{ id: 'en-goal-2', description: 'Order coffee in a natural way', targetSkill: 'speaking' }],
    aiPrompt: {
      teacherName: 'Alex',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Alex, a barista at a busy New York cafe. Help the user order their morning coffee. Use natural New York slang and keep it friendly!',
      initialMessage: 'Hey! Welcome to Grounded Coffee. I\'m Alex. What can I get started for you today? Try saying "I\'d like a latte, please"!',
      scenarioDescription: 'Order coffee and practice small talk in a New York cafe.',
    },
  },
  {
    id: 'en-u1-l3',
    unitId: 'en-unit-1',
    title: 'Meeting New Friends',
    description: 'Learn to introduce yourself and ask about others.',
    order: 3,
    xp: 15,
    type: 'audio',
    goals: [{ id: 'en-goal-3', description: 'Introduce yourself confidently', targetSkill: 'speaking' }],
    aiPrompt: {
      teacherName: 'Alex',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Alex, meeting the student at a party. Teach them to say "My name is...".',
      initialMessage: 'Hey! I\'m Alex. Nice to meet you! To introduce yourself, you can say "My name is" and then your name. Give it a try!',
      scenarioDescription: 'Socialize at a friendly gathering with Alex.',
    },
  },
  {
    id: 'en-u2-l1',
    unitId: 'en-unit-2',
    title: 'Office Introductions',
    description: 'Learn to introduce colleagues and your role at work.',
    order: 1,
    xp: 20,
    type: 'audio',
    goals: [{ id: 'en-goal-4', description: 'Professional introductions', targetSkill: 'speaking' }],
    aiPrompt: {
      teacherName: 'Alex',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Alex, a senior manager. Help the student introduce themselves in a meeting.',
      initialMessage: 'Good morning! Welcome to the team. Let\'s practice your elevator pitch. Start by saying "I\'m the new developer here".',
      scenarioDescription: 'Navigate professional introductions at a modern office.',
    },
  },
  {
    id: 'en-u2-l2',
    unitId: 'en-unit-2',
    title: 'Writing Professional Emails',
    description: 'Learn common phrases for business email communication.',
    order: 2,
    xp: 15,
    type: 'audio',
    goals: [{ id: 'en-goal-5', description: 'Business email etiquette', targetSkill: 'writing' }],
    aiPrompt: {
      teacherName: 'Alex',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Alex, helping the student write an email to a client. Teach "I am writing to inform you...".',
      initialMessage: 'Hi! Let\'s polish your business writing. When starting a formal email, you can say "I am writing to inform you". Try saying that out loud!',
      scenarioDescription: 'Draft professional emails with Alex in a corporate setting.',
    },
  },

  // ==========================================
  // FRENCH LESSONS (Unit 2: Dining & Food)
  // ==========================================
  {
    id: 'fr-u1-l1',
    unitId: 'fr-unit-1',
    title: 'First French Words',
    description: 'Learn foundational greetings and expressions in French.',
    order: 1,
    xp: 10,
    type: 'vocabulary',
    goals: [{ id: 'fr-goal-1', description: 'Understand the basic greetings in French', targetSkill: 'vocabulary' }],
    aiPrompt: {
      teacherName: 'Chloé',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      systemPrompt: 'You are Chloé, a warm French teacher. Teach "Bonjour" (Hello) and "Salut" (Hi). Speak mostly English and be very encouraging! Ask the student to repeat words.',
      initialMessage: 'Bonjour! I\'m Chloé, and I\'m so happy to be teaching you French today! Let\'s start with a classic. Can you say "Bonjour"? It means hello!',
      scenarioDescription: 'Learn first French words with Chloé.',
    },
  },
  {
    id: 'fr-u2-l1',
    unitId: 'fr-unit-2',
    title: 'Dinner Reservations',
    description: 'Practice booking a table and arriving at a restaurant.',
    order: 1,
    xp: 20,
    type: 'audio',
    goals: [{ id: 'fr-goal-7', description: 'Book a table in French', targetSkill: 'speaking' }],
    aiPrompt: {
      teacherName: 'Chloé',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      systemPrompt: 'You are Chloé, a restaurant hostess in Lyon. Teach "Une table pour deux" (A table for two).',
      initialMessage: 'Bonsoir! Welcome to Le Petit Bistro. To ask for a table, say "Une table pour deux, s\'il vous plaît". Try it!',
      scenarioDescription: 'Arrive at a French bistro and ask for a table.',
    },
  },

  // ==========================================
  // JAPANESE LESSONS (Unit 2: City Exploration)
  // ==========================================
  {
    id: 'ja-u1-l3',
    unitId: 'ja-unit-1',
    title: 'At the Café',
    description: 'Practice ordering green tea and delicious desserts in Kyoto.',
    order: 3,
    xp: 20,
    type: 'chat',
    goals: [{ id: 'ja-goal-3', description: 'Order food politely', targetSkill: 'chat' }],
    aiPrompt: {
      teacherName: 'Kenji',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Kenji, a helpful server. Help the user order green tea. Speak mostly English and encourage them to use "Onegai shimasu" (Please). Ask them to repeat phrases.',
      initialMessage: 'Irasshaimase! Welcome! I\'m Kenji. Are you ready to order? Let\'s try saying "Ocha o onegai shimasu" for some green tea!',
      scenarioDescription: 'Order a cup of green tea (ocha) in Japanese.',
    },
  },
  {
    id: 'ja-u2-l1',
    unitId: 'ja-unit-2',
    title: 'Finding the Station',
    description: 'Learn to navigate Tokyo using simple direction phrases.',
    order: 1,
    xp: 20,
    type: 'audio',
    goals: [{ id: 'ja-goal-7', description: 'Ask for the train station', targetSkill: 'speaking' }],
    aiPrompt: {
      teacherName: 'Kenji',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Kenji, a local in Shibuya. Teach "Eki wa doko desu ka?" (Where is the station?).',
      initialMessage: 'Sumimasen! Need help? If you\'re looking for the train station, say "Eki wa doko desu ka?". Give it a try!',
      scenarioDescription: 'Navigate the busy streets of Shibuya with Kenji.',
    },
  },

  // ==========================================
  // KOREAN LESSONS (Unit 2: Daily Socializing)
  // ==========================================
  {
    id: 'ko-u1-l3',
    unitId: 'ko-unit-1',
    title: 'At the Café',
    description: 'Practice ordering standard treats like iced americano in Seoul.',
    order: 3,
    xp: 20,
    type: 'chat',
    goals: [{ id: 'ko-goal-3', description: 'Order drinks at a coffee shop', targetSkill: 'chat' }],
    aiPrompt: {
      teacherName: 'Minjun',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Minjun, a friendly barista in Seoul. Help the user order an iced americano. Speak mostly English and encourage them to use "Juseyo" (Please/Give me).',
      initialMessage: 'Eoseo oseyo! Welcome! I\'m Minjun. I can help you order. Why don\'t you try saying "Aiseu amerikanoh juseyo"?',
      scenarioDescription: 'Order an iced americano (아아) in Korean.',
    },
  },
  {
    id: 'ko-u2-l1',
    unitId: 'ko-unit-2',
    title: 'Making New Friends',
    description: 'Learn to ask for someone\'s name and social media.',
    order: 1,
    xp: 20,
    type: 'audio',
    goals: [{ id: 'ko-goal-7', description: 'Exchange contact info', targetSkill: 'speaking' }],
    aiPrompt: {
      teacherName: 'Minjun',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Minjun, meeting the student at a university club. Teach "Ireumi mwoyeyo?" (What is your name?).',
      initialMessage: 'Annyeong! I\'m Minjun. To ask someone\'s name, say "Ireumi mwoyeyo?". Can you try that?',
      scenarioDescription: 'Socialize at a Hongdae university meetup with Minjun.',
    },
  },

  // ==========================================
  // GERMAN LESSONS (Unit 2: Shopping & Home)
  // ==========================================
  {
    id: 'de-u1-l3',
    unitId: 'de-unit-1',
    title: 'At the Café',
    description: 'Practice ordering coffee or beer and pretzels in Munich.',
    order: 3,
    xp: 20,
    type: 'chat',
    goals: [{ id: 'de-goal-3', description: 'Order food and drinks', targetSkill: 'chat' }],
    aiPrompt: {
      teacherName: 'Lukas',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      systemPrompt: 'You are Lukas, a friendly Munich waiter. Help the user order a beer. Speak mostly English and encourage them to use "Bitte" (Please).',
      initialMessage: 'Hallo! Welcome to Munich! I\'m Lukas. I\'d love to take your order. How about starting with "Ein Bier, bitte"?',
      scenarioDescription: 'Order a local beer (Bier) in German.',
    },
  },
  {
    id: 'de-u2-l1',
    unitId: 'de-unit-2',
    title: 'Supermarket Run',
    description: 'Learn to find groceries and check out in German.',
    order: 1,
    xp: 20,
    type: 'audio',
    goals: [{ id: 'de-goal-7', description: 'Shop for groceries', targetSkill: 'speaking' }],
    aiPrompt: {
      teacherName: 'Emma',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      systemPrompt: 'You are Emma, a shop assistant. Teach "Ich suche..." (I am looking for...).',
      initialMessage: 'Hallo! Can I help you find something? To say you are looking for milk, say "Ich suche Milch". Try it!',
      scenarioDescription: 'Find items and shop at a modern German supermarket.',
    },
  },

  // ==========================================
  // CHINESE LESSONS (Unit 2: Meeting People)
  // ==========================================
  {
    id: 'zh-u1-l3',
    unitId: 'zh-unit-1',
    title: 'At the Café',
    description: 'Practice ordering hot Chinese tea and delicious snacks.',
    order: 3,
    xp: 20,
    type: 'chat',
    goals: [{ id: 'zh-goal-3', description: 'Order tea at a tea house', targetSkill: 'chat' }],
    aiPrompt: {
      teacherName: 'Mei',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      systemPrompt: 'You are Mei, a friendly tea house server in Beijing. Help the user order green tea. Speak mostly English and encourage them to use "Qǐng" (Please).',
      initialMessage: 'Nǐ hǎo! Welcome to our tea house! I\'m Mei. I can help you order some tea. Why don\'t you try saying "Qǐng gěi wǒ lǜchá"?',
      scenarioDescription: 'Order a cup of green tea (绿茶) in Chinese.',
    },
  },
  {
    id: 'zh-u2-l1',
    unitId: 'zh-unit-2',
    title: 'Introducing Family',
    description: 'Learn to talk about your family members in Chinese.',
    order: 1,
    xp: 20,
    type: 'audio',
    goals: [{ id: 'zh-goal-7', description: 'Introduce family members', targetSkill: 'speaking' }],
    aiPrompt: {
      teacherName: 'Mei',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      systemPrompt: 'You are Mei, visiting the student\'s home. Teach "Zhè shì wǒ de..." (This is my...).',
      initialMessage: 'Nǐ hǎo! I\'d love to meet your family. To say "This is my mother", say "Zhè shì wǒ de māmā". Give it a go!',
      scenarioDescription: 'Host Mei at your home and introduce your family.',
    },
  },
];
