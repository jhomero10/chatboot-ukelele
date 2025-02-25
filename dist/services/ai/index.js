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
const openai_1 = __importDefault(require("openai"));
class AIClass {
    constructor(apiKey, _model) {
        /**
         *
         * @param messages
         * @param model
         * @param temperature
         * @returns
         */
        this.createChat = (messages_1, model_1, ...args_1) => __awaiter(this, [messages_1, model_1, ...args_1], void 0, function* (messages, model, temperature = 0) {
            try {
                const completion = yield this.openai.chat.completions.create({
                    model: model !== null && model !== void 0 ? model : this.model,
                    messages,
                    temperature,
                    max_tokens: 326,
                    top_p: 0,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                });
                return completion.choices[0].message.content;
            }
            catch (err) {
                console.error(err);
                return "ERROR";
            }
        });
        this.openai = new openai_1.default({ apiKey, timeout: 15 * 1000 });
        if (!apiKey || apiKey.length === 0) {
            throw new Error("OPENAI_KEY is missing");
        }
        this.model = _model;
    }
}
exports.default = AIClass;
