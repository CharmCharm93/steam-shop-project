const BASE_URL = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/";

const inputSearch = document.querySelector(".search-input-box");
const buttonSearch = document.querySelector("#search-btn");

const gameDisplaySection = document.querySelector("#game-display-section");
const ulGenresGroup = document.querySelector(".genres-group");

const genresDisplay = document.querySelector(".genres-tittle");

// 1. Search game by game' name input box

buttonSearch.addEventListener("click", () => {
  genresDisplay.textContent = "";
  renderAllGames(inputSearch.value, "", "");
});
//2. Get API
//=> all games
const getAllGames = async (search, genres, tag) => {
  try {
    let queryParameter = "";
    // if (inputSearch.value) {
    //   queryParameter += `q=${inputSearch.value}`;
    // }
    if (search) {
      queryParameter += `&q=${search}`;
    }
    if (genres) {
      queryParameter += `&genres=${genres}`;
    }
    if (tag) {
      queryParameter += `&steamspy_tags=${tag}`;
    }

    const url = `${BASE_URL}/games?${queryParameter}&limit=20`;
    const res = await fetch(url);
    const result = await res.json();
    // console.log(result);

    const data = result["data"];
    // console.log(data);

    return data;
  } catch (error) {
    console.log(`Error message getAllGames: ${error.message}`);
  }
};
const renderAllGames = async (search, genres, tag) => {
  try {
    // let allGamesList = await getAllGames(inputSearch.value, "", "");
    let allGamesList = await getAllGames(search, genres, tag);
    gameDisplaySection.innerHTML = "";

    allGamesList.forEach((obj) => {
      let eDiv = document.createElement("div");

      eDiv.classList.add("game-box");
      eDiv.innerHTML = `<div onclick="renderGameDetails(${obj.appid})">

        <div class="header-image">
          <img src="${obj.header_image}" alt="game-banner" />
        </div>
        <div class="wrap-game-information">
          <div class="game-name">${obj.name}</div>
          <div class="game-price">💰 Price: ${obj.price}</div>
        </div>
      </div>`;

      gameDisplaySection.appendChild(eDiv);
    });
  } catch (error) {
    console.log(`Error message renderAllGames: ${error.message}`);
  }
};
// render max 20 games on opening page
renderAllGames("", "", "");

//=> genres => render Genres list
const getGenres = async () => {
  try {
    const res = await fetch(`${BASE_URL}/genres`);
    const result = await res.json();
    // console.log(result);

    const data = result["data"];

    // console.log(data);
    return data;
  } catch (error) {
    console.log(`Error message getGenres: ${error.message}`);
  }
};
// getGenres();

const renderGenresList = async () => {
  try {
    let genresList = await getGenres();
    ulGenresGroup.innerHTML = "";

    genresList.forEach((obj) => {
      let eLi = document.createElement("li");
      let genresContent = "";
      // eLi.setAttribute("onclick", "renderGameByGenres()");

      eLi.textContent = obj.name.toLocaleUpperCase("en-US");
      genresContent = obj.name;

      eLi.addEventListener("click", () => {
        genresDisplay.textContent = `${eLi.textContent} GAMES`;
        renderAllGames("", genresContent, "");
      });

      ulGenresGroup.appendChild(eLi);
    });
  } catch (error) {
    console.log(`Error message renderGenresList: ${error.message}`);
  }
};
// render genresList on loading
renderGenresList();

//=> tags
const getTags = async () => {
  try {
    const res = await fetch(`${BASE_URL}/steamspy-tags`);
    const result = await res.json();
    // console.log(result);

    const data = result["data"];

    // console.log(data);
    return data;
  } catch (error) {
    console.log(`Error message getTags: ${error.message}`);
  }
};
// getTags();

