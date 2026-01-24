// we got a good amount of logic to add here...

// for this, need to figure out how to interact with cookies in js
// have to find if there is a jar stored at the code, otherwise if
// there is no code, or else, you can input a code into a form
// which will redirect to the query url.
// you can then send the query url to freinds so that they can immediantly
// navigate to it. Will I need users in order to track who is submitting to 
// the jar?

async function getFirstRoom( event ) {
    
    // event.prevenDefault();

    try {
        const response = await fetch('/api/get-room');

        console.log(response);

        const data = await response.json();

        console.log(data);
        
    } catch (error) {
        console.log("Error fetching data at /api/get-room", error);
    }
}

// async function addToJar( amount )

window.getFirstRoom = getFirstRoom;