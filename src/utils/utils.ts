import { Request } from 'express';
import { ApplicationModule } from '../modules/Application';

/**
 * Retrieves the root path for an image based on the provided request object.
 *
 * @param {Request} request - The request object containing the protocol and host details.
 * @return {string} The root path for the image.
 */
export const getImageRootPath = (request: Request) => {
  const path = `${request.protocol}://${request.get('Host')}/${
    process.env.MINIO_BUCKET_NAME
  }`.replace(ApplicationModule.port.toString(), process.env.MINIO_PORT);

  return path;
};
