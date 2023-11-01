#!/usr/bin/env node
import fs from 'node:fs';
import { appendFile } from 'fs/promises';
import chalk from 'chalk';
import packageJSON from './package.json' assert {type: 'json'};
import {OfferGenerator} from './src/modules/offer-generator.ts';
import got from 'got';
import { stdout } from 'node:process';

switch (process.argv[2]) {
    case '--help':
    case '-h':
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
        break;
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
        sourceFile.pipe(process.stdout);
    };
    for (let filename of process.argv.slice(3)) {
        pipe(`${filename}`);
    }
}

async function generate() {
    let data = {};
    const [filepath, amount, url] = process.argv.slice(3);
    const amount_int = Number.parseInt(amount);

    try {
        data = await got.get(url).json();
    } catch {   
        console.log("Can\'t parse data from this url");
    }

    const og = new OfferGenerator(data);

    for (let i = 0; i < amount_int; i++) {
        await appendFile(`${filepath}`, `${og.generate()}\n`, 'utf-8');
    }
}