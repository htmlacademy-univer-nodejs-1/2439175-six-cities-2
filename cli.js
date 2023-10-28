#!/usr/bin/env node
import {fs} from 'node:fs';
import appendFile from 'node:fs/promises'
import chalk from 'chalk';
import packageJSON from './package.json' assert {type: 'json'};
import {OfferGenerator} from './src/modules/offer-generator';
import got from 'got';

switch (process.argv[2]) {
    case '--help':
    case '-h':
    case undefined:
        help();
        break;
    case '--version':
    case '-v':       
        version();
        break;
    case '--import':
    case '-i':
        import_command();
        break;
    case '-g':
    case '--generate':
        generate();
    default:
        def();
        break;
}

function help() {
    const helpMsg = chalk.green(
        `-h, --help - to get help for cli
        -v, --version - to get version of app
        -i, --import filenale - imports data form *.tsv file, logs data in console`)
    console.log(helpMsg);
}

function def() {
    console.log(chalk.red('unknown command'));
}

function version() {
    console.log(chalk.yellow(packageJSON.version));
}

function import_command() {
    const pipe = async (name) => {
        const sourceFile = fs.createReadStream(name);
        const destFile = fs.createWriteStream(destPath);
        sourceFile.pipe(destFile);
    };
    for (let filename of process.argv.slice(3)) {
        pipe(`./mocks/${filename}`);
    }
}

async function generate() {
    data = Moc
    [path, amount, path] = process.argv.slice(3);
    amount = Number.parseInt(amount);

    try {
        data = await got.get(path).json();
    } catch {   
        console.log("Can\'t parse data from this url")
    }

    const og = new OfferGenerator(data);

    for (let i = 0; i < amount; i++) {
        await appendFile(`./mocks/${path}`, `${og.generate()}\n`, 'utf-8');
    }
}