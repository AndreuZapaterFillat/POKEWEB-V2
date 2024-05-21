var height = 6; //Number of guesses
var width = 5; //Number of letters

var row = 0; //Current guess
var col= 0; //Current letter

var gameOver = false;
//var word = "SQUID";

var wordList = ["arbok", "zubat", "ekans", "eevee", "gloom", "golem", "pichu", "absol", "paras", "deino", "bagon", "ditto", "gible",
            "tepig", "hypno", "snivy", "lotad", "ralts", "doduo", "lugia", "numel", "rotom", "toxel", "budew", "magby", "shinx", 
            "riolu", "zorua", "aipom", "burmy", "goomy", "throh", "lokix", "entei", "hoopa", "klink", "luxio", "azelf", "minun", 
            "pawmi", "pawmo", "yanma", "inkay", "klang", "nacli", "kubfu", "munna", "unown", "klawf"];


var word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
console.log(word);

window.onload = function(){
    initialize();
}

function initialize(){
    //Create the game board
    for(let r = 0; r < height; r++){
        for(let c = 0; c < width; c++){
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }


    //Listen for key press
    document.addEventListener("keyup", (e) => {
        if(gameOver) return;

        //alert(e.code);
        if("KeyA" <= e.code && e.code <= "KeyZ"){
            if(col < width){
                let currTile = document.getElementById(row.toString() + "-" + col.toString());
                if(currTile.innerText == ""){
                    currTile.innerText = e.code[3];
                    col += 1;
                }
            }
        }
        else if (e.code == "Backspace"){
            if (0 < col && col <= width){
                col -= 1;
            }
            let currTile = document.getElementById(row.toString() + "-" + col.toString());
            currTile.innerText = "";
        }

        else if (e.code == "Enter"){
            update();
        }

        if(!gameOver && row == height){
            gameOver = true;
            document.getElementById("answer").innerText = word;
        }
        
    });
}


function update(){
    let guess = "";
    document.getElementById("answer").innerText = "";
    
    //string up the guess word
    for(let c = 0; c < width; c++){
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase();

    if(!wordList.includes(guess)){
        document.getElementById("answer").innerText = "No está en la lista de palabras";
        return;
    }
    
    //start processing game
    let correct = 0;
    let letterCount = {};
    for(let i = 0; i < word.length; i++){
        letter = word[i];
        if(letterCount[letter]){
            letterCount[letter] += 1;
        }else{
            letterCount[letter] = 1;
        }
    }

    //first iteration , check all the correct ones
    for (let c = 0; c < width; c++){
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;

        //Is it in the correct position?
        if(word[c] == letter){
            currTile.classList.add("correct");
            correct += 1;
            letterCount[letter] -= 1;
        }
        

        if (correct == width){
            gameOver = true;
        }
    }

    //Go again and mark which ones are present but in wrong position
    for (let c = 0; c < width; c++){
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;

        if(!currTile.classList.contains("correct")){
            //Is it in the word then?
            if (word.includes(letter) && letterCount[letter] > 0){
                currTile.classList.add("present");
                letterCount[letter] -= 1;
            }
            //Not int the word
            else{
                currTile.classList.add("absent");
            }
        }
            
    }

    row += 1; //Start new row
    col = 0; //Start at 0 for new row


}