const flightInput = document.getElementById("flight"); //dropdown
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");

let selection = "";

const renderSeats = (seats) => {
  seatsDiv.innerHTML = "";
  document.querySelector(".form-container").style.display = "block";
  let flightIdent = flightInput.value;
  //console.log(flightIdent); //diplays selected flight
  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement("li");

      // Two types of seats to render
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      // TODO: render the seat availability based on the data...

      let matchingSeat = seats.find((seat) => {
        if (seat.id === seatNumber) {
          return true;
        }
      });
      //console.log(matchingSeat); logs all the seats (id/availability)
      if (matchingSeat.isAvailable === false) {
        seat.innerHTML = seatOccupied;
      } else seat.innerHTML = seatAvailable;

      row.appendChild(seat);
    }
  }

  let seatMap = document.forms["seats"].elements["seat"];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove("selected");
        }
      });
      document.getElementById(seat.value).classList.add("selected");
      document.getElementById("seat-number").innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  const flightNumber = flightInput.value;
  console.log("toggleFormContent: ", flightNumber);

  fetch(`/flights/${flightNumber}`)
    .then((res) => res.json())
    .then((seats) => {
      // console.log(" Selected Fligh Seats: ", seats); //Displays all the seats
      renderSeats(seats);
    });
  // TODO: contact the server to get the seating availability
  //      - only contact the server if the flight number is this format 'SA###'.
  //      - Do I need to create an error message if the number is not valid?

  // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
};

const handleConfirmSeat = (event) => {
  console.log("handleConfirmSeat: ", event);
  event.preventDefault();
  // TODO: everything in here!
  fetch("/users", {
    headers: {
      Accept: "application/json", //what kind of data we are sending
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      givenName: document.getElementById("givenName").value,
      surname: document.getElementById("surname").value,
      email: document.getElementById("email").value,
      seatNum: document.getElementById("seat-number").value,
      flight: document.getElementById("flight").value,
      seat: `${selection}`,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      //write the redirect code
      console.log("confrimed", data);
      window.location.href = `/confirmed?id=${data.id}`;
      //window.location.href = `http://localhost:8000/confirmed/`; ///!!!!Something must be wrong in this area!!!!!!!
      //location.replace(`/${randomNumber}`);
    });
};

flightInput.addEventListener("change", toggleFormContent);

fetch("/flights")
  .then((res) => res.json())
  .then((flightNumbers) => {
    console.log(flightNumbers);
    flightNumbers.forEach((flightId) => {
      const option = document.createElement("option");
      option.innerText = flightId;
      option.value = flightId;
      flightInput.appendChild(option);
    });
  });
