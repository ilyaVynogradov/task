import express, { Application, Request, response, Response } from 'express';
import axios from 'axios';

const app: Application = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try{
  app.post(
    '/upload/dog/image',
    async (req: Request, res: Response): Promise<Response> => {
      const result = await (axios.get('https://random.dog/woof.json'));

      const fin = result.data;

      const myUrl = fin.url;

      var img = new Image();
      img.src = myUrl;
      img.onload = () => {
        var params = (this.width + ' ' + this.height)
        
      }
      
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
