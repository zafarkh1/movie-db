// function multiply1(firstNum) {
// 	return function multiply2(secondNum) {
// 		return firstNum * secondNum
// 	}
// }

// console.log(multiply1(2)(3));

// function greeting(name, callback) {
// 	return name + callback
// }

// function sayHello() {
// 	return "Hello"
// }

// console.log(greeting(sayHello(), " Zafar"));

const apiKey = "4783a22df2d1910d2b29371e02ed3b51";
const baseUrl = "https://api.themoviedb.org/3/";
const imageUrl = "https://image.tmdb.org/t/p/w500/";
// const url = `${baseUrl}discover/movie?api_key=${apiKey}`;

const movieContainer = document.querySelector(".movie-container");
const loaderContainer = document.querySelector(".loader-container");
const paginationWrapper = document.querySelector(".pagination-wrapper");
const fragment = document.createDocumentFragment();
const loader = document.createElement("div");

loader.classList.add("loader");
loaderContainer.appendChild(loader);

let currentPage = 1;

async function asynFunction() {
  let url;
  const searchTerm = document.querySelector("#search").value;

  if (searchTerm) {
    url = `${baseUrl}search/movie?api_key=${apiKey}&query=${searchTerm}`;
  } else {
    url = `${baseUrl}discover/movie?api_key=${apiKey}&page=${currentPage}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    movieContainer.innerHTML = "";

    let totalPages = data.total_pages > 5 ? 5 : data.total_pages;

    if (data.results.length === 0) {
      const pageNotFound = document.querySelector(".pageNotFound");
      pageNotFound.textContent = "Film is not found";
    } else {
      data.results.map((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        const movieImage = document.createElement("img");
        movieImage.src = `${imageUrl}${movie.backdrop_path}`;
        movieImage.alt = movie.title;

        const movieTitle = document.createElement("h3");
        movieTitle.textContent = movie.title;

        const movieRelease = document.createElement("span");
        movieRelease.textContent = `Release: ${movie.release_date}`;

        fragment.appendChild(movieImage);
        fragment.appendChild(movieTitle);
        fragment.appendChild(movieRelease);

        movieCard.appendChild(fragment);
        movieContainer.appendChild(movieCard);
      });

      paginationWrapper.innerHTML = "";

      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          const button = document.createElement("button");
          button.innerText = i;

          if (currentPage === i) {
            button.classList.add("active");
          }

          button.addEventListener("click", () => {
            currentPage = i;
            asynFunction();
          });
          paginationWrapper.appendChild(button);
        }
      }
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    const loader = document.querySelector(".loader");
    if (loader) {
      loaderContainer.remove();
    }
  }
}

const searchInput = document.querySelector("#search");
// searchInput.addEventListener("input", () => {
//   asynFunction();
// });

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    asynFunction();
  }
});

const btn = document.querySelector(".btn");

btn.addEventListener("click", () => {
	currentPage = 1
  asynFunction();
});

setTimeout(() => {
  asynFunction();
}, 500);