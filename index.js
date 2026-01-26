// we got a good amount of logic to add here...

// for this, need to figure out how to interact with cookies in js
// have to find if there is a jar stored at the code, otherwise if
// there is no code, or else, you can input a code into a form
// which will redirect to the query url.
// you can then send the query url to freinds so that they can immediantly
// navigate to it. Will I need users in order to track who is submitting to 
// the jar?

const addForm = document.getElementById("jar-form");

addForm.addEventListener("submit",  async ( event ) => {

    event.preventDefault();

    const formData = new FormData(addForm);

    // works
    const data = Object.fromEntries(formData.entries());

    try {
        const request = new Request('/api/add-jar', {
            method: 'POST',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify({roomCode : data.roomCode, amount : 1})
        });

        console.log(event);

        const response = await fetch(request);

        console.log(response);

        const responseData = await response.json();

        console.log(responseData);
        
    } catch (error) {
        console.log("Error fetching data at /api/get-room", error);
    }
})

// async function addToJar( amount )