const serachButton = document.getElementById("serachButton");
const inputField = document.getElementById("inputField");
const movieNotFoundDiv = document.getElementById("movie_not_found_div");
const startExploringDiv = document.getElementById("start_exploring_div");
const allMoviesListUl = document.getElementById("all_movies_list_ul");
const loader = document.getElementById("loader");

serachButton.addEventListener("click", () => {
  const inputQuery = inputField.value.trim();
  if (inputQuery == "") {
    alert("enter movie name plz");
    return;
  }
  fetchMoviesData(inputQuery);
});

// Method to fetch movies data form server
async function fetchMoviesData(inputQuery) {
  loader.classList.replace("hidden", "flex");
  const API_KEY = "b64cb23d";
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${inputQuery}`,
    );
    const data = await response.json();
    // console.log("ALL MOVIES FETCHED:", JSON.stringify(data, null, 2));
    if (data.Response === "True") {
      console.log("responce was true");

      // clear movielist before adding new movies
      allMoviesListUl.innerHTML = "";
      // Now fetch all data of a movie on the bases of imdbID
      data.Search.forEach(async ({ imdbID }) => {
        const responce = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`,
        );

        const movie = await responce.json();
        console.log(`DATA IS =========== ${JSON.stringify(movie, null, 2)}`);

        let movieObject = {
          title: movie.Title,
          poster: movie.Poster,
          imdbRating: movie.imdbRating,
          runtime: movie.Runtime,
          genre: movie.Genre, // means movie type
          plot: movie.Plot, // description
          imdbid: imdbID, // this will help top add in watchlist
          // rating: parseFloat(movie.Ratings[0].Value),
        };

        // CHECKING IS RATING PROPERTY PRESENT IN MOVIE DATA OR NOT
        if (
          !movie.Ratings ||
          movie.Ratings.length === 0 ||
          movie.Ratings[0].Value === "N/A"
        ) {
          movieObject.rating = "N/A";
        } else {
          movieObject.rating = parseFloat(movie.Ratings[0].Value);
        }

        displayMovie(movieObject);
        loader.classList.replace("flex", "hidden");
      });
    } else {
      loader.classList.replace("flex", "hidden");
      // No movie found
      console.log("responce was false");
      movieNotFoundDiv.classList.replace("hidden", "flex");
      allMoviesListUl.classList.replace("flex", "hidden");
      startExploringDiv.classList.replace("flex", "hidden");
    }
  } catch (err) {
    loader.classList.replace("flex", "hidden");
    console.log(err);
  }
}

// Functin to display movie on page
function displayMovie(movieObject) {
  movieNotFoundDiv.classList.replace("flex", "hidden");
  allMoviesListUl.classList.replace("hidden", "flex");
  startExploringDiv.classList.replace("flex", "hidden");
  // create movie card eleemnt
  const movieCard = document.createElement("li");
  movieCard.classList.add("my-5", "flex", "h-60", "w-[100%]", "max-w-100");

  // Add Content Inside the Card
  movieCard.innerHTML = `
         <img
            src="${movieObject.poster}"
            alt="movie image"
            class="h-full w-[100px] object-fill"
          />
          <!-- this will container movie info like name time type etc -->
          <div
            class="flex flex-col justify-center gap-y-[20px] pl-[10px] text-[12px]"
          >
            <!-- title and rating div -->
            <div class="flex items-center gap-x-[10px]">
              <h1 class="text-2xl">${movieObject.title}</h1>
              <p>${movieObject.rating}<span>⭐</span></p>
            </div>
            <!-- Movie time movie type and add in watchlist option -->
            <div class="flex gap-x-[10px]">
              <p>${movieObject.runtime}</p>
              <p>${movieObject.genre}</p>
              <span class="flex gap-x-[4px]">
                <img
                  src="./images/add_icon.svg"
                  alt=""
                  data-value="${movieObject.imdbid}"
                  class="h-[20px] w-[20px]"
                />
                <p>Watchlist</p>
              </span>
            </div>
            <!-- movie description -->
            <p class="overflow-hidden text-ellipsis">
            ${movieObject.plot}
            </p>
          </div>
  `;
  allMoviesListUl.appendChild(movieCard);
}
