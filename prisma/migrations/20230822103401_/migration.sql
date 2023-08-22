-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `clientname` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `billing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` INTEGER NOT NULL,
    `balance` DOUBLE NOT NULL,
    `cur` VARCHAR(191) NOT NULL,
    `credit` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `routing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destination` INTEGER NOT NULL,
    `rate` VARCHAR(191) NOT NULL,
    `credit` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deleverd` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `send` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pending` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
