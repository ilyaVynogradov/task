import express, { Application, Request, response, Response } from 'express';
import axios from 'axios';

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'Done!'
  });
});

// app.post(
//   '/upload/dog/image',
//   async (req: Request, res: Response): Promise<Response> => {
//     const result = await (axios.get('https://random.dog/woof.json'));
//     const data = await res.json();
//     console.log(data);
    
//     return res.status(200).send({
//       message: 'Done!',
//     });
//   },
// );

try {
  app.listen(port, (): void => {
    console.log(`Server is listening on port ${port}`);
  });
} catch (error) {
  console.log(`Error: ${error.message}`);
}
