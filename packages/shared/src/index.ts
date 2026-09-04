// Structured Response and Error helpers
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function successResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function errorResponse(message: string, code = 'INTERNAL_ERROR', details?: unknown): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}

// Structured Logger
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const logger = {
  log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };
    if (level === 'error') {
      console.error(JSON.stringify(entry));
    } else if (level === 'warn') {
      console.warn(JSON.stringify(entry));
    } else {
      console.log(JSON.stringify(entry));
    }
  },
  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  },
  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  },
  error(message: string, context?: Record<string, unknown>) {
    this.log('error', message, context);
  },
  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, context);
    }
  },
};

// Cost tracking constants (Gemini 3.8 Flash pricing estimates)
export const PRICING = {
  INPUT_COST_PER_MILLION_TOKENS: 0.15,
  OUTPUT_COST_PER_MILLION_TOKENS: 0.60,
};

export function calculateEstimatedCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * PRICING.INPUT_COST_PER_MILLION_TOKENS;
  const outputCost = (outputTokens / 1_000_000) * PRICING.OUTPUT_COST_PER_MILLION_TOKENS;
  return Number((inputCost + outputCost).toFixed(6));
}
