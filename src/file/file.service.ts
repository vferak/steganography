import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {
  public readFile(fileName: string): Buffer {
    return fs.readFileSync(this.getPublicPathForFileName(fileName));
  }

  public writeFile(data: Buffer, fileName: string): void {
    const fullFileName = this.getPublicPathForFileName(fileName);
    fs.writeFileSync(fullFileName, data);
  }

  private getPublicPathForFileName(fileName: string): string {
    return `${__dirname}/../../public/${fileName}`;
  }
}
