// Two celebratory bursts. No external library or persistent animation.
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
  const colors = ['#5f88b4', '#91b8d8', '#d393a3', '#c6a052', '#e6c877'];
  const count = width < 540 ? 170 : 230;
  const launchHeight = Math.min(height * 0.78, 650);
  const random = (min, max) => min + Math.random() * (max - min);
  const particles = Array.from({ length: count }, (_, index) => {
    const fromLeft = index % 2 === 0;
    return {
      x: fromLeft ? paper.left + 8 : paper.right - 8,
      y: launchHeight,
      vx: (fromLeft ? 1 : -1) * random(spread * 0.65, spread * 1.65),
      vy: -random(launchHeight * 1.05, launchHeight * 1.35),
      delay: random(0, 0.06) + (index < count * 0.6 ? 0 : 0.42),
      size: random(5, 11),
      rotation: random(0, Math.PI * 2),
      spin: random(-11, 11),
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
    // A quick opening volley, followed by another burst 420 ms later.
    const elapsed = (timestamp - startedAt - 250) / 1000;
    if (elapsed >= 5.4) { stop(); return; }
    context.clearRect(0, 0, width, height);

    for (const particle of particles) {
      const age = elapsed - particle.delay;
      if (age < 0) continue;
      const x = particle.x + particle.vx * (1 - Math.exp(-1.1 * age)) / 1.1
        + Math.sin(age * 3 + particle.phase) * age * 8;
      const y = particle.y + particle.vy * age + 225 * age * age;
      if (y > height + 20) continue;

      context.save();
      context.translate(x, y);
      context.rotate(particle.rotation + age * particle.spin);
      context.scale(1, 0.35 + Math.abs(Math.cos(age * 6 + particle.phase)) * 0.65);
      context.globalAlpha = Math.min(1, age * 30) * Math.max(0, 1 - Math.max(0, age - 3.2) / 1.5);
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
