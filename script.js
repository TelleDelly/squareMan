//demoing object following cursor and pulling code from here: https://levelup.gitconnected.com/use-javascript-to-make-an-element-follow-the-cursor-3872307778b4

// let player = document.querySelector('.player')

// const onMouseMove = (e) =>{
//     circle.style.left = e.pageX + 'px'
//     circle.style.top = e.pageY + 'px'
// }

// document.addEventListener('mousemove', onMouseMove)

//whiteboarding
/*
Map: The entire viewport is the map the player can move around by using the mouse

Player:
Will have a square body which can be moved around using the mouse
W-key will shoot a projectile up from the player
A-key will shoot a projectile to the left of the player
S-key will shoot a projectile down from the player
D-key will shoot a projectile to the right of the player

Each projectile will have the same speed and will travel until it is off screen(use vh and vw)
Once a projectile is off screen(once the animation is done it will be removed as a child from the parent object(see animationEnd event callbacks)

If a player is hit or runs into a target the player will lose the game and a game over modal will appear

Target:
Targets will fly in off the screen at "random" determined from an array of possible points and paths using random selection
Target will have the same speed and will not accelerate during their flight
There will only be three targets on the screen at any time  || target distribution is dictated by the interval and pathes of the targets
Once a target is off screen it will be removed from the page
If a target is hit by a projectile it will be destroyed and points will be added to the players tally
If a target is not hit by a projectile no points will be added and the target will be removed from the game after it has traveled its path

Game:
The game objective is to get a highscore or play untill game over
The player score will be located in the top right of the screen
It will start at zero and increment for each target destroyed
*/

//psuedocode
/*
playerObject.style.left will be equal to the cursor x of a mouse move event
playerObject.style.top will be equal to the cursor y of a mouse move event
the playerObject will have a cursor.style of none
the playerObject height and width will be equal

projectiles will be created from the center of the playerObject and will follow an animation transform
let projectile = Document.createElement('div')
projectile.classList.add('projectile WHAT_TYPE_OF_SHOT')
projectile.addEventListener('animationend',()=>{
  playerObject.removeChild(projectile)
})
playerObject.appendChild(projectile)

when projectile animationend ===true the object will be deleted from the dom

an eventlistener on the window body will check to see if animationstart has occured
window.addEventListener('animationstart' (e)=>{
  if(target){
    do{
      if(target intersects player){
        gameover
      }
    } while(target.aniamtionend != true)
  }

  if(projectile){
    if(projectile intersects target){
      target is destroyed
      score is increased
    }
  } while(projectile.animationend != true)

})

window.addEventListener('animationend' (e) => {
  if(target){
    target.animationend = true
  }
  if(projectile){
    projectile.animationend = true
  }
})
*/

//GLOBAL STATIC CONSTS

//Projectile buffer in miliseconds
const PROJECTILEBUFFER = 200;

//Target constants for duration and iteration see target creation function
//targetSpeed is time in miliseconds
let targetDuration;
const MINTARGETDURATION = 1200;
const targetIterations = 1;
const TARGETPOINTVALUE = 10;

//Target duration decrement will increase the difficulty
const TARGETDURATIONDECREMENT = 300

//Difficulty increase time in miliseconds
const DIFFICULTYINCREASE = 16000;

//Target creation variables
//Be wary of increasing TARGETCREATIONINTERVAL it may not allow targets to reach there full path
//in miliseconds
let TARGETCREATIONINTERVAL = 900;
const TARGETINTERVALDECREMENT = 120;
let targetInteval = null;

//X viewport range of posible starting and ending positions
const sXPORTMAX = 85;
const sXPORTMIN = 15;
const eXPORTMAX = 85;
const eXPORTMIN = 15;

//X viewport offsets
const sXPORTOFFSET = -15;
const eXPORTOFFSET = 115;

//Y viewport range of possible starting and ending positions
const sYPORTMAX = 90;
const sYPORTMIN = 10;
const eYPORTMAX = 90;
const eYPORTMIN = 10;

//Y viewport offsets
const sYPORTOFFSET = -15;
const eYPORTOFFSET = 115;

//GLOBAL VARIABLES FOR COLLISION CHECKER FUNCTION
let targets = null;
let projectiles = null;
let targetRecs = null;
let playerRecs = null;
let projectileRecs = null;

//Max index for the following colections containing for items
//To be used with the randomNumber function
const COLLECTIONMAX = 3;

