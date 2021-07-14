import express, { Application, Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import FileType from 'file-type';
import mkdirp from 'mkdirp';
import { resolve } from 'path/posix';
import { rejects } from 'assert/strict';

const app: Application = express();
const port = 8000;

enum Resize { finalWidth = 1400, finalHeight = 700 };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const clearFilePath = (filePath: string) => {
    return new Promise(async (resolve, reject) => {
    console.log(filePath);
        try {
            let files = [];
            if( fs.existsSync(filePath) ) {
                files = fs.readdirSync(filePath);
                files.forEach(function(file){
                    let curPath = filePath + "/" + file;
                    if(fs.statSync(curPath).isDirectory()) {
                        clearFilePath(curPath);
                    } else {
                    fs.unlinkSync(curPath);
                    }
                });
            fs.rmdirSync(filePath);
            }
            resolve('success');
        } catch (error) {
            console.log(`Error: ${error.message}`);
            reject(error);
        }
    })
}

const downloadFile = (fileUrl: string, downloadFolder: string) => {
    return new Promise(async (resolve, reject) => {
        const fileName = path.basename(fileUrl);
        const localFilePath = path.resolve(__dirname, downloadFolder, fileName);
    
        try {
            const response = await(axios.get(
                fileUrl, {
                    responseType: 'stream',
                }
            ));
    
            const w = response.data.pipe(fs.createWriteStream(localFilePath));
            w.on('finish', () => {
                resolve('success');
                console.log('Image downloaded');
            });
    
        } catch (error) {
            console.log(`Error: ${error.message}`);
            reject(error)
        }
    });
}

const checkType = async(imgUrl: string) => {
        const type = await FileType.fromFile(__dirname + '/download/'+ path.basename(imgUrl));
        console.log(type);
        if (type.ext == 'jpg' || 'jpeg' || 'png') {
            console.log(type.ext);
            return {
                isValid: true
            }
        } else {
            clearFilePath(__dirname + '/download');
            console.log(type.ext);
            return {
                isValid: false
            }
        }
};

const resizePicture = (imgUrl: string, resizeFolder: string) => {
    return new Promise((resolve, reject) =>
    {
        const fileName = path.basename(imgUrl)
        const localFilePath = path.resolve(__dirname, resizeFolder, fileName);

        let inputFile = __dirname + '/download/' + fileName;
        let outputFile = localFilePath + fileName ;

        sharp(inputFile).resize({height: Resize.finalHeight, width: Resize.finalWidth}).toFile(outputFile)
            .then(function (newFileInfo: any) {
                console.log("Success");
                resolve(newFileInfo);
            })
            .catch(function (error: any) {
                console.log(`Error: ${error.message}`);
                reject(error)
            });
    });
}

try{
  app.post(
    '/upload/dog/image',
    async (req: Request, res: Response): Promise<Response> => {
        let isValidFileType = false;
        let imgUrl;
        do {
            await clearFilePath(__dirname + '/download');

            const result = await (axios.get('https://random.dog/woof.json'));

            const fin = result.data;
            imgUrl = fin.url;

            await downloadFile(imgUrl, mkdirp.sync(__dirname + '/download/'));

            const typeValidationResult = await checkType(imgUrl)
            isValidFileType = typeValidationResult.isValid;
        } while (isValidFileType === false)
        
        const resizedImageInfo = await resizePicture(imgUrl, mkdirp.sync(__dirname + '/download/resized'))
        // TODO You need to add this info in db

      return res.status(200).send({
          resizedImageInfo,
      });
    }
  );
} catch (error) {
  console.log(`Error: ${error.message}`);
}

try {
  app.listen(port, (): void => {
    console.log(`Server is listening on port ${port}`);
  });
} catch (error) {
  console.log(`Error: ${error.message}`);
}
