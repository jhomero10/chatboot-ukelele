import { format, addMinutes } from 'date-fns'
import fs from 'fs'
import Axios, { AxiosInstance } from 'axios'
var service: AxiosInstance;

const data = fs.readFileSync('calendar.json', 'utf8');
const calendar = JSON.parse(data);
/**
 * get calendar
 * @returns 
 */
const getCurrentCalendar = async (parentId?: number): Promise<string> => {
    const list = calendar.filter((x: any) => x.startDate !== null && x.startDate !== undefined && x.idParent === parentId || parentId === undefined).reduce((prev: any, current: any) => {
        return prev += [
            `Espacio reservado (no disponible): ID: ${current.idCalendar}`,
            `(Desde ${format(current.startDate, 'eeee do h:mm a')} `,
            `Hasta ${format(addMinutes(current.startDate, 30), 'eeee do h:mm a')})\n`,
        ].join(' ')
    }, '')
    return list
}

/**
 * add to calendar
 * @param text 
 * @returns 
 */
const appToCalendar = async (text: string) => {
    const payload = JSON.parse(text)
    if (!service) {
        service = Axios.create({
            baseURL: 'https://hook.us2.make.com',
            timeout: 15000,
        });
    }
    return service.post(`${service.defaults.baseURL}/au12hcff27xa6u5sgt6e8qc5sesnv4fn`, { ...payload, idCalendar: payload.idCalendar + "@group.calendar.google.com" }, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            body: { ...payload, idCalendar: payload.idCalendar + "@group.calendar.google.com" }
        },
    }).then(dataApi => {
        const payloadToSave = { ...payload, eventId: dataApi.data }
        calendar.push(payloadToSave)
        console.log(payloadToSave)
        fs.writeFile('calendar.json', JSON.stringify(calendar, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
            }
        });
    })
}

export { getCurrentCalendar, appToCalendar }