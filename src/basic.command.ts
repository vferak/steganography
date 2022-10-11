import { Command, CommandRunner, Option } from 'nest-commander';

@Command({ name: 'basic', description: 'Basic steganography' })
export class BasicCommand extends CommandRunner {
  async run(): Promise<void> {
    console.log('Ahoj');
  }
}
