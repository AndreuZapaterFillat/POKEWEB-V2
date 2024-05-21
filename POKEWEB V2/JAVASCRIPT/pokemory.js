//inicializacion de variables
let tarjetasDestapadas = 0;
let tarjeta1 = null; // crear junto a el if 
let tarjeta2 = null;
//Se define cuando creamos primerResultado = numeros[id];
let primerResultado = null;
let segundoResultado = null;
let movimientos = 0;
let aciertos = 0;
let temporizador = false; 
let timer = 50; 
let timerInicial = 50;
let tiempoRegresivoId = null; 

let winAudio = new Audio('/ASSETS/AUDIO/win.wav');
let loseAudio = new Audio('/ASSETS/AUDIO/lose.wav');
let clickAudio = new Audio('/ASSETS/AUDIO/click.wav');
let rightAudio = new Audio('/ASSETS/AUDIO/right.wav');
let wrongAudio = new Audio('/ASSETS/AUDIO/wrong.wav');


//Creamos este cuando se cree la variable movimientos ++ 
let mostrarMovimientos = document.getElementById('movimientos');
//se crea hasta que se genere la variable movimientos dentro del if
let mostrarAciertos = document.getElementById('aciertos');
//
let mostrarTiempo = document.getElementById('t-restante');
//generacion de nums aleatorios
let numeros = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
numeros = numeros.sort(() => {return Math.random() -0.5});
console.log(numeros);

//funcion contar tiempo
function contarTiempo(){

    tiempoRegresivoId = setInterval(() =>{
        timer--; 
        mostrarTiempo.innerHTML = `Tiempo: ${timer} segundos`;
        if(timer == 0){
            clearInterval(tiempoRegresivoId);
            bloquearTarjetas();
            loseAudio.play();
        }
    },1000);
}
function  bloquearTarjetas(){
    for(let i=0; i<=15; i++){
        let tarjetaBloqueada = document.getElementById(i);
        tarjetaBloqueada.innerHTML = `<img src="/ASSETS/IMG/${numeros[i]}.png" alt="">`;
        tarjetaBloqueada.disabled = true;
    }
}

//funcion boton principal
function destapar(id){
  
 
 if(temporizador == false){
    contarTiempo();
    temporizador = true;
 }
 tarjetasDestapadas++;
 console.log(tarjetasDestapadas);
 if(tarjetasDestapadas ==1){
    //mostrar primer numero
    tarjeta1 = document.getElementById(id);
    primerResultado = numeros[id];
    tarjeta1.innerHTML = `<img src="/ASSETS/IMG/${primerResultado}.png" alt="">`;
    clickAudio.play();
    //Desabilitar boton
   tarjeta1.disabled = true;

 }else if(tarjetasDestapadas ==2){
    tarjeta2 = document.getElementById(id);
    segundoResultado = numeros[id];
    tarjeta2.innerHTML = `<img src="/ASSETS/IMG/${segundoResultado}.png" alt="">`;
    //Desabilitamos segundo boton
    tarjeta2.disabled = true;


    //incrementar movimientos
    movimientos++; 
    mostrarMovimientos.innerHTML =  `Movements: ${movimientos}`;
    if(primerResultado == segundoResultado){
        tarjetasDestapadas = 0; 

        //Aumentar aciertos
        aciertos++;
        mostrarAciertos.innerHTML = `Correct answers: ${aciertos}`;
        rightAudio.play();
        if(aciertos == 8){
            clearInterval(tiempoRegresivoId); 
            mostrarAciertos.innerHTML = `Correct answers: ${aciertos}`;
            mostrarMovimientos.innerHTML = `Movements: ${movimientos}`;
            mostrarTiempo.innerHTML = `Fantastic ${timerInicial - timer} seconds`;
            winAudio.play();
        }
    }else{
        //mostrar momentaneamente valores y volver a tapar
        setTimeout(() => {
            tarjeta1.innerHTML = '';
            tarjeta2.innerHTML = '';
            tarjeta1.disabled = false;
            tarjeta2.disabled = false;
            tarjetasDestapadas = 0;
            wrongAudio.play();
        },700);
    }
 }
}