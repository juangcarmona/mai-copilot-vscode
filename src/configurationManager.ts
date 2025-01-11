import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

const DEFAULT_CONFIG = {
    logging: {
        level: 'debug', // default log level
        enabled: true, // enable or disable logging
    },
};

export class ConfigurationManager {
    private static instance: ConfigurationManager;
    private config: any;
    private configFilePath: string;

    private constructor() {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        this.configFilePath = path.join(workspaceFolder, '.mai', 'settings.json');

        Logger.debug(`Using configuration file path: ${this.configFilePath}`);
        this.ensureConfigFile();
        this.loadConfig();
    }

    static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    private ensureConfigFile() {
        const configFolder = path.dirname(this.configFilePath);

        // Ensure the folder exists
        if (!fs.existsSync(configFolder)) {
            Logger.info(`Creating folder: ${configFolder}`);
            fs.mkdirSync(configFolder, { recursive: true });
        } else {
            Logger.debug(`Folder already exists: ${configFolder}`);
        }

        // Ensure the configuration file exists
        if (!fs.existsSync(this.configFilePath)) {
            Logger.info(`Creating default configuration file at: ${this.configFilePath}`);
            fs.writeFileSync(this.configFilePath, JSON.stringify(DEFAULT_CONFIG, null, 4), 'utf-8');
        } else {
            Logger.debug(`Configuration file already exists: ${this.configFilePath}`);
        }
    }

    private loadConfig() {
        try {
            Logger.debug(`Loading configuration from: ${this.configFilePath}`);
            const rawConfig = fs.readFileSync(this.configFilePath, 'utf-8');
            this.config = JSON.parse(rawConfig);
            Logger.info('Configuration loaded successfully.');
        } catch (error) {
            Logger.error(`Failed to load configuration: ${error}`);
            this.config = DEFAULT_CONFIG;
        }
    }

    saveConfig() {
        try {
            Logger.debug('Saving configuration...');
            fs.writeFileSync(this.configFilePath, JSON.stringify(this.config, null, 4), 'utf-8');
            Logger.info('Configuration saved successfully.');
        } catch (error) {
            Logger.error(`Failed to save configuration: ${error}`);
        }
    }

    getConfig() {
        Logger.debug('Fetching current configuration.');
        return this.config;
    }

    set(key: string, value: any) {
        Logger.debug(`Setting configuration key: ${key} with value: ${value}`);
        const keys = key.split('.');
        let obj = this.config;

        while (keys.length > 1) {
            const currentKey = keys.shift();

            if (currentKey === undefined) {
                throw new Error('Key path is invalid');
            }

            if (!obj[currentKey]) {
                obj[currentKey] = {};
            }
            obj = obj[currentKey];
        }

        obj[keys[0]] = value;
        this.saveConfig();
    }

    get(key: string) {
        Logger.debug(`Fetching configuration key: ${key}`);
        const keys = key.split('.');
        let obj = this.config;

        for (const currentKey of keys) {
            obj = obj[currentKey];
            if (obj === undefined) {
                Logger.warn(`Configuration key not found: ${key}`);
                return undefined;
            }
        }

        return obj;
    }
}

export const configurationManager = ConfigurationManager.getInstance();
