<?php
/**
 * CommandDeck live-stats endpoint.
 * Returns JSON counts for the CommandDeck ops console (served at /commanddeck/).
 * Reads the same config.inc.php as the main app; no secrets are hardcoded.
 */

header( 'Content-Type: application/json; charset=utf-8' );
header( 'Cache-Control: no-store, no-cache, must-revalidate' );
header( 'Access-Control-Allow-Origin: *' );

require_once __DIR__ . '/config.inc.php';

$host = $DatabaseServer;
$port = $DatabasePort ? $DatabasePort : '6543';
$user = $DatabaseUsername;
$pass = $DatabasePassword;
$db   = $DatabaseName ? $DatabaseName : ( getenv( 'DB_DATABASE' ) ? getenv( 'DB_DATABASE' ) : 'postgres' );

$conn = @pg_connect( "host={$host} port={$port} dbname={$db} user={$user} password={$pass} sslmode=require connect_timeout=5" );

if ( ! $conn )
{
	http_response_code( 500 );
	echo json_encode( [ 'error' => 'db-connect' ] );
	exit;
}

// search_path is set to kerrfairtex,public via PGOPTIONS at container start.

function cd_count( $conn, $table )
{
	$r = @pg_query( $conn, "SELECT count(*) FROM {$table}" );

	return ( $r && pg_num_rows( $r ) ) ? (int) pg_fetch_result( $r, 0, 0 ) : 0;
}

$title = '';
$r = @pg_query( $conn, 'SELECT title FROM schools ORDER BY id LIMIT 1' );

if ( $r && pg_num_rows( $r ) )
{
	$title = (string) pg_fetch_result( $r, 0, 0 );
}

if ( $title === '' )
{
	$title = 'KerrFairtex Student Information System';
}

echo json_encode( [
	'title'      => $title,
	'schools'    => cd_count( $conn, 'schools' ),
	'students'   => cd_count( $conn, 'students' ),
	'staff'      => cd_count( $conn, 'staff' ),
	'courses'    => cd_count( $conn, 'courses' ),
	'grades'     => cd_count( $conn, 'gradebook_grades' ),
	'attendance' => cd_count( $conn, 'attendance_completed' ),
	'activities' => cd_count( $conn, 'eligibility_activities' ),
	'discipline' => cd_count( $conn, 'discipline_referrals' ),
	'accounting' => cd_count( $conn, 'accounting_incomes' ),
	'billing'    => cd_count( $conn, 'billing_fees' ),
	'food'       => cd_count( $conn, 'food_service_menus' ),
	'resources'  => cd_count( $conn, 'resources' ),
] );
