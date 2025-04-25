import { Module } from '@nestjs/common';
import { MyLoggerService } from './my-logger.service';

@Module({
  providers: [MyLoggerService],
  exports: [MyLoggerModule]
})
export class MyLoggerModule {}
