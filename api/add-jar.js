import { neon } from "@neondatabase/serverless"

// figure out exactly how this should be made, how backend should be constructed
// from memory, and then remake the whole thing by yourself with all the proper
// routes and functions.

// also need to learn sql to interact with the db, now that the connection is made!
// make sure to give a timline on jars, they should delete themselves after so much
// time of inactivity.

export default async function handler(request, response) {
    try {
        const requestBody = request.body;

        let testing_room_code = requestBody.roomCode;
        let testing_amount = requestBody.amount;
        
        // we are making a connection!!
        const db = neon(process.env.DATABASE_URL);

        // do some things to get the info from the request
        await db`UPDATE jars SET jar_amount = jar_amount + ${testing_amount}, last_event_on = NOW() WHERE jar_code = ${testing_room_code}`;

        // better way to get the updated jar amount from the last command?
        const data = await db`SELECT jar_amount FROM jars WHERE jar_code = ${testing_room_code}`;

        return response.status(200).json(data);

    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}