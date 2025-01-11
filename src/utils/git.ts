import * as fs from 'fs';
import * as path from 'path';

export async function ensureGitIgnore(workspacePath: string, folder: string) {
    const gitIgnorePath = path.join(workspacePath, '.gitignore');

    if (!fs.existsSync(gitIgnorePath)) {
        fs.writeFileSync(gitIgnorePath, `# Ignore MAI folder\n${folder}/\n`);
        return;
    }

    const gitIgnoreContent = fs.readFileSync(gitIgnorePath, 'utf8');
    if (!gitIgnoreContent.includes(`${folder}/`)) {
        fs.appendFileSync(gitIgnorePath, `\n# Ignore MAI folder\n${folder}/\n`);
    }
}
