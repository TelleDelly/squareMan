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
Target will have the same speed and will no accelerate during their flight
There will only be three targets on the screen at any time
Once a target is off screen it will be removed from the page
If a target is hit by a projectile it will be destroyed and points will be added to the players tally
If a target is not hit by a projectile no points will be added and the target will be removed from the game

Game:
The game objective is to get a highscore or play untill death
The player score will be located in the top right of the screen
It will start at zero and increment for each target destroyed
*/

//psuedocode
/*
playerObject.style.left will be equal to the cursor x of a mouse move event
playerObject.style.top will be equal to the cursor y of a mouse move event
the player object will have a cursor.style of none
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

//Animation list
const animationList = {
  'w': 'upshot',
  'a': 'leftshot',
  's': 'downshot',
  'd': 'rightshot',
}

//Object for player data
const player = {
  score: 0,
}

//Player Object DOM element
const playerObject = document.querySelector('.player-object')

const onMouseMove = (e) => {
  playerObject.style.left = e.pageX + 'px'
  playerObject.style.top = e.pageY + 'px'
}

const onShootKeyPress = (e) => {
  if(e.key === 'w' || e.key === 'a' || e.key === 's' || e.key ==='d'){
    setTimeout(() => {
      let projectile = document.createElement('div')
      projectile.classList.add('projectile')
      projectile.style.animation = `${animationList[e.key]} 1s linear 1`
      playerObject.appendChild(projectile)
    }, 200)
  }
} 


//Event listenters for player objectw
document.addEventListener('mousemove', onMouseMove)
document.addEventListener('keypress', onShootKeyPress)

//Event listener for transitionEnd
document.addEventListener('animationend',(e) => {
  if(e.target.classList.contains('projectile')){
    e.target.remove()
  }
  if(e.target.classList.contains('target')){
    e.target.remove()
  }
}) 

//Event listener for transitionStart
//I am going to try and use requestAnimationFrame to do all my collision checks
//TODO: Must clean up this function as it will run every single frame refresh

const collisionCheck = () => {
  let targets = document.querySelectorAll('.target')
  let projectiles = document.querySelectorAll('.projectile')
  let targetRecs = null
  let playerRecs = null
  let projectileRecs = null

  playerRecs = playerObject.getBoundingClientRect()
  
  if(targets.length > 0){
    targets = [...targets]
    targetRecs = targets.map((target) => {
      return target.getBoundingClientRect()
    })
    targetRecs.forEach((target) => {
      if((playerRecs.x < target.right && playerRecs.y < target.bottom) && (playerRecs.right > target.x && playerRecs.bottom > target.y)){
       hitByTarget()
        console.log('Player gets deleted')
      }
    })


    if(projectiles.length > 0){
      projectiles = [...projectiles]
      projectileRecs = projectiles.map((projectile) => {
        return projectile.getBoundingClientRect()
      })
      if(targetRecs.length > 0){
        projectileRecs.forEach((projectile) => {
          targetRecs.forEach((target) => {
            if((projectile.x < target.right && projectile.y < target.bottom) && (projectile.right > target.x && projectile.bottom > target.y)){
              console.log('target hit by projectile')
              hitByProjectile()
            }
          })
        })
      }
    }


  }  

  window.requestAnimationFrame(collisionCheck)
}


window.requestAnimationFrame(collisionCheck)


//Function to call if target is hit by a projectile
const hitByProjectile = () =>  {
  player.score += 10
   const playerScore = document.querySelector('.player-score')
   playerScore.textContent = player.score
}

const hitByTarget = () => {
  playerObject.remove()
  let gameOverModal = document.querySelector('#game-over')
  gameOverModal.classList.add('game-over-died')
}



