import 'dotenv/config'
import { createBot, MemoryDB, createProvider } from '@bot-whatsapp/bot'
import { BaileysProvider } from '@bot-whatsapp/provider-baileys'
import AWS from 'aws-sdk';
import fs from "fs"
import AIClass from './services/ai';
import flows from './flows';

const ai = new AIClass(process.env.OPEN_API || "", 'gpt-3.5-turbo-16k')
const s3: AWS.S3 = new AWS.S3({
    accessKeyId: "AKIAW5WU5D2AXMUM62YH",
    secretAccessKey: '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',
    region: 'us-east-1',
})
const main = async () => {

    const provider = createProvider(BaileysProvider)
    // const provider = createProvider(TelegramProvider, { token: process.env.TELEGRAM_API ?? '' })
    provider.addListener("require_action", () => {
        uploadQrToS3("bot.qr.png");
    })
    await createBot({
        database: new MemoryDB(),
        provider,
        flow: flows
    }, { extensions: { ai } })

}
const uploadQrToS3 = async (filePath: string) => {
    if (fs.existsSync(filePath) && s3) {
        try {
            const fileContent = fs.readFileSync(filePath);

            const params = {
                Bucket: "img-qr", // Nombre de tu bucket
                Key: `canchas-${filePath}`, // Nombre del archivo en S3
                Body: fileContent,
                ACL: "public-read"
            };

            const data = await s3.upload(params).promise();
            console.log(`Archivo subido exitosamente a ${data.Location}`);
        } catch (err) {
            console.error("Error al subir el archivo:", err);
        }
    } else {
        console.error('QR file not found at:', "bot.qr.png");
    }

};
main()