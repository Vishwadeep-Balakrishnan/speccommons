/* ========================================
   Speculative Commons — Interactive Layer
   Constellation background, scroll reveals,
   and pointer-responsive atmosphere.
   ======================================== */

(function () {
  'use strict';

  /* ---- Reduced-motion guard ---- */
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var motionAllowed = !motionQuery.matches;

  /* ========================================
     1. Scroll-reveal (IntersectionObserver)
     ======================================== */

  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (motionAllowed) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      reveals.forEach(function (el) { observer.observe(el); });
    } else {
      /* No motion: show everything immediately */
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  initReveal();

  /* ========================================
     2. Background constellation animation
     ======================================== */

  var canvas = document.getElementById('bg-canvas');
  if (!canvas || !motionAllowed) {
    if (canvas && !motionAllowed) canvas.style.display = 'none';
    setupMotionToggle();
    return;
  }

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  var nodes = [];
  var NODE_COUNT = 44;
  var CONNECTION_DIST = 120;
  var POINTER_INFLUENCE = 180;
  var pointer = { x: -1000, y: -1000 };
  var rafId;

  /* Warm muted palette for nodes */
  var palette = [
    { r: 140, g: 132, b: 118 },
    { r: 120, g: 115, b: 100 },
    { r: 155, g: 145, b: 128 },
    { r: 110, g: 120, b: 105 }
  ];

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createNode() {
    var col = palette[Math.floor(Math.random() * palette.length)];
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.08,
      radius: Math.random() * 1.4 + 0.5,
      baseOpacity: Math.random() * 0.2 + 0.06,
      opacity: 0,
      color: col,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.003 + Math.random() * 0.004
    };
  }

  function initNodes() {
    nodes = [];
    var count = window.innerWidth < 600 ? Math.floor(NODE_COUNT * 0.45) : NODE_COUNT;
    for (var i = 0; i < count; i++) {
      nodes.push(createNode());
    }
  }

  var time = 0;

  function draw() {
    time++;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    var w = window.innerWidth;
    var h = window.innerHeight;

    /* Draw connections */
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          var strength = 1 - dist / CONNECTION_DIST;
          var alpha = strength * 0.035;

          /* Brighten connections near pointer */
          var mx = (nodes[i].x + nodes[j].x) * 0.5;
          var my = (nodes[i].y + nodes[j].y) * 0.5;
          var pdx = mx - pointer.x;
          var pdy = my - pointer.y;
          var pDist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pDist < POINTER_INFLUENCE) {
            alpha += (1 - pDist / POINTER_INFLUENCE) * 0.04;
          }

          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = 'rgba(130, 124, 112, ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    /* Draw and update nodes */
    for (var k = 0; k < nodes.length; k++) {
      var n = nodes[k];

      /* Gentle breathing pulse */
      n.phase += n.pulseSpeed;
      n.opacity = n.baseOpacity + Math.sin(n.phase) * 0.06;

      /* Pointer proximity brightening */
      var ndx = n.x - pointer.x;
      var ndy = n.y - pointer.y;
      var nDist = Math.sqrt(ndx * ndx + ndy * ndy);
      if (nDist < POINTER_INFLUENCE) {
        var influence = 1 - nDist / POINTER_INFLUENCE;
        n.opacity += influence * 0.15;
        /* Gentle repulsion from pointer */
        n.vx += (ndx / nDist) * influence * 0.008;
        n.vy += (ndy / nDist) * influence * 0.008;
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + n.color.r + ', ' + n.color.g + ', ' + n.color.b + ', ' + n.opacity + ')';
      ctx.fill();

      /* Update position with damping */
      n.vx *= 0.999;
      n.vy *= 0.999;
      n.x += n.vx;
      n.y += n.vy;

      /* Wrap edges */
      if (n.x < -20) n.x = w + 20;
      if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20;
      if (n.y > h + 20) n.y = -20;
    }

    rafId = requestAnimationFrame(draw);
  }

  /* Pointer tracking (passive, throttled) */
  var pointerFrame = false;
  document.addEventListener('mousemove', function (e) {
    if (!pointerFrame) {
      pointerFrame = true;
      requestAnimationFrame(function () {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointerFrame = false;
      });
    }
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    pointer.x = -1000;
    pointer.y = -1000;
  }, { passive: true });

  /* Debounced resize */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      initNodes();
    }, 200);
  });

  /* Pause when hidden */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(draw);
    }
  });

  /* Runtime motion-preference changes */
  function setupMotionToggle() {
    motionQuery.addEventListener('change', function (e) {
      motionAllowed = !e.matches;
      if (!motionAllowed) {
        cancelAnimationFrame(rafId);
        if (canvas) canvas.style.display = 'none';
        /* Reveal everything immediately */
        document.querySelectorAll('.reveal').forEach(function (el) {
          el.classList.add('is-visible');
        });
      } else {
        if (canvas) {
          canvas.style.display = '';
          resize();
          initNodes();
          draw();
        }
      }
    });
  }

  setupMotionToggle();
  resize();
  initNodes();
  draw();
})();
