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
exports.getUserList = exports.appToUser = exports.getUserByDoc = void 0;
const fs_1 = __importDefault(require("fs"));
/**
 * get list user
 * @returns
 */
const data = fs_1.default.readFileSync('users.json', 'utf8');
const users = JSON.parse(data);
const getUserByDoc = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    //const dataCalendarApi = await fetch('https://hook.us1.make.com/vw8g2pkkckoj4f369yq2bga1uiirqphx')
    const list = users.find((x) => x.document === doc);
    return list;
});
exports.getUserByDoc = getUserByDoc;
const getUserList = () => __awaiter(void 0, void 0, void 0, function* () {
    //const dataCalendarApi = await fetch('https://hook.us1.make.com/vw8g2pkkckoj4f369yq2bga1uiirqphx')
    const list = users.reduce((prev, current) => {
        return prev += [
            `Documento reservado (no disponible): `,
            `${current.document} \n`,
        ].join(' ');
    }, '');
    return list;
});
exports.getUserList = getUserList;
/**
 * add user
 * @param text
 * @returns
 */
const appToUser = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = JSON.parse(text);
    const newUsers = users.push(payload);
    fs_1.default.writeFile('users.json', JSON.stringify(newUsers, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
        }
        else {
            console.log('JSON data has been written to output.json');
        }
    });
    /*const dataApi = await fetch('https://hook.us1.make.com/hiu7qpxd876el55uxjy5cgg49apkfiff', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })*/
    return payload;
});
exports.appToUser = appToUser;
