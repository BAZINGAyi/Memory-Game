/* global start
 ***********************
 * cardData : init Data Array
 * cardCount: The total number of cards
 * openCardCount: The total number of cards opened
 * icnoData: The display icno of card
 * userMoveCount: The number of user moves
 * useTime: The time of user used
 */

let cardData = [];
let cardCount = 16;
let openCardCount = 0;
let icnoData = ['fa fa-cube','fa fa-paper-plane-o','fa fa-bicycle',
				'fa fa-bolt','fa fa-bomb','fa fa-leaf','fa fa-diamond','fa fa-anchor'];
let userMoveCount = 0;
let useTime = Date.now();

// game Layout id
let gameLayout = document.getElementById("container");
// win Layout id
let congratulationLayout = document.getElementById("congratulation");

//  Card Class is used to represent Itself
let Card = function (value, icnoName,className) {
	this.value = value;
	this.icnoName = icnoName;
	this.className = className;
};

// generate init data
function generatecardData(dataCount) {
	cardData.length = 0;
	for (let i = 0; i < dataCount/2; i++) {
		let card1 = new Card(i,icnoData[i],"card");
		let card2 = new Card(i,icnoData[i],"card");
		cardData.push(card1);
		cardData.push(card2);
	}
}

/*******  global end ***********/




/*******  main start ***********/

// generate card on page
function generateCard(cardCount) {
	let deck =  document.getElementById("deck");
	deck.innerHTML = "";
	
	for (let count = 0; count < cardCount; count++){
        // create <li> tag
		let li = document.createElement("li");
		li.setAttribute("class", cardData[count].className);
		li.addEventListener('click', function(e) {
				liClassName = this.className.trim();
				// click logical
				checkClickStrategy(this,liClassName);
        });

		// create <i> tag 
		let i = document.createElement("i");

		// add to parent
		li.appendChild(i);
		deck.appendChild(li);
	}
}

// Assign Value to each card
function assignValueToEachCard() {
	// assign value to card
	let cardList = document.getElementsByClassName("card");
	for (let i = 0; i < cardList.length; i++){
		let card = cardList[i];
		card.value = cardData[i].value;
	}

	// assign icno to card
	let ulTag = document.getElementById("deck");
	let iTagList = ulTag.getElementsByTagName("li");
	for (let i = 0; i < iTagList.length; i++) {
		// find <i> tag, set class
		let liTag = iTagList[i];
		let iTag = liTag.firstChild;
		// set icno
		iTag.setAttribute("class",cardData[i].icnoName);
	}

}

// the method of user click to card
function checkClickStrategy(obj,cardClassName) {
  
    // if the card status == not open
	if (cardClassName === "card") {
		openCardCount++;
		setClassNameOpenStatus(obj);

		if (openCardCount == 2) {
			// score 
   			addUserMoveCount();
   			setStarRate();

   			// main start
			forbidAllTagClickEvent();
			// Restart Calculate openCardCount
			openCardCount = 0;
			// compare Open Card1 to Opend Crad2
			cardList = document.getElementsByClassName("card open show");
			if (cardList.length == 2) {
				openedCard1 = cardList[0];
				openedCard2 = cardList[1];
				if(openedCard1.value === openedCard2.value) {
					// set shake staus
					setSuccessShakeStatus(openedCard1);
					setSuccessShakeStatus(openedCard2);

					function openCard() {
						// set match status
						setClassNameMatchStatus(openedCard1);
						setClassNameMatchStatus(openedCard2);
						aggreeAllTagClickEvent();
						// check all card was found
						isSuceess();
					}
					setTimeout(openCard,1000);
				}else {
					// set shake staus
					setErrorShakeStatus(openedCard1);
					setErrorShakeStatus(openedCard2);

					// The two value of  open card is different
					function closeCard(){
						// revert default status 
       					setClassNameCloseStatus(openedCard1);
						setClassNameCloseStatus(openedCard2);
						aggreeAllTagClickEvent();
    				}
    				setTimeout(closeCard,1000);
				}
			}
			
		}

	}
}


