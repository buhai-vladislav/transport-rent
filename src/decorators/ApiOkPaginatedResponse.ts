import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationMeta, ResponseBody } from '../types';

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  description: string,
  status: HttpStatus,
) =>
  applyDecorators(
    ApiExtraModels(ResponseBody, dataDto),
    ApiOkResponse({
      description,
      status,
      schema: {
        allOf: [
          {
            properties: {
              message: { type: 'string', example: 'Success' },
              statusCode: { type: 'integer', example: status },
            },
          },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(dataDto) },
                  },
                  pagination: {
                    $ref: getSchemaPath(PaginationMeta),
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
