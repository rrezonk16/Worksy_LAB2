FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    git \
    nano \
    libzip-dev \
    libpq-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Fix MongoDB extension version to 1.19.1 (required by composer.lock)
RUN pecl uninstall mongodb || true && \
    pecl install mongodb-1.19.1 && \
    docker-php-ext-enable mongodb

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy only composer files first to optimize build cache
COPY composer.json composer.lock ./

# Install PHP dependencies early
RUN composer install --no-scripts --no-autoloader

# Copy application files
COPY . .

RUN composer dump-autoload

RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www \
    && chmod -R 775 storage bootstrap/cache

# Expose FPM port
EXPOSE 9000

CMD ["php-fpm"]

