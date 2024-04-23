const API_KEY = "ece985488c982715535011849742081f";
const imgPath = "https://image.tmdb.org/t/p/w1280";

const input = document.querySelector(".search input");
const btn = document.querySelector(".search button");


const mainGridTitle = document.querySelector(".favourites h1");
const mainGrid =  document.querySelector(".favourites .movies-grid");
const trendingGrid =  document.querySelector(".trending .movies-grid");
const popupContainer = document.querySelector(".popup-container")

async function getMovieBySearch(search_term){
    const resp = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`
    );
    let respData = await resp.json();
    return respData.results;
}
async function addSearchMoviestoDOM(){
    const  search_term = input.value;
    const data = await getMovieBySearch(search_term);
    mainGridTitle.innerText = "Search Results...";
    let resultArr = data.map((m)=>{
        return `
    <div class="card" data-id="${m.id}">
        <div class="img">
            <img src="${imgPath + m.poster_path}" alt="">
        </div>
        <div class="info">
            <h2>${m.title}</h2>
            <div class="single-info">
                <span>Rating :</span>
                <span>${m.vote_average}/ 10</span>
            </div>
            <div class="single-info">
                <span>Release Date :</span>
                <span>${m.release_date}</span>
            </div>
        </div>
    </div>
        `;
    });
    mainGrid.innerHTML = resultArr.join(" ");
    const cards = document.querySelectorAll(".card");
    addClickEffectToCards(cards);
}
btn.addEventListener("click",addSearchMoviestoDOM);
input.addEventListener('keypress', (e)=> {
    if (e.keyCode === 13) {
      addSearchMoviestoDOM();
    }
  });

function  addClickEffectToCards(cards){
    cards.forEach((card)=>{
        card.addEventListener("click",()=>{
            showPopUp(card);
        });
    });
}
async function getMovieById(movieId){
    const response = await fetch(
       `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
      );
    const data = await response.json();
    return data;
}
async function getMovieTrailerById(movieId){
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
      );
    
     const data = await response.json();
     return data.results[0].key;
}
async function showPopUp(card){
    popupContainer.classList.add("show-popup");
    const movieId = card.getAttribute("data-id");
    const movie = await getMovieById(movieId);
    const key = await getMovieTrailerById(movieId);

    popupContainer.style.background = `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.1)),url(${imgPath + movie.poster_path})`;
    popupContainer.innerHTML=`
    <span class="x-icon">&#10006;</span>
    <div class="content">
        <!-- Left content div start here -->
        <div class="left">
            <div class="poster-img">
                <img src="${imgPath + movie.poster_path}"  alt="">
            </div>
            <div class="single-info">
                <span>Add to favourites :</span>
                <span class="heart-icon">&#9829;</span>
            </div>
        </div>
        <!-- Left content div ends here -->

        <!-- Right content div start here -->
        <div class="right">
            <h1>${movie.title}</h1>
            <h3>${movie.tagline}</h3>
            <!-- Single info container starts here -->
            <div class="single-info-container">
                <div class="single-info">
                    <span>Languages :</span>
                    <span>${movie.spoken_languages[0].name}</span>
                </div>
                <div class="single-info">
                    <span>Length :</span>
                    <span>${movie.runtime} Minutes</span>
                </div>
                <div class="single-info">
                    <span>Rating :</span>
                    <span>${movie.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Budget :</span>
                    <span> $ ${movie.budget}</span>
                </div>
                <div class="single-info">
                    <span>Release Date</span>
                    <span>${movie.release_date}</span>
                </div>
            </div>
             <!-- Single info container starts here -->

             <!-- Movie genres Starts here -->
             <div class="genres">
                <h2>Genres</h2>
                <ul>
                    ${movie.genres.map((e)=>{
                        return `<li>${e.name}</li>`;
                    }).join(" ")}
                </ul>
             </div>
             <!-- Movie genres ends here -->

             <!-- Overview content starts here -->
             <div class="overview">
                <h2>Overview</h2>
                <p>
                    ${movie.overview}
                </p>
             </div>
             <!-- Overview content ends here -->

             <!-- Trailer content starts here-->
             <div class="trailer">
                <h2>Trailer</h2>
                <iframe src="https://www.youtube.com/embed/${key}" width="560" height="315" title="YouTube video player" frameborder="0" allow="accelermeter;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"></iframe>
             </div>
             <!-- Trailer content ends here-->

        </div>
         <!-- Right content div ends here -->
    </div>`;
 const x_icon = document.querySelector(".x-icon");
 x_icon.addEventListener("click",()=>{
    popupContainer.classList.remove("show-popup");
 });
 const heart_icon = document.querySelector(".heart-icon");

 heart_icon.addEventListener("click",()=>{
    if(heart_icon.classList.contains("change-color")){
        addMovieInFavourites(card);
        heart_icon.classList.remove("change-color");
    }else{
        addMovieInFavourites(card);
        heart_icon.classList.add("change-color");
    }  
 });
}
function  addMovieInFavourites(card){
    const data = JSON.stringify(card);
    localStorage.setItem("data",data);
}

