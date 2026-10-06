import { jsonrepair } from 'jsonrepair';

/**
 * Robust JSON parser for LLM responses.
 * Uses `jsonrepair` to automatically fix:
 * 1. Markdown code fences (```json ... ```) and conversational preamble/postamble
 * 2. Unescaped control characters (raw \n, \r, \t) inside string literals
 *    which cause "SyntaxError: Bad control character in string literal in JSON"
 * 3. Unescaped quotes inside string values (e.g., "слово "в кавычках"")
 * 4. Trailing commas, single quotes, missing closing braces/brackets
 */
export function safeParseLlmJson<T = unknown>(raw: string): T {
  if (!raw || typeof raw !== 'string') {
    throw new Error('Empty JSON response from model');
  }

  // 1. Strip markdown fences if present
  let clean = raw.trim();
  const fenceMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    clean = fenceMatch[1].trim();
  } else {
    clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }

  // 2. Extract JSON boundary from first '{' to last '}'
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
    clean = clean.slice(firstBrace, lastBrace + 1);
  }

  // 3. Fast path: try standard JSON.parse
  try {
    return JSON.parse(clean) as T;
  } catch {
    // 4. Robust path: use jsonrepair
    try {
      const repaired = jsonrepair(clean);
      return JSON.parse(repaired) as T;
    } catch {
      // 5. Ultimate fallback: sanitize dangerous non-printable control characters and repair again
      const sanitized = clean.replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, ' ');
      const finalRepaired = jsonrepair(sanitized);
      return JSON.parse(finalRepaired) as T;
    }
  }
}