//Global variables for creating target function
const startingPointChoice = ["x", "y", "oX", "oY"];

//Possible color for target and projectiles
const tColors = ["purple", "red", "green", "yellow"];

const pColors = {
  a: "purple",
  w: "red",
  s: "green",
  d: "yellow",
};

//Animation list
const animationList = {
  w: "upshot",
  a: "leftshot",
  s: "downshot",
  d: "rightshot",
};

//Object for player data
const player = {
  shotsFired: 0,
  targetHit: 0,
  score: 0,
};

//Player Object DOM element
const playerObject = document.querySelector(".player-object");
const playerScore = document.querySelector(".player-score");

//Event listener callback functions for player object
const onMouseMove = (e) => {
  playerObject.style.left = e.pageX + "px";
  playerObject.style.top = e.pageY + "px";
};

const onShootKeyPress = (e) => {
  if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
    if (!e.repeat) {
      setTimeout(() => {
        player.shotsFired++;
        let projectile = document.createElement("div");
        projectile.classList.add("projectile");
        projectile.style.backgroundColor = pColors[e.key];
        projectile.style.animation = `${animationList[e.key]} 1s linear 1`;
        playerObject.appendChild(projectile);
      }, PROJECTILEBUFFER);
    }
  }
};

const onAnimationEnd = (e) => {
  if (e.target.classList.contains("projectile")) {
    e.target.remove();
  }
  if (e.target.classList.contains("target")) {
    e.target.remove();
  }
}

//may be a bit too much
// const onRotateKeyPress = (e)=> {
//   if(e.key === 'q'){
//     playerObject.style.transform = "rotate(90deg)"
//   }
//   if(e.key === 'e'){
//     playerObject.style.transform = 'rotate(-90deg)'
//   }
// }

//Event listenters for player objectw
document.addEventListener("mousemove", onMouseMove);
document.addEventListener("keypress", onShootKeyPress);

//Event listener for transitionEnd
document.addEventListener("animationend", onAnimationEnd);

const collisionCheck = () => {
  targets = document.querySelectorAll(".target");
  projectiles = document.querySelectorAll(".projectile");

  playerRecs = playerObject.getBoundingClientRect();

  if (targets.length > 0) {
    targets = [...targets];
    targetRecs = targets.map((target) => {
      return target.getBoundingClientRect();
    });

    targetRecs.forEach((target) => {
      if (
        playerRecs.x < target.right &&
        playerRecs.y < target.bottom &&
        playerRecs.right > target.x &&
        playerRecs.bottom > target.y
      ) {
        hitByTarget();
      }
    });

    if (projectiles.length > 0) {
      projectiles = [...projectiles];
      
      projectileRecs = projectiles.map((projectile) => {
        return projectile.getBoundingClientRect();
      });
      
      projectileRecs.forEach((projectile, pIndex) => {
        targetRecs.forEach((target, index) => {
          
          if (
            projectile.x < target.right &&
            projectile.y < target.bottom &&
            projectile.right > target.x &&
            projectile.bottom > target.y
          ) {

            if (
              targets[index].style.backgroundColor ===
              projectiles[pIndex].style.backgroundColor
            ) {
              targets[index].remove();
              projectiles[pIndex].remove();
              hitByProjectile();
            } else {
              projectiles[pIndex].remove();
            }
          }
        });
      });
    }
  }
  window.requestAnimationFrame(collisionCheck);
};

//Function to call if target is hit by a projectile
const hitByProjectile = () => {
  player.score += TARGETPOINTVALUE;
  player.targetHit++;
  playerScore.textContent = `Score: ${player.score}`;
};

const hitByTarget = () => {
  playerObject.remove();
  playerScore.remove();

  let allTargets = document.querySelectorAll(".target");
  // console.log(allTargets)
  allTargets.forEach((target) => {
    target.remove();
  });

  clearInterval(targetInteval);
  clearInterval(difficultyInterval);

  window.cancelAnimationFrame(requestAnimationID);

  setHighScore();

  let accuraccyCalculations = getAccuracy();

  let highScore = document.querySelector("#highscore");
  let gameOverScore = document.querySelector("#game-over-score");
  let shotsFired = document.querySelector("#shots-fired");
  let shotsHit = document.querySelector("#shots-hit");
  let accuracy = document.querySelector("#accuracy");

  highScore.textContent = `Highscore ${localStorage.getItem("highscore")}`;
  gameOverScore.textContent = `Score: ${player.score}`;
  shotsFired.textContent = `Shots fired: ${player.shotsFired}`;
  shotsHit.textContent = `Target hit: ${player.targetHit}`;
  accuracy.textContent = `Accuracy: ${accuraccyCalculations}`;

  let gameOverModal = document.querySelector("#game-over");
  gameOverModal.classList.add("game-over-died");
};

