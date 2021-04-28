-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2021-04-28 22:43:28
-- 服务器版本： 8.0.23
-- PHP 版本： 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `koishi`
--
CREATE DATABASE IF NOT EXISTS `koishi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `koishi`;

-- --------------------------------------------------------

--
-- 表的结构 `channel`
--

CREATE TABLE `channel` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `flag` bigint UNSIGNED NOT NULL DEFAULT '0',
  `assignee` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `disable` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 表的结构 `gmr`
--

CREATE TABLE `gmr` (
  `groupId` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `selfId` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `time` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `userId` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `platform` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `channelId` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `messageId` varchar(25) NOT NULL,
  `replyMessageId` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='group-member-request';

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `flag` bigint UNSIGNED NOT NULL DEFAULT '0',
  `authority` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `usage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `timers` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `onebot` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转储表的索引
--

--
-- 表的索引 `channel`
--
ALTER TABLE `channel`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `gmr`
--
ALTER TABLE `gmr`
  ADD PRIMARY KEY (`messageId`) USING BTREE,
  ADD UNIQUE KEY `userId` (`userId`),
  ADD UNIQUE KEY `replyMessageId` (`replyMessageId`),
  ADD KEY `platform` (`platform`);

--
-- 表的索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `onebot` (`onebot`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
