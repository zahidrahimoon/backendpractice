import { IUploader } from './interfaces/uploader.interface';

export class S3Uploader implements IUploader {
    async upload(filename: string): Promise<boolean> {
        console.log(`Uploading ${filename} to S3 Bucket`);
        return true;
    }
}
