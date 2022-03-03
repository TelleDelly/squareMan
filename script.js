//demoing object following cursor and pulling code from here: https://levelup.gitconnected.com/use-javascript-to-make-an-element-follow-the-cursor-3872307778b4

// let player = document.querySelector('.player')

// const onMouseMove = (e) =>{
//     circle.style.left = e.pageX + 'px'
//     circle.style.top = e.pageY + 'px'
// }

// document.addEventListener('mousemove', onMouseMove)

const circle = document.body.querySelector('.circle');
const onMouseMove = (e) =>{
    // console.log('moving')
  circle.style.left = e.pageX + 'px';
  circle.style.top = e.pageY + 'px';
}

document.addEventListener('mousemove', onMouseMove);

circle.addEventListener('click', (e) => {
    const projectile = document.createElement('div')
    projectile.className = 'projectile'
    circle.appendChild(projectile)
})