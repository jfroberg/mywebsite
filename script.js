const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfParticles = 100;
const mouse = {
    x: null,
    y: null,
    radius: 150 // Interaction radius
};

// Update mouse position
canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Particle class
class Particle {
    constructor(x, y, size, color, weight) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.weight = weight;
        this.directionX = (Math.random() * 0.4) - 0.2;
        this.velocity = { x: 0, y: 0 }; // Velocity vector
        this.friction = 0.98; // Friction coefficient
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        // Mouse interaction with gravitational effect
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance; // Force decreases with distance
            let directionX = forceDirectionX * force * this.weight;
            let directionY = forceDirectionY * force * this.weight;

            this.velocity.x += directionX;
            this.velocity.y += directionY;
        }

        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Update position
        this.x += this.velocity.x;
        this.y += this.velocity.y + this.weight;

        // Reset position if out of bounds
        if (this.y > canvas.height) {
            this.y = 0 - this.size;
            this.x = Math.random() * canvas.width;
            this.velocity.y = 0;
        }

        if (this.x > canvas.width || this.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
    }
}

// Initialize particles
function init() {
    particlesArray.length = 0;
    for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 5 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        const weight = Math.random() * 2 + 1;
        particlesArray.push(new Particle(x, y, size, color, weight));
    }
}

// Animate particles
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

// Handle window resize
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});