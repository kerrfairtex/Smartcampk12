/* ==========================================================================
   SMARTCAMP-2030 — KPI Dashboard & Breadcrumbs
   JS: Count-up animation, sparklines, breadcrumb dynamic generation
   ========================================================================== */

(function() {
  'use strict';

  // ── Count-Up Animation ───────────────────────────────────────────────────
  function animateCountUp(el, target, duration) {
    target = parseInt(target, 10) || 0;
    duration = duration || 800;
    var start = 0;
    var startTime = null;
    var isFloat = (target % 1 !== 0);

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current = Math.round(start + (target - start) * easeOutQuart(progress));
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  // ── Sparkline Generator ──────────────────────────────────────────────────
  function generateSparkline(data, width, height, color) {
    if (!data || data.length < 2) return '';
    var max = Math.max.apply(null, data);
    var min = Math.min.apply(null, data);
    var range = max - min || 1;
    var points = [];

    data.forEach(function(val, i) {
      var x = (i / (data.length - 1)) * width;
      var y = height - ((val - min) / range) * height;
      points.push(x.toFixed(1) + ',' + y.toFixed(1));
    });

    var pathD = 'M' + points.join(' L ');
    var areaD = pathD + ' L' + width + ',' + height + ' L0,' + height + ' Z';

    return '<svg class="sparkline" viewBox="0 0 ' + width + ' ' + height + '">' +
      '<defs><linearGradient id="spark-gradient" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' + color + '" stop-opacity="0.3"/>' +
      '<stop offset="100%" stop-color="' + color + '" stop-opacity="0"/>' +
      '</linearGradient></defs>' +
      '<path class="sparkline-fill" d="' + areaD + '"/>' +
      '<path d="' + pathD + '"/>' +
      '</svg>';
  }

  // ── Pseudo-random sparkline data from seed (card label) ──────────────────
  function seedFromString(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function generateSparklineData(seed, count) {
    count = count || 12;
    var data = [];
    var val = 30 + (seed % 40);
    for (var i = 0; i < count; i++) {
      val += (Math.random() - 0.5) * 20;
      val = Math.max(5, Math.min(95, val));
      data.push(Math.round(val));
    }
    return data;
  }

  // ── Initialize KPI Cards ─────────────────────────────────────────────────
  function initKPICards() {
    var cards = document.querySelectorAll('.kpi-card[data-count]');
    cards.forEach(function(card, index) {
      var target = card.getAttribute('data-count');
      var el = card.querySelector('.kpi-value');
      if (el) {
        // Stagger the animation start
        setTimeout(function() {
          animateCountUp(el, target);
        }, index * 150);
      }

      // Generate sparkline
      var sparklineEl = card.querySelector('.sparkline-container');
      if (sparklineEl) {
        var label = card.getAttribute('data-label') || 'default';
        var color = card.getAttribute('data-color') || '#00C8FF';
        var seed = seedFromString(label);
        var sparkData = generateSparklineData(seed);
        sparklineEl.innerHTML = generateSparkline(sparkData, 80, 32, color);
      }
    });
  }

  // ── Dynamic Breadcrumb Generation ────────────────────────────────────────
  function generateBreadcrumbs() {
    var path = window.location.pathname;
    var search = window.location.search;
    var container = document.querySelector('.breadcrumbs');
    if (!container) return;

    var crumbs = [];
    crumbs.push({ label: 'Home', url: 'Modules.php?modname=misc/Portal.php' });

    // Parse modname from URL
    var modnameMatch = search.match(/[?&]modname=([^&]+)/);
    if (modnameMatch) {
      var modname = decodeURIComponent(modnameMatch[1]);
      var parts = modname.split('/');
      if (parts.length >= 1) {
        var moduleName = parts[0];
        var programName = parts[1];

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

        if (moduleLabels[moduleName]) {
          crumbs.push({
            label: moduleLabels[moduleName],
            url: 'Modules.php?modname=' + moduleName + '/' + getModuleDefault(moduleName)
          });
        }

        if (programName) {
          // Convert program filename to readable label
          var programLabel = programName
            .replace('.php', '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, function(c) { return c.toUpperCase(); });
          crumbs.push({ label: programLabel, url: null });
        }
      }
    }

    // Render breadcrumbs
    var html = '';
    crumbs.forEach(function(crumb, i) {
      if (i > 0) {
        html += '<span class="separator">/</span>';
      }
      if (crumb.url) {
        html += '<a href="' + crumb.url + '">' + crumb.label + '</a>';
      } else {
        html += '<span class="current">' + crumb.label + '</span>';
      }
    });

    container.innerHTML = html;
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

  // ── Page Transition ──────────────────────────────────────────────────────
  function initPageTransitions() {
    var body = document.getElementById('body');
    if (!body) return;

    // Soft fade-in on load
    body.style.opacity = '0';
    body.style.transform = 'translateY(8px)';
    body.style.transition = 'opacity 350ms ease-out, transform 350ms ease-out';

    requestAnimationFrame(function() {
      body.style.opacity = '1';
      body.style.transform = 'translateY(0)';
    });
  }

  // ── Skeleton Loading State ──────────────────────────────────────────────
  function showSkeletonLoader(container) {
    if (!container) return;
    container.innerHTML = '<div class="skeleton-grid">' +
      '<div class="skeleton skeleton-card"></div>' +
      '<div class="skeleton skeleton-card"></div>' +
      '<div class="skeleton skeleton-card"></div>' +
      '<div class="skeleton skeleton-card"></div>' +
      '</div>';
  }

  // ── Button Press Effect ──────────────────────────────────────────────────
  function initButtonEffects() {
    document.addEventListener('mousedown', function(e) {
      var btn = e.target.closest('button, input[type="submit"], input[type="button"], .button');
      if (btn) {
        btn.style.transform = 'scale(0.97)';
        btn.style.transition = 'transform 100ms ease';
      }
    });

    document.addEventListener('mouseup', function(e) {
      var btn = e.target.closest('button, input[type="submit"], input[type="button"], .button');
      if (btn) {
        btn.style.transform = 'scale(1)';
        btn.style.transition = 'transform 200ms ease';
      }
    });

    document.addEventListener('mouseleave', function(e) {
      var btn = e.target.closest('button, input[type="submit"], input[type="button"], .button');
      if (btn) {
        btn.style.transform = 'scale(1)';
      }
    });
  }

  // ── Initialize ───────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    initKPICards();
    initPageTransitions();
    initButtonEffects();

    // Breadcrumbs are generated server-side; this is a fallback
    if (document.querySelector('.breadcrumbs:empty')) {
      generateBreadcrumbs();
    }
  });

  // Expose for external use
  window.SmartCamp = {
    animateCountUp: animateCountUp,
    generateSparkline: generateSparkline,
    generateBreadcrumbs: generateBreadcrumbs
  };

})();
