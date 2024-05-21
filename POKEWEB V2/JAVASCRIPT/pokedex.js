const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');
const pokemonImage = document.querySelector('.pokemon_image');
const typesContainer = document.querySelector('#types');
const baseStatsHeader = document.getElementById('base-stats');
const pokedex = document.getElementById('pokedex');
const statNumbers = document.querySelectorAll('.stat-number');
const statDesc = document.querySelectorAll('.stat-desc');
const barInners = document.querySelectorAll('.bar-inner');
const baseStatsTotal = document.querySelector('.base-stats-total');

const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

const typeColors = {
    "rock": [182, 158, 49],
    "ghost": [112, 85, 155],
    "steel": [183, 185, 208],
    "water": [100, 147, 235],
    "grass": [116, 203, 72],
    "psychic": [251, 85, 132],
    "ice": [154, 214, 223],
    "dark": [117, 87, 76],
    "fairy": [230, 158, 172],
    "normal": [170, 166, 127],
    "fighting": [193, 34, 57],
    "flying": [168, 145, 236],
    "poison": [164, 62, 158],
    "ground": [222, 193, 107],
    "bug": [167, 183, 35],
    "fire": [245, 125, 49],
    "electric": [249, 207, 48],
    "dragon": [112, 55, 255]
};

let searchPokemon = 1;

const updateBackground = (color) => {
    const backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    const gradientColor = `linear-gradient(to top, ${backgroundColor}, #fff)`;
    document.body.style.background = gradientColor;
    pokedex.style.backgroundColor = backgroundColor;
}

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if (APIResponse.status === 200) {
        const data = await APIResponse.json();
        return data;
    } else {
        return null;
    }
}

const renderPokemon = async (pokemon) => {
    /* pokemonNumber.innerHTML = ''; */
    pokemonImage.style.display = 'block';

    const data = await fetchPokemon(pokemon);

    if (data) {
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;

        const normalSpriteUrl = data.sprites.other['official-artwork'].front_default;
        pokemonImage.src = normalSpriteUrl;

        const shinySpriteUrl = data.sprites.other['official-artwork'].front_shiny;

        if (shinySpriteUrl) {
            document.getElementById("pokemon-image").src = shinySpriteUrl;
        } else {
            document.getElementById("pokemon-image").src = normalSpriteUrl;
        }

        const firstType = data.types[0].type.name;
        const color = typeColors[firstType];
        updateBackground(color);

        typesContainer.innerHTML = data.types.map(type => {
            const backgroundColor = `rgb(${typeColors[type.type.name][0]}, ${typeColors[type.type.name][1]}, ${typeColors[type.type.name][2]})`;
            return `<span class="type" style="background-color: ${backgroundColor}; padding: 5px; margin-right: 5px; border-radius: 5px;">${type.type.name}</span>`;
        }).join('');

        baseStatsHeader.style.color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

        barInners.forEach((barInner, index) => {
            const statValue = data.stats[index].base_stat;
            const widthPercentage = (statValue / 255) * 100;
            barInner.style.width = `${widthPercentage}%`;
            barInner.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        });

        statDesc.forEach(statDesc => {
            statDesc.style.color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        });

        data.stats.forEach((stat, index) => {
            statNumbers[index].innerHTML = stat.base_stat;
        });

        const sumBaseStats = data.stats.reduce((acc, stat) => acc + stat.base_stat, 0);

        baseStatsTotal.textContent = sumBaseStats;

        input.value = '';
        searchPokemon = data.id;
    } else {
        pokemonName.innerHTML = 'MissingNO'; // Establece el nombre como MissingNO
        pokemonNumber.innerHTML = '¿?'; // Establece el número de la Pokédex como ¿?
    
        // Establece todos los valores de las estadísticas como "?"
        statNumbers.forEach(statNumber => {
            statNumber.innerHTML = '¿?';
        });
    
        baseStatsTotal.textContent = '¿?';
    
        // Establece el color de fondo y de texto como el color del tipo "normal"
        updateBackground(typeColors['normal']);
    
        // Establece el color de las barras de progreso y del texto de las estadísticas
        barInners.forEach((barInner, index) => {
            barInner.style.backgroundColor = `rgb(${typeColors['normal'][0]}, ${typeColors['normal'][1]}, ${typeColors['normal'][2]})`;
        });

        barInners.forEach((barInner) => {
            barInner.style.width = `100%`;
        });

        statDesc.forEach(statDesc => {
            statDesc.style.color = `rgb(${typeColors['normal'][0]}, ${typeColors['normal'][1]}, ${typeColors['normal'][2]})`;
        });

        // Establece los tipos como "?"
        typesContainer.innerHTML = `<span class="type" style="background-color: rgb(${typeColors['normal'][0]}, ${typeColors['normal'][1]}, ${typeColors['normal'][2]}); padding: 5px; margin-right: 5px; border-radius: 5px;">¿?</span>`;
    
        // Establece el color del texto "Base Stats"
        baseStatsHeader.style.color = `rgb(${typeColors['normal'][0]}, ${typeColors['normal'][1]}, ${typeColors['normal'][2]})`;
    
        const missingNoImage = '/ASSETS/IMG/MissingNO.webp';
        pokemonImage.src = missingNoImage; // Establece la imagen de MissingNO para ambas versiones
        document.getElementById("pokemon-image").src = missingNoImage; // Establece la imagen de MissingNO para ambas versiones
        pokemonImage.style.display = 'block'; // Asegúrate de que la imagen se muestre
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

updateBackground(typeColors['normal']);

renderPokemon(searchPokemon);
