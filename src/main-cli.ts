
import { ImportCommand } from './cli/commands/import.js';
import 'reflect-metadata';
import { CLIApplication, HelpCommand, VersionCommand } from './cli/index.js';
import { GenerateCommand } from './cli/commands/generate.js';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();