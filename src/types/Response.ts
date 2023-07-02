import { HttpStatus } from '@nestjs/common';

export class ResponseBody {
  message: string;
  status: HttpStatus;
  data?: any;
  error?: any;
}
