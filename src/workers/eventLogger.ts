import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../logger';
import minimatch = require('minimatch');


const LOG_FILE = 'events.log';

export function initializeEventLogger(context: vscode.ExtensionContext, workspaceFolder: string) {
    const logFilePath = path.join(workspaceFolder, '.mai', 'logs', LOG_FILE);

    // Load ignored patterns
    const ignoredPaths = loadIgnoredPaths(workspaceFolder);

    // Watch file system changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/*', false, false, false);

    watcher.onDidCreate(uri => {
        if (isInterestingFile(uri.fsPath, workspaceFolder, ignoredPaths)) {
            logFileEvent(logFilePath, `File created: ${uri.fsPath}`);
        }
    });

    watcher.onDidChange(uri => {
        if (isInterestingFile(uri.fsPath, workspaceFolder, ignoredPaths)) {
            logFileEvent(logFilePath, `File changed: ${uri.fsPath}`);
        }
    });

    watcher.onDidDelete(uri => {
        if (isInterestingFile(uri.fsPath, workspaceFolder, ignoredPaths)) {
            logFileEvent(logFilePath, `File deleted: ${uri.fsPath}`);
        }
    });

    context.subscriptions.push(watcher);
}

function logFileEvent(logFilePath: string, message: string) {
    const timestamp = new Date().toISOString();
    Logger.debug(message);
    fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
}

/**
 * Load ignored paths from .gitignore and add default exclusions.
 */
function loadIgnoredPaths(workspaceFolder: string): string[] {
    const gitignorePath = path.join(workspaceFolder, '.gitignore');
    const ignoredPaths: string[] = [];

    // Add default ignored paths (folders starting with .)
    ignoredPaths.push('**/.*/**'); // Matches all files and folders starting with .

    // Read .gitignore if it exists
    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
        const gitignoreLines = gitignoreContent.split(/\r?\n/).map(line => line.trim());
        ignoredPaths.push(...gitignoreLines.filter(line => line && !line.startsWith('#')));
    }

    Logger.debug(`Ignored paths: ${JSON.stringify(ignoredPaths)}`);
    return ignoredPaths;
}

/**
 * Determine if a file is "interesting" based on ignored paths and default rules.
 */
function isInterestingFile(filePath: string, workspaceFolder: string, ignoredPaths: string[]): boolean {
    const relativePath = path.relative(workspaceFolder, filePath);

    // Check if the file matches any ignored patterns
    for (const pattern of ignoredPaths) {
        if (minimatch(relativePath, pattern)) {
            return false; // File is ignored
        }
    }

    return true; // File is interesting
}
