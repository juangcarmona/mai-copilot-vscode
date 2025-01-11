import * as vscode from 'vscode';

export class MaiPanel {
    private static panel: vscode.WebviewView | undefined;

    static initialize(context: vscode.ExtensionContext) {
        // Registra la vista en la barra lateral
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider(
                'maiView',
                new MaiViewProvider(context)
            )
        );

        // Comando para actualizar la vista
        const updatePanelCommand = vscode.commands.registerCommand('mai.updatePanel', () => {
            if (MaiPanel.panel) {
                MaiPanel.updateContent('This is updated information about MAI Copilot!');
            }
        });

        context.subscriptions.push(updatePanelCommand);
    }

    static updateContent(content: string) {
        if (MaiPanel.panel) {
            MaiPanel.panel.webview.html = MaiPanel.getHtml(content);
        }
    }

    private static getHtml(content: string): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; padding: 10px; }
                    h1 { color: #007acc; }
                    p { margin-top: 0; }
                </style>
            </head>
            <body>
                <h1>MAI Copilot</h1>
                <p>${content}</p>
                <button onclick="showAlert()">Click Me</button>
                <script>
                    function showAlert() {
                        const vscode = acquireVsCodeApi();
                        vscode.postMessage({ type: 'alert', message: 'Hello from the Webview!' });
                    }
                </script>
            </body>
            </html>
        `;
    }

    public static setPanel(webviewView: vscode.WebviewView) { // Método público para establecer panel
        this.panel = webviewView;
    }

    public static getDefaultHtml(): string { // Método público para obtener el HTML predeterminado
        return this.getHtml('Welcome to MAI Copilot!');
    }
}

class MaiViewProvider implements vscode.WebviewViewProvider {
    constructor(private context: vscode.ExtensionContext) { }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        MaiPanel.setPanel(webviewView); // Usa el método público

        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = MaiPanel.getDefaultHtml(); // Usa el método público

        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.type === 'alert') {
                vscode.window.showInformationMessage(message.message);
            }
        });
    }
}