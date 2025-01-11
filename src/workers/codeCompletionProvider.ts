import * as vscode from 'vscode';
import { ApiClient, GenerateRequest } from '../utils/apiClient';

export const maiCodeCompletionProvider: vscode.InlineCompletionItemProvider = {
    async provideInlineCompletionItems(document, position, context, token) {
        const config = vscode.workspace.getConfiguration("maiCopilot");
        const requestDelay = config.get<number>("requestDelay") || 500;

        if (requestDelay > 0) {
            const cancelled = await delay(requestDelay, token);
            if (cancelled) return;
        }

        const client = new ApiClient();

        // Prepare the API request
        const inputs = document.getText(
            new vscode.Range(
                new vscode.Position(0, 0),
                position
            )
        );
        const model = config.get<string>("model") || "gpt2";
        const parameters = {
            temperature: config.get<number>("temperature") || 0.7,
            max_new_tokens: config.get<number>("maxNewTokens") || 50,
        };

        const request: GenerateRequest = {
            model,
            inputs,
            parameters,
        };

        // Call the API
        const response = await client.generateCode(request);
        if (response.status !== 200) {
            vscode.window.showErrorMessage(`Error generating code: ${response.error || "Unknown error"}`);
            return;
        }

        const items = response.generated_text.split("\n").map((output) => ({
            insertText: output,
            range: new vscode.Range(position, position),
        }));

        return { items };
    },
};

// Helper function for delaying the request
async function delay(milliseconds: number, token: vscode.CancellationToken): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), milliseconds);
        token.onCancellationRequested(() => {
            clearTimeout(timeout);
            resolve(true);
        });
    });
}
