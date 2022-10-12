import { Byte } from '../byte';
import { ImageHeader } from './imageHeader';

export class Image {
  public constructor(
    private width: number,
    private height: number,
    private data: Buffer,
  ) {}

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getData(): Buffer {
    return this.data;
  }

  public getNumberOfBytesAvailableForEncoding(): number {
    return ((this.data.length / 4) * 3) / 8;
  }

  public isAlphaChannelByte(bufferOffset: number): boolean {
    return bufferOffset % 4 === 3;
  }

  public async encodeDataIntoNewImage(data: Buffer): Promise<Image> {
    const encodedImageBytes = Buffer.alloc(this.data.length);

    const dataBits = this.yieldDataBits(data);

    for (const [imageByteIndex, imageByteValue] of this.data.entries()) {
      const imageByte = Byte.createFromNumber(imageByteValue);

      if (!this.isAlphaChannelByte(imageByteIndex)) {
        const nextBit = dataBits.next();
        imageByte.setBit(nextBit.done ? imageByte.getBit() : nextBit.value);
      }

      imageByte.writeToBuffer(encodedImageBytes, imageByteIndex);
    }

    return new Image(this.width, this.height, encodedImageBytes);
  }

  public decodeData(imageHeader: ImageHeader): Buffer {
    const decodedImageBytes = Buffer.alloc(imageHeader.getNumberOfBytes());

    let decodedImageByteIndex = 0;
    for (const imageByte of this.yieldLastBitsAsBytes(
      imageHeader.getFirstByteNumber(),
    )) {
      imageByte.writeToBuffer(decodedImageBytes, decodedImageByteIndex++);

      if (decodedImageByteIndex === decodedImageBytes.length) {
        break;
      }
    }

    return decodedImageBytes;
  }

  public *yieldLastBitsAsBytes(offset = 0): Generator<Byte> {
    let charBits = [];

    let decodedImageByteCount = 0;
    for (const [imageByteIndex, imageByteValue] of this.data.entries()) {
      if (this.isAlphaChannelByte(imageByteIndex)) {
        continue;
      }

      const imageByte = Byte.createFromNumber(imageByteValue);
      charBits.push(imageByte.getBit());

      if (!Byte.isBitArrayAByteLength(charBits)) {
        continue;
      }

      if (++decodedImageByteCount > offset) {
        yield Byte.createFromBitArray(charBits);
      }

      charBits = [];
    }
  }

  private *yieldDataBits(dataBytes: Buffer): Generator<number> {
    for (const dataBufferByte of dataBytes) {
      const dataByte = Byte.createFromNumber(dataBufferByte);

      for (const bit of dataByte.getBits()) {
        yield bit;
      }
    }
  }
}
