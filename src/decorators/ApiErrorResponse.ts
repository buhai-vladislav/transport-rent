import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseBody } from 'src/types';

export const ApiErrorResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  description: string,
  status: HttpStatus,
) =>
  applyDecorators(
    ApiExtraModels(ResponseBody, dataDto),
    ApiResponse({
      description,
      status,
      schema: {
        allOf: [
          {
            properties: {
              message: { type: 'string', example: 'Something went wrong' },
              statusCode: { type: 'integer', example: status },
            },
          },
          {
            properties: {
              error: {
                oneOf: [{ $ref: getSchemaPath(dataDto) }, { type: 'string' }],
              },
            },
          },
        ],
      },
    }),
  );
