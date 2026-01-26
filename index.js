// we got a good amount of logic to add here...

// for this, need to figure out how to interact with cookies in js
// have to find if there is a jar stored at the code, otherwise if
// there is no code, or else, you can input a code into a form
// which will redirect to the query url.
// you can then send the query url to freinds so that they can immediantly
// navigate to it. Will I need users in order to track who is submitting to 
// the jar?

let currentRoom = '';
let currentRoomElement = document.getElementById("current-room-code");

let currentAmount = 0;
let currentAmountElement = document.getElementById("current-jar-amount");

const addForm = document.getElementById("jar-form");


async function getJarAmount( jarCode ) {
    try {
      const request = new Request("api/get-current", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ roomCode: jarCode }),
      });

      const response = await fetch(request);

      return response.json()

    } catch (error) {
      console.log(`Error fetching from get-current`, error);
      return error
    }
}

addForm.addEventListener("submit",  async ( event ) => {

    event.preventDefault();

    const formData = new FormData(addForm);

    // works
    const data = Object.fromEntries(formData.entries());

    currentRoom = data.roomCode;

    currentRoomElement.innerHTML = currentRoom;

    const responseData = await getJarAmount(currentRoom);

    currentAmount = responseData[0].jar_amount;

    currentAmountElement.innerHTML = currentAmount;

    console.log(responseData);
    
})

async function addToJar( event ) {

    event.preventDefault();

    try {
      const request = new Request("/api/add-jar", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ roomCode: currentRoom, amount: 1 }),
      });

      const response = await fetch(request);

      console.log(response);

      const responseData = await response.json();

      currentAmount = responseData[0].jar_amount;
      currentAmountElement.innerHTML = currentAmount;

      console.log(responseData);
    } catch (error) {
      console.log("Error fetching data at /api/get-room", error);
    }
}

window.addToJar = addToJar;