function isSuceess() {
	let cardList = document.getElementsByClassName("card open match");
	let scoreDisplay = document.getElementById("socre_display");
	// All card was matched
	if (cardList.length === cardCount) {
		let time = MillisecondToDate(new Date()-useTime);
		let rate = document.getElementsByClassName("fa-star");
		scoreDisplay.innerHTML = "With " + userMoveCount + " Moves and " + rate.length + " Stars and " + time;
		// hidden game layout
		gameLayout.className = "no_display";
		// display score layout
		congratulation.className = "congratulation";
		// restart game
		startGame();
	}
}

/*******  main end ***********/




/*******  head start ***********/
const freshButton = document.querySelector("#restart");
freshButton.addEventListener('click', function(e) {
	startGame();
});

let moves = document.getElementById("moves");
let ulStarTag = document.getElementById("stars");
let liStarTagList = ulStarTag.getElementsByTagName("li");

function initScoreHeader() {
	userMoveCount = 0;
	moves.innerHTML = userMoveCount;
	liStarTagList[0].firstChild.setAttribute("class","fa fa-star");
	liStarTagList[1].firstChild.setAttribute("class","fa fa-star");
}

function setStarRate() {
	// set stars rate
	if (userMoveCount <= 18) {

	}else if (userMoveCount <= 30 && userMoveCount >= 18) {
		liStarTagList[0].firstChild.setAttribute("class","fat");
	}else {
		liStarTagList[1].firstChild.setAttribute("class","fat");
	}
}

function addUserMoveCount(){
	userMoveCount++;
	// set moves 
	moves.innerHTML = userMoveCount;
}
/*******  head end ***********/






/*******  utils start *********/

// Randomly disrupted the array 
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function setClassNameOpenStatus(obj){
	obj.setAttribute("class","card open show")
}

function setClassNameCloseStatus(obj){
	obj.setAttribute("class","card")
}

function setClassNameMatchStatus(obj) {
	// Match is used to mark, disabled is used to forbid user click
	obj.setAttribute("class","card open match")
}

function forbidAllTagClickEvent() {
	let cardList = document.getElementsByClassName("card");
	for (let i = 0; i < cardList.length; i++){
		let card = cardList[i];
		card.className += " disabled";
	}
}

function aggreeAllTagClickEvent() {
	let cardList = document.getElementsByClassName("card");
	for (let i = 0; i < cardList.length; i++){
		let card = cardList[i];
		card.className = card.className.replace(" disabled","");
	}
}


function setErrorShakeStatus(obj) {
	obj.className += " error_matching";
}

function setSuccessShakeStatus(obj) {
	obj.className += " success_matching";
}

// Remove the tag of the specified class name / no use
function reomoveSpecifiedTagInArray(array,className) {
	let newArray = [];
	for (let i = 0; i < array.length; i++) {
		let tag = array[i];
		findPosition = tag.getAttribute("class").indexOf(className);
		if (findPosition < 0){
			newArray.push(array[i]);
		}
	}
	return newArray;
}

function MillisecondToDate(msd) {
    let time = parseFloat(msd) / 1000;
    if (null != time && "" != time) {
        if (time > 60 && time < 60 * 60) {
            time = parseInt(time / 60.0) + "mins" 
                 + parseInt((parseFloat(time / 60.0) 
                 - parseInt(time / 60.0)) * 60) + "秒";

        }else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            time = parseInt(time / 3600.0) + "hours"
                 + parseInt((parseFloat(time / 3600.0) 
                 - parseInt(time / 3600.0)) * 60) + "mins" 
                 + parseInt((parseFloat((parseFloat(time / 3600.0) 
                 - parseInt(time / 3600.0)) * 60) 
                 - parseInt((parseFloat(time / 3600.0) 
                 - parseInt(time / 3600.0)) * 60)) * 60) + "secs";
        }
        else {
            time = parseInt(time) + "secs";
        }
    }
    return time;
}
/*******  utils end *********/




/*******  congratulation start *********/

let playButton = document.getElementById("play");
playButton.addEventListener("click", function (){
	let scoreDisplay = document.getElementById("congratulation");
	// win layout hidden
	scoreDisplay.className = "no_display";
	// game layout display
	gameLayout.className = "container";
});




/*******  congratulation start *********/

function startGame() {
	initScoreHeader();
	generatecardData(cardCount);
	//shuffle(cardData);
	generateCard(cardCount);
	assignValueToEachCard();
}

startGame();