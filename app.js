import express from "express";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import path from 'path'
import router from './src/routes/index.js'
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  fileUpload({
    tempFileDir: "./upload",
    useTempFiles: true,
  })
);

app.use(express.static(path.join(__dirname, '../client/build')));

// Routes
app.use('/', router);

export { app };
