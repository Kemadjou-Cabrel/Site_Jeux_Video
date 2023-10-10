-- phpMyAdmin SQL Dump
-- version 4.5.4.1
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Mer 03 Mai 2023 à 23:34
-- Version du serveur :  5.7.11
-- Version de PHP :  5.6.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `jeuxvideo`
--

-- --------------------------------------------------------

--
-- Structure de la table `classement`
--

CREATE TABLE `classement` (
  `pseudoUser` varchar(50) NOT NULL,
  `idJeux` int(11) NOT NULL,
  `score` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `classement`
--

INSERT INTO `classement` (`pseudoUser`, `idJeux`, `score`) VALUES
('Deepa', 1, 45),
('Deepa', 2, 100212),
('eee', 1, 45),
('fgdg', 1, 645),
('fsfw', 1, 15),
('hxh', 1, 5002),
('jdjdj', 1, 64),
('NatNat', 1, 2),
('rte', 1, 123),
('tgd', 1, 478),
('wgw', 1, 222),
('wgwg', 1, 789);

-- --------------------------------------------------------

--
-- Structure de la table `jeux`
--

CREATE TABLE `jeux` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `libelle` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `jeux`
--

INSERT INTO `jeux` (`id`, `nom`, `libelle`) VALUES
(1, 'B-BTAN', 'But du jeu : casser les cubes avant qu''ils atteignent le ligne rouge.'),
(2, 'SpaceInvaders', 'Vous devez vaincre des essaims d''extraterrestres et ne pas les laisser atteindre le bas de l''ecran alors qu''ils vous attaquent sans relache!'),
(3, 'Zelda', 'Battez les ennemis en utilisant vos pouvoirs magiques.'),
(4, 'Ztype', 'vous devez écrire rapidement pour vaincre les ennemis');
(5, 'Runner', 'doit atteindre l''autre côté et éviter les balles en sautant');
(6, 'Sokoban', 'placez les cases dans le bon sens pour gagner');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `pseudo` varchar(100) NOT NULL,
  `mdp` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Email` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `utilisateur`
--

INSERT INTO `utilisateur` (`pseudo`, `mdp`, `Email`) VALUES
('azertyuiop', '$2y$10$x7zeO.HyTwQiF58u.Fbv0eAzt3OObSicIvLKUFTIKmd2DORfLA7Gu', 'feyenadrien2002@gmail.com'),
('Deepa', '$2y$10$xZfK8hv2DJ7NN7mfOUKZCOtm/uk0lLaZvBHxzba7AKdZoNFuq/JOi', 'feyenadrien2002@gmail.com'),
('eee', '$2y$10$yuf90c1exGDmuehk14kge.GGhLa7iM0ckDbrecTbSpM1TV4if8lBG', 'feyenadrien2002@gmail.com'),
('fgdg', '$2y$10$O9ebwVuj4X34JKMGQhj5.O1X9IMGaF/sfycYac0oxwsUSMUhCQZ5m', 'feyenadrien2002@gmail.com'),
('fsfw', '$2y$10$/WJONPI14UXDZrbYdH.BcuWv8zwcbUIDyvwo4EZ3vz4HYQ.CuWqSS', 'feyenadrien2002@gmail.com'),
('hxh', '$2y$10$5Dyp4tOITWb4hp9q.IwTX.eSIM7IorlLdmbqOCbTe1Xu79bDnSpxS', 'feyenadrien2002@gmail.com'),
('jdjdj', '$2y$10$C5CnYwWlMNdZTkII0Le.8u6znntImhX2h38IPhvRhgcrwHfq.sDDm', 'feyenadrien2002@gmail.com'),
('NatNat', '$2y$10$fXyg7upVyMe0P53QGTNWbeQ/kPIXc/JGNsmautwTsa/0udNg27f5y', 'Nat@me.com'),
('rte', '$2y$10$VnaJdyCsJKV3IRdczzvSQeFW4Jpq96lZiI8RwVswm8p6NxHj5zBAW', 'feyenadrien2002@gmail.com'),
('tgd', '$2y$10$EwYvy/Lcnx9k/cF0DKVpauN/uQStmB.sALPLcG9J3CzkDgyb5rM7u', 'feyenadrien2002@gmail.com'),
('wgw', '$2y$10$y9rdzFp9ZNS9ilmCHatoweaajU4frpZcqwGKTnib/H98rLcsEt7ha', 'feyenadrien2002@gmail.com'),
('wgwg', '$2y$10$2RdOlIFJSWFbN9/q9ORcRO57QIONz6n7D9eRn/XlVnzhS9ZFrasaC', 'feyenadrien2002@gmail.com');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `classement`
--
ALTER TABLE `classement`
  ADD PRIMARY KEY (`pseudoUser`,`idJeux`),
  ADD KEY `idJeux` (`idJeux`);

--
-- Index pour la table `jeux`
--
ALTER TABLE `jeux`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`pseudo`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `jeux`
--
ALTER TABLE `jeux`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `classement`
--
ALTER TABLE `classement`
  ADD CONSTRAINT `classement_ibfk_1` FOREIGN KEY (`pseudoUser`) REFERENCES `utilisateur` (`pseudo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `classement_ibfk_2` FOREIGN KEY (`idJeux`) REFERENCES `jeux` (`id`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
