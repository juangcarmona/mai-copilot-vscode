import * as path from 'path';
import * as Mocha from 'mocha';
import { glob } from 'glob';

export async function run(): Promise<void> {
    const mocha = new Mocha({
        ui: 'tdd',
        color: true
    });

    const testsRoot = path.resolve(__dirname, '..');

    try {
        // Usa la API de promesas de glob
        const files = await glob('**/**.test.js', { cwd: testsRoot });

        // Agrega cada archivo encontrado a Mocha
        files.forEach(file => mocha.addFile(path.resolve(testsRoot, file)));

        // Ejecuta los tests
        await new Promise((resolve, reject) => {
            mocha.run(failures => {
                if (failures > 0) {
                    reject(new Error(`${failures} tests failed.`));
                } else {
                    resolve(null);
                }
            });
        });
    } catch (err) {
        console.error('Error while running tests:', err);
        throw err;
    }
}
