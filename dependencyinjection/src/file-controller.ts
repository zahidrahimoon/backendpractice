import { Request, Response } from "express";
import { IUploader } from "./interfaces/uploader.interface";

export class FileController {
    // uploader dependecy injection ka through aeegha
    constructor(private uploader: IUploader) {}

    async upload(req: Request, res: Response): Promise<void> {
        try {
            const filename = 'test.mp4';
            const result = await this.uploader.upload(filename);
            
            res.json({ 
                message: "File uploaded successfully",
                filename: filename,
                success: result
            });
        } catch (error) {
            res.status(500).json({ 
                message: "Upload failed", 
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}