import * as vscode from "vscode";
import { ApiClient, GenerateRequest } from "../utils/apiClient";
import { Logger } from "../logger";
import { templates } from "../configTemplates";

export const maiCodeCompletionProvider: vscode.InlineCompletionItemProvider = {
    async provideInlineCompletionItems(document, position, context, token) {
        Logger.info("Starting inline completion process...");

        const config = vscode.workspace.getConfiguration("mai");

        const modelConfig = {
            modelId: config.get<string>("model") || "hf/bigcode/starcoder2-15b",
            backend: config.get<string>("api.backend") || "huggingface",
            url: config.get<string>("api.baseUrl") || "http://127.0.0.1",
            port: config.get<number>("api.port") || 1234,
            endpoint: config.get<string>("api.completionEndpoint") || "/v1/completions/",
            fillInTheMiddle: {
                enabled: config.get<boolean>("completion.fimEnabled") || false,
                prefix: config.get<string>("completion.fimPrefix") || "",
                middle: config.get<string>("completion.fimMiddle") || "",
                suffix: config.get<string>("completion.fimSuffix") || "",
            },
            requestBody: {
                parameters: {
                    max_new_tokens: config.get<number>("completion.maxTokens") || 50,
                    temperature: config.get<number>("completion.temperature") || 0.7,
                },
            },
        };

        Logger.info(`Using model: ${modelConfig.modelId}`);

        const requestDelay = config.get<number>("requestDelay") || 500;

        if (requestDelay > 0) {
            Logger.debug(`Delaying request by ${requestDelay}ms...`);
            const cancelled = await delay(requestDelay, token);
            if (cancelled) {
                Logger.info("Request was cancelled during delay.");
                return;
            }
        }

        const client = new ApiClient();

        const prefix = document.getText(
            new vscode.Range(new vscode.Position(0, 0), position)
        );

        const suffix = document.getText(
            new vscode.Range(position, document.lineAt(document.lineCount - 1).range.end)
        );

        let fimInput = `${prefix}${suffix}`;
        if (modelConfig.fillInTheMiddle.enabled) {
            const fimPrefix = modelConfig.fillInTheMiddle.prefix || "";
            const fimMiddle = modelConfig.fillInTheMiddle.middle || "";
            const fimSuffix = modelConfig.fillInTheMiddle.suffix || "";

            fimInput = `${fimPrefix}${prefix}${fimMiddle}${suffix}${fimSuffix}`;
            Logger.debug(`FIM Input: ${fimInput}`);
        }

        const request: GenerateRequest = {
            model: modelConfig.modelId,
            inputs: fimInput,
            parameters: "parameters" in modelConfig.requestBody
                ? modelConfig.requestBody.parameters
                : undefined
        };

        Logger.debug(`Generated API request: ${JSON.stringify(request)}`);

        try {
            Logger.info("Calling MAI API for completions...");
            const response = await client.generateCode(request);

            Logger.debug(`API Response: ${JSON.stringify(response)}`);

            if (response.status !== 200) {
                const errorMessage = response.error || "Unknown error";
                Logger.error(`Error generating code: ${errorMessage}`);
                vscode.window.showErrorMessage(`Error generating code: ${errorMessage}`);
                return;
            }

            const generatedText = response.generated_text.trim();
            const middleText = extractMiddleText(generatedText, fimInput, modelConfig);

            const insertText = middleText.replace(/\n/g, "\n");
            const completionItem = new vscode.InlineCompletionItem(
                insertText,
                new vscode.Range(position, position)
            );

            Logger.debug("Returning completion item to VSCode.");
            return { items: [completionItem] };
        } catch (error) {
            const errorMessage = (error as Error).message;
            Logger.error(`Exception during completion generation: ${errorMessage}`);
            vscode.window.showErrorMessage(`Failed to generate code: ${errorMessage}`);
            return;
        }
    },
};

function extractMiddleText(generatedText: string, inputs: string, modelConfig: any): string {
    const fimPrefix = modelConfig["fillInTheMiddle.prefix"];
    const fimMiddle = modelConfig["fillInTheMiddle.middle"];
    const fimSuffix = modelConfig["fillInTheMiddle.suffix"];

    const prefixIndex = inputs.indexOf(fimPrefix);
    const middleIndex = inputs.indexOf(fimMiddle);
    const suffixIndex = inputs.indexOf(fimSuffix);

    if (prefixIndex === -1 || middleIndex === -1 || suffixIndex === -1) {
        throw new Error("Invalid FIM input format. Missing required tokens.");
    }

    const prefix = inputs.substring(prefixIndex + fimPrefix.length, suffixIndex).trim();
    const suffix = inputs.substring(suffixIndex + fimSuffix.length, middleIndex).trim();

    let middleText = generatedText
        .replace(prefix, "")
        .replace(suffix, "")
        .trim();

    return middleText;
}

async function delay(milliseconds: number, token: vscode.CancellationToken): Promise<boolean> {
    Logger.debug(`Delaying for ${milliseconds}ms...`);
    return new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), milliseconds);
        token.onCancellationRequested(() => {
            clearTimeout(timeout);
            Logger.debug("Delay cancelled.");
            resolve(true);
        });
    });
}