async function getTrendingMovies(){
    const resp = await fetch(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
    );
    let respData = await resp.json();
    return respData.results;
}
async function addTrendingMoviestoDom(){
    const data = await getTrendingMovies();
    const displayMovies = data.slice(0, 8);
    let resultArr = displayMovies.map((m)=>{
        return `
    <div class="card" data-id="${m.id}">
        <div class="img">
            <img src="${imgPath + m.poster_path}" alt="">
        </div>
        <div class="info">
            <h2>${m.title}</h2>
            <div class="single-info">
                <span>Rating :</span>
                <span>${m.vote_average}/ 10</span>
            </div>
            <div class="single-info">
                <span>Release Date :</span>
                <span>${m.release_date}</span>
            </div>
        </div>
    </div>
        `;
    });
    trendingGrid.innerHTML = resultArr.join(" ");
    const cards = document.querySelectorAll(".card");
    addClickEffectToCards(cards);
}

function addMovieInFavourites(card) {
    // Retrieve the array of favorite movies from localStorage
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const cardData = {
        
        id: card.getAttribute("data-id"),
        title: card.querySelector(".info h2").innerText,
        rating: card.querySelector(".single-info:nth-of-type(1) span:nth-of-type(2)").innerText,
        releaseDate: card.querySelector(".single-info:nth-of-type(2) span:nth-of-type(2)").innerText,
        poster_Path: card.querySelector(".img img").getAttribute("src")
        // Add other relevant details as needed
    };


    //Check if the movie is already in favorites
    const index = favorites.findIndex(movie => movie.id === cardData.id);

    // If the movie is not in favorites, add it
    if (index === -1) {
        favorites.push(cardData);
        card.classList.add("favorite"); // Add a class to visually indicate that the card is in favorites
    } else {
        // If the movie is already in favorites, remove it
        favorites.splice(index, 1);
        card.classList.remove("favorite"); // Remove the class if the movie is removed from favorites
    }

   
    localStorage.setItem("favorites", JSON.stringify(favorites));
    
    // const movieHTML = card.outerHTML;
    // const favoritesGrid = document.querySelector(".favourites .movies-grid");
    // favoritesGrid.innerHTML += movieHTML;
    
   
    // const addedCard = favoritesGrid.lastElementChild;

    // addedCard.addEventListener("click", () => {
    //     showPopUp(addedCard);
    // });
}

function displayFavoriteMovies() {
    const favoritesContainer = document.querySelector(".movies-container.favourites .movies-grid");
    
    // Clear previous content
    favoritesContainer.innerHTML = "";

    // Retrieve favorite movies from local storage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Generate HTML for each favorite movie and append it to the container
    favorites.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("card", "favorite-card");
        movieCard.dataset.id = movie.id;

        movieCard.innerHTML = `
            <div class="img">
                <img src="${movie.poster_Path}" alt="">
            </div>
            <div class="info">
                <h2>${movie.title}</h2>
                <div class="single-info">
                    <span>Rating :</span>
                    <span>${movie.rating}</span>
                </div>
                <div class="single-info">
                    <span>Release Date :</span>
                    <span>${movie.releaseDate}</span>
                </div>
            </div>
        `;

        favoritesContainer.appendChild(movieCard);
    });
}

// Call the function to  initially display favorite movies when the page loads
displayFavoriteMovies();


addTrendingMoviestoDom();
