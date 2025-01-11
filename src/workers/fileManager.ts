import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../logger';

export async function initializeFileManager(workspaceFolder: string) {
    const maiFolderPath = path.join(workspaceFolder, '.mai');
    const logsFolderPath = path.join(maiFolderPath, 'logs');

    // Create .mai folder if it doesn't exist
    if (!fs.existsSync(maiFolderPath)) {
        fs.mkdirSync(maiFolderPath);
        Logger.info(`Created folder: ${maiFolderPath}`);
    }

    // Create logs folder if it doesn't exist
    if (!fs.existsSync(logsFolderPath)) {
        fs.mkdirSync(logsFolderPath);
        Logger.info(`Created folder: ${logsFolderPath}`);
    }

    Logger.info('FileManager initialized successfully.');
}
