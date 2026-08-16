#!/bin/sh
set -e

# Generate config.inc.php from container environment (reads env at runtime —
# no secret is ever baked into this file or the image).
cat > /var/www/html/config.inc.php <<'PHP'
<?php
$DatabaseType = 'postgresql';
$DatabaseServer = getenv( 'DB_HOST' );
$DatabasePort = getenv( 'DB_PORT' ) ? getenv( 'DB_PORT' ) : '6543';
$DatabaseUsername = getenv( 'DB_USERNAME' );
$DatabasePassword = getenv( 'DB_PASSWORD' );
$DatabaseName = getenv( 'DB_NAME' );
$wkhtmltopdfPath = '';
$DefaultSyear = getenv( 'DEFAULT_SYEAR' ) ? getenv( 'DEFAULT_SYEAR' ) : '2026';
$RosarioNotifyAddress = '';
$RosarioErrorsAddress = '';
$RosarioLocales = [ 'en_US.utf8' ];
PHP

# Writable upload directories + ownership for Apache
mkdir -p /var/www/html/assets/Fileuploads /var/www/html/assets/Uploads
chown -R www-data:www-data /var/www/html

# Bind Apache to Render's $PORT
PORT="${PORT:-80}"
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/\*:80/\*:${PORT}/g" /etc/apache2/sites-available/000-default.conf

exec apache2-foreground
