import { Injectable } from '@nestjs/common';
import { ImageFileService } from './imageFile.service';
import { ImageHeader } from './imageHeader';
import { FileService } from '../file/file.service';
import { Image } from './image';

@Injectable()
export class ImageEncoder {
  public constructor(
    private fileService: FileService,
    private imageFileService: ImageFileService,
  ) {}

  public async encodeStringIntoImageFile(
    value: string,
    imageFileName: string,
  ): Promise<void> {
    const image = await this.imageFileService.readImageFromFileName(
      imageFileName,
    );

    const imageData = Buffer.from(value);
    const imageHeader = ImageHeader.createHeaderFromData(
      ImageHeader.HEADER_ENCODE_TYPE_STRING,
      imageData,
      'string',
    );

    const completeDataForEncoding = Buffer.concat([
      imageHeader.writeToBuffer(),
      imageData,
    ]);

    this.guardAgainstDataOverflow(completeDataForEncoding, image);

    const encodedImage = await image.encodeDataIntoNewImage(
      completeDataForEncoding,
    );

    this.imageFileService.writeImageIntoFile(
      encodedImage,
      `encoded-${imageFileName}`,
    );
  }

  public async encodeFileIntoImageFile(
    fileName: string,
    imageFileName: string,
  ): Promise<void> {
    this.guardAgainstLongFileName(fileName);

    const image = await this.imageFileService.readImageFromFileName(
      imageFileName,
    );

    const imageData = this.fileService.readFile(fileName);
    const imageHeader = ImageHeader.createHeaderFromData(
      ImageHeader.HEADER_ENCODE_TYPE_FILE,
      imageData,
      fileName,
    );

    const completeDataForEncoding = Buffer.concat([
      imageHeader.writeToBuffer(),
      imageData,
    ]);

    this.guardAgainstDataOverflow(completeDataForEncoding, image);

    const encodedImage = await image.encodeDataIntoNewImage(
      completeDataForEncoding,
    );

    this.imageFileService.writeImageIntoFile(
      encodedImage,
      `encoded-${imageFileName}`,
    );
  }

  private guardAgainstDataOverflow(
    completeDataForEncoding: Buffer,
    image: Image,
  ) {
    if (
      completeDataForEncoding.length >
      image.getNumberOfBytesAvailableForEncoding()
    ) {
      throw new Error(
        `String is too long! (max length = ${image.getNumberOfBytesAvailableForEncoding()})`,
      );
    }
  }

  private guardAgainstLongFileName(fileName: string): void {
    if (fileName.length > ImageHeader.getMaxAllowedFileNameLength()) {
      throw new Error(
        `File name is too long! (max length = ${ImageHeader.getMaxAllowedFileNameLength()})`,
      );
    }
  }
}
