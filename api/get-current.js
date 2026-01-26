import { neon } from "@neondatabase/serverless"

export default async function handler( request, response ) {

    let roomCode = request.body.roomCode;
    
    try {

        const db = neon(process.env.DATABASE_URL);

        const queryResponse = await db`SELECT jar_amount FROM jars WHERE jar_code = ${roomCode}`;

        return response.status(200).json(queryResponse);

    } catch (error) {
        return response.status(500).json(error);
    }


}