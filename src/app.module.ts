import { Module } from '@nestjs/common';
import { EncodeCommand } from './encode.command';
import { SteganographyService } from './steganography.service';
import { ImageModule } from './image/image.module';
import { DecodeCommand } from './decode.command';

@Module({
  imports: [ImageModule],
  providers: [EncodeCommand, DecodeCommand, SteganographyService],
})
export class AppModule {}
