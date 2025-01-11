import * as vscode from 'vscode';
import fetch from "node-fetch";

export interface GenerateRequest {
    model: string;
    inputs: string;
    parameters?: Record<string, unknown>;
}

export interface GenerateResponse {
    generated_text: string;
    status: number;
    error?: string;
}

export class ApiClient {
    private baseUrl: string;
    private port: number;
    private completionEndpoint: string;

    constructor() {
        const config = vscode.workspace.getConfiguration("maiCopilot");
        this.baseUrl = config.get<string>("api.baseUrl") || "http://0.0.0.0";
        this.port = config.get<number>("api.port") || 8000;
        this.completionEndpoint = config.get<string>("api.completionEndpoint") || "/api/generate/";
    }

    private getFullUrl(): string {
        return `${this.baseUrl}:${this.port}${this.completionEndpoint}`;
    }

    async generateCode(request: GenerateRequest): Promise<GenerateResponse> {
        const url = this.getFullUrl();
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            return (await response.json()) as GenerateResponse;
        } catch (error) {
            return { generated_text: "", status: 500, error: (error as Error).message };
        }
    }
}
