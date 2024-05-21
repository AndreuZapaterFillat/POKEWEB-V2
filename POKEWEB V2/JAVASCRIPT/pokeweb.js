document.addEventListener('DOMContentLoaded', async () => {
    const CaroS = document.querySelector('.Carousel-slider');
    const CaroSlider = new MicroSlider(CaroS, { indicators: true, indicatorText: '' });
    const hammer = new Hammer(CaroS);
    const CaroSTimer = 2000;
    let CaroAutoplay = setInterval(() => CaroSlider.next(), CaroSTimer);

    // Función para obtener una imagen de un Pokémon de la PokeAPI dado su ID
    async function getPokemonImageById(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            return data.sprites.other['official-artwork'].front_default;
        } catch (error) {
            console.error('Error al obtener la imagen del Pokémon:', error);
            return null;
        }
    }

    // Función para obtener 7 IDs de Pokémon aleatorios del 1 al 1025
    function getRandomPokemonIds() {
        const randomIds = [];
        while (randomIds.length < 7) {
            const randomId = Math.floor(Math.random() * 1025) + 1;
            if (!randomIds.includes(randomId)) {
                randomIds.push(randomId);
            }
        }
        return randomIds;
    }

    // Cargar imágenes de 7 Pokémon aleatorios para los elementos del carrusel
    async function loadRandomPokemonImages() {
        const randomIds = getRandomPokemonIds();
        const sliderItems = document.querySelectorAll('.slider-item');
        for (let i = 0; i < sliderItems.length; i++) {
            const imageUrl = await getPokemonImageById(randomIds[i]);
            if (imageUrl) {
                sliderItems[i].style.backgroundImage = `url(${imageUrl})`;
            }
        }
    }

    await loadRandomPokemonImages(); // Cargar imágenes de 7 Pokémon aleatorios al cargar la página

    // Detener la reproducción automática al hacer swipe
    hammer.on('swipe', function (e) {
        clearInterval(CaroAutoplay);
        CaroAutoplay = setInterval(() => CaroSlider.next(), CaroSTimer);
        console.log(e.type + ' gesture detected');
    });
});
