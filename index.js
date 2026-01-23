import db from "./lib/database"

async function getFirstRoom( event ) {
    
    event.prevenDefault();

    try {
        const response = await fetch('/api/get-room');
        const data = await response.json();

        console.log(data);
        
    } catch (error) {
        console.log("Error fetching data at /api/get-room", error);
    }
}

window.getFirstRoom = getFirstRoom;