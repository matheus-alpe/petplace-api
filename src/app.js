import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import { routes } from './routes.js';
import './db.js';


const __dirname = path.resolve(path.dirname(''));

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/static', express.static(__dirname + '/pictures'));
app.use(fileUpload())

app.post('/user-upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    
    const sampleFile = req.files.pic;
    const uploadPath = path.resolve(__dirname, 'pictures', 'users', sampleFile.name);
    
    sampleFile.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err);

        res.status(200).send('File Uploaded!');

    });

});

app.post('/pet-upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    
    const sampleFile = req.files.pic;
    const uploadPath = path.resolve(__dirname, 'pictures', 'pets', sampleFile.name);
    
    sampleFile.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err);

        res.status(200).send('File Uploaded!');

    });

});

app.use(routes);

app.use((req, res, next) => {
    res.status(404).send({ error: '404 - Not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
