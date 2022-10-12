import { Injectable } from '@nestjs/common';
import { ImageEncoder } from './image/image.encoder';
import { ImageDecoder } from './image/image.decoder';

@Injectable()
export class SteganographyService {
  public constructor(
    private imageEncoder: ImageEncoder,
    private imageDecoder: ImageDecoder,
  ) {}

  public async encodeStringIntoFile(
    data: string,
    imageFileName: string,
  ): Promise<void> {
    await this.imageEncoder.encodeStringIntoImageFile(data, imageFileName);
  }

  public async encodeFileIntoFile(
    data: string,
    imageFileName: string,
  ): Promise<void> {
    await this.imageEncoder.encodeFileIntoImageFile(data, imageFileName);
  }

  public async decodeFile(imageFileName: string): Promise<string> {
    return await this.imageDecoder.decodeImageFile(imageFileName);
  }
}
