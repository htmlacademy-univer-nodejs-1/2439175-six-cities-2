#!/usr/bin/env node
import fs from 'node:fs';
import chalk from 'chalk';
import packageJSON from './package.json' assert {type: 'json'};

switch (process.argv[2]) {
    case '--help':
    case '-h':
        console.log(chalk.green(` --help - to get help for cli
        --version - to get version of app
        --import filenale - imports data form *.tsv file, logs data in console
        `))
        break;
    case '--version':
    case '-v':       
        console.log(chalk.yellow(packageJSON.version));
        break;
    case '--import':
    case '-i':
        for (let filename of process.argv.slice(3)) {
            fs.readFile(`./mocks/${filename}`, 'utf8', function(err, data) {
                if (err) throw err;
                const lines = data.split('\n');
                lines.forEach(line => console.log(chalk.blue(line)));
            });
        }
        break;
    default:
        console.log(chalk.red('unknown command'))
        break;
}