import express from 'express';
import { FileController } from './file-controller';
import { S3Uploader } from './s3-uploader';

const app = express();
app.use(express.json());

const uploader = new S3Uploader();
const fileController = new FileController(uploader);

app.get('/upload', (req, res) => fileController.upload(req, res));

export default app;
