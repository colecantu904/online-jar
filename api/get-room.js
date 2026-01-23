import { neon } from "@neondatabase/serverless"

export default async function handler(request, response) {
    try {
        
        const db = neon(process.env.DATABASE_URL);

        // do some things to get the info from the request

        const data = json({room : 1});

        return response.status(200).data;

    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}