const createATarget = () => {
  //I am going to get the 3 and zero here because i
  let randomColor = randomNumber(COLLECTIONMAX, 0);
  let tempTarget = document.createElement("div");
  tempTarget.classList.add("target");
  tempTarget.style.backgroundColor = tColors[randomColor];
  tempTarget.animate(keyFrameGenerator(), {
    duration: targetDuration,
    iterations: targetIterations,
  });
  document.body.append(tempTarget);
};

const keyFrameGenerator = () => {
  let randStart = randomNumber(COLLECTIONMAX, 0);
  let startingPointDecision = startingPointChoice[randStart];
  let startingXPoint = null;
  let endingXPoint = null;
  let startingYPoint = null;
  let endingYPoint = null;
  let keyframeReturn = null;

  switch (startingPointDecision) {
    case "x":
      // console.log('start from x')
      startingXPoint = randomNumber(sXPORTMAX, sXPORTMIN);
      endingXPoint = randomNumber(eXPORTMAX, eXPORTMIN);
      keyframeReturn = [
        { transform: `translate(${startingXPoint}vw, ${sYPORTOFFSET}vh)` },
        { transform: `translate(${endingXPoint}vw, ${eYPORTOFFSET}vh)` },
      ];
      break;
    case "y":
      // console.log('start from y')
      startingYPoint = randomNumber(sYPORTMAX, sYPORTMIN);
      endingYPoint = randomNumber(eYPORTMAX, eYPORTMIN);
      keyframeReturn = [
        { transform: `translate(${sXPORTOFFSET}vw, ${startingYPoint}vh)` },
        { transform: `translate(${eXPORTOFFSET}vw, ${endingYPoint}vh)` },
      ];
      break;
    case "oX":
      // console.log('starting from oX')
      startingXPoint = randomNumber(sXPORTMAX, sXPORTMIN);
      endingXPoint = randomNumber(eXPORTMAX, eXPORTMIN);
      keyframeReturn = [
        { transform: `translate(${startingXPoint}vw, ${eYPORTOFFSET}vh)` },
        { transform: `translate(${endingXPoint}vw, ${sYPORTOFFSET}vh)` },
      ];
      break;
    case "oY":
      // console.log('starting from oY')
      startingYPoint = randomNumber(sYPORTMAX, sYPORTMIN);
      endingYPoint = randomNumber(eYPORTMAX, eYPORTMIN);
      keyframeReturn = [
        { transform: `translate(${eXPORTOFFSET}vw, ${startingYPoint}vh)` },
        { transform: `translate(${sXPORTOFFSET}vw, ${endingYPoint}vh)` },
      ];
      break;
  }
  return keyframeReturn;
};

const randomNumber = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getAccuracy = () => {
  if (player.shotsFired > 0) {
    percentageCalculations = player.targetHit / player.shotsFired;
    percentageCalculations = parseFloat(percentageCalculations) * 100.0;
    percentageCalculations = percentageCalculations.toFixed(1);
    let percentage = `${percentageCalculations}%`;
    return percentage;
  }
  return "No shot";
};

const increaseDifficulty = () => {
  if (targetDuration > MINTARGETDURATION) {
    targetDuration -= TARGETDURATIONDECREMENT;
    TARGETCREATIONINTERVAL -= TARGETINTERVALDECREMENT
  }
};

const setHighScore = () => {
  if (player.score > localStorage.getItem("highscore")) {
    localStorage.setItem("highscore", player.score);
  }
};

const runGame = () => {
  targetDuration = 3500;

  targetInteval = setInterval(createATarget, TARGETCREATIONINTERVAL);
  difficultyInterval = setInterval(increaseDifficulty, DIFFICULTYINCREASE);
  
  playerObject.style.left = "50vw";
  playerObject.style.top = "50vh";

  requestAnimationID = window.requestAnimationFrame(collisionCheck);
};

runGame();
