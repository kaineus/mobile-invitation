// A brief, decorative welcome burst. No external library or persistent animation.
export function playWelcomeConfetti() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || document.hidden) return;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;

  canvas.className = 'welcome-confetti';
  canvas.setAttribute('aria-hidden', 'true');
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  context.scale(pixelRatio, pixelRatio);
  document.body.append(canvas);

  const paper = document.querySelector('.paper').getBoundingClientRect();
  const spread = Math.min(paper.width, width);
  const colors = ['#819fbe', '#b5c9df', '#d0b2b6', '#bfaa79', '#d7e1ed'];
  const count = width < 540 ? 86 : 110;
  const random = (min, max) => min + Math.random() * (max - min);
  const particles = Array.from({ length: count }, (_, index) => {
    const fromLeft = index % 2 === 0;
    return {
      x: fromLeft ? paper.left + 12 : paper.right - 12,
      y: Math.min(height * 0.6, 470),
      vx: (fromLeft ? 1 : -1) * random(spread * 0.32, spread * 0.95),
      vy: -random(260, Math.min(height * 0.65, 470)),
      delay: random(0, 0.16) + (fromLeft ? 0 : 0.1),
      size: random(4, 8),
      rotation: random(0, Math.PI * 2),
      spin: random(-7, 7),
      phase: random(0, Math.PI * 2),
      color: colors[index % colors.length],
      round: index % 5 === 0
    };
  });

  let frame;
  let startedAt;
  function stop() {
    cancelAnimationFrame(frame);
    canvas.remove();
    reducedMotion.removeEventListener('change', stop);
    document.removeEventListener('visibilitychange', stop);
    window.removeEventListener('pagehide', stop);
    window.removeEventListener('resize', stop);
  }

  function draw(timestamp) {
    startedAt ??= timestamp;
    // Let the names appear before the two small bursts begin.
    const elapsed = (timestamp - startedAt - 450) / 1000;
    if (elapsed >= 4.2) { stop(); return; }
    context.clearRect(0, 0, width, height);

    for (const particle of particles) {
      const age = elapsed - particle.delay;
      if (age < 0) continue;
      const x = particle.x + particle.vx * (1 - Math.exp(-1.3 * age)) / 1.3
        + Math.sin(age * 3 + particle.phase) * age * 8;
      const y = particle.y + particle.vy * age + 125 * age * age;
      if (y > height + 20) continue;

      context.save();
      context.translate(x, y);
      context.rotate(particle.rotation + age * particle.spin);
      context.scale(1, 0.35 + Math.abs(Math.cos(age * 6 + particle.phase)) * 0.65);
      context.globalAlpha = Math.min(1, age * 12) * Math.max(0, 1 - Math.max(0, age - 2.6) / 1.3);
      context.fillStyle = particle.color;
      if (particle.round) {
        context.beginPath();
        context.ellipse(0, 0, particle.size * 0.45, particle.size * 0.65, 0, 0, Math.PI * 2);
        context.fill();
      } else {
        context.fillRect(-particle.size / 2, -particle.size / 3, particle.size, particle.size * 0.65);
      }
      context.restore();
    }
    frame = requestAnimationFrame(draw);
  }

  reducedMotion.addEventListener('change', stop);
  document.addEventListener('visibilitychange', stop);
  window.addEventListener('pagehide', stop);
  window.addEventListener('resize', stop);
  frame = requestAnimationFrame(draw);
}
