# Improve AI Teacher's Spoken Output & Fix Connection Issues

Improve the AI teacher's persona and spoken output to be warm, energetic, human, and lesson-focused. Also, fix connection errors and deprecation warnings in the app.

## Proposed Changes

### Vision Agent

Update the base instructions to establish a warm, energetic, and lesson-focused persona.

#### [main.py](file:///C:/Users/student/AndroidStudioProjects/react-native-lingua/vision-agent/main.py)

- Replace the base `instructions` in the `create_agent` function.
- The new instructions will emphasize:
    - Staying strictly within the lesson context.
    - Speaking mostly English with slow introductions of target-language words and translations.
    - Using natural conversational English with contractions.
    - Providing gentle encouragement and adapting to the student's responses.
    - Keeping replies to 1-2 sentences.

```python
    agent = Agent(
        edge=Edge(),
        llm=llm,
        agent_user=User(id="teacher", name="AI Teacher"),
        instructions="""
You are a warm, energetic, and highly focused language teacher in a Duolingo-inspired app.
Your persona is that of a real-world language teacher: professional yet very friendly and encouraging.

CORE PRINCIPLES:
1. FOCUS: Stay strictly within the current lesson's goal, vocabulary, and phrases. Do not teach unrelated topics.
2. LANGUAGE: Mostly speak English. Introduce target-language words and phrases slowly, always providing English translations immediately.
3. TONE: Be warm, human, and energetic. Use natural conversational English with contractions (e.g., "don't" instead of "do not", "let's" instead of "let us").
4. ENGAGEMENT: Use gentle encouragement. Keep your responses short (1-2 conversational sentences).
5. INTERACTION: Listen carefully to the student. If they make a mistake or seem hesitant, adapt your next explanation. Ask the student to repeat words or try phrases again.
6. TARGET LANGUAGE ONLY: Do not switch to or teach any other languages except the target language for the current lesson.

INSTRUCTIONS:
- When introducing a new word, say it clearly, then give the translation.
- If the student is correct, give warm praise.
- If the student is incorrect, gently correct them and ask them to try again.
- Keep the energy high!
"""
    )
```

---

### Data Layer

Update lesson entries to provide specific prompts and initial messages for the AI teacher.

#### [lessons.ts](file:///C:/Users/student/AndroidStudioProjects/react-native-lingua/src/data/lessons.ts)

- Add or update `aiPrompt` for lessons (especially those of type `video` and `chat`).
- Ensure `initialMessage` and `systemPrompt` align with the new warm and lesson-focused style.

---

### Bug Fixes

Fix connection errors and deprecation warnings.

#### [vision-agent.ts](file:///C:/Users/student/AndroidStudioProjects/react-native-lingua/src/lib/vision-agent.ts)

- Update the fallback port from `8083` to `8081` to match the default Expo Dev Server port, as API routes are served on the same port.

#### [index.tsx](file:///C:/Users/student/AndroidStudioProjects/react-native-lingua/src/app/(tabs)/index.tsx), [learn.tsx](file:///C:/Users/student/AndroidStudioProjects/react-native-lingua/src/app/(tabs)/learn.tsx), [choose-language.tsx](file:///C:/Users/student/AndroidStudioProjects/react-native-lingua/src/app/choose-language.tsx)

- Update `SafeAreaView` import to use `react-native-safe-area-context` instead of `react-native`.

## Verification Plan

### Automated Tests
- No automated tests are available for AI persona behavior.

### Manual Verification
- Review the updated `main.py` and `lessons.ts` to ensure all requirements are met.
- Verify that `lessons.ts` contains `aiPrompt` for the relevant lessons.
- (Optional) Start a session and verify the teacher's initial message and behavior (requires running the Vision Agent server).
