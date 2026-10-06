/**
 * Robust JSON parser for LLM responses.
 * Handles:
 * 1. Markdown code fences (```json ... ```)
 * 2. Leading/trailing explanatory text
 * 3. Unescaped control characters (raw \n, \r, \t, etc. inside string literals)
 *    which cause "SyntaxError: Bad control character in string literal in JSON"
 */
export function safeParseLlmJson<T = unknown>(raw: string): T {
  if (!raw || typeof raw !== 'string') {
    throw new Error('Empty JSON response from model');
  }

  // 1. Remove markdown fences if present
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
  } catch (initialErr) {
    // 4. Fallback path: sanitize raw control characters inside double-quoted string literals
    try {
      const sanitized = sanitizeControlCharactersInJson(clean);
      return JSON.parse(sanitized) as T;
    } catch {
      // Re-throw original error with context if sanitization still failed
      throw initialErr;
    }
  }
}

/**
 * Iterates through the JSON string and escapes raw control characters (bytes < 0x20)
 * that occur inside double-quoted string literals without altering structural whitespace.
 */
export function sanitizeControlCharactersInJson(input: string): string {
  let result = '';
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (inString) {
      if (isEscaped) {
        result += char;
        isEscaped = false;
      } else if (char === '\\') {
        result += char;
        isEscaped = true;
      } else if (char === '"') {
        result += char;
        inString = false;
      } else {
        const code = char.charCodeAt(0);
        if (code < 32) {
          if (char === '\n') {
            result += '\\n';
          } else if (char === '\r') {
            result += '\\r';
          } else if (char === '\t') {
            result += '\\t';
          } else {
            result += `\\u${code.toString(16).padStart(4, '0')}`;
          }
        } else {
          result += char;
        }
      }
    } else {
      if (char === '"') {
        inString = true;
      }
      result += char;
    }
  }

  return result;
}
