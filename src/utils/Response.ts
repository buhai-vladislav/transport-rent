import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ResponseBody } from '../types/Response';

export class ResponseResult {
  /**
   * Sends a success response with the provided status, message, and data.
   *
   * @param {Response} res - The response object.
   * @param {HttpStatus} status - The HTTP status code.
   * @param {string} message - The message to be included in the response.
   * @param {object} data - The data to be included in the response.
   * @return {Response<ResponseBody>} The response object.
   */
  static sendSuccess<T>(
    res: Response,
    status: HttpStatus,
    message: string,
    data: object,
  ): Response<ResponseBody<T>> {
    return res.status(status).json({ message, status, data });
  }

  /**
   * Send an error response.
   *
   * @param {Response} res - The response object.
   * @param {HttpStatus} status - The HTTP status code.
   * @param {string} message - The error message.
   * @param {object} [error] - Optional error object.
   * @return {Response<ResponseBody>} The response object.
   */
  static sendError(
    res: Response,
    status: HttpStatus,
    message: string,
    error?: object,
  ): Response<ResponseBody<undefined>> {
    return res.status(status).json({ message, status, error });
  }
}
