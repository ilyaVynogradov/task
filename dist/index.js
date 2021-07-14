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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const file_type_1 = __importDefault(require("file-type"));
const app = express_1.default();
const port = 8000;
var Resize;
(function (Resize) {
    Resize[Resize["finalWidth"] = 1400] = "finalWidth";
    Resize[Resize["finalHeight"] = 700] = "finalHeight";
})(Resize || (Resize = {}));
;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
try {
    app.post('/upload/dog/image', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (axios_1.default.get('https://random.dog/woof.json'));
        const fin = result.data;
        const imgUrl = fin.url;
        const downloadFile = (fileUrl, downloadFolder) => __awaiter(void 0, void 0, void 0, function* () {
            const fileName = path_1.default.basename(fileUrl);
            const localFilePath = path_1.default.resolve(__dirname, downloadFolder, fileName);
            try {
                const response = yield (axios_1.default.get(fileUrl, {
                    responseType: 'stream',
                }));
                const w = response.data.pipe(fs_1.default.createWriteStream(localFilePath));
                w.on('finish', () => {
                    console.log('Image downloaded');
                });
            }
            catch (error) {
                console.log(`Error: ${error.message}`);
            }
        });
        downloadFile(imgUrl, 'download');
        let checkType = () => {
            (() => __awaiter(void 0, void 0, void 0, function* () {
                const type = yield file_type_1.default.fromFile(__dirname + '/download/' + path_1.default.basename(imgUrl));
                console.log(type);
                if (type.ext === 'jpg' || 'jpeg' || 'png') {
                    console.log('Type is OK');
                }
                else {
                    res.redirect('/upload/dog/image');
                }
            }))();
        };
        let resizePicture = () => {
            let inputFile = __dirname + '/download/' + path_1.default.basename(imgUrl);
            let outputFile = __dirname + '/download/resized/' + 'resized-' + path_1.default.basename(imgUrl);
            sharp_1.default(inputFile).resize({ height: Resize.finalHeight, width: Resize.finalWidth }).toFile(outputFile)
                .then(function (newFileInfo) {
                console.log("Success");
            })
                .catch(function (error) {
                console.log(`Error: ${error.message}`);
            });
        };
        setTimeout(checkType, 1000);
        setTimeout(resizePicture, 2000);
        return res.status(200).send({
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