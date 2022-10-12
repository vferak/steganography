import { Module } from '@nestjs/common';
import { ImageEncoder } from './image.encoder';
import { ImageDecoder } from './image.decoder';
import { ImageFileService } from './imageFile.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  providers: [ImageEncoder, ImageDecoder, ImageFileService],
  exports: [ImageEncoder, ImageDecoder],
})
export class ImageModule {}
