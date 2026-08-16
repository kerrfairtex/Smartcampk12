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

# Render routes traffic to $PORT (default 10000 for Docker web services).
# Bind Apache to it deterministically instead of relying on sed matches.
PORT="${PORT:-10000}"

printf 'Listen %s\n' "$PORT" > /etc/apache2/ports.conf

cat > /etc/apache2/sites-available/000-default.conf <<CONF
<VirtualHost *:${PORT}>
    DocumentRoot /var/www/html
    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
CONF

# Use the dedicated kerrfairtex schema (public is shared with another app)
export PGOPTIONS='-c search_path=kerrfairtex,public'

exec apache2-foreground
