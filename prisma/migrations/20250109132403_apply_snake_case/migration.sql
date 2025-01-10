/*
  Warnings:

  - The primary key for the `avatar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `avatar` table. All the data in the column will be lost.
  - The primary key for the `comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `postId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `comment` table. All the data in the column will be lost.
  - The primary key for the `friend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fromUserId` on the `friend` table. All the data in the column will be lost.
  - You are about to drop the column `toUserId` on the `friend` table. All the data in the column will be lost.
  - The primary key for the `moment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `postId` on the `moment` table. All the data in the column will be lost.
  - The primary key for the `momentcontent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `momentId` on the `momentcontent` table. All the data in the column will be lost.
  - The primary key for the `notice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `notice` table. All the data in the column will be lost.
  - The primary key for the `planner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `planner` table. All the data in the column will be lost.
  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cheeringCount` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `postType` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `textAlign` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `post` table. All the data in the column will be lost.
  - The primary key for the `search` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `search` table. All the data in the column will be lost.
  - The primary key for the `sharedplanner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `plannerId` on the `sharedplanner` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `sharedplanner` table. All the data in the column will be lost.
  - The primary key for the `sharedplannerview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sharedPlannerId` on the `sharedplannerview` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `sharedplannerview` table. All the data in the column will be lost.
  - The primary key for the `story` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `postId` on the `story` table. All the data in the column will be lost.
  - The primary key for the `storycontent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contentData` on the `storycontent` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `storycontent` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `storycontent` table. All the data in the column will be lost.
  - You are about to drop the column `storyId` on the `storycontent` table. All the data in the column will be lost.
  - The primary key for the `task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `plannerId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `taskCategoryId` on the `task` table. All the data in the column will be lost.
  - The primary key for the `taskcategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `taskcategory` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `platform` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `type` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the `cheer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_user_id` to the `Friend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_user_id` to the `Friend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `Moment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moment_id` to the `MomentContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Notice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Planner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_type` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text_align` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Search` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planner_id` to the `SharedPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `SharedPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shared_planner_id` to the `SharedPlannerView` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `SharedPlannerView` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `Story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_data` to the `StoryContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_type` to the `StoryContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sort_order` to the `StoryContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `story_id` to the `StoryContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planner_id` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TaskCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `avatar` DROP FOREIGN KEY `Avatar_userId_fkey`;

-- DropForeignKey
ALTER TABLE `cheer` DROP FOREIGN KEY `Cheer_fromUserId_fkey`;

-- DropForeignKey
ALTER TABLE `cheer` DROP FOREIGN KEY `Cheer_userId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `friend` DROP FOREIGN KEY `Friend_fromUserId_fkey`;

-- DropForeignKey
ALTER TABLE `friend` DROP FOREIGN KEY `Friend_toUserId_fkey`;

-- DropForeignKey
ALTER TABLE `moment` DROP FOREIGN KEY `Moment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `momentcontent` DROP FOREIGN KEY `MomentContent_momentId_fkey`;

-- DropForeignKey
ALTER TABLE `notice` DROP FOREIGN KEY `Notice_userId_fkey`;

-- DropForeignKey
ALTER TABLE `planner` DROP FOREIGN KEY `Planner_userId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_userId_fkey`;

-- DropForeignKey
ALTER TABLE `search` DROP FOREIGN KEY `Search_userId_fkey`;

-- DropForeignKey
ALTER TABLE `sharedplanner` DROP FOREIGN KEY `SharedPlanner_plannerId_fkey`;

-- DropForeignKey
ALTER TABLE `sharedplanner` DROP FOREIGN KEY `SharedPlanner_userId_fkey`;

-- DropForeignKey
ALTER TABLE `sharedplannerview` DROP FOREIGN KEY `SharedPlannerView_sharedPlannerId_fkey`;

-- DropForeignKey
ALTER TABLE `sharedplannerview` DROP FOREIGN KEY `SharedPlannerView_userId_fkey`;

-- DropForeignKey
ALTER TABLE `story` DROP FOREIGN KEY `Story_postId_fkey`;

-- DropForeignKey
ALTER TABLE `storycontent` DROP FOREIGN KEY `StoryContent_storyId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_plannerId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_taskCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `taskcategory` DROP FOREIGN KEY `TaskCategory_userId_fkey`;

-- DropIndex
DROP INDEX `Avatar_userId_fkey` ON `avatar`;

-- DropIndex
DROP INDEX `Comment_postId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `Comment_userId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `Friend_fromUserId_fkey` ON `friend`;

-- DropIndex
DROP INDEX `Friend_toUserId_fkey` ON `friend`;

-- DropIndex
DROP INDEX `Moment_postId_fkey` ON `moment`;

-- DropIndex
DROP INDEX `MomentContent_momentId_fkey` ON `momentcontent`;

-- DropIndex
DROP INDEX `Notice_userId_fkey` ON `notice`;

-- DropIndex
DROP INDEX `Planner_userId_fkey` ON `planner`;

-- DropIndex
DROP INDEX `Post_userId_fkey` ON `post`;

-- DropIndex
DROP INDEX `Search_userId_fkey` ON `search`;

-- DropIndex
DROP INDEX `SharedPlanner_plannerId_fkey` ON `sharedplanner`;

-- DropIndex
DROP INDEX `SharedPlanner_userId_fkey` ON `sharedplanner`;

-- DropIndex
DROP INDEX `SharedPlannerView_sharedPlannerId_fkey` ON `sharedplannerview`;

-- DropIndex
DROP INDEX `SharedPlannerView_userId_fkey` ON `sharedplannerview`;

-- DropIndex
DROP INDEX `Story_postId_fkey` ON `story`;

-- DropIndex
DROP INDEX `StoryContent_storyId_fkey` ON `storycontent`;

-- DropIndex
DROP INDEX `Task_plannerId_fkey` ON `task`;

-- DropIndex
DROP INDEX `Task_taskCategoryId_fkey` ON `task`;

-- DropIndex
DROP INDEX `TaskCategory_userId_fkey` ON `taskcategory`;

-- AlterTable
ALTER TABLE `avatar` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    ADD COLUMN `user_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `comment` DROP PRIMARY KEY,
    DROP COLUMN `postId`,
    DROP COLUMN `userId`,
    ADD COLUMN `post_id` BIGINT NOT NULL,
    ADD COLUMN `user_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `friend` DROP PRIMARY KEY,
    DROP COLUMN `fromUserId`,
    DROP COLUMN `toUserId`,
    ADD COLUMN `from_user_id` BIGINT NOT NULL,
    ADD COLUMN `to_user_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `moment` DROP PRIMARY KEY,
    DROP COLUMN `postId`,
    ADD COLUMN `post_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `momentcontent` DROP PRIMARY KEY,
    DROP COLUMN `momentId`,
    ADD COLUMN `moment_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `notice` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    ADD COLUMN `user_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `planner` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    ADD COLUMN `user_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `post` DROP PRIMARY KEY,
    DROP COLUMN `cheeringCount`,
    DROP COLUMN `postType`,
    DROP COLUMN `textAlign`,
    DROP COLUMN `userId`,
    ADD COLUMN `like_count` BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN `post_type` ENUM('moment', 'story') NOT NULL,
    ADD COLUMN `text_align` ENUM('left', 'center', 'right') NOT NULL,
    ADD COLUMN `user_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `search` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    ADD COLUMN `user_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `sharedplanner` DROP PRIMARY KEY,
    DROP COLUMN `plannerId`,
    DROP COLUMN `userId`,
    ADD COLUMN `planner_id` BIGINT NOT NULL,
    ADD COLUMN `user_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `sharedplannerview` DROP PRIMARY KEY,
    DROP COLUMN `sharedPlannerId`,
    DROP COLUMN `userId`,
    ADD COLUMN `shared_planner_id` BIGINT NOT NULL,
    ADD COLUMN `user_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `story` DROP PRIMARY KEY,
    DROP COLUMN `postId`,
    ADD COLUMN `post_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `storycontent` DROP PRIMARY KEY,
    DROP COLUMN `contentData`,
    DROP COLUMN `contentType`,
    DROP COLUMN `sortOrder`,
    DROP COLUMN `storyId`,
    ADD COLUMN `content_data` VARCHAR(191) NOT NULL,
    ADD COLUMN `content_type` ENUM('image', 'video') NOT NULL,
    ADD COLUMN `sort_order` BIGINT NOT NULL,
    ADD COLUMN `story_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `task` DROP PRIMARY KEY,
    DROP COLUMN `plannerId`,
    DROP COLUMN `taskCategoryId`,
    ADD COLUMN `planner_id` BIGINT NOT NULL,
    ADD COLUMN `task_category_id` BIGINT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `taskcategory` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    ADD COLUMN `user_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `platform` ENUM('kakao', 'naver', 'google') NULL,
    MODIFY `type` ENUM('category_user', 'memo_user') NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `cheer`;

-- CreateTable
CREATE TABLE `Like` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `from_user_id` BIGINT NOT NULL,
    `entityType` ENUM('shared_planner', 'post') NOT NULL,
    `entityId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Planner` ADD CONSTRAINT `Planner_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_planner_id_fkey` FOREIGN KEY (`planner_id`) REFERENCES `Planner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_task_category_id_fkey` FOREIGN KEY (`task_category_id`) REFERENCES `TaskCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskCategory` ADD CONSTRAINT `TaskCategory_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Search` ADD CONSTRAINT `Search_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_from_user_id_fkey` FOREIGN KEY (`from_user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedPlanner` ADD CONSTRAINT `SharedPlanner_planner_id_fkey` FOREIGN KEY (`planner_id`) REFERENCES `Planner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedPlanner` ADD CONSTRAINT `SharedPlanner_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedPlannerView` ADD CONSTRAINT `SharedPlannerView_shared_planner_id_fkey` FOREIGN KEY (`shared_planner_id`) REFERENCES `SharedPlanner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedPlannerView` ADD CONSTRAINT `SharedPlannerView_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notice` ADD CONSTRAINT `Notice_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_from_user_id_fkey` FOREIGN KEY (`from_user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avatar` ADD CONSTRAINT `Avatar_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Moment` ADD CONSTRAINT `Moment_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MomentContent` ADD CONSTRAINT `MomentContent_moment_id_fkey` FOREIGN KEY (`moment_id`) REFERENCES `Moment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Story` ADD CONSTRAINT `Story_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StoryContent` ADD CONSTRAINT `StoryContent_story_id_fkey` FOREIGN KEY (`story_id`) REFERENCES `Story`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
