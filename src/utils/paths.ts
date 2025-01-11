import * as vscode from 'vscode';

export function getWorkspaceFolder(): string | null {
    const folders = vscode.workspace.workspaceFolders;
    return folders && folders.length > 0 ? folders[0].uri.fsPath : null;
}
