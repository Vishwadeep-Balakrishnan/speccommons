/* ========================================
   Speculative Commons — Interactive Layer
   Constellation background, scroll reveals,
   project rendering, and pointer-responsive
   atmosphere.
   ======================================== */

(function () {
  'use strict';

  /* ---- Reduced-motion guard ---- */
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var motionAllowed = !motionQuery.matches;

  /* ========================================
     0. Project data — loaded from /data/essays.js
     Essays with status 'archived' are hidden.
     Essays with status 'published' link to
     their essay page at /essays/<slug>.html.
     ======================================== */

  var essays = (window.ESSAYS || []).filter(function (e) {
    return e.status !== 'archived';
  });

  /* ========================================
     1. Render project cards
     ======================================== */

  function renderProjects() {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;

    var fragment = document.createDocumentFragment();

    essays.forEach(function (essay) {
      var isPublished = essay.status === 'published';
      var essayUrl = 'essays/' + encodeURIComponent(essay.slug) + '.html';

      /* Outer element: <a> for published, <article> otherwise */
      var card;
      if (isPublished) {
        card = document.createElement('a');
        card.href = essayUrl;
        card.className = 'project-card project-card--published';
        card.setAttribute('aria-label', 'Read: ' + essay.title);
      } else {
        card = document.createElement('article');
        card.className = 'project-card project-card--' + essay.status;
      }

      /* Cover art */
      var cover = document.createElement('div');
      cover.className = 'project-cover';
      var coverInner = document.createElement('div');
      coverInner.className = 'project-cover-inner';
      coverInner.style.setProperty('--cover-from', essay.coverFrom);
      coverInner.style.setProperty('--cover-to', essay.coverTo);

      if (essay.coverImage) {
        var img = document.createElement('img');
        img.src = essay.coverImage;
        img.alt = '';
        img.loading = 'lazy';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        coverInner.appendChild(img);
      }

      cover.appendChild(coverInner);
      card.appendChild(cover);

      /* Card body */
      var body = document.createElement('div');
      body.className = 'project-body';

      /* Meta (tag + year) */
      var meta = document.createElement('div');
      meta.className = 'project-meta';
      if (essay.tag) {
        var tag = document.createElement('span');
        tag.className = 'project-tag';
        tag.textContent = essay.tag;
        meta.appendChild(tag);
      }
      if (essay.year) {
        var year = document.createElement('span');
        year.className = 'project-year';
        year.textContent = essay.year;
        meta.appendChild(year);
      }
      body.appendChild(meta);

      /* Title */
      var title = document.createElement('h3');
      title.className = 'project-title';
      title.textContent = essay.title;
      body.appendChild(title);

      /* Description */
      var desc = document.createElement('p');
      desc.className = 'project-desc';
      desc.textContent = essay.description;
      body.appendChild(desc);

      /* Link label or status badge */
      if (isPublished) {
        var linkLabel = document.createElement('span');
        linkLabel.className = 'project-link';
        linkLabel.textContent = 'Read essay';
        body.appendChild(linkLabel);
      } else {
        var statusLabel = essay.status === 'in-progress' ? 'In progress' : 'Forthcoming';
        var status = document.createElement('span');
        status.className = 'project-status';
        status.textContent = statusLabel;
        body.appendChild(status);
      }

      card.appendChild(body);
      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }

  renderProjects();

  /* ========================================
     2. Scroll-reveal (IntersectionObserver)
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
     3. Smooth-scroll navigation
     ======================================== */

  document.querySelectorAll('.nav-item[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: motionAllowed ? 'smooth' : 'auto', block: 'start' });
        /* Update URL without jumping */
        history.pushState(null, '', targetId);
      }
    });
  });

  /* ========================================
     4. Background constellation animation
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
