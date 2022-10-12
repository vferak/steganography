import { Byte } from '../byte';
import { Image } from './image';

export class ImageHeader {
  public static readonly HEADER_ENCODE_TYPE_STRING = 1;
  public static readonly HEADER_ENCODE_TYPE_FILE = 2;

  private static readonly HEADER_TYPE_NUMBER_OF_BYTES = 1;
  private static readonly HEADER_FILE_NAME_SIZE_NUMBER_OF_BYTES = 1;
  private static readonly HEADER_SIZE_NUMBER_OF_BYTES = 3;

  public constructor(
    private encodeType: number,
    private numberOfBytes: number,
    private firstByteNumber: number,
    private fileName: string,
  ) {}

  public getNumberOfBytes(): number {
    return this.numberOfBytes;
  }

  public getFirstByteNumber(): number {
    return this.firstByteNumber;
  }

  public isFileType(): boolean {
    return this.encodeType === ImageHeader.HEADER_ENCODE_TYPE_FILE;
  }

  public static getTotalNumberOfBytes(): number {
    return (
      ImageHeader.HEADER_TYPE_NUMBER_OF_BYTES +
      ImageHeader.HEADER_FILE_NAME_SIZE_NUMBER_OF_BYTES +
      ImageHeader.HEADER_SIZE_NUMBER_OF_BYTES
    );
  }

  public static getMaxAllowedFileNameLength(): number {
    return Math.pow(2, 8 * ImageHeader.HEADER_FILE_NAME_SIZE_NUMBER_OF_BYTES);
  }

  public getFileName(): string {
    return this.fileName;
  }

  public static createHeaderFromData(
    encodeType: number,
    data: Buffer,
    fileName: string,
  ): ImageHeader {
    return new ImageHeader(
      encodeType,
      data.length,
      ImageHeader.getTotalNumberOfBytes() + fileName.length,
      fileName,
    );
  }

  public static readHeaderFromImage(image: Image): ImageHeader {
    const decodedHeaderBytes: Byte[] = [];

    for (const imageByte of image.yieldLastBitsAsBytes()) {
      decodedHeaderBytes.push(imageByte);

      if (decodedHeaderBytes.length === this.getTotalNumberOfBytes()) {
        break;
      }
    }

    let sum = 0;
    let encodeType = ImageHeader.HEADER_ENCODE_TYPE_STRING;
    let fileNameLength = 0;
    for (const [headerByteOffset, headerByte] of decodedHeaderBytes.entries()) {
      if (headerByteOffset === 0) {
        encodeType = headerByte.getValue();
        continue;
      }

      if (headerByteOffset === 1) {
        fileNameLength = headerByte.getValue();
        continue;
      }

      const order = Math.abs(
        headerByteOffset - this.getTotalNumberOfBytes() + 1,
      );

      sum += Math.pow(256, order) * headerByte.getValue();
    }

    return new ImageHeader(
      encodeType,
      sum,
      ImageHeader.getTotalNumberOfBytes() + fileNameLength,
      this.getFileNameFromImage(image, fileNameLength),
    );
  }

  public writeToBuffer(): Buffer {
    const headerBytes = Buffer.alloc(ImageHeader.getTotalNumberOfBytes());

    let length = this.numberOfBytes;

    for (const [headerByteOffset] of headerBytes.entries()) {
      if (headerByteOffset === 0) {
        Byte.createFromNumber(this.encodeType).writeToBuffer(
          headerBytes,
          headerByteOffset,
        );
        continue;
      }

      if (headerByteOffset === 1) {
        Byte.createFromNumber(this.fileName.length).writeToBuffer(
          headerBytes,
          headerByteOffset,
        );
        continue;
      }

      const order = Math.abs(
        headerByteOffset - ImageHeader.getTotalNumberOfBytes() + 1,
      );

      if (order > 0) {
        Byte.createFromNumber(
          Math.floor(length / Math.pow(256, order)),
        ).writeToBuffer(headerBytes, headerByteOffset);

        length = length % Math.pow(256, order);

        continue;
      }

      Byte.createFromNumber(length).writeToBuffer(
        headerBytes,
        headerByteOffset,
      );
    }

    return Buffer.concat([headerBytes, Buffer.from(this.fileName)]);
  }

  private static getFileNameFromImage(
    image: Image,
    fileNameLength: number,
  ): string {
    const fileNameBuffer = Buffer.alloc(fileNameLength);
    const imageBytesGenerator = image.yieldLastBitsAsBytes(
      ImageHeader.getTotalNumberOfBytes(),
    );

    for (
      let fileNameBufferPosition = 0;
      fileNameBufferPosition < fileNameLength;
      fileNameBufferPosition++
    ) {
      imageBytesGenerator
        .next()
        .value.writeToBuffer(fileNameBuffer, fileNameBufferPosition);
    }

    return fileNameBuffer.toString();
  }
}
