import { Injectable } from '@nestjs/common';
import { ImageFileService } from './imageFile.service';
import { ImageHeader } from './imageHeader';
import { FileService } from '../file/file.service';

@Injectable()
export class ImageDecoder {
  public constructor(
    private fileService: FileService,
    private imageFileService: ImageFileService,
  ) {}

  public async decodeImageFile(imageFileName: string): Promise<string> {
    const image = await this.imageFileService.readImageFromFileName(
      imageFileName,
    );

    const imageHeader = ImageHeader.readHeaderFromImage(image);

    const decodedData = image.decodeData(imageHeader);

    if (imageHeader.isFileType()) {
      this.fileService.writeFile(decodedData, imageHeader.getFileName());
      return imageHeader.getFileName();
    }

    return decodedData.toString();
  }
}
