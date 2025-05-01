import { Exercise, Set } from '@/types';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY || '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';
const MODEL = process.env.OPENROUTER_MODEL || 'qwen/qwen3-4b:free'

// Format returned workout to match assets/data/programs.json
export type GeneratedProgram = {
  id: string;
  name: string;
  exercises: Array<{
    id: string;
    name: string;
    setList: Set[];
  }>;
};

/**
 * Send a request to OpenRouter LLM.
 * @param inputType 'generate' for workouts, 'ask' for free text answers
 * @param text user input describing workout or question
 * @param exercisesList optional list of exercises to include in the prompt
 */
export async function askCoach(
  inputType: 'generate' | 'ask',
  text: string,
  exercisesList: { id: string; name: string }[] = []
): Promise<string | GeneratedProgram> {
  //console.log('[askCoach] parameters:', { inputType, text, exercisesList });
  if (!API_KEY) throw new Error('Missing OPENROUTER_API_KEY environment variable');

  // For workout generation, include available exercises list so the LLM can reference IDs
  const listPrompt =
    inputType === 'generate' && exercisesList.length > 0
      ? `Here is the list of valid exercises with their IDs:
${JSON.stringify(exercisesList)}
Use only these when composing the workout.`
      : '';
  // Log the generated listPrompt
  //console.log('[askCoach] listPrompt:', listPrompt);
  const systemPrompt =
    inputType === 'generate'
      ? `You are a gym coach that outputs a complete workout as a JSON object in this exact format:
{ "id": "<workout id>", "name": "<workout name>", "exercises": [ { "id": "<string>", "name": "<exercise name>", "setList": [ { "id": "1", "setNum": 1, "weight": 0, "reps": 12 }, ... ] }, ... ] }
Use the user's description to build the workout containing 3-8 exercises. ${listPrompt}
Do not wrap in code fences or include extra text.`
      : 'You are a helpful gym coach. Answer the user question in plain text.';
  //console.log('[askCoach] systemPrompt:', systemPrompt);

  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text }
    ]
  };
  //console.log('[askCoach] request body:', body);

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify(body)
  });
  console.log('[askCoach] response status:', res.status);
  if (!res.ok) {
    const err = await res.text();
    console.error('[askCoach] fetch error response:', err);
    throw new Error(`OpenRouter API error: ${res.status} ${err}`);
  }

  const json = await res.json();
  console.log('[askCoach] response json:', json);
  const content: string = json.choices?.[0]?.message?.content;
  if (!content) throw new Error('No response from LLM');
  console.log('[askCoach] content:', content);

  if (inputType === 'generate') {
    try {
      console.log('[askCoach] parsing program JSON');
      const program: GeneratedProgram = JSON.parse(content);
      console.log('[askCoach] parsed program:', program);
      return program;
    } catch (e) {
      console.error('[askCoach] JSON parse error:', e);
      throw new Error('Failed to parse workout JSON: ' + e);
    }
  }

  // for questions, return raw text answer
  return content.trim();
}
