document.addEventListener('DOMContentLoaded', function() {
  const baseURL = 'http://localhost:3000';

  function fetchFirstMovieDetails() {
      const movieDetailsContainer = document.getElementById('movie-details');
      if (movieDetailsContainer) {
          fetch(`${baseURL}/films/1`)
              .then(response => response.json())
              .then(data => {
                  const { title, runtime, capacity, showtime, tickets_sold, description, poster } = data;
                  const availableTickets = capacity - tickets_sold;

                  
                  movieDetailsContainer.innerHTML = `
                      <img src="${poster}" alt="${title} Poster">
                      <h2>${title}</h2>
                      <p>Description: ${description}</p>
                      <p>Showtime: ${showtime}</p>
                      <p>Runtime: ${runtime} minutes</p>`;

                  const buyTicketBtn = document.getElementById("buy-ticket");
                  buyTicketBtn.addEventListener("click", () => buyTicket(data));
              })
              .catch(error => console.error('Error fetching first movie details:', error));
      } else {
          console.error('Movie details container not found.');
      }
  }

  function fetchAllMovies() {
      const filmsList = document.getElementById('films');
      if (filmsList) {
          fetch(`${baseURL}/films`)
              .then(response => response.json())
              .then(data => {
                  
                  data.forEach(movie => {
                      const { title } = movie;
                      const li = document.createElement('li');
                      li.textContent = title;
                      li.className = 'film item';
                      filmsList.appendChild(li);
                      li.addEventListener('click', () => updateMovieDetails(movie));
                  });
              })
              .catch(error => console.error('Error fetching all movies:', error));
      } else {
          console.error('Films list container not found.');
      }
  }

  function updateMovieDetails(movie) {
      const movieDetailsContainer = document.getElementById('film-info');
      if (movieDetailsContainer) {
          const { title, runtime, capacity, showtime, tickets_sold, description, poster } = movie;
          const availableTickets = capacity - tickets_sold;

          
          movieDetailsContainer.innerHTML = `
              <img src="${poster}" alt="${title} Poster">
              <h2>${title}</h2>
              <p>Description: ${description}</p>
              <p>Runtime: ${runtime} minutes</p>
              <p>Available Tickets: ${availableTickets}</p>
              `;

          const buyTicketBtn = document.getElementById("buy-ticket");
          buyTicketBtn.addEventListener("click", () => buyTicket(movie));
      } else {
          console.error('Movie details container not found.');
      }
  }

  async function buyTicket(movie) {
      if (movie.availableTickets < 0) {
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
          updateMovieDetails({ ...movie, tickets_sold: updatedTicketsSold, availableTickets: movie.availableTickets - 1 });
      } else {
          alert("Sorry, this showing is sold out!");
      }
  }

  fetchFirstMovieDetails();
  fetchAllMovies();
});
