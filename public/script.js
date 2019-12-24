$(document).ready(function () {
    $('.col').hover(
        //triger when mouse hover
        function () {
            $(this).animate({
                marginTop: "-=1%",
            }, 200);
        },

        //trigger when mouse out 
        function () {
            $(this).animate({
                marginTop: "0%",
            }, 200);
        }
    );
});

const particles = document.getElementById("particles-js");
const ctx = particles.getContext("2d");
particles.width = window.innerWidth;
particles.height = window.innerHeight;

let particlesArray;

//get mouse position
let mouse = {
    x: null,
    y: null,
    radius: (particles.height / 80) * (particles.width / 80),
}

window.addEventListener('mousemove',
    function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

//create particle
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    //method to draw individual particles 
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); //creates a circle
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    }
    //check particle position, check mouse position, move the particle, draw the particle
    update() {
        //check if particle is still within particle-js container
        if (this.x > particles.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > particles.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        //check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < particles.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < particles.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }
        // move particle
        this.x += this.directionX;
        this.y += this.directionY;
        // draw particle
        this.draw();
    }
}

//create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (particles.height * particles.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1; //size: random number between 1 and 5
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2); //random number between 0 and canvas width
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1.5; //movement speed: random number between -.5 and .5
        let directionY = (Math.random() * 2) - 1.5;
        let color = '#ffffff';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

//check if particles are close enough to draw line between them
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (particles.width / 7) * (particles.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')'; //line opacity is 1 when close, slowly get invisible as particles spread further apart
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

//animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}
//resize event
window.addEventListener('resize',
    function () {
        particles.width = innerWidth;
        particles.height = innerHeight;
        mouse.radius = ((canvas.height / 90) * (canvas.height / 90));
        init();
    }
);

//mouse out event
window.addEventListener('mouseout',
    function () {
        mouse.x = undefined;
        mouse.y = undefined;
    }
)

init();
animate();