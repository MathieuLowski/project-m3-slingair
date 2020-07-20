const getReservation = (event) => {
  event.preventDefault();
  let id = event.target.id.value;
  fetch("/reservations/" + id)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      document.getElementById("flight").innerText = data.flight;
      document.getElementById("seat").innerText = data.seat;
      document.getElementById("name").innerText =
        data.givenName + " " + data.surname;
      document.getElementById("email").innerText = data.email;
    });
};
