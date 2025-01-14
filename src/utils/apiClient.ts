import * as vscode from 'vscode';
import axios from 'axios';
import { Logger } from '../logger';

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
        Logger.debug('ApiClient');
        const config = vscode.workspace.getConfiguration("mai");
        Logger.debug(`ApiClient Config: ${config}`);
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
            const response = await axios.post<GenerateResponse>(url, request, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error: any) {
            return {
                generated_text: "",
                status: error.response?.status || 500,
                error: error.message,
            };
        }
    }
}
