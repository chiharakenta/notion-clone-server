-- AlterTable
ALTER TABLE `Memo` MODIFY `icon` VARCHAR(191) NOT NULL DEFAULT '📝',
    MODIFY `title` VARCHAR(191) NOT NULL DEFAULT '無題',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT 'ここに自由に記入してください。';
