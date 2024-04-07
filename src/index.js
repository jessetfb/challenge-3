
document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000";
  
    // Function to make GET requests
    async function fetchData(endpoint) {
      const response = await fetch(`${baseURL}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }
  
    // Function to update movie details on the page
    function updateMovieDetails(movie) {
      const movieDetails = document.querySelector("#movie-details");
      movieDetails.innerHTML = `
              <img src="${movie.poster}" alt="${movie.title} Poster">
              <h2>${movie.title}</h2>
              <p>Description: ${movie.description}</p>
              <p>Showtime: ${movie.showtime}</p>
              <p>Runtime: ${movie.runtime} minutes</p>
              <p>Available Tickets: ${movie.capacity - movie.tickets_sold}</p>
              <button id="buy-ticket">Buy Ticket</button>
          `;
      const buyTicketBtn = document.querySelector("#buy-ticket");
      buyTicketBtn.addEventListener("click", () => buyTicket(movie));
    }
  
    // Function to buy ticket
    async function buyTicket(movie) {
      const updatedTicketsSold = movie.tickets_sold + 1;
      const response = await fetch(`${baseURL}/films/${movie.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      updateMovieDetails({ ...movie, tickets_sold: updatedTicketsSold });
    }
  
    // Function to populate movie list
    async function populateMovieList() {
      const films = await fetchData("films");
      const filmsList = document.querySelector("#films");
      filmsList.innerHTML = "";
      films.forEach((film) => {
        const li = document.createElement("li");
        li.textContent = film.title;
        li.className = "film item";
        if (film.capacity - film.tickets_sold === 0) {
          li.classList.add("sold-out");
        }
        filmsList.appendChild(li);
        li.addEventListener("click", () => updateMovieDetails(film));
      });
    }
  
    // Initial setup
    async function initialize() {
      try {
        const firstMovie = await fetchData("films/1");
        updateMovieDetails(firstMovie);
        populateMovieList();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
    initialize();
  });
  