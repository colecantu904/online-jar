import { neon } from "@neondatabase/serverless"

export default async function handler( request, response ) {
    
    let madeRoomCode = request.body.roomCode;

    try {
        const db = neon(process.env.DATABASE_URL);

        const dataResponse = await db`INSERT INTO jars (jar_code, created_on, jar_amount) VALUES (${madeRoomCode}, NOW(), 0)`;

        return response.status(200).json(dataResponse);

    } catch (error){
        return response.status(500).json(error)
    }

}