export declare const DEFAULT_OPENAI_MODEL: string;
export declare function resolveOpenAIModel(): string;
export declare const OPENAI_MODEL: string;
export declare function inspectOpenAIModelConfig(): {
    model: string;
    enforcedDefault: boolean;
    reason: string | null;
    rawCandidate: string;
    candidateSource: string | null;
    candidates: Array<{
        source: string;
        value: string;
        error?: string;
    }>;
};
export declare function logOpenAIModelDiagnostics(context?: string): void;
export declare function refreshOpenAIModelDiagnostics(): ReturnType<typeof inspectOpenAIModelConfig>;
