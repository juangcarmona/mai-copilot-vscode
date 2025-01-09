"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
let loadingIndicator;
function activate(context) {
    console.log('MAI Copilot extension is now active!');
    // Loading indicator in the status bar
    loadingIndicator = createLoadingIndicator();
    context.subscriptions.push(loadingIndicator);
    // Command to log workspace and active file info
    const logWorkspaceInfoCommand = vscode.commands.registerCommand('mai-copilot-vscode.logWorkspaceInfo', logWorkspaceInfo);
    context.subscriptions.push(logWorkspaceInfoCommand);
    // Command to simulate AI suggestion
    const simulateAISuggestionCommand = vscode.commands.registerCommand('mai-copilot-vscode.simulateAISuggestion', simulateAISuggestion);
    context.subscriptions.push(simulateAISuggestionCommand);
    // Placeholder for registering more commands and functionality in the future
    console.log('Commands registered.');
}
// Deactivate method for cleanup
function deactivate() {
    console.log('MAI Copilot extension is now deactivated.');
    if (loadingIndicator) {
        loadingIndicator.dispose();
    }
}
// Command: Log workspace and active file information
function logWorkspaceInfo() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const activeEditor = vscode.window.activeTextEditor;
    if (workspaceFolders) {
        console.log('Workspace folders:', workspaceFolders.map(folder => folder.uri.fsPath));
        vscode.window.showInformationMessage(`Workspace: ${workspaceFolders[0].uri.fsPath}`);
    }
    else {
        console.log('No workspace folder open.');
        vscode.window.showWarningMessage('No workspace folder is open.');
    }
    if (activeEditor) {
        console.log('Active file:', activeEditor.document.uri.fsPath);
        vscode.window.showInformationMessage(`Active file: ${activeEditor.document.uri.fsPath}`);
    }
    else {
        console.log('No active file.');
        vscode.window.showWarningMessage('No active file is open.');
    }
}
// Command: Simulate AI suggestion functionality
async function simulateAISuggestion() {
    if (!vscode.window.activeTextEditor) {
        vscode.window.showWarningMessage('No active editor to suggest code for.');
        return;
    }
    loadingIndicator.show();
    vscode.window.showInformationMessage('Simulating AI suggestion...');
    // Simulated delay for suggestion generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;
    // Simulated AI-generated suggestion
    const suggestion = 'console.log("Hello from MAI Copilot!");';
    editor.edit(editBuilder => {
        editBuilder.insert(position, suggestion);
    });
    loadingIndicator.hide();
    vscode.window.showInformationMessage('Suggestion applied!');
}
// Create a loading indicator in the status bar
function createLoadingIndicator() {
    const indicator = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
    indicator.text = '$(loading~spin) MAI Copilot';
    indicator.tooltip = 'Generating suggestions...';
    return indicator;
}
//# sourceMappingURL=extension.js.map