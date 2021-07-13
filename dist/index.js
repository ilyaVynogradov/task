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
const axios_1 = __importDefault(require("axios"));
const app = express_1.default();
const port = 8000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
try {
    app.post('/upload/dog/image', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (axios_1.default.get('https://random.dog/woof.json'));
        const fin = result.data;
        const myUrl = fin.url;
        console.log(myUrl);
        return res.status(200).send({
            message: "done",
            fin,
        });
    }));
}
catch (error) {
    console.log(`Error: ${error.message}`);
}
try {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}
catch (error) {
    console.log(`Error: ${error.message}`);
}
//# sourceMappingURL=index.js.map