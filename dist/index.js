"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).send({
        message: 'Done!'
    });
}));
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
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}
catch (error) {
    console.log(`Error: ${error.message}`);
}
//# sourceMappingURL=index.js.map