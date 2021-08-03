var firstCardClicked;
var secondCardClicked;
var firstCardClasses;
var secondCardClasses;
var maxMatches = 9;
var matches = 0;
var attempts = 0;
var gamesPlayed = 0;

function shuffle1(){
  var shuffleArray = ["mario-logo",
                      "koopa-logo",
                      "bowser-logo",
                      "wario-logo",
                      "yoshi-logo",
                      "peach-logo",
                      "toad-logo",
                      "goomba-logo",
                      "luigi-logo",
                      "mario-logo",
                      "koopa-logo",
                      "bowser-logo",
                      "wario-logo",
                      "yoshi-logo",
                      "peach-logo",
                      "toad-logo",
                      "goomba-logo",
                      "luigi-logo"]
shuffle(shuffleArray);

var shuffledCards = document.querySelectorAll(".card-front");
console.log(shuffledCards)

for (var i = 0; i < shuffledCards.length; i++) {
  var cardFront = shuffledCards[i];
  var cardImage = shuffleArray[i];
  cardFront.classList.add(cardImage);
  console.log(cardFront);
  console.log(cardImage);
}
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

shuffle1();

var clickElement = document.getElementById("gameCards");

clickElement.addEventListener("click", handleClick);

function handleClick(event) {
  if(event.target.className.indexOf("card-back") === -1) {
    return;
  }

  event.target.classList.add("hidden");

  if (!firstCardClicked) {
    firstCardClicked = event.target;
    firstCardClasses = firstCardClicked.previousElementSibling.className;
  } else {
    secondCardClicked = event.target;
    secondCardClasses = secondCardClicked.previousElementSibling.className;
    clickElement.removeEventListener("click", handleClick);
    if (firstCardClasses === secondCardClasses) {
      clickElement.addEventListener("click", handleClick);
      firstCardClicked = null;
      secondCardClicked = null;
      matches ++;
      attempts ++;
      displayStats();
        if (matches === maxMatches) {
          var modal = document.getElementById("modal1");
          modal.classList.remove("hidden");
        }
    } else {
      clickElement.addEventListener("click", handleClick);

      attempts++;
      displayStats();
      setTimeout(removeHidden,1050);

      function removeHidden() {
      firstCardClicked.classList.remove("hidden");
      secondCardClicked.classList.remove("hidden");
      firstCardClicked.classList.remove("is-flipped");
      secondCardClicked.classList.remove("is-flipped");
      firstCardClicked.parentNode.classList.remove("is-flipped");
      secondCardClicked.parentNode.classList.remove("is-flipped");
      firstCardClicked = null;
      secondCardClicked = null;
      }
    }
  }
}

function displayStats() {
  var gamesplayed1 = document.getElementById("gamesPlayed");
  gamesplayed1.textContent = gamesPlayed;
  var attempts1 = document.getElementById("attempts");
  attempts1.textContent = attempts;
  var accuracy = document.getElementById("accuracy");
  accuracy.textContent = calculateAccuracy(attempts, matches);
}

function calculateAccuracy(attempts, matches) {
  if (!attempts) {
    return "0%";
  } else {
  return Math.trunc(matches/attempts * 100) + "%";
  }
}

function resetGame() {
  gamesPlayed ++;
  attempts = 0;
  matches = 0;
  var resetAttempts = document.getElementById("attempts");
  resetAttempts.textContent = attempts;
  var increaseGame = document.getElementById("gamesPlayed");
  increaseGame.textContent = gamesPlayed;
  var accuracy1 = document.getElementById("accuracy");
  accuracy1.textContent = calculateAccuracy();
  resetCards();
  var hideModal = document.getElementById("modal1");
  hideModal.classList.add("hidden");
}

function resetCards() {
  var hiddenCards = document.querySelectorAll(".card-back");
  for (var i = 0; i < hiddenCards.length; i++) {
    hiddenCards[i].classList.remove("hidden");
  }
}

var resetGame1 = document.getElementById("reset");

resetGame1.addEventListener("click", resetGame);

var card = document.querySelector('.main');
card.addEventListener("click", function(event) {
  if (event.target.className.indexOf("card-back") !== -1){
event.target.parentNode.classList.add("is-flipped");
event.target.classList.add("is-flipped");
  }
});
