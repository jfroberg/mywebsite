const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const container = document.querySelector('.circle-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

resizeCanvas();

const particlesArray = [];
const numberOfParticles = 1000;
let currentParticleCount = 0; // Track the number of particles currently spawned
const spawnInterval = 10; // Time in milliseconds between spawning particles

const mouse = {
    x: null,
    y: null,
    radius: 150 // Interaction radius
};

let attractionActive = false; // Start with attraction off

canvas.addEventListener('mousemove', function(event) {
    if (attractionActive) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    }
});

// Toggle attraction on click
canvas.addEventListener('click', function() {
    attractionActive = !attractionActive;
    if (!attractionActive) {
        mouse.x = null;
        mouse.y = null;
    }
});

const attractionSlider = document.getElementById('attractionSlider');
attractionSlider.addEventListener('input', function() {
    const attractionForce = parseFloat(this.value);
    particlesArray.forEach(particle => {
        particle.attractionForce = attractionForce;
    });
});

class Particle {
    constructor(x, y, size, color, weight) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.weight = weight;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2;
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
        this.friction = 0.995;
        this.attractionForce = 0.2;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        if (attractionActive && mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance * this.attractionForce;
                let directionX = forceDirectionX * force * this.weight;
                let directionY = forceDirectionY * force * this.weight;
                this.velocity.x += directionX;
                this.velocity.y += directionY;
            }
        }

        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2;
        let distFromCenter = Math.sqrt((this.x - centerX) ** 2 + (this.y - centerY) ** 2);
        if (distFromCenter + this.size > radius) {
            let angle = Math.atan2(this.y - centerY, this.x - centerX);
            this.x = centerX + (radius - this.size) * Math.cos(angle);
            this.y = centerY + (radius - this.size) * Math.sin(angle);
            this.velocity.x = -this.velocity.x;
            this.velocity.y = -this.velocity.y;
        }
    }
}

function spawnParticle() {
    if (currentParticleCount < numberOfParticles) {
        const size = Math.random() * 5 + 1;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const x = centerX + (Math.random() - 0.5) * 50;
        const y = centerY + (Math.random() - 0.5) * 50;

        // Use cool blue and white colors
        const colors = [
            'rgba(173, 216, 230, 0.8)', // Light blue
            'rgba(135, 206, 250, 0.8)', // Sky blue
            'rgba(255, 255, 255, 0.8)', // White
            'rgba(70, 130, 180, 0.8)', // Steel blue
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const weight = Math.random() * 2 + 1;
        particlesArray.push(new Particle(x, y, size, color, weight));
        currentParticleCount++;
    }
}

function init() {
    particlesArray.length = 0;
    currentParticleCount = 0;
    setInterval(spawnParticle, spawnInterval);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', function() {
    resizeCanvas();
    init();
});