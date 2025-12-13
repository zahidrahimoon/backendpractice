import { IUploader } from './interfaces/uploader.interface';


export class CloudinaryUploader implements IUploader {
    async upload(filename: string): Promise<boolean> {
        console.log(`Uploading ${filename} to Cloudinary`);
        return true;
    }
}
