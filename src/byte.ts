export class Byte {
  private constructor(private value: number) {}

  public static createFromNumber(value: number): Byte {
    return new Byte(value);
  }

  static createFromBitArray(charBits: any[]): Byte {
    const byte = new Byte(0);

    for (const charBitEntry of charBits.entries()) {
      byte.setBit(charBitEntry[1]);

      const charBitIndex = charBitEntry[0];
      if (charBitIndex < charBits.length - 1) {
        byte.shiftLeft();
      }
    }

    return byte;
  }

  public static isBitArrayAByteLength(bitArray: number[]): boolean {
    return bitArray.length === 8;
  }

  public getBit(offset = 0): number {
    return this.value & (1 << offset);
  }

  public getBits(): number[] {
    const bits = [];

    for (let i = 7; i >= 0; i--) {
      bits.push(this.getBit(i));
    }

    return bits;
  }

  public setBit(bitValue: number, offset = 0): Byte {
    if (bitValue) {
      this.setTrueBit(offset);
      return this;
    }

    this.setFalseBit(offset);
    return this;
  }

  private setTrueBit(offset = 0): void {
    this.value |= 1 << offset;
  }

  private setFalseBit(offset = 0): void {
    this.value &= ~(1 << offset);
  }

  public writeToBuffer(buffer: Buffer, offset: number): void {
    buffer.writeUint8(this.value, offset);
  }

  private shiftLeft(): void {
    this.value = this.value << 1;
  }

  public getValue(): number {
    return this.value;
  }
}
