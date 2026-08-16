FROM php:8.3-apache

# System deps + PHP extensions required by KerrFairtex
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev \
        libzip-dev \
        libicu-dev \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        libonig-dev \
        libcurl4-openssl-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_pgsql \
        pgsql \
        mbstring \
        gettext \
        intl \
        zip \
        gd \
        curl \
        opcache \
    && a2enmod rewrite headers expires \
    && sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# PHP tuning
RUN { \
        echo 'memory_limit=256M'; \
        echo 'upload_max_filesize=20M'; \
        echo 'post_max_size=24M'; \
        echo 'date.timezone=Asia/Manila'; \
    } > /usr/local/etc/php/conf.d/kerrfairtex.ini

# Application code
COPY . /var/www/html/

# Serve the built CommandDeck React console at /commanddeck/ (strip the Vite source tree)
RUN mv /var/www/html/commanddeck/dist /var/www/html/_commanddeck \
    && rm -rf /var/www/html/commanddeck \
    && mv /var/www/html/_commanddeck /var/www/html/commanddeck

# Entrypoint (writes config.inc.php from env, binds Apache to $PORT)
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /var/www/html
EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
