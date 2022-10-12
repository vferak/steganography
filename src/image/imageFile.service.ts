import { Injectable } from '@nestjs/common';
import Jimp from 'jimp/es';
import { Image } from './image';

@Injectable()
export class ImageFileService {
  public async readImageFromFileName(fileName: string): Promise<Image> {
    const image = await Jimp.read(this.getPublicPathForFileName(fileName));

    return new Image(
      image.bitmap.width,
      image.bitmap.height,
      image.bitmap.data,
    );
  }

  public writeImageIntoFile(image: Image, fileName: string): void {
    new Jimp({
      data: image.getData(),
      width: image.getWidth(),
      height: image.getHeight(),
    }).write(this.getPublicPathForFileName(fileName));
  }

  private getPublicPathForFileName(fileName: string): string {
    return `${__dirname}/../../public/${fileName}`;
  }
}
