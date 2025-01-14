import * as vscode from 'vscode';

export class Logger {
    private static instance: Logger | null = null;
    private outputChannel: vscode.OutputChannel;
    private loggingEnabled: boolean;
    private logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

    private constructor(private name: string) {
        const config = vscode.workspace.getConfiguration('mai');
        this.loggingEnabled = config.get<boolean>('logging.enabled') ?? true;
        this.logLevel = (config.get<string>('logging.level') as 'DEBUG' | 'INFO' | 'WARN' | 'ERROR') || 'INFO';
        
        this.outputChannel = vscode.window.createOutputChannel(this.name);
    }

    // Singleton initializer
    private static ensureInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger('MAI');
        }
    }

    private log(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', message: string) {
        if (!this.loggingEnabled || !this.shouldLog(level)) {
            return;
        }

        const timestamp = new Date().toISOString();
        const icon = {
            DEBUG: '🐛',
            INFO: 'ℹ️',
            WARN: '⚠️',
            ERROR: '❌',
        }[level];

        const formattedMessage = `[${timestamp}] [${icon} ${level}] ${message}`;
        this.outputChannel.appendLine(formattedMessage);

        // Optionally show the output channel for WARN and ERROR
        if (level === 'WARN' || level === 'ERROR') {
            this.outputChannel.show(true);
        }
    }

    private shouldLog(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'): boolean {
        const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }

    public static debug(message: string) {
        Logger.ensureInstance();
        Logger.instance!.log('DEBUG', message);
    }

    public static info(message: string) {
        Logger.ensureInstance();
        Logger.instance!.log('INFO', message);
    }

    public static warn(message: string) {
        Logger.ensureInstance();
        Logger.instance!.log('WARN', message);
    }

    public static error(message: string) {
        Logger.ensureInstance();
        Logger.instance!.log('ERROR', message);
    }

    public static dispose() {
        if (Logger.instance) {
            Logger.instance.outputChannel.dispose();
            Logger.instance = null;
        }
    }
}
