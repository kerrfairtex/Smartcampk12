/* ==========================================================================
   SMARTCAMP-K12 — UI Hardening
   JS: Safe breadcrumb generation, safe KPI animation, safe sparkline.
   ========================================================================== */

(function() {
  'use strict';

  // ── Count-Up Animation ───────────────────────────────────────────────────
  // Animates a target number from 0 → target via easeOutQuart over `duration`.
  // Currently used by .kpi-card[data-count] (Dashboard). Safe: writes only
  // textContent on the .kpi-value element.
  function animateCountUp(el, target, duration) {
    target = parseInt(target, 10) || 0;
    duration = duration || 800;
    var startTime = null;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current = Math.round(target * easeOutQuart(progress));
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  // ── Sparkline (safe DOM construction) ───────────────────────────────────
  // The previous implementation wrote the SVG via innerHTML. We now build the
  // SVG using the DOM API so no user-controlled value ever reaches
  // innerHTML. Note: PHP currently emits data-count="0" (Dashboard.php
  // line 107) so the count-up is a no-op; the sparkline provides visual
  // rhythm but its data is decorative, not a real metric.
  function buildSparkline(data, width, height, color) {
    if (!data || data.length < 2) return null;
    var max = Math.max.apply(null, data);
    var min = Math.min.apply(null, data);
    var range = max - min || 1;

    var points = data.map(function(val, i) {
      var x = (i / (data.length - 1)) * width;
      var y = height - ((val - min) / range) * height;
      return [x, y];
    });

    var pathD = points.map(function(p, i) {
      return (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1);
    }).join(' ');

    var lastX = points[points.length - 1][0].toFixed(1);
    var areaD = pathD + ' L' + lastX + ',' + height + ' L0,' + height + ' Z';

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'sparkline');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

    var defs = document.createElementNS(svgNS, 'defs');
    var grad = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id', 'spark-gradient-' + Math.random().toString(36).slice(2, 8));
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
    var stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%'); stop1.setAttribute('stop-color', color);
    stop1.setAttribute('stop-opacity', '0.3');
    var stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '100%'); stop2.setAttribute('stop-color', color);
    stop2.setAttribute('stop-opacity', '0');
    grad.appendChild(stop1); grad.appendChild(stop2);
    defs.appendChild(grad);
    svg.appendChild(defs);

    var area = document.createElementNS(svgNS, 'path');
    area.setAttribute('class', 'sparkline-fill');
    area.setAttribute('d', areaD);
    svg.appendChild(area);

    var line = document.createElementNS(svgNS, 'path');
    line.setAttribute('d', pathD);
    svg.appendChild(line);

    return svg;
  }

  // Deterministic pseudo-random data from a string seed (so the sparkline
  // is stable across page loads for the same card label).
  function seedFromString(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function makeSparklineData(seed) {
    var count = 12;
    var data = [];
    // Mulberry32 PRNG seeded from the card label — same label → same data
    // every load, so the dashboard doesn't "shimmer" between page views.
    var s = seed >>> 0;
    function rand() {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    var val = 30 + (seed % 40);
    for (var i = 0; i < count; i++) {
      val += (rand() - 0.5) * 20;
      val = Math.max(5, Math.min(95, val));
      data.push(Math.round(val));
    }
    return data;
  }

  function initKPICards() {
    var cards = document.querySelectorAll('.kpi-card[data-count]');
    cards.forEach(function(card, index) {
      var target = card.getAttribute('data-count');
      var el = card.querySelector('.kpi-value');
      if (el) {
        setTimeout(function() {
          animateCountUp(el, target);
        }, index * 150);
      }

      var sparklineEl = card.querySelector('.sparkline-container');
      if (sparklineEl) {
        var label = card.getAttribute('data-label') || 'default';
        var color = card.getAttribute('data-color') || '#00C8FF';
        var seed = seedFromString(label);
        var sparkData = makeSparklineData(seed);
        var svg = buildSparkline(sparkData, 80, 32, color);
        if (svg) {
          // Clear any existing children before appending.
          while (sparklineEl.firstChild) sparklineEl.removeChild(sparklineEl.firstChild);
          sparklineEl.appendChild(svg);
        }
      }
    });
  }

  // ── Dynamic Breadcrumb Generation ────────────────────────────────────────
  // Builds crumbs via safe DOM APIs (textContent / setAttribute) — no
  // string concatenation of user-controlled values into innerHTML.
  // SmartCamp-K12: professional-grade hardening.
  function generateBreadcrumbs() {
    var search = window.location.search;
    var container = document.querySelector('.breadcrumbs');
    if (!container) return;

    // Map module names to labels
    var moduleLabels = {
      'School_Setup': 'School Setup',
      'Students': 'Students',
      'Users': 'Users',
      'Scheduling': 'Scheduling',
      'Grades': 'Grades',
      'Attendance': 'Attendance',
      'Discipline': 'Discipline',
      'Accounting': 'Accounting',
      'Student_Billing': 'Student Billing',
      'Food_Service': 'Food Service',
      'Resources': 'Resources',
      'Custom': 'Custom',
      'misc': 'Miscellaneous'
    };

    var crumbs = [];
    crumbs.push({ label: 'Home', url: 'Modules.php?modname=misc/Portal.php' });

    // Parse modname from URL — restrict to safe characters first.
    var modnameMatch = search.match(/[?&]modname=([A-Za-z0-9_\-\.\/]+)/);
    if (modnameMatch) {
      var parts = modnameMatch[1].split('/');
      var moduleName = parts[0];
      var programName = parts[1];

      if (moduleLabels[moduleName]) {
        crumbs.push({
          label: moduleLabels[moduleName],
          url: 'Modules.php?modname=' + moduleName + '/' + getModuleDefault(moduleName)
        });
      }

      if (programName) {
        var programLabel = programName
          .replace(/\.php$/, '')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        crumbs.push({ label: programLabel, url: null });
      }
    }

    // Render breadcrumbs using safe DOM construction.
    while (container.firstChild) container.removeChild(container.firstChild);
    crumbs.forEach(function(crumb, i) {
      if (i > 0) {
        var sep = document.createElement('span');
        sep.className = 'separator';
        sep.textContent = '/';
        container.appendChild(sep);
      }
      if (crumb.url) {
        var a = document.createElement('a');
        a.setAttribute('href', crumb.url);
        a.textContent = crumb.label;
        container.appendChild(a);
      } else {
        var span = document.createElement('span');
        span.className = 'current';
        span.textContent = crumb.label;
        container.appendChild(span);
      }
    });
  }

  // ── Module Default Programs (fallback) ──────────────────────────────────
  function getModuleDefault(moduleName) {
    var defaults = {
      'School_Setup': 'School_Setup/Calendar.php',
      'Students': 'Students/Student.php',
      'Users': 'Users/User.php',
      'Scheduling': 'Scheduling/Schedule.php',
      'Grades': 'Grades/ReportCard.php',
      'Attendance': 'Attendance/Attendance.php',
      'Discipline': 'Discipline/Referral.php',
      'Accounting': 'Accounting/Expenses.php',
      'Student_Billing': 'Student_Billing/StudentFees.php',
      'Food_Service': 'Food_Service/Menu.php',
      'Resources': 'Resources/Resource.php',
      'Custom': 'Custom/Notifications.php',
      'misc': 'misc/Portal.php'
    };
    return defaults[moduleName] || moduleName + '/';
  }

  // ── Initialize ───────────────────────────────────────────────────────────
  // Breadcrumbs are server-rendered in Warehouse.php. We only fall back to
  // the JS generator if the server emitted an explicit empty placeholder
  // (the [data-bc="auto"] attribute), so this never duplicates server
  // output.
  //
  // KPI cards: emitted by classes/KerrFairtex/Functions/Dashboard.php
  // (data-count="0" today, but the count-up animation + sparkline are
  // harmless and provide visual continuity).
  document.addEventListener('DOMContentLoaded', function() {
    initKPICards();

    var bc = document.querySelector('.breadcrumbs');
    if (bc && bc.getAttribute('data-bc') === 'auto') {
      generateBreadcrumbs();
    }
  });

})();
