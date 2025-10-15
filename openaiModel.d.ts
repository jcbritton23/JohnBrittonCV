export declare const DEFAULT_OPENAI_MODEL: string;
export interface OpenAIModelDiagnostics {
    model: string;
    enforcedDefault: boolean;
    rawCandidate: string;
    candidateSource: string;
    candidates: Array<{
        source: string;
        value: unknown;
        error?: string;
    }>;
}
export declare const refreshOpenAIModelDiagnostics: () => OpenAIModelDiagnostics;
export declare const getOpenAIModelDiagnostics: () => OpenAIModelDiagnostics;
export declare function resolveOpenAIModel(): string;
export declare const logOpenAIModelDiagnostics: (context?: string) => OpenAIModelDiagnostics;
export declare const OPENAI_MODEL: string;
