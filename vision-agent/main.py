import os
from dotenv import load_dotenv
from vision_agents.core import Agent, Runner, AgentLauncher, User
from vision_agents.plugins.getstream import Edge
from vision_agents.plugins import openai

# Load environment variables from parent .env
load_dotenv("../.env")
load_dotenv()

async def create_agent(**kwargs) -> Agent:
    """
    Creates and configures the Vision Agent.
    """
    # OpenAI Realtime handles both LLM and voice natively
    # We ensure we use the model that supports realtime audio
    llm = openai.Realtime(
        model="gpt-4o-realtime-preview-2024-10-01",
    )

    agent = Agent(
        edge=Edge(),
        llm=llm,
        agent_user=User(id="teacher", name="AI Teacher"),
        instructions="""
You are a warm, energetic, and highly focused language teacher in a Duolingo-inspired app.
Your persona is that of a real-world language teacher: professional yet very friendly and encouraging.

CORE PRINCIPLES:
1. LIVE INTERACTION: This is a 1-on-1 live session, NOT a recording. You MUST listen to the student and wait for them to speak. If they speak, react to what they said.
2. TURN-TAKING: Never speak more than two sentences at once. After every explanation or question, STOP and wait for the student's audio input.
3. FOCUS: Stay strictly within the current lesson's goal, vocabulary, and phrases. Do not teach unrelated topics.
4. LANGUAGE: Mostly speak English. Introduce target-language words and phrases slowly, always providing English translations immediately.
5. TONE: Be warm, human, and energetic. Use natural conversational English with contractions (e.g., "I'm", "don't", "let's").
6. ENGAGEMENT: Use gentle encouragement. If they are correct, give warm praise. If they are incorrect, gently correct them and ask them to try again.
7. ADAPTIVITY: Listen carefully to the student. If they make a mistake or seem hesitant, adapt your next explanation. Ask the student to repeat words or try phrases again.
8. TARGET LANGUAGE ONLY: Do not switch to or teach any other languages except the target language for the current lesson.

INSTRUCTIONS:
- Start with the provided initial_message.
- When introducing a new word, say it clearly, give the translation, and ask the student to repeat it.
- Keep replies to one or two conversational sentences to keep the dialogue flowing.
- ALWAYS wait for the student to finish speaking before responding.
"""
    )
    return agent

async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs):
    """
    Lifecycle method called when the agent joins a call.
    """
    # 1. Create the call object
    call = await agent.create_call(call_type, call_id)

    # 2. Get call data to access custom fields
    call_data = await call.get()
    custom = call_data.call.custom

    language_id = custom.get("language_id", "en")
    lesson_title = custom.get("lesson_title", "General Practice")
    goals = custom.get("goals", [])
    vocabulary = custom.get("vocabulary", [])
    phrases = custom.get("phrases", [])
    teacher_prompt = custom.get("teacher_prompt", "")
    scenario = custom.get("scenario", "")
    initial_message = custom.get("initial_message", "")

    # Map common IDs to full names
    language_map = {
        "es": "Spanish",
        "fr": "French",
        "ja": "Japanese",
        "ko": "Korean",
        "de": "German",
        "zh": "Chinese",
        "en": "English"
    }
    language_name = language_map.get(language_id, language_id)

    # Update agent instructions with lesson context
    is_english_target = language_id == "en"
    
    context_instructions = f"""
Current Lesson: {lesson_title}
Target Language: {language_name}
Scenario: {scenario}

Learning Goals:
{chr(10).join([f"- {g}" for g in goals])}

Key Vocabulary:
{chr(10).join([f"- {v['word']}: {v['translation']}" for v in vocabulary])}

Key Phrases:
{chr(10).join([f"- {p['text']}: {p['translation']}" for p in phrases])}

Additional Teacher Instructions:
{teacher_prompt}
"""
    if is_english_target:
        context_instructions += "\nNOTE: The target language is English. Since you already speak English, focus on teaching the specific phrases and vocabulary mentioned above. Be a conversation partner and correct the student's grammar or pronunciation in English."
    else:
        context_instructions += f"\nNOTE: Mostly speak English, but focus on teaching {language_name}. Always provide translations for {language_name} words."

    agent.instructions += "\n" + context_instructions

    # 3. Join the call using an async context manager
    async with agent.join(call):
        # Use initial message if provided, otherwise a default one
        greeting = initial_message if initial_message else f"Hello! I am your AI language teacher. I'm excited to help you practice {language_name} today with our lesson on {lesson_title}. Let's get started!"
        await agent.say(greeting)

        # Keep the agent running until the call ends
        await agent.finish()

if __name__ == "__main__":
    # The Runner handles CLI arguments for 'run' and 'serve' modes
    launcher = AgentLauncher(create_agent=create_agent, join_call=join_call)
    Runner(launcher).cli()
