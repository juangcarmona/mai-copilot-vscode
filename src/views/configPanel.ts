import * as vscode from 'vscode';
import { getDefaultConfigForBackend } from '../configTemplates';
import { Logger } from '../logger';

export class ConfigPanel {
    private static panel: vscode.WebviewPanel | undefined;

    static show(context: vscode.ExtensionContext) {
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.One);
        } else {
            this.panel = vscode.window.createWebviewPanel(
                'maiConfigPanel',
                'MAI Configuration',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.file(context.extensionPath)],
                }
            );

            this.panel.webview.html = this.getHtml();
            this.handleMessages(this.panel.webview);

            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
        }
    }

    private static getHtml(): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>MAI Configuration</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
                    h1 { color: #007acc; }
                    label { display: block; margin-top: 10px; }
                    select, input, button { margin-top: 5px; }
                </style>
            </head>
            <body>
                <h1>MAI Configuration</h1>
                <label for="backend">Backend:</label>
                <select id="backend" onchange="updateFields()">
                    <option value="llm-studio">LLM Studio</option>
                    <option value="mai-api">MAI API</option>
                    <option value="tabby">Tabby</option>
                    <option value="llama-cpp">Llama.cpp</option>
                </select>
    
                <div id="parameters">
                    <label for="url">URL:</label>
                    <input type="text" id="url" placeholder="Backend URL">
    
                    <label for="port">Port:</label>
                    <input type="number" id="port" placeholder="Backend Port">
    
                    <label for="endpoint">Endpoint:</label>
                    <input type="text" id="endpoint" placeholder="API Endpoint">
    
                    <label for="temperature">Temperature:</label>
                    <input type="number" id="temperature" min="0" max="1" step="0.1" value="0.7">
    
                    <label for="maxTokens">Max Tokens:</label>
                    <input type="number" id="maxTokens" min="1" value="50">
    
                    <label for="fimPrefix">FIM Prefix:</label>
                    <input type="text" id="fimPrefix" placeholder="Fill-in-the-Middle Prefix">
    
                    <label for="fimMiddle">FIM Middle:</label>
                    <input type="text" id="fimMiddle" placeholder="Fill-in-the-Middle Middle">
    
                    <label for="fimSuffix">FIM Suffix:</label>
                    <input type="text" id="fimSuffix" placeholder="Fill-in-the-Middle Suffix">
                </div>
    
                <button id="save">Save Configuration</button>
                <button id="reset">Reset to Defaults</button>
    
                <script>
                    const vscode = acquireVsCodeApi();
    
                    document.getElementById('save').onclick = () => {
                        const backend = document.getElementById('backend').value;
                        const url = document.getElementById('url').value;
                        const port = document.getElementById('port').value;
                        const endpoint = document.getElementById('endpoint').value;
                        const temperature = document.getElementById('temperature').value;
                        const maxTokens = document.getElementById('maxTokens').value;
                        const fimPrefix = document.getElementById('fimPrefix').value;
                        const fimMiddle = document.getElementById('fimMiddle').value;
                        const fimSuffix = document.getElementById('fimSuffix').value;
    
                        vscode.postMessage({ 
                            type: 'save', 
                            backend, 
                            url, 
                            port, 
                            endpoint, 
                            temperature, 
                            maxTokens, 
                            fimPrefix, 
                            fimMiddle, 
                            fimSuffix 
                        });
                    };
    
                    document.getElementById('reset').onclick = () => {
                        const backend = document.getElementById('backend').value;
                        vscode.postMessage({ type: 'reset', backend });
                    };
    
                    function updateFields() {
                        const backend = document.getElementById('backend').value;
                        vscode.postMessage({ type: 'updateFields', backend });
                    }
    
                    window.addEventListener('message', (event) => {
                        const { backend, config } = event.data;
                        if (backend && config) {
                            document.getElementById('url').value = config.url || '';
                            document.getElementById('port').value = config.port || '';
                            document.getElementById('endpoint').value = config.endpoint || '';
                            document.getElementById('temperature').value = config.requestBody.parameters?.temperature || '';
                            document.getElementById('maxTokens').value = config.requestBody.parameters?.max_new_tokens || '';
                            document.getElementById('fimPrefix').value = config.fillInTheMiddle?.prefix || '';
                            document.getElementById('fimMiddle').value = config.fillInTheMiddle?.middle || '';
                            document.getElementById('fimSuffix').value = config.fillInTheMiddle?.suffix || '';
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }

    private static handleMessages(webview: vscode.Webview) {
        webview.onDidReceiveMessage(async (message) => {
            const config = vscode.workspace.getConfiguration('mai');

            switch (message.type) {
                case 'save':
                    await config.update('api.backend', message.backend, vscode.ConfigurationTarget.Global);
                    await config.update('api.baseUrl', message.url, vscode.ConfigurationTarget.Global);
                    await config.update('api.port', parseInt(message.port, 10), vscode.ConfigurationTarget.Global);
                    await config.update('api.completionEndpoint', message.endpoint, vscode.ConfigurationTarget.Global);
                    await config.update('completion.temperature', parseFloat(message.temperature), vscode.ConfigurationTarget.Global);
                    await config.update('completion.maxTokens', parseInt(message.maxTokens, 10), vscode.ConfigurationTarget.Global);
                    await config.update('completion.fimPrefix', message.fimPrefix, vscode.ConfigurationTarget.Global);
                    await config.update('completion.fimMiddle', message.fimMiddle, vscode.ConfigurationTarget.Global);
                    await config.update('completion.fimSuffix', message.fimSuffix, vscode.ConfigurationTarget.Global);

                    Logger.debug("Configuration saved!");
                    vscode.window.showInformationMessage('Configuration saved!');
                    break;

                case 'reset':
                    const defaultConfig = getDefaultConfigForBackend(message.backend);
                    webview.postMessage({ backend: message.backend, config: defaultConfig });
                    break;

                case 'updateFields':
                    const selectedConfig = getDefaultConfigForBackend(message.backend);
                    webview.postMessage({ backend: message.backend, config: selectedConfig });
                    break;

                default:
                    vscode.window.showErrorMessage(`Unknown message type: ${message.type}`);
            }
        });
    }

}
