SET
    FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE `Parents`;

USE `Parents`;

CREATE TABLE `Admin`
(
    `id`             int          NOT NULL AUTO_INCREMENT,
    `cognito_sub_id` varchar(255) NOT NULL,
    `email`          varchar(255) NOT NULL,
    `phone_number`   varchar(255) NOT NULL,
    `given_name`     varchar(255) NOT NULL,
    `family_name`    varchar(255) NOT NULL,
    `created_at`     datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_login_at`  datetime              DEFAULT NULL,
    `permissions`    json         NOT NULL,
    `school_id`      int          NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `cognito_sub_id` (`cognito_sub_id`),
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `phone_number` (`phone_number`),
    KEY `idx_admin_school_id` (`school_id`),
    CONSTRAINT `Admin_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `School` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 21
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `Form`
(
    `id`                 int                                                    NOT NULL AUTO_INCREMENT,
    `student_id`         int                                                    NOT NULL,
    `parent_id`          int                                                    NOT NULL,
    `reason`             enum ('other', 'absence', 'lateness', 'leaving early') NOT NULL DEFAULT 'other',
    `date`               date                                                   NOT NULL,
    `additional_message` text,
    `sent_at`            datetime                                               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `school_id`          int                                                    NOT NULL,
    `status`             enum ('accept', 'reject', 'wait')                      NOT NULL DEFAULT 'wait',
    PRIMARY KEY (`id`),
    KEY `idx_form_school_id` (`school_id`),
    KEY `idx_form_student_id` (`student_id`),
    KEY `idx_form_parent_id` (`parent_id`),
    CONSTRAINT `Form_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `School` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Form_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `Student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Form_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `Parent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 16
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `GroupMember`
(
    `id`         int NOT NULL AUTO_INCREMENT,
    `student_id` int NOT NULL,
    `group_id`   int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_groupmember_student_id` (`student_id`),
    KEY `idx_groupmember_group_id` (`group_id`),
    CONSTRAINT `GroupMember_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `Student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `GroupMember_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `StudentGroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 63
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `GroupPost`
(
    `id`       int NOT NULL AUTO_INCREMENT,
    `post_id`  int NOT NULL,
    `group_id` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_grouppost_post_id` (`post_id`),
    KEY `idx_grouppost_group_id` (`group_id`),
    CONSTRAINT `GroupPost_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `GroupPost_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `StudentGroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
  
CREATE TABLE `messages`
(
    `id`             int          NOT NULL AUTO_INCREMENT,
    `sender_id`      int          NOT NULL,
    `receiver_id`    int          NOT NULL,
    `message`        text         NOT NULL,
    `message_type`   enum('parent', 'student', 'admin') NOT NULL,  -- Kategoriyalar
    `sent_at`        datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_messages_sender_id` (`sender_id`),
    KEY `idx_messages_receiver_id` (`receiver_id`),
    CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `Parent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `Student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `Parent`
(
    `id`             int          NOT NULL AUTO_INCREMENT,
    `cognito_sub_id` varchar(255) NOT NULL,
    `email`          varchar(255) NOT NULL,
    `phone_number`   varchar(255) NOT NULL,
    `given_name`     varchar(255) NOT NULL,
    `family_name`    varchar(255) NOT NULL,
    `created_at`     datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_login_at`  datetime              DEFAULT NULL,
    `school_id`      int          NOT NULL,
    `arn`            text,
    PRIMARY KEY (`id`),
    UNIQUE KEY `cognito_sub_id` (`cognito_sub_id`),
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `phone_number` (`phone_number`),
    KEY `idx_parent_school_id` (`school_id`),
    CONSTRAINT `Parent_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `School` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 19
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `Post`
(
    `id`          int                            NOT NULL AUTO_INCREMENT,
    `title`       varchar(255)                   NOT NULL,
    `description` text                           NOT NULL,
    `priority`    enum ('low', 'medium', 'high') NOT NULL DEFAULT 'low',
    `admin_id`    int                            NOT NULL,
    `sent_at`     datetime                       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `edited_at`   datetime                       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `school_id`   int                            NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_post_school_id` (`school_id`),
    CONSTRAINT `Post_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `School` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 104
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `PostImage`
(
    `id`        int          NOT NULL AUTO_INCREMENT,
    `post_id`   int          NOT NULL,
    `image_url` varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_postimage_post_id` (`post_id`),
    CONSTRAINT `PostImage_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `PostParent`
(
    `id`              int        NOT NULL AUTO_INCREMENT,
    `post_student_id` int        NOT NULL,
    `parent_id`       int        NOT NULL,
    `viewed_at`       datetime            DEFAULT NULL,
    `push`            tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `idx_postparent_post_student_id` (`post_student_id`),
    KEY `idx_postparent_parent_id` (`parent_id`),
    CONSTRAINT `PostParent_ibfk_1` FOREIGN KEY (`post_student_id`) REFERENCES `PostStudent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `PostParent_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `Parent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 803
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `PostStudent`
(
    `id`         int NOT NULL AUTO_INCREMENT,
    `post_id`    int NOT NULL,
    `student_id` int NOT NULL,
    `group_id`   int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_poststudent_post_id` (`post_id`),
    KEY `idx_poststudent_student_id` (`student_id`),
    KEY `idx_poststudent_group_id` (`group_id`),
    CONSTRAINT `PostStudent_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `PostStudent_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `Student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `PostStudent_ibfk_3` FOREIGN KEY (`group_id`) REFERENCES `StudentGroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 581
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `PostTemplate`
(
    `id`            int          NOT NULL AUTO_INCREMENT,
    `template_name` varchar(255) NOT NULL,
    `title`         varchar(255)                   DEFAULT NULL,
    `description`   text,
    `priority`      enum ('low', 'medium', 'high') DEFAULT NULL,
    `school_id`     int          NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_posttemplate_school_id` (`school_id`),
    CONSTRAINT `PostTemplate_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `School` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `School`
(
    `id`            int          NOT NULL AUTO_INCREMENT,
    `name`          varchar(255) NOT NULL,
    `contact_email` varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`),
    UNIQUE KEY `contact_email` (`contact_email`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 3
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `Student`
(
    `id`             int          NOT NULL AUTO_INCREMENT,
    `email`          varchar(255) NOT NULL,
    `phone_number`   varchar(255) NOT NULL,
    `given_name`     varchar(255) NOT NULL,
    `family_name`    varchar(255) NOT NULL,
    `student_number` varchar(255) NOT NULL,
    `school_id`      int          NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `phone_number` (`phone_number`),
    KEY `idx_student_school_id` (`school_id`),
    CONSTRAINT `Student_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `School` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 127
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `StudentGroup`
(
    `id`         int          NOT NULL AUTO_INCREMENT,
    `name`       varchar(255) NOT NULL,
    `created_at` datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `school_id`  int          NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_studentgroup_school_id` (`school_id`),
    CONSTRAINT `StudentGroup_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `School` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 22
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `StudentParent`
(
    `id`         int NOT NULL AUTO_INCREMENT,
    `parent_id`  int NOT NULL,
    `student_id` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_studentparent_student_id` (`student_id`),
    KEY `idx_studentparent_parent_id` (`parent_id`),
    CONSTRAINT `StudentParent_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `Student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `StudentParent_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `Parent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 65
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

INSERT INTO `School` (`id`, `name`, `contact_email`)
VALUES (1, 'New School', 'contact@newschool.com');

INSERT INTO `Admin` (`cognito_sub_id`, `email`, `phone_number`, `given_name`, `family_name`, `school_id`, `permissions`)
VALUES ('1', 'admin@gmail.com', '111111111', 'Admin', 'Staff', 1, JSON_OBJECT());

INSERT INTO `Student` (`id`, `email`, `phone_number`, `given_name`, `family_name`, `student_number`, `school_id`)
VALUES (1, 'student@gmail.com', '1234567890', 'Student', 'John', '1', 1);

INSERT INTO `Parent` (`id`, `cognito_sub_id`, `email`, `phone_number`, `given_name`, `family_name`, `school_id`)
VALUES (1, '1', 'parent@gmail.com', '222222222', 'Parent', 'Smith', 1);

INSERT INTO `StudentParent` (`parent_id`, `student_id`)
VALUES (1, 1);
