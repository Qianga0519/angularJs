-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th5 31, 2024 lúc 09:06 PM
-- Phiên bản máy phục vụ: 8.0.31
-- Phiên bản PHP: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `angular`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lbl_posts`
--

DROP TABLE IF EXISTS `lbl_posts`;
CREATE TABLE IF NOT EXISTS `lbl_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `lbl_posts`
--

INSERT INTO `lbl_posts` (`id`, `title`, `description`, `created_at`) VALUES
(155, 'toi yeu viet nam', 'toi yeu viet nam', '0000-00-00'),
(156, 'dat nuoc cua toi', 'dat nuoc cua toi', '0000-00-00'),
(157, 'mien dat hua', 'mien dat hua', '0000-00-00'),
(158, 'canh dep noi day', 'canh dep noi day', '0000-00-00'),
(159, 'rung ram nhiet doi', 'rung ram nhiet doi', '0000-00-00'),
(160, 'vung nui hoang so', 'vung nui hoang so', '0000-00-00'),
(161, 'dong vat hoang da', 'dong vat hoang da', '0000-00-00'),
(162, 'dinh cao cua su nghiep la gi', 'dinh cao cua su nghiep la gi', '0000-00-00'),
(163, 'bong da hom nay', 'bong da hom nay', '0000-00-00'),
(164, 'tong hop tin tuc 1', '<p>tong hop tin tuc11</p>\n', '0000-00-00'),
(167, 'fsadf', '<p>asfd</p>\n', '2024-05-31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'user123', 'user@gmail.com', '123'),
(2, 'user234', 'user234@gmail.com', '234'),
(3, 'user000', 'tquang@gmail.com', '123');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_post_likes`
--

DROP TABLE IF EXISTS `user_post_likes`;
CREATE TABLE IF NOT EXISTS `user_post_likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user_post_likes`
--

INSERT INTO `user_post_likes` (`id`, `user_id`, `post_id`) VALUES
(80, 1, 159),
(79, 1, 157),
(57, 9, 164),
(56, 8, 164),
(55, 7, 164),
(54, 6, 164),
(53, 5, 164),
(52, 5, 164),
(82, 1, 163),
(89, 1, 167),
(84, 1, 156),
(85, 1, 158),
(86, 2, 164);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