//=> single games // => onClick element: renderGameDetails(appid) ; getSingleGame()
const getSingleGame = async (appID) => {
  try {
    const res = await fetch(`${BASE_URL}/single-game/${appID}`);
    const result = await res.json();
    const data = result["data"];
    // console.log(data);

    return data;
  } catch (error) {
    console.log(`Error message getSingleGame: ${error.message}`);
  }
};
// getSingleGame(20);
// => render time!
const renderGameDetails = async (appID) => {
  try {
    let specificGameDetail = await getSingleGame(appID);
    gameDisplaySection.innerHTML = "";
    genresDisplay.textContent = `${specificGameDetail.name}`;

    // gameDisplaySection.innerHTML = `
    //         <div class="game-detail-header">
    //           <h2>${specificGameDetail.name}</h2>
    //         </div>
    //         <div class="game-detail-main">

    //             <img src="${specificGameDetail.header_image}" alt="game-image" />

    //           <div class="wraper-game-description">
    //             <div class="game-description">${specificGameDetail.description}</div>
    //             <div class="game-subinformation">
    //               <p>Price: ${specificGameDetail.price}</p>
    //               <p>Required age: ${specificGameDetail.required_age}+</p>
    //               <p>Developer: ${specificGameDetail.developer[0]}</p>
    //               <p>Release date: ${specificGameDetail.release_date}</p>
    //             </div>
    //           </div>
    //         </div>
    //         <div class="game-detail-tag">
    //           <p>Popular user-defined tags for this product:</p>
    //           <div class="wrapper-tags">
    //             <div class="tag" onclick="renderGameByTag()">${specificGameDetail.steamspy_tags[0]}</div>
    //             <div class="tag" onclick="renderGameByTag()">${specificGameDetail.steamspy_tags[1]}</div>
    //             <div class="tag" onclick="renderGameByTag()">${specificGameDetail.steamspy_tags[2]}</div>

    //           </div>
    //         </div>
    // `;

    // Split into 3 parts as tags return arrays need loop
    // part 1

    let upperDivHeader = document.createElement("div");
    upperDivHeader.classList.add("game-detail-header");
    upperDivHeader.innerHTML = ` <h2>${specificGameDetail.name}</h2>`;

    //part 2
    let upperDivMainContent = document.createElement("div");
    upperDivMainContent.classList.add("game-detail-main");
    upperDivMainContent.innerHTML = `
<img src="${specificGameDetail.header_image}" alt="game-image" />

       <div class="wraper-game-description">
            <div class="game-description">${
              specificGameDetail.description
            }</div>
            <div class="game-subinformation">
              <p>Price: ${specificGameDetail.price}</p>
              <p>Required age: ${specificGameDetail.required_age}+</p>
              <p>Developer: ${specificGameDetail.developer[0]}</p>
              <p>Release date: ${formatDate(
                specificGameDetail.release_date
              )}</p>
            </div>
         </div>

`;

    // part 3: div contains tags
    let lowerDiv = document.createElement("div");
    lowerDiv.classList.add("game-detail-tag");
    lowerDiv.innerHTML = `
    <p>Popular user-defined tags for this product:</p>
  
    `;

    let divTagsWrapper = document.createElement("div");
    divTagsWrapper.classList.add("wrapper-tags");

    specificGameDetail.steamspy_tags.forEach((tag) => {
      let divTags = document.createElement("div");
      divTags.classList.add("tag");
      divTags.textContent = tag;

      divTags.addEventListener("click", () => {
        renderAllGames("", "", tag);
        genresDisplay.textContent = tag;
      });

      divTagsWrapper.appendChild(divTags);
    });

    lowerDiv.appendChild(divTagsWrapper);
    gameDisplaySection.appendChild(upperDivHeader); //1
    gameDisplaySection.appendChild(upperDivMainContent); //2
    gameDisplaySection.appendChild(lowerDiv); //3
  } catch (error) {
    console.log(`Error message renderGameDetails: ${error.message}`);
  }
};

//=> featured games > render featured game
const getFeaturedGame = async () => {
  try {
    const res = await fetch(`${BASE_URL}/features`);
    const result = await res.json();
    // console.log(result);

    const data = result["data"];

    // console.log(data);
    return data;
  } catch (error) {
    console.log(`Error message getFeaturedGame: ${error.message}`);
  }
};
// getFeaturedGame();

const renderFeaturedGame = async () => {
  try {
    let featuredGameList = await getFeaturedGame();
    gameDisplaySection.innerHTML = "";
    genresDisplay.textContent = "FEATURED GAMES";

    featuredGameList.forEach((obj) => {
      let eDiv = document.createElement("div");
      eDiv.classList.add("game-box");
      eDiv.innerHTML = `<div onclick="renderGameDetails(${obj.appid})">

  <div class="header-image">
    <img src="${obj.header_image}" alt="game-banner" />
  </div>
  <div class="wrap-game-information">
    <div class="game-name">${obj.name}</div>
    <div class="game-price">💰 Price: ${obj.price}</div>
  </div>

</div>
`;
      gameDisplaySection.appendChild(eDiv);
    });
  } catch (error) {
    console.log(`Error message renderGenresList: ${error.message}`);
  }
};

// 4. release date timestamp format

function formatDate(releaseDate) {
  const newDate = new Date(releaseDate);
  let displayDateTime = "";
  const monthString = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  displayDateTime = `${newDate.getUTCFullYear()}-${
    monthString[newDate.getUTCMonth()]
  }-${newDate.getUTCDate()}`;
  return displayDateTime;
}
