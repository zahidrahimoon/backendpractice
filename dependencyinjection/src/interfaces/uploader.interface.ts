// Interface that all uploaders must implement
export interface IUploader {
    upload(filename: string): Promise<boolean>;
}
