/**
 * Structured Observability Logger for AI Generation and Delivery Pipelines.
 * Outputs parseable, single-line JSON logs tailored for Vercel, Datadog, CloudWatch, and log analysis queries.
 */

export type AIEventType = 'start' | 'completed' | 'failed' | 'fallback' | 'delivery_summary';

export type AIErrorCategory =
  | 'timeout'
  | 'rate_limit'
  | 'quota_exceeded'
  | 'auth_error'
  | 'json_parse_error'
  | 'connection_error'
  | 'bad_request'
  | 'api_error'
  | 'unknown';

export interface AITokenMetrics {
  prompt?: number;
  completion?: number;
  total?: number;
}

export interface AIErrorInfo {
  type: AIErrorCategory | string;
  message: string;
  status?: number;
  code?: string;
  isRetryable?: boolean;
}

export interface AILogPayload {
  event: AIEventType;
  testId: string;
  traceId?: string;
  userName?: string;
  durationMs?: number;
  model?: string;
  tokens?: AITokenMetrics;
  costUsd?: number;
  error?: AIErrorInfo;
  metadata?: Record<string, unknown>;
}

export interface DeliveryPipelineMetrics {
  traceId?: string;
  chatId: string | number;
  testId: string;
  testTitle?: string;
  profileName?: string;
  aiDurationMs: number;
  pdfDurationMs: number;
  tgDurationMs?: number;
  totalDurationMs: number;
  pdfBytes: number;
  aiSuccess: boolean;
  usedFallback: boolean;
  tgSuccess: boolean;
  tgMessageId?: number;
  error?: string;
}

/**
 * Estimates cost in USD for OpenAI completion based on published model pricing.
 */
export function estimateAICost(model: string = '', tokens?: AITokenMetrics): number | undefined {
  if (!tokens || typeof tokens.prompt !== 'number' || typeof tokens.completion !== 'number') {
    return undefined;
  }
  const is4oMini = model.includes('mini');
  // gpt-4o-mini: $0.15 / 1M prompt, $0.60 / 1M completion
  // standard gpt-4o: $2.50 / 1M prompt, $10.00 / 1M completion
  const inputRate = is4oMini ? 0.00000015 : 0.0000025;
  const outputRate = is4oMini ? 0.0000006 : 0.00001;
  const cost = tokens.prompt * inputRate + tokens.completion * outputRate;
  return Number(cost.toFixed(6));
}

/**
 * Classifies an unknown error into a structured AI error category.
 */
export function classifyAIError(err: unknown): AIErrorInfo {
  const message = err instanceof Error ? err.message : String(err || 'Unknown error');
  const errObj = (err && typeof err === 'object' ? err : {}) as Record<string, unknown>;
  const status = typeof errObj.status === 'number' ? errObj.status : undefined;
  const code = typeof errObj.code === 'string' ? errObj.code : undefined;
  const name = typeof errObj.name === 'string' ? errObj.name : '';

  const lowerMsg = message.toLowerCase();
  let type: AIErrorCategory = 'api_error';
  let isRetryable = false;

  if (
    lowerMsg.includes('timed out') ||
    lowerMsg.includes('timeout') ||
    code === 'ETIMEDOUT' ||
    name === 'APIConnectionTimeoutError'
  ) {
    type = 'timeout';
    isRetryable = true;
  } else if (status === 429 || lowerMsg.includes('rate limit')) {
    type = 'rate_limit';
    isRetryable = true;
  } else if (lowerMsg.includes('insufficient_quota') || lowerMsg.includes('quota exceeded')) {
    type = 'quota_exceeded';
    isRetryable = false;
  } else if (status === 401 || lowerMsg.includes('incorrect api key') || lowerMsg.includes('unauthorized')) {
    type = 'auth_error';
    isRetryable = false;
  } else if (name === 'SyntaxError' || lowerMsg.includes('json') || lowerMsg.includes('parse')) {
    type = 'json_parse_error';
    isRetryable = false;
  } else if (code === 'ECONNRESET' || code === 'ENOTFOUND' || name === 'APIConnectionError') {
    type = 'connection_error';
    isRetryable = true;
  } else if (status === 400) {
    type = 'bad_request';
    isRetryable = false;
  }

  return {
    type,
    message,
    status,
    code,
    isRetryable,
  };
}

/**
 * Emits a structured log line for AI events.
 */
export function logAI(payload: AILogPayload): void {
  const isErr = payload.event === 'failed';
  const isWarn = payload.event === 'fallback';
  const prefix = isErr ? '[AI_ERROR]' : isWarn ? '[AI_FALLBACK]' : '[AI_METRIC]';

  const entry = {
    timestamp: new Date().toISOString(),
    ...payload,
    costUsd:
      payload.costUsd ??
      (payload.model && payload.tokens ? estimateAICost(payload.model, payload.tokens) : undefined),
  };

  const line = `${prefix} ${JSON.stringify(entry)}`;
  if (isErr) {
    console.error(line);
  } else if (isWarn) {
    console.warn(line);
  } else {
    console.log(line);
  }
}

/**
 * Logs end-to-end metrics for the entire assessment delivery pipeline.
 */
export function logAIDelivery(metrics: DeliveryPipelineMetrics): void {
  const prefix = metrics.tgSuccess && metrics.aiSuccess ? '[DELIVERY_SUCCESS]' : '[DELIVERY_WARNING]';
  const line = `${prefix} ${JSON.stringify({
    timestamp: new Date().toISOString(),
    ...metrics,
  })}`;
  if (!metrics.tgSuccess || !metrics.aiSuccess) {
    console.warn(line);
  } else {
    console.log(line);
  }
}

/**
 * Helper to trace a single AI request lifecycle from start to finish.
 */
export function createAITracer(
  testId: string,
  initialMeta?: { userName?: string; traceId?: string; [key: string]: unknown }
) {
  const startTime = Date.now();
  const traceId =
    initialMeta?.traceId || `ai_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const userName = initialMeta?.userName;

  return {
    traceId,
    startTime,
    logStart(model: string, metadata?: Record<string, unknown>) {
      logAI({
        event: 'start',
        testId,
        traceId,
        userName,
        model,
        metadata: { ...initialMeta, ...metadata },
      });
    },
    logSuccess(model: string, tokens?: AITokenMetrics, metadata?: Record<string, unknown>) {
      const durationMs = Date.now() - startTime;
      logAI({
        event: 'completed',
        testId,
        traceId,
        userName,
        durationMs,
        model,
        tokens,
        metadata,
      });
    },
    logFallback(reason: string, error?: unknown, metadata?: Record<string, unknown>) {
      const durationMs = Date.now() - startTime;
      const errorInfo = error ? classifyAIError(error) : undefined;
      logAI({
        event: 'fallback',
        testId,
        traceId,
        userName,
        durationMs,
        error: errorInfo,
        metadata: { reason, ...metadata },
      });
    },
    logFailed(err: unknown, model?: string, metadata?: Record<string, unknown>) {
      const durationMs = Date.now() - startTime;
      const errorInfo = classifyAIError(err);
      logAI({
        event: 'failed',
        testId,
        traceId,
        userName,
        durationMs,
        model,
        error: errorInfo,
        metadata,
      });
      return errorInfo;
    },
  };
}
