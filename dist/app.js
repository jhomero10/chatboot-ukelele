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
require("dotenv/config");
const bot_1 = require("@bot-whatsapp/bot");
const provider_baileys_1 = require("@bot-whatsapp/provider-baileys");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const ai_1 = __importDefault(require("./services/ai"));
const flows_1 = __importDefault(require("./flows"));
const ai = new ai_1.default(process.env.OPEN_API || "", 'gpt-3.5-turbo-16k');
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION,
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const provider = (0, bot_1.createProvider)(provider_baileys_1.BaileysProvider);
    // const provider = createProvider(TelegramProvider, { token: process.env.TELEGRAM_API ?? '' })
    provider.addListener("require_action", () => {
        uploadQrToS3("bot.qr.png");
    });
    yield (0, bot_1.createBot)({
        database: new bot_1.MemoryDB(),
        provider,
        flow: flows_1.default
    }, { extensions: { ai } });
});
const uploadQrToS3 = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    if (fs_1.default.existsSync(filePath) && s3) {
        try {
            const fileContent = fs_1.default.readFileSync(filePath);
            const params = {
                Bucket: "img-qr", // Nombre de tu bucket
                Key: `canchas-${filePath}`, // Nombre del archivo en S3
                Body: fileContent,
                ACL: "public-read"
            };
            const data = yield s3.upload(params).promise();
            console.log(`Archivo subido exitosamente a ${data.Location}`);
        }
        catch (err) {
            console.error("Error al subir el archivo:", err);
        }
    }
    else {
        console.error('QR file not found at:', "bot.qr.png");
    }
});
main();
