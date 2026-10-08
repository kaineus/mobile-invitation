// One generous, energetic burst. No external library or persistent animation.
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
  const colors = ['#5f88b4', '#91b8d8', '#d393a3', '#c6a052', '#e6c877'];
  const count = width < 540 ? 310 : 420;
  const launchHeight = Math.min(height * 0.78, 650);
  const random = (min, max) => min + Math.random() * (max - min);
  const gaussian = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(Math.random() * Math.PI * 2);
  const particles = Array.from({ length: count }, (_, index) => {
    const fromLeft = index % 2 === 0;
    // Sample a launch cone, not independent x/y ranges with a rectangular edge.
    // Bell-shaped angles and varied speeds create a dense core with stray pieces.
    const angle = (fromLeft ? 1 : -1) * 0.42 + gaussian() * 0.4;
    const speed = launchHeight * 1.5 * Math.exp(gaussian() * 0.2);
    return {
      x: (fromLeft ? paper.left + 8 : paper.right - 8) + gaussian() * 7,
      y: launchHeight + gaussian() * 9,
      vx: Math.sin(angle) * speed,
      vy: -Math.cos(angle) * speed,
      drag: random(0.9, 1.9),
      gravity: random(225, 325),
      flutter: random(6, 20),
      frequency: random(2.5, 6),
      size: random(5, 12),
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
    // Launch every piece together so this reads as one emphatic pop.
    const elapsed = (timestamp - startedAt - 250) / 1000;
    if (elapsed >= 6.5) { stop(); return; }
    context.clearRect(0, 0, width, height);

    for (const particle of particles) {
      if (elapsed < 0) continue;
      // Slow the climb without flattening the launch arc. Resume normal speed
      // smoothly after each piece reaches its own peak.
      const ascentRate = 0.7;
      const peakAt = Math.max(0, -particle.vy / (2 * particle.gravity)) / ascentRate;
      const fallingFor = Math.max(0, elapsed - peakAt);
      const age = elapsed * ascentRate + (1 - ascentRate)
        * (fallingFor - 0.3 * (1 - Math.exp(-fallingFor / 0.3)));
      const flutter = (Math.sin(age * particle.frequency + particle.phase) - Math.sin(particle.phase))
        * Math.min(age, 1) * particle.flutter;
      const x = particle.x + particle.vx * (1 - Math.exp(-particle.drag * age)) / particle.drag + flutter;
      const y = particle.y + particle.vy * age + particle.gravity * age * age + flutter * 0.35;
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
