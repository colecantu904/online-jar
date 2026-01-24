import { neon } from "@neondatabase/serverless"

// figure out exactly how this should be made, how backend should be constructed
// from memory, and then remake the whole thing by yourself with all the proper
// routes and functions.

// also need to learn sql to interact with the db, now that the connection is made!
// make sure to give a timline on jars, they should delete themselves after so much
// time of inactivity.

export default async function handler(request, response) {
    try {
        let testing_room_code = 'ABCDEF';
        let testing_amount = 10;
        
        // we are making a connection!!
        const db = neon(process.env.DATABASE_URL);

        // do some things to get the info from the request
        await db`UPDATE jars SET jar_amount = jar_amount + ${testing_amount} WHERE jar_code = ${testing_room_code}`;

        const data = await db`SELECT jar_amount FROM jars WHERE jar_code = ${testing_room_code}`;

        return response.status(200).json(data);

    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}