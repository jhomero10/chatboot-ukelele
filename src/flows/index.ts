import { createFlow } from "@bot-whatsapp/bot";
import welcomeFlow from "./welcome.flow";
import { flowSeller } from "./seller.flow";
import { flowScheduleFutbol } from "./schedule-futbol.flow";
import { flowConfirm } from "./confirm.flow";
import { flowScheduleVoley } from "./schedule-voley.flow";

/**
 * Declaramos todos los flujos que vamos a utilizar
 */
export default createFlow([welcomeFlow, flowSeller, flowScheduleFutbol, flowScheduleVoley, flowConfirm])