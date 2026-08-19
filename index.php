<?php
/**
 * SmartCampus K12 / KerrFairtex Clean Dashboard UI
 * Replaced with smartcamk12.html layout template.
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SmartCampus K12 — Admin Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:wght@500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#16233F;
    --ink-2:#22335A;
    --gold:#C98A2C;
    --gold-light:#F3E4C6;
    --page:#F2F4F8;
    --card:#FFFFFF;
    --border:#E2E5EC;
    --text:#1B2333;
    --text-2:#63697A;
    --text-3:#9498A6;
    --green:#2F8F5B;
    --green-light:#E4F3EA;
    --coral:#D1573F;
    --coral-light:#FBE7E2;
    --blue:#3D6FD1;
    --blue-light:#E7EDFB;
    --sans:'Inter',-apple-system,'Segoe UI',sans-serif;
    --serif:'Lora',Georgia,serif;
    --radius:10px;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;}
  body{font-family:var(--sans);background:var(--page);color:var(--text);font-size:13.5px;}
  .shell{display:flex;flex-direction:column;height:100vh;}

  /* Top bar */
  .topbar{height:56px;flex-shrink:0;background:var(--ink);display:flex;align-items:center;padding:0 20px;gap:20px;color:#fff;}
  .brand{display:flex;align-items:center;gap:9px;font-family:var(--serif);font-size:17px;font-weight:600;letter-spacing:.2px;}
  .brand .mark{width:26px;height:26px;border-radius:6px;background:var(--gold);display:flex;align-items:center;justify-content:center;color:var(--ink);font-family:var(--sans);font-weight:600;font-size:13px;}
  .topbar .selectors{display:flex;gap:8px;margin-left:8px;}
  .pill-select{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);color:#fff;font-size:12px;padding:6px 10px;border-radius:7px;display:flex;align-items:center;gap:6px;cursor:pointer;}
  .pill-select:hover{background:rgba(255,255,255,0.14);}
  .topbar .search{flex:1;max-width:340px;margin-left:auto;position:relative;}
  .topbar .search input{width:100%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);border-radius:7px;padding:7px 10px 7px 32px;color:#fff;font-size:12.5px;font-family:var(--sans);}
  .topbar .search input::placeholder{color:rgba(255,255,255,0.5);}
  .topbar .search svg{position:absolute;left:9px;top:50%;transform:translateY(-50%);width:14px;height:14px;color:rgba(255,255,255,0.5);}
  .icon-btn{width:32px;height:32px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.75);cursor:pointer;position:relative;}
  .icon-btn:hover{background:rgba(255,255,255,0.1);color:#fff;}
  .badge-dot{position:absolute;top:5px;right:5px;width:7px;height:7px;border-radius:50%;background:var(--coral);border:1.5px solid var(--ink);}
  .avatar{width:30px;height:30px;border-radius:50%;background:var(--gold);color:var(--ink);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;font-family:var(--sans);cursor:pointer;}

  /* Body */
  .body{flex:1;display:flex;min-height:0;}

  /* Sidebar */
  .sidebar{width:246px;flex-shrink:0;background:var(--card);border-right:1px solid var(--border);overflow-y:auto;padding:12px 0;}
  .nav-group{border-bottom:1px solid #F0F1F5;}
  .nav-head{display:flex;align-items:center;gap:10px;padding:10px 16px;cursor:pointer;user-select:none;transition:background .12s;position:relative;}
  .nav-head:hover{background:#F7F8FA;}
  .nav-head.open{background:#F7F8FA;}
  .nav-head .stripe{position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:0 2px 2px 0;}
  .nav-head .ic{width:17px;height:17px;color:var(--text-2);flex-shrink:0;}
  .nav-head.open .ic{color:var(--ink);}
  .nav-head span.label{flex:1;font-size:13px;font-weight:500;color:var(--text);}
  .nav-head .chev{width:13px;height:13px;color:var(--text-3);transition:transform .18s;}
  .nav-head.open .chev{transform:rotate(90deg);}
  .submenu{max-height:0;overflow:hidden;transition:max-height .22s ease;}
  .submenu.open{max-height:600px;}
  .submenu a{display:block;padding:7px 16px 7px 44px;font-size:12.5px;color:var(--text-2);text-decoration:none;border-left:2px solid transparent;transition:background .12s,color .12s;}
  .submenu a:hover{background:#F7F8FA;color:var(--text);}
  .submenu a.active{color:var(--ink);font-weight:600;background:var(--gold-light);border-left:2px solid var(--gold);}

  /* Main */
  .main{flex:1;overflow-y:auto;padding:24px 28px 40px;}
  .crumb{font-size:11.5px;color:var(--text-3);margin-bottom:6px;}
  h1.page-title{font-family:var(--serif);font-size:23px;font-weight:600;color:var(--ink);margin-bottom:18px;}
  .kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
  .kpi{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;}
  .kpi .label{font-size:11.5px;color:var(--text-2);margin-bottom:8px;}
  .kpi .value{font-size:25px;font-weight:600;font-family:var(--serif);color:var(--ink);}
  .kpi .sub{font-size:11px;color:var(--text-3);margin-top:4px;}
  .kpi .sub.up{color:var(--green);}
  .grid-2{display:grid;grid-template-columns:1.6fr 1fr;gap:16px;}
  .panel{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px;margin-bottom:16px;}
  .panel h2{font-size:13.5px;font-weight:600;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;}
</style>
</head>
<body>
<div class="shell">
  <!-- Top bar -->
  <div class="topbar">
    <div class="brand">
      <div class="mark">SC</div>
      SmartCampus K12
    </div>
    <div class="selectors">
      <div class="pill-select">SYEAR: 2026-2027 ▼</div>
      <div class="pill-select">Batu-Batu National High ▼</div>
    </div>
    <div class="search">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <input type="text" placeholder="Search students, teachers, modules...">
    </div>
    <div class="icon-btn">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
      <div class="badge-dot"></div>
    </div>
    <div class="avatar" title="Administrator">AD</div>
  </div>

  <!-- Body -->
  <div class="body">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="nav-group">
        <div class="nav-head open" onclick="toggleMenu(this)">
          <div class="stripe" style="background:var(--blue);"></div>
          <svg class="ic" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          <span class="label">Students</span>
          <svg class="chev open" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>
        <div class="submenu open">
          <a href="#" class="active">Student Info</a>
          <a href="#">Enrollment</a>
          <a href="#">Attendance</a>
          <a href="#">Report Cards</a>
        </div>
      </div>

      <div class="nav-group">
        <div class="nav-head" onclick="toggleMenu(this)">
          <div class="stripe" style="background:var(--green);"></div>
          <svg class="ic" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          <span class="label">Scheduling</span>
          <svg class="chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>
        <div class="submenu">
          <a href="#">Courses</a>
          <a href="#">Master Schedule</a>
          <a href="#">Calendar</a>
        </div>
      </div>

      <div class="nav-group">
        <div class="nav-head" onclick="toggleMenu(this)">
          <div class="stripe" style="background:var(--coral);"></div>
          <svg class="ic" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          <span class="label">Grades & Reports</span>
          <svg class="chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>
        <div class="submenu">
          <a href="#">Transcripts</a>
          <a href="#">Gradebook</a>
          <a href="#">State Reports</a>
        </div>
      </div>

      <div class="nav-group">
        <div class="nav-head" onclick="toggleMenu(this)">
          <div class="stripe" style="background:var(--gold);"></div>
          <svg class="ic" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span class="label">School Setup</span>
          <svg class="chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>
        <div class="submenu">
          <a href="#">Parameters</a>
          <a href="#">Users</a>
          <a href="#">School Years</a>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main">
      <div class="crumb">SmartCampus K12 / <b>Admin Dashboard</b></div>
      <h1 class="page-title">Batu-Batu National Integrated High School</h1>

      <div class="kpi-row">
        <div class="kpi">
          <div class="label">Total Enrolled Students</div>
          <div class="value">1,428</div>
          <div class="sub up">↑ +4.2% from last term</div>
        </div>
        <div class="kpi">
          <div class="label">Faculty & Staff</div>
          <div class="value">84</div>
          <div class="sub">100% active credentials</div>
        </div>
        <div class="kpi">
          <div class="label">Daily Attendance Rate</div>
          <div class="value">96.8%</div>
          <div class="sub up">↑ Optimal threshold</div>
        </div>
        <div class="kpi">
          <div class="label">Active Courses</div>
          <div class="value">62</div>
          <div class="sub">Grades 7 to 12</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <h2>System Status <span style="font-weight:normal;color:var(--green)">● Operational</span></h2>
          <p style="color:var(--text-2);margin-bottom:12px;font-size:13px;">All database connections, Supabase poolers, and Render application endpoints are synchronized and fully responding.</p>
          <div style="background:var(--page);padding:12px;border-radius:8px;font-size:12px;color:var(--text);">
            <b>Active Theme:</b> smartcamk12.html Clean Layout<br>
            <b>Database Schema:</b> public (SmartCampus K12)<br>
            <b>Deployment URL:</b> <a href="https://smartcampk12.onrender.com" target="_blank">https://smartcampk12.onrender.com</a>
          </div>
        </div>
        <div class="panel">
          <h2>Quick Actions</h2>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <button style="padding:10px;background:var(--ink);color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:500;">+ Enroll New Student</button>
            <button style="padding:10px;background:var(--card);color:var(--ink);border:1px solid var(--border);border-radius:6px;cursor:pointer;font-weight:500;">Generate Monthly Report</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
function toggleMenu(el) {
  el.classList.toggle('open');
  const chev = el.querySelector('.chev');
  if(chev) chev.classList.toggle('open');
  const sub = el.nextElementSibling;
  if(sub) sub.classList.toggle('open');
}
</script>
</body>
</html>
