<?php
/**
 * Router / Modules wrapper for SmartCampus K12
 */
require_once 'Warehouse.php';

$modname = isset($_REQUEST['modname']) ? $_REQUEST['modname'] : '';

if (empty($modname)) {
    header('Location: index.php');
    exit;
}

// Security: basic path traversal check
$modname = str_replace(['../', '..\\'], '', $modname);
$filepath = 'modules/' . $modname;

if (file_exists($filepath)) {
    $_ROSARIO['page'] = 'modules';
    Warehouse('header');
    include $filepath;
    Warehouse('footer');
} else {
    echo '<div style="padding:40px;font-family:sans-serif;">';
    echo '<h2>Module Not Found</h2>';
    echo '<p>The requested module <code>' . htmlspecialchars($modname) . '</code> could not be found.</p>';
    echo '<a href="index.php" style="color:#3D6FD1;text-decoration:underline;">Return to Dashboard</a>';
    echo '</div>';
}