import app from './src/app';

const port = 5000;

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
