const state={
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score-points"),
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-fight"),
    },
};

const playerSide={
    player1: "player-cards",
    computer: "computer-cards",
}

//pokemons
const cardData=[
    {
        id: 0,
        name: "Vaporeon",
        type: "agua",
        img: "./assets/agua.png",
        winOf: [2],
        loseOf: [1],
    },
    {
        id: 1,
        name: "Jolteon",
        type: "eletrico",
        img: "./assets/eletrico.png",
        winOf: [0],
        loseOf: [2],
    },
    {
        id: 2,
        name: "Flareon",
        type: "fogo",
        img: "./assets/fogo.png",
        winOf: [1],
        loseOf: [0],
    },
];

//criar ID aleatório de carta
async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random()*cardData.length);
    return cardData[randomIndex].id;
}

//criar imagem da carta
async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./assets/pokebola.jpg");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    //apenas cartas do jogador serem clicáveis
    if(fieldSide===playerSide.player1){
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
        //mostrar carta na tela ao lado
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectedCard(IdCard);
        });
    };
    return cardImage;
};

async function setCardsField(cardId){
    await removeAllCardsImages();


    //sorteia carta aleatória para computador
    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let fightResult = await checkFightResult(cardId, computerCardId);

    await updateScore();
    await drawButton(fightResult);
};

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
};

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
};

//checar quem venceu
async function checkFightResult(playerCardId, computerCardId){
    
    const playerCard = cardData[playerCardId];
    if (playerCard.winOf.includes(computerCardId)){
        state.score.playerScore++;
        await playAudioWin();
        return "Ganhou!";
    } else if (playerCard.loseOf.includes(computerCardId)) {
        state.score.computerScore++;
        await playAudioLose();
        return "Perdeu";
    }
    return "EMPATE";
}

async function removeAllCardsImages(){
    let cards = document.querySelector("#computer-cards");
    let imageElements = cards.querySelectorAll("img");
    imageElements.forEach((img)=> img.remove());

    cards = document.querySelector("#player-cards");
    imageElements = cards.querySelectorAll("img");
    imageElements.forEach((img)=> img.remove());
}

async function drawSelectedCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText= "Atributo: " + cardData[index].type;
}

//sorteio das cartas
async function drawCards(cardNumbers, fieldSide){
    for(let i=0; i<cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    };
};

//resetar batalhas
async function resetFight(){
    state.cardSprites.avatar.src=""
    state.actions.button.style.display="none";

    state.fieldCards.player.style.display="none";
    state.fieldCards.computer.style.display="none";

    init();
}

//áudio de vitória 
async function playAudioWin(){
    let audioFile1 = "./assets/GANHOU.mp3";
    const audioGanhou = new Audio(audioFile1);
    audioGanhou.play();
}

//áudio de derrota
async function playAudioLose(){
    let audioFile2 = "./assets/perdeu.mp3";
    const audioPerdeu = new Audio(audioFile2)
    audioPerdeu.play();
}

//música de fundo
function playBgm(){
    const bgm = new Audio("./assets/music-background.mp3");

    bgm.play();
}

//função principal
function init(){
    drawCards(5, playerSide.player1);
    drawCards(5, playerSide.computer);

    const bgm = document.getElementById("bgm");

    bgm.volume = 0.2;
    bgm.play();
}

init();
