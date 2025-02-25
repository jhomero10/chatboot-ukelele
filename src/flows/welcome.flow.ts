import { addKeyword, EVENTS } from "@bot-whatsapp/bot"; 
import conversationalLayer from "../layers/conversational.layer";
import mainLayer from "../layers/main.layer";
/**
* Este flow responde a cualquier palabra que escriban
*/
export default addKeyword(EVENTS.WELCOME)
    .addAction(conversationalLayer)
    .addAction(mainLayer)