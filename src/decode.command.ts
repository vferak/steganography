import { Command, CommandRunner } from 'nest-commander';
import { SteganographyService } from './steganography.service';

@Command({
  name: 'decode',
  arguments: '<target>',
  description: 'Steganography decode',
})
export class DecodeCommand extends CommandRunner {
  public constructor(private steganographyService: SteganographyService) {
    super();
  }

  async run(inputs: string[]): Promise<void> {
    console.log(`Decoding data from image "${inputs[0]}".`);

    const result = await this.steganographyService.decodeFile(
      inputs[0],
    );

    console.log(`Decoded data: ${result}`);
  }
}
