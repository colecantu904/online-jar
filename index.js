// set up current jar
let searchParams = new URLSearchParams(window.location.search);
let currentRoom = searchParams.get('jar_code');

if ( currentRoom ) {
    joinJar(currentRoom);
}

// check cookie for jar codes
let recentJarsElement = document.getElementById("recent-jars-container")

const rooms = localStorage.getItem('recentRooms');
const roomsData = JSON.parse(rooms);

if ( roomsData ) {
  let elem = document.createElement('h2');
  elem.innerHTML = "Recent Rooms:"
  recentJarsElement.appendChild(elem);

  for ( const room of roomsData ) {
    let elem = document.createElement('p');
    elem.innerHTML = `${room}`;
    recentJarsElement.appendChild(elem);
  }
}

let currentRoomElement = document.getElementById("current-room-code");

let currentAmount = 0;
let currentAmountElement = document.getElementById("current-jar-amount");

const addForm = document.getElementById("join-jar-form");

const newJarElement = document.getElementById("made-jar-code")

let currentClicks = 0;
let currentCounterElement = document.getElementById("current-counter");

function getJarCode() {
  return currentRoom
}

function setJarCode( value ) {

    currentRoom = value;
    currentRoomElement.innerHTML = currentRoom;
    addForm.value = currentRoom;

}

function getJarAmount() {
  return currentAmount
}

function setJarAmount( value ) {
  currentAmount = value;
  currentAmountElement.innerHTML = value;
}

function getCounter() {
  return currentClicks
}

function setCounter( value ) {
  currentClicks = value;

  if ( value == 0 ) {
    currentCounterElement.innerHTML = ``
  } else {
    currentCounterElement.innerHTML = `+ ${value}`
  }
}

function addJarCodeToCookie( code ) {
  let storage = "";

  if ( localStorage.getItem('recentRooms') ) {
    storage = localStorage.getItem('recentRooms');
    storage = JSON.parse(storage);

    storage.push(code);

    storage = JSON.stringify(storage);
    
  } else {
    storage = JSON.stringify([code]);
  }

  localStorage.setItem('recentRooms', storage);
}

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

async function joinJar( jarCode ) {

    const responseData = await getJarAmount(jarCode);


    if ( responseData.length > 0 ) {
      setJarCode(jarCode);
      setJarAmount(responseData[0].jar_amount)
      
      addJarCodeToCookie(jarCode);
      
    } else {
        console.log("Invalid jar code!")
    }
}

// form to specifically join a jar
addForm.addEventListener("submit",  async ( event ) => {

    event.preventDefault();

    // fetch the form data
    const formData = new FormData(addForm);
    const data = Object.fromEntries(formData.entries());

    // join the jar
    await joinJar(data.roomCode);
    
})

async function clickJar( event ) {

  if ( getJarCode() ) {
    event.preventDefault();

    let clicks = getCounter() + 1;

    setTimeout(() => {addToJar(clicks)}, 500);

    setCounter(clicks);
  } else {
    setCounter("You need to join a jar!")
    setTimeout(() => {setCounter(0)}, 500)
  }
    
}

async function addToJar( clicks ) {
  // if the current amount of clicks matched what 
  // was passed to the function in the timeout
  // it might build up a stack but it will greatly reduce spam
  // and put the weight of spam on the user
  if ( getCounter() == clicks ) {
    try {
      const request = new Request("/api/add-jar", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ roomCode: getJarCode(), amount: getCounter() }),
      });

      const response = await fetch(request);

      const responseData = await response.json();

      setJarAmount(responseData[0].jar_amount);

      setCounter(0);

    } catch (error) {
      console.log("Error fetching data at /api/add-jar", error);
    }
  }
}


async function makeJar( event ) {
    event.preventDefault()

    // we will just make it at random!
    // even then it will be less of a rate waste
    // then spammers

    let madeRoomCode = '';
    let foundValid = false;
    let trialLimit = 0;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    try {
      while ( !foundValid ) {

      for (i = 0; i < 6; i++) {
        madeRoomCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const request = new Request("/api/make-jar", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ roomCode: madeRoomCode }),
      });

      let response = await fetch(request);

      if ( !(response.length > 0) ) {
        foundValid = true;
      }

      if ( trialLimit > 4 ) {
        throw new Error("Could not generate a random room.")
      }

      trialLimit++;
    }
    } catch (error) {
      console.log("Room code search timed out.", error)
    }
    

    // update display with share url
    let url = new URL(document.location.href);

    let newUrl = url.origin + url.pathname;

    newJarElement.innerHTML = `${newUrl}?jar_code=${madeRoomCode}`
    
}

window.addToJar = addToJar;