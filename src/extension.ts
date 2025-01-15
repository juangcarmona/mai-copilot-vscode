import * as vscode from 'vscode';

import { initializeFileManager } from './workers/fileManager';
import { initializeEventLogger } from './workers/eventLogger';
import { Logger } from './logger';
import { MaiPanel } from './views/maiPanel';
import { ConfigPanel } from './views/configPanel';
import { maiCodeCompletionProvider} from './workers/codeCompletionProvider';
import { CompletionResponse } from './types';

export async function activate(context: vscode.ExtensionContext) {
    Logger.info('MAI Copilot extension is now active!');	

    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
        Logger.warn('No workspace folder is open.');
        return;
    }

    const workspaceFolder = workspaceFolders[0].uri.fsPath;

    // Initialize file manager
    await initializeFileManager(workspaceFolder);

    // Initialize event logger
    initializeEventLogger(context, workspaceFolder);

	vscode.languages.registerInlineCompletionItemProvider(
		{ scheme: "file", pattern: "**/*" },
		maiCodeCompletionProvider
	);

	// Register Commands
	const openConfigPanelCommand = vscode.commands.registerCommand('mai.openConfigurationPanel', () => {
        ConfigPanel.show(context);
    });
    context.subscriptions.push(openConfigPanelCommand);

	
	const logWorkspaceInfoCommand = vscode.commands.registerCommand('mai.logWorkspaceInfo', () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		const activeEditor = vscode.window.activeTextEditor;

		if (workspaceFolders) {
			vscode.window.showInformationMessage(`Workspace: ${workspaceFolders[0].uri.fsPath}`);
		} else {
			Logger.warn('No workspace folder is open.');
			vscode.window.showWarningMessage('No workspace folder is open.');
		}

		if (activeEditor) {
			vscode.window.showInformationMessage(`Active file: ${activeEditor.document.uri.fsPath}`);
		} else {
			Logger.warn('No active file is open.');
			vscode.window.showWarningMessage('No active file is open.');
		}
	});
	context.subscriptions.push(logWorkspaceInfoCommand);

	const afterInsertCommand = vscode.commands.registerCommand('mai.afterInsert', async (response: CompletionResponse) => {
		Logger.info(`Accepted suggestion: ${response.completions[0].generated_text}`);
	});	
	context.subscriptions.push(afterInsertCommand);

	// Initialize Main Panel
	MaiPanel.initialize(context);

	Logger.info('MAI is Up & Running');
}

export function deactivate() {
	Logger.info('MAI Copilot extension is now deactivated.');
}
