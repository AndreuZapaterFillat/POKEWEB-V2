const container = document.querySelector(".container");
const gameContainer = document.querySelector(".game-container");
const startButton = document.getElementById("start");
const scoreContainer = document.querySelector(".score-container");
const userScore = document.getElementById("user-score");
let timer = document.getElementsByClassName("timer")[0];
let nextBtn;
let score, currentQuestion, finalQuestions;
let countdown,
  count = 11;

const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon/';
const POKEAPI_POKEMON_LIST_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151';
const POKEAPI_IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
let allPokemonNames = [];

// Function to fetch Pokémon data from PokeAPI
async function fetchPokemonData(pokemonId) {
  const response = await fetch(`${POKEAPI_URL}${pokemonId}`);
  const data = await response.json();
  return {
    name: data.name,
    image: `${POKEAPI_IMAGE_URL}${pokemonId}.png`
  };
}

// Function to fetch all Pokémon names from PokeAPI
async function fetchAllPokemonNames() {
  const response = await fetch(POKEAPI_POKEMON_LIST_URL);
  const data = await response.json();
  allPokemonNames = data.results.map(pokemon => pokemon.name);
}

// Function to get a random list of unique Pokémon IDs
function getRandomPokemonIds(count, maxId) {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * maxId) + 1);
  }
  return [...ids];
}

// Function to initialize the game
const startGame = async () => {
  scoreContainer.classList.add("hide");
  gameContainer.classList.remove("hide");
  await fetchAllPokemonNames();
  finalQuestions = await populateQuestions();
  score = 0;
  currentQuestion = 0;
  cardGenerator(finalQuestions[currentQuestion]);
};

// Timer
const timerDisplay = () => {
  countdown = setInterval(() => {
    count -= 1;
    timer.innerHTML = `<span>Time Left: </span>${count}s`;
    if (count === 0) {
      clearInterval(countdown);
      nextQuestion();
    }
  }, 1000);
};

// Function to create options
const populateOptions = (correct_option) => {
  let arr = [];
  arr.push(correct_option);
  let optionsCount = 1;
  while (optionsCount < 4) {
    let randomvalue = randomValueGenerator(allPokemonNames);
    if (!arr.includes(randomvalue)) {
      arr.push(randomvalue);
      optionsCount += 1;
    }
  }
  return arr;
};

// Function to choose random questions
const populateQuestions = async () => {
  const allPokemonIds = getRandomPokemonIds(40, 151); // Original 151 Pokémon
  const pokemonPromises = allPokemonIds.map(id => fetchPokemonData(id));
  const allPokemonData = await Promise.all(pokemonPromises);
  const questionsCount = 5;
  const chosenPokemon = randomShuffle(allPokemonData).slice(0, questionsCount);
  return chosenPokemon.map(pokemon => ({
    image: pokemon.image,
    correct_option: pokemon.name
  }));
};

// Random value from array
const randomValueGenerator = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Random shuffle array
const randomShuffle = (array) => array.sort(() => 0.5 - Math.random());

// Check selected answer
const checker = (e) => {
  let userSolution = e.target.innerText;
  let options = document.querySelectorAll(".option");
  if (userSolution === finalQuestions[currentQuestion].correct_option) {
    e.target.classList.add("correct");
    score++;
  } else {
    e.target.classList.add("incorrect");
    options.forEach((element) => {
      if (element.innerText == finalQuestions[currentQuestion].correct_option) {
        element.classList.add("correct");
      }
    });
  }

  clearInterval(countdown);
  options.forEach((element) => {
    element.disabled = true;
  });
};

// Next question
const nextQuestion = (e) => {
  currentQuestion += 1;
  if (currentQuestion === finalQuestions.length) {
    gameContainer.classList.add("hide");
    scoreContainer.classList.remove("hide");
    startButton.innerText = `Restart`;
    userScore.innerHTML =
      "Your score is " + score + " out of " + currentQuestion;
    clearInterval(countdown);
  } else {
    cardGenerator(finalQuestions[currentQuestion]);
  }
};

// Card UI
const cardGenerator = (cardObject) => {
  const { image, correct_option } = cardObject;
  let options = randomShuffle(populateOptions(correct_option));
  container.innerHTML = `<div class="quiz">
  <p class="num">
  ${currentQuestion + 1}/5
  </p>
  <div class="questions">
    <img class="pokemon-image" src="${image}" alt="${correct_option}"/>
  </div>
    <div class="options">
    <button class="option" onclick="checker(event)">${options[0]}
    </button>
    <button class="option" onclick="checker(event)">${options[1]}
    </button>
    <button class="option" onclick="checker(event)">${options[2]}
    </button>
    <button class="option" onclick="checker(event)">${options[3]}
    </button>
    </div>

    <div class="nxt-btn-div">
        <button class="next-btn" onclick="nextQuestion(event)">Next</button>
    </div>

  </div>`;
  count = 11;
  clearInterval(countdown);
  timerDisplay();
};

startButton.addEventListener("click", startGame);
