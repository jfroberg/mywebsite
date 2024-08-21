const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const particlesArray = [];
const numberOfParticles = 2000;
let currentParticleCount = 0;
const spawnInterval = 0;
const mouse = { x: null, y: null, radius: 150 };
let attractionActive = false;
let repulsionMode = false;

function resizeCanvas() {
    const container = document.querySelector('.circle-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    init(); // Reinitialize particles with the new size
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('mousemove', function(event) {
    if (attractionActive) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    }
});

canvas.addEventListener('click', function() {
    attractionActive = !attractionActive;
    if (!attractionActive) {
        mouse.x = null;
        mouse.y = null;
    }
});

document.getElementById('toggleForceButton').addEventListener('click', function() {
    repulsionMode = !repulsionMode;
});

const palettes = {
    coolBlue: {
        particles: ['rgba(173, 216, 230, 0.8)', 'rgba(135, 206, 250, 0.8)', 'rgba(254, 205, 5, 0.8)', 'rgba(70, 130, 180, 0.8)'],
        background: 'linear-gradient(135deg, #f0f8ff, #e6f7ff)',
        button: '#fff',
        buttonHover: '#f0f0f0'
    },
    warmSunset: {
        particles: ['rgba(255, 99, 71, 0.8)', 'rgba(255, 140, 0, 0.8)', 'rgba(255, 165, 0, 0.8)', 'rgba(255, 69, 0, 0.8)'],
        background: 'linear-gradient(135deg, #fff5e6, #ffe6cc)',
        button: '#ffcccb',
        buttonHover: '#ffb6b9'
    },
    greenForest: {
        particles: ['rgba(34, 139, 34, 0.8)', 'rgba(0, 100, 0, 0.8)', 'rgba(50, 205, 50, 0.8)', 'rgba(144, 238, 144, 0.8)'],
        background: 'linear-gradient(135deg, #e6ffe6, #ccffcc)',
        button: '#d4edda',
        buttonHover: '#c3e6cb'
    },
    midnightBlue: {
        particles: ['rgba(25, 25, 112, 0.8)', 'rgba(0, 0, 139, 0.8)', 'rgba(72, 61, 139, 0.8)', 'rgba(123, 104, 238, 0.8)'],
        background: 'linear-gradient(135deg, #000428, #004e92)',
        button: '#1e3c72',
        buttonHover: '#2a5298'
    },
    emeraldNight: {
        particles: ['rgba(0, 100, 0, 0.8)', 'rgba(0, 128, 0, 0.8)', 'rgba(34, 139, 34, 0.8)', 'rgba(46, 139, 87, 0.8)'],
        background: 'linear-gradient(135deg, #004d00, #001a00)',
        button: '#006400',
        buttonHover: '#008000'
    },
    crimsonTwilight: {
        particles: ['rgba(139, 0, 0, 0.8)', 'rgba(85, 42, 102, 0.8)', 'rgba(178, 34, 34, 0.8)', 'rgba(220, 20, 60, 0.8)'],
        background: 'linear-gradient(135deg, #2c003e, #3a000d)',
        button: '#8b0000',
        buttonHover: '#a52a2a'
    },
    pastelPink: {
        particles: ['rgba(255, 182, 193, 0.8)', 'rgba(255, 192, 203, 0.8)', 'rgba(255, 228, 225, 0.8)', 'rgba(225, 220, 245, 0.8)'],
        background: 'linear-gradient(135deg, #fff0f5, #ffe4e1)',
        button: '#ffc0cb',
        buttonHover: '#ffb6c1'
    },
    cherryBlossom: {
        particles: ['rgba(85, 133, 59, 0.8)', 'rgba(255, 192, 203, 0.8)', 'rgba(255, 182, 193, 0.8)', 'rgba(255, 105, 180, 0.8)'],
        background: 'linear-gradient(135deg, #ffe4e1, #ffebcd)',
        button: '#ff69b4',
        buttonHover: '#ff1493'
    },
    highContrast: {
        particles: ['rgba(0, 0, 0, 0.8)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 0, 0, 0.8)', 'rgba(0, 255, 0, 0.8)'],
        background: 'linear-gradient(135deg, #f0f0f0, #ffffff)',
        button: '#0f0f0f0',
        buttonHover: '#ffffff'
    },
    matrix: {
        particles: ['rgba(0, 255, 0, 0.8)', 'rgba(0, 128, 0, 0.8)', 'rgba(0, 100, 0, 0.8)', 'rgba(0, 255, 127, 0.8)'],
        background: 'linear-gradient(135deg, #001100, #003300)',
        button: '#00ff00',
        buttonHover: '#009900'
    },
    candyPop: {
        particles: ['rgba(255, 105, 180, 0.8)', 'rgba(255, 20, 147, 0.8)', 'rgba(255, 182, 193, 0.8)', 'rgba(255, 160, 122, 0.8)'],
        background: 'linear-gradient(135deg, #ffb6c1, #ff69b4)',
        button: '#ff1493',
        buttonHover: '#ff69b4'
    },
    evaUnit01: {
        particles: ['rgba(118, 88, 152, 0.8)', 'rgba(139, 212, 80, 0.8)', 'rgba(162, 178, 223, 0.8)', 'rgba(230, 119, 11, 0.8)'],
        background: 'linear-gradient(135deg, #3d2c47, #4a5e35)', // Darker and more muted
        button: '#fff',
        buttonHover: '#f0f0f0'
    },
    evaUnit00: {
        particles: ['rgba(70, 96, 158, 0.8)', 'rgba(243, 243, 245, 0.8)', 'rgba(142, 68, 60, 0.8)', 'rgba(212, 49, 38, 0.8)'],
        background: 'linear-gradient(135deg, #2c3e50, #4f4f4f)', // Darker and more muted
        button: '#fff',
        buttonHover: '#f0f0f0'
    },
    evaUnit02: {
        particles: ['rgba(255, 58, 33, 0.8)', 'rgba(247, 138, 24, 0.8)', 'rgba(128, 30, 130, 0.8)', 'rgba(9, 150, 134, 0.8)'],
        background: 'linear-gradient(135deg, #4a1c1c, #5b3b1e)', // Darker and more muted
        button: '#fff',
        buttonHover: '#f0f0f0'
    }
};


let currentPalette = palettes.coolBlue;

document.getElementById('paletteSelector').addEventListener('change', function(event) {
    currentPalette = palettes[event.target.value];
    document.body.style.background = currentPalette.background;
    document.getElementById('toggleForceButton').style.backgroundColor = currentPalette.button;
    document.getElementById('toggleForceButton').addEventListener('mouseover', function() {
        this.style.backgroundColor = currentPalette.buttonHover;
    });
    document.getElementById('toggleForceButton').addEventListener('mouseout', function() {
        this.style.backgroundColor = currentPalette.button;
    });
    init(); // Reinitialize particles with the new palette
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
        this.attractionForce = 0.1;
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
                if (repulsionMode) {
                    this.velocity.x -= directionX;
                    this.velocity.y -= directionY;
                } else {
                    this.velocity.x += directionX;
                    this.velocity.y += directionY;
                }
            }
        }
        this.applyRepulsion();
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

    applyRepulsion() {
        particlesArray.forEach(particle => {
            if (particle !== this) {
                let dx = this.x - particle.x;
                let dy = this.y - particle.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let minDistance = this.size + particle.size;
                if (distance < minDistance) {
                    let force = (minDistance - distance) / minDistance;
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    this.velocity.x += forceDirectionX * force * 0.04;
                    this.velocity.y += forceDirectionY * force * 0.04;
                }
            }
        });
    }
}

function spawnParticle() {
    if (currentParticleCount < numberOfParticles) {
        const size = Math.random() * 4 + 2;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const x = centerX + (Math.random() - 0.5) * 50;
        const y = centerY + (Math.random() - 0.5) * 50;
        const color = currentPalette.particles[Math.floor(Math.random() * currentPalette.particles.length)];
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