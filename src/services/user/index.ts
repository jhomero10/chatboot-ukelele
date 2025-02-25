import fs from 'fs' 

/**
 * get list user
 * @returns 
 */

const data = fs.readFileSync('users.json', 'utf8');
const users = JSON.parse(data);
const getUserByDoc = async (doc: string): Promise<any> => {
    //const dataCalendarApi = await fetch('https://hook.us1.make.com/vw8g2pkkckoj4f369yq2bga1uiirqphx')
    const list = users.find((x:any) => x.document === doc)
    return list
}

const getUserList = async (): Promise<string> => {
    //const dataCalendarApi = await fetch('https://hook.us1.make.com/vw8g2pkkckoj4f369yq2bga1uiirqphx')
    const list = users.reduce((prev:any, current:any) => {
        return prev += [
            `Documento reservado (no disponible): `,
            `${current.document} \n`,
        ].join(' ')
    }, '')
    return list
}

/**
 * add user
 * @param text 
 * @returns 
 */
const appToUser = async (text: string) => {
    const payload = JSON.parse(text)
    const newUsers = users.push(payload)
    fs.writeFile('users.json', JSON.stringify(newUsers, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
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
    return payload

}

export { getUserByDoc, appToUser, getUserList }