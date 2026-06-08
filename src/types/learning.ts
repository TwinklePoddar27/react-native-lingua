export interface Language {
  id: string; // e.g., 'es', 'fr', 'ja'
  code: string; // e.g., 'es', 'fr', 'ja'
  name: string; // e.g., 'Spanish'
  nativeName: string; // e.g., 'Español'
  flagIcon: string; // Flag image URL or asset path
  learnersCount: string; // e.g., '28.4M learners'
  description: string;
}

export interface Unit {
  id: string; // e.g., 'es-unit-1'
  languageId: string; // e.g., 'es'
  title: string;
  description: string;
  order: number;
}

export type LessonType = 'video' | 'audio' | 'chat' | 'vocabulary' | 'practice';

export interface Lesson {
  id: string; // e.g., 'es-lesson-1'
  unitId: string; // e.g., 'es-unit-1'
  title: string;
  description: string;
  order: number;
  xp: number;
  type: LessonType;
  goals: LessonGoal[];
  aiPrompt?: AITeacherPrompt;
  vocabList?: VocabularyItem[];
  phrases?: Phrase[];
  activities: Activity[];
}

export interface LessonGoal {
  id: string;
  description: string;
  targetSkill: string; // e.g., 'speaking', 'listening', 'vocabulary', 'grammar'
}

export interface AITeacherPrompt {
  teacherName: string;
  avatarUrl?: string;
  voiceId?: string; // voice style configuration
  systemPrompt: string; // prompt for the agent
  initialMessage: string;
  scenarioDescription: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'interjection' | 'phrase' | 'particle' | 'other';
  exampleSentence: string;
  exampleTranslation: string;
}

export interface Phrase {
  id: string;
  text: string;
  translation: string;
  pronunciation: string;
  context: string;
}

export type ActivityType = 
  | 'multiple_choice' 
  | 'translate' 
  | 'tap_pairs' 
  | 'listen_speak' 
  | 'fill_blank';

export interface Activity {
  id: string;
  type: ActivityType;
  prompt: string; // e.g., "Translate this sentence" or "Select the correct meaning"
  questionText?: string; // e.g., "Hola, ¿cómo estás?"
  options?: string[]; // for multiple choice or matching
  correctAnswer: string | string[]; // answer text, correct option index, or matches
  audioUrl?: string; // optional reference for listening activity
  tip?: string;
}
