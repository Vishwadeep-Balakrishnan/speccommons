/* ========================================
   Speculative Commons — Background Animation
   Drifting signal points evoking hidden
   opportunity discovery and probabilistic search.
   ======================================== */

(function () {
  'use strict';

  /* Respect reduced motion preference */
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) return;

  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var particles = [];
  var PARTICLE_COUNT = 60;
  var CONNECTION_DIST = 120;
  var rafId;

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.18,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.35 + 0.08
    };
  }

  function init() {
    particles = [];
    var count = window.innerWidth < 600 ? Math.floor(PARTICLE_COUNT * 0.5) : PARTICLE_COUNT;
    for (var i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    var w = window.innerWidth;
    var h = window.innerHeight;

    /* Draw connections */
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          var alpha = (1 - dist / CONNECTION_DIST) * 0.07;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(100, 110, 95, ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    /* Draw particles */
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 110, 95, ' + p.opacity + ')';
      ctx.fill();
    }

    /* Update positions */
    for (var m = 0; m < particles.length; m++) {
      var pt = particles[m];
      pt.x += pt.vx;
      pt.y += pt.vy;

      /* Wrap around edges with padding */
      if (pt.x < -10) pt.x = w + 10;
      if (pt.x > w + 10) pt.x = -10;
      if (pt.y < -10) pt.y = h + 10;
      if (pt.y > h + 10) pt.y = -10;
    }

    rafId = requestAnimationFrame(draw);
  }

  /* Debounced resize */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      init();
    }, 200);
  });

  /* Stop animation when tab is hidden */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(draw);
    }
  });

  /* Handle runtime reduced-motion changes */
  motionQuery.addEventListener('change', function (e) {
    if (e.matches) {
      cancelAnimationFrame(rafId);
      canvas.style.display = 'none';
    } else {
      canvas.style.display = '';
      resize();
      init();
      draw();
    }
  });

  resize();
  init();
  draw();
})();
