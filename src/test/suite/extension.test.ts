import * as assert from 'assert';
import * as vscode from 'vscode';

suite('MAI Copilot Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Should activate extension', async () => {
        const extension = vscode.extensions.getExtension('JuanGCarmona.mai-copilot-vscode');
        await extension?.activate();
        assert.strictEqual(extension?.isActive, true, 'Extension should be active.');
    });

    // test('Should register helloWorld command', async () => {
    //     const commands = await vscode.commands.getCommands(true);
    //     assert.ok(commands.includes('mai.helloWorld'), 'Command mai.helloWorld should be registered.');
    // });

    // test('Should register logWorkspaceInfo command', async () => {
    //     const commands = await vscode.commands.getCommands(true);
    //     assert.ok(commands.includes('mai.logWorkspaceInfo'), 'Command mai.logWorkspaceInfo should be registered.');
    // });

    // test('Should create a .mai folder and logs folder in workspace', async () => {
    //     const workspaceFolders = vscode.workspace.workspaceFolders;
    //     assert.ok(workspaceFolders, 'Workspace should be open for this test.');

    //     const workspaceFolder = workspaceFolders![0].uri.fsPath;
    //     const maiFolderPath = vscode.Uri.joinPath(workspaceFolders![0].uri, '.mai').fsPath;
    //     const logsFolderPath = vscode.Uri.joinPath(workspaceFolders![0].uri, '.mai', 'logs').fsPath;

    //     const fs = vscode.workspace.fs;
    //     const maiFolderStat = await fs.stat(vscode.Uri.file(maiFolderPath));
    //     const logsFolderStat = await fs.stat(vscode.Uri.file(logsFolderPath));

    //     assert.ok(maiFolderStat, '.mai folder should exist.');
    //     assert.ok(logsFolderStat, '.mai/logs folder should exist.');
    // });
});
