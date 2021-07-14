import express, { Application, Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import FileType from 'file-type';


const app: Application = express();
const port = 8000;

enum Resize { finalWidth = 1400, finalHeight = 700 };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try{
  app.post(
    '/upload/dog/image',
    async (req: Request, res: Response): Promise<Response> => {
      const result = await (axios.get('https://random.dog/woof.json'));

      const fin = result.data;

      const imgUrl = fin.url;
      
      const downloadFile = async(fileUrl: string, downloadFolder: string) => {

        const fileName = path.basename(fileUrl);
        const localFilePath = path.resolve(__dirname, downloadFolder, fileName);

        try {
          const response = await (axios.get(
            fileUrl, {
              responseType: 'stream',
            }
            ));

          const w = response.data.pipe(fs.createWriteStream(localFilePath));
          w.on('finish', () => {
            console.log('Image downloaded');
          });

        } catch (error) {
          console.log(`Error: ${error.message}`);
        }
      }

      downloadFile(imgUrl, 'download');

      let checkType = () => {
        (async () => {
          const type = await FileType.fromFile(__dirname + '/download/'+ path.basename(imgUrl));
          console.log(type);
          if (type.ext == 'jpg' || 'jpeg' || 'png') {
            console.log('Type is OK');
          } else {
            res.redirect('/upload/dog/image');
          }
        })();
      }
      
      let resizePicture = () => {
        let inputFile = __dirname + '/download/'+ path.basename(imgUrl);
        let outputFile = __dirname+ '/download/resized/' +'resized-' + path.basename(imgUrl);

        sharp(inputFile).resize({height: Resize.finalHeight, width: Resize.finalWidth }).toFile(outputFile)
        .then(function(newFileInfo) {
          console.log("Success");
        })
        .catch(function(error) {
          console.log(`Error: ${error.message}`);
        });
      }

      setTimeout(checkType, 1000);
      setTimeout(resizePicture, 2000);

      return res.status(200).send({
        fin,
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
