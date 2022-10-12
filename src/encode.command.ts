import { Command, Option, CommandRunner } from 'nest-commander';
import { SteganographyService } from './steganography.service';

@Command({
  name: 'encode',
  description: 'Steganography encode',
})
export class EncodeCommand extends CommandRunner {
  public constructor(private steganographyService: SteganographyService) {
    super();
  }

  async run(inputs: string[], options): Promise<void> {
    const imageFileName = options.target;
    const fileName = options.file;
    const stringData = options.string;

    if (fileName !== undefined) {
      console.log(`Encoding file "${fileName}" into image "${imageFileName}".`);

      await this.steganographyService.encodeFileIntoFile(
        fileName,
        imageFileName,
      );

      console.log(`File was successfully encoded into image.`);
      return;
    }

    if (stringData !== undefined) {
      console.log(
        `Encoding string "${stringData}" into image "${imageFileName}".`,
      );

      await this.steganographyService.encodeStringIntoFile(
        stringData,
        imageFileName,
      );

      console.log(`String was successfully encoded into image.`);
      return;
    }

    console.log(`No data was added, exiting...`);
  }

  @Option({
    flags: '-t, --target <target>',
    description: 'Target image',
    required: true,
  })
  parseTarget(target: string) {
    return target;
  }

  @Option({
    flags: '-s, --string <string>',
    description: 'String',
  })
  parseString(stringValue: string) {
    return stringValue;
  }

  @Option({
    flags: '-f, --file <file>',
    description: 'File',
  })
  parseFile(file: string) {
    return file;
  }
}
