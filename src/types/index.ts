export interface LogEntry {
    timestamp: string;
    event: string;
    filePath: string;
}


export interface Completion {
    generated_text: string;
}

export interface CompletionResponse {
    request_id: string;
    completions: Completion[];
}
