/* ==========================================================================
   SMARTCAMP-K12 — Breadcrumbs
   JS: Safe breadcrumb generation for module pages.
   ========================================================================== */

(function() {
  'use strict';

  // ── Initialize ───────────────────────────────────────────────────────────
  // Breadcrumbs are server-rendered in Warehouse.php. We only fall back to
  // the JS generator if the server emitted an explicit empty placeholder
  // (the [data-bc="auto"] attribute), so this never duplicates server
  // output.
  document.addEventListener('DOMContentLoaded', function() {
    var bc = document.querySelector('.breadcrumbs');
    if (bc && bc.getAttribute('data-bc') === 'auto') {
      generateBreadcrumbs();
    }
  });

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
  // Page transitions and button effects were intentionally removed: the
  // CSS overlay in smartcamp-2030.css owns those concerns. Inline-style
  // JS pin (scale on press, fade-in on load) competed with CSS and made
  // future style changes invisible to the developer.
  document.addEventListener('DOMContentLoaded', function() {
    var bc = document.querySelector('.breadcrumbs');
    if (bc && bc.getAttribute('data-bc') === 'auto') {
      generateBreadcrumbs();
    }
  });

})();
