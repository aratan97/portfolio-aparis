// ============================================================
// MOTEUR DE PARTICULES (Traînée de la souris)
// ============================================================

const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const sparks = [];
let isAnimating = false;

document.addEventListener('mousemove', e => {
    // Limite la création de particules pour garder des performances optimales (Clean Code !)
    if (Math.random() > 0.8) {
        sparks.push({
            x: e.clientX, y: e.clientY,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
            size: Math.floor(Math.random() * 2 + 1) * 3, // Taille de la particule
            life: 1,
            // On utilise les couleurs hex de ton thème (Rouge carmin et rouge clair)
            color: Math.random() > 0.5 ? '#c62828' : '#ef5350'
        });
        if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(animateSparks);
        }
    }
});

function animateSparks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = false;

    for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy;
        s.vy += 0.05; // Gravité douce
        s.life -= 0.05; // Disparition progressive

        if (s.life <= 0) {
            sparks.splice(i, 1);
            continue;
        }

        activeParticles = true;
        ctx.globalAlpha = s.life * 0.6;
        ctx.fillStyle = s.color;
        // Particules carrées (style Pixel Art)
        ctx.fillRect(Math.round(s.x), Math.round(s.y), s.size, s.size);
    }

    ctx.globalAlpha = 1;

    if (activeParticles) {
        requestAnimationFrame(animateSparks);
    } else {
        isAnimating = false; // Arrête la boucle JS si la souris ne bouge plus (Économie de batterie)
    }
}