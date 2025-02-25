export const calendarsFutbol = [{
    "id": "08d1e584fc6684c36d3a5f85d2c3887454579c366adf1c7276f467ca645ca60f", "name": "cancha sintetica"
}]

export const calendarVoley = [{
    "id": "0cad647eabf06fe263bd287556e1187a0eb04cc44f7a9d4c27e1498b7ddc8394", "name": "cancha volley playa 1"
}, { "id": "b5051742cd676dce1180e3c56ae96a62d083ebbdcdfd6e1807466a6c17134a58", "name": "cancha volley playa 2" },
{ "id": "89c67f61955349ad989536a6faf828ccda2f4bd8198fe70640709973f94ec700", "name": "cancha volley playa 3" },
{ "id": "6e0c90bfeea9b0a0d27af5144b5044215e6cc3ee9240e549aa3147736d5a0442", "name": "cancha volley playa 4" },
{ "id": "397abf4930d220f3f66061d407b38eec3f3ec2a9f3f34b5ed1cd92d43611d316", "name": "cancha volley playa 5" }]

export const getCalendar = (calendar: any[]) => calendar.map((item: any) => `- ID: ${item.id}  nombre: ${item.name} `).join("\n")

 