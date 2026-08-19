<?php
/**
 * SmartCamp KPI Dashboard Cards
 * Generates KPI cards with real database data for count-up animation
 *
 * Called from misc/Portal.php for admin users
 */

function SmartCamp_KPICards() {
    if (User('PROFILE') !== 'admin') return '';

    $cards = [];

    // ── School Setup: Login Records (last 24h) ────────────────────────────
    $start_date = date('Y-m-d', time() - 60 * 60 * 24);
    $access_log_RET = DBGet("SELECT
        COUNT(USERNAME) AS LOGIN_RECORDS,
        SUM(CASE WHEN PROFILE='admin' THEN 1 END) AS LOGIN_ADMIN,
        SUM(CASE WHEN PROFILE='teacher' THEN 1 END) AS LOGIN_TEACHER,
        SUM(CASE WHEN PROFILE='parent' THEN 1 END) AS LOGIN_PARENT,
        SUM(CASE WHEN PROFILE='student' THEN 1 END) AS LOGIN_STUDENT,
        SUM(CASE WHEN STATUS IS NULL OR STATUS='B' THEN 1 END) AS LOGIN_FAIL
        FROM access_log
        WHERE CREATED_AT >='" . $start_date . "'
        AND CREATED_AT <='" . DBDate() . " 23:59:59'");

    $login_records = (int) ($access_log_RET[1]['LOGIN_RECORDS'] ?? 0);
    $login_fail = (int) ($access_log_RET[1]['LOGIN_FAIL'] ?? 0);

    if ($login_records > 0) {
        $cards[] = [
            'label' => 'Login Records',
            'value' => $login_records,
            'icon' => 'activity',
            'color' => '#A855F7',
            'accent' => 'violet',
            'change' => $login_fail > 0 ? ['type' => 'negative', 'text' => $login_fail . ' failed'] : null,
            'live' => true,
        ];
    }

    // ── Students: Active Count ─────────────────────────────────────────────
    $students_nb = DBGetOne("SELECT COUNT(DISTINCT se.STUDENT_ID)
        FROM student_enrollment se
        WHERE se.SYEAR='" . UserSyear() . "'
        AND se.SCHOOL_ID='" . UserSchool() . "'
        AND (CURRENT_DATE>=se.START_DATE
            AND (se.END_DATE IS NULL OR CURRENT_DATE<=se.END_DATE))");

    $students_nb = (int) $students_nb;

    if ($students_nb > 0) {
        $inactive_students = (int) DBGetOne("SELECT COUNT(DISTINCT se.STUDENT_ID)
            FROM student_enrollment se
            WHERE se.SYEAR='" . UserSyear() . "'
            AND se.SCHOOL_ID='" . UserSchool() . "'
            AND (CURRENT_DATE<se.START_DATE OR CURRENT_DATE>se.END_DATE)");

        $cards[] = [
            'label' => 'Active Students',
            'value' => $students_nb,
            'icon' => 'users',
            'color' => '#00C8FF',
            'accent' => 'cyan',
            'change' => $inactive_students > 0 ? ['type' => 'neutral', 'text' => $inactive_students . ' inactive'] : null,
            'live' => false,
        ];
    }

    // ── Users: Total Count ─────────────────────────────────────────────────
    $users_nb = DBGetOne("SELECT COUNT(STAFF_ID)
        FROM staff
        WHERE SYEAR='" . UserSyear() . "'
        AND (SCHOOLS IS NULL OR position('," . UserSchool() . ",' IN SCHOOLS)>0)");

    $users_nb = (int) $users_nb;

    if ($users_nb > 0) {
        $teachers_nb = (int) DBGetOne("SELECT COUNT(STAFF_ID)
            FROM staff
            WHERE SYEAR='" . UserSyear() . "'
            AND PROFILE='teacher'
            AND (SCHOOLS IS NULL OR position('," . UserSchool() . ",' IN SCHOOLS)>0)");

        $cards[] = [
            'label' => 'Staff Members',
            'value' => $users_nb,
            'icon' => 'user-check',
            'color' => '#22C55E',
            'accent' => 'green',
            'change' => $teachers_nb > 0 ? ['type' => 'neutral', 'text' => $teachers_nb . ' teachers'] : null,
            'live' => false,
        ];
    }

    // ── Scheduling: Courses Count ──────────────────────────────────────────
    $courses_nb = DBGetOne("SELECT COUNT(c.COURSE_ID)
        FROM courses c
        WHERE c.SYEAR='" . UserSyear() . "'
        AND c.SCHOOL_ID='" . UserSchool() . "'");

    $courses_nb = (int) $courses_nb;

    if ($courses_nb > 0) {
        $cp_nb = (int) DBGetOne("SELECT COUNT(cp.COURSE_PERIOD_ID)
            FROM course_periods cp
            WHERE cp.SYEAR='" . UserSyear() . "'
            AND cp.SCHOOL_ID='" . UserSchool() . "'");

        $cards[] = [
            'label' => 'Active Courses',
            'value' => $courses_nb,
            'icon' => 'calendar',
            'color' => '#F59E0B',
            'accent' => 'amber',
            'change' => $cp_nb > 0 ? ['type' => 'neutral', 'text' => $cp_nb . ' periods'] : null,
            'live' => false,
        ];
    }

    // ── Attendance: Today's Present ────────────────────────────────────────
    $attendance_today = DBGetOne("SELECT COUNT(*)
        FROM attendance_day ad
        JOIN course_periods cp ON cp.COURSE_PERIOD_ID=ad.COURSE_PERIOD_ID
        WHERE ad.SCHOOL_DATE=CURRENT_DATE
        AND ad.SYEAR='" . UserSyear() . "'
        AND cp.SCHOOL_ID='" . UserSchool() . "'
        AND ad.STATE_VALUE='1'");

    $attendance_today = (int) $attendance_today;

    if ($attendance_today > 0) {
        $cards[] = [
            'label' => 'Present Today',
            'value' => $attendance_today,
            'icon' => 'check-circle',
            'color' => '#14B8A6',
            'accent' => 'teal',
            'change' => null,
            'live' => true,
        ];
    }

    // ── Render Cards ───────────────────────────────────────────────────────
    if (empty($cards)) return '';

    $html = '<div class="kpi-grid">';

    foreach ($cards as $card) {
        $live_dot = !empty($card['live']) ? '<span class="pulse-dot" style="margin-right:6px"></span>' : '';
        $change_html = !empty($card['change'])
            ? '<span class="kpi-change ' . $card['change']['type'] . '">' . $card['change']['text'] . '</span>'
            : '';

        $html .= '<div class="kpi-card accent-' . $card['accent'] . '" data-count="' . $card['value'] . '" data-label="' . $card['label'] . '" data-color="' . $card['color'] . '">' .
            '<div class="kpi-card-header">' .
                '<div class="kpi-card-icon">' . SmartCamp_IconSvg($card['icon'], $card['color']) . '</div>' .
                '<div class="sparkline-container"></div>' .
            '</div>' .
            '<div class="kpi-value">0</div>' .
            '<div class="kpi-label">' . $live_dot . $card['label'] . '</div>' .
            $change_html .
            '</div>';
    }

    $html .= '</div>';

    return $html;
}

/**
 * SVG Icons for KPI cards
 */
function SmartCamp_IconSvg($name, $color) {
    $icons = [
        'activity' => '<svg viewBox="0 0 24 24" fill="none" stroke="' . $color . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
        'users' => '<svg viewBox="0 0 24 24" fill="none" stroke="' . $color . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        'user-check' => '<svg viewBox="0 0 24 24" fill="none" stroke="' . $color . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><polyline points="9 14 11 16 15 12"/></svg>',
        'calendar' => '<svg viewBox="0 0 24 24" fill="none" stroke="' . $color . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        'check-circle' => '<svg viewBox="0 0 24 24" fill="none" stroke="' . $color . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    ];

    return $icons[$name] ?? '';
}
