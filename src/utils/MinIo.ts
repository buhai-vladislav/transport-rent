import { MinioService } from 'nestjs-minio-client';

/**
 * Sets up a bucket in Minio with the specified policy.
 *
 * @param {MinioService} minio - The Minio service instance.
 * @param {object} policy - The policy object to set for the bucket.
 * @return {void} Returns nothing.
 */
export const setUpBucket = (minio: MinioService, policy: object) => {
  minio.client.bucketExists(
    process.env.MINIO_BUCKET_NAME,
    function (err, exists) {
      if (err) throw err;
      if (!exists) {
        minio.client.makeBucket(
          process.env.MINIO_BUCKET_NAME,
          'us-east-1',
          (err) => {
            if (err) return console.log('Error creating bucket.', err);
          },
        );
      }
      minio.client.setBucketPolicy(
        process.env.MINIO_BUCKET_NAME,
        JSON.stringify(policy),
        (error) => {
          if (error) throw error;
          console.log('Bucket policy set');
        },
      );
    },
  );
};
