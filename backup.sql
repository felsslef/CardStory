-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: cadastro
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jogo_tags`
--

DROP TABLE IF EXISTS `jogo_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jogo_tags` (
  `jogo_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`jogo_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `jogo_tags_ibfk_1` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `jogo_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jogo_tags`
--

LOCK TABLES `jogo_tags` WRITE;
/*!40000 ALTER TABLE `jogo_tags` DISABLE KEYS */;
INSERT INTO `jogo_tags` VALUES (1,3),(3,5),(4,5),(5,5),(6,5),(7,5),(8,5),(9,5),(10,5),(11,5),(3,6),(4,6),(5,6),(6,6),(7,6),(8,6),(9,6),(10,6),(11,6),(1,9),(1,11),(3,11),(4,11),(5,11),(6,11),(7,11),(8,11),(9,11),(10,11),(11,11),(1,22),(3,22),(4,22),(5,22),(6,22),(7,22),(8,22),(9,22),(10,22),(11,22),(1,34),(1,35),(3,35),(4,35),(5,35),(6,35),(7,35),(8,35),(9,35),(10,35),(11,35),(1,40),(3,40),(4,40),(5,40),(6,40),(3,44),(4,44),(5,44),(6,44),(7,44),(8,44),(9,44),(10,44),(11,44),(3,49),(4,49),(5,49),(6,49),(7,49),(8,49),(9,49),(10,49),(11,49),(4,51),(5,51),(7,51),(8,51),(9,51),(10,51),(11,51),(1,53),(3,53),(4,53),(5,53),(6,53),(1,56),(3,57),(4,57),(5,57),(6,57),(1,59),(3,59),(4,59),(5,59),(6,59),(7,59),(8,59),(9,59),(10,59),(11,59),(1,63),(3,63),(4,63),(5,63),(6,63),(7,63),(8,63),(9,63),(10,63),(11,63),(1,64),(3,64),(4,64),(5,64),(6,64),(1,65),(3,65),(4,65),(5,65),(6,65),(1,66),(3,66),(4,66),(5,66),(6,66),(3,67),(4,67),(5,67),(6,67),(7,67),(8,67),(9,67),(10,67),(11,67),(1,69);
/*!40000 ALTER TABLE `jogo_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jogos`
--

DROP TABLE IF EXISTS `jogos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jogos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` text,
  `imagem_url` varchar(500) DEFAULT NULL,
  `data_lancamento` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jogos`
--

LOCK TABLES `jogos` WRITE;
/*!40000 ALTER TABLE `jogos` DISABLE KEYS */;
INSERT INTO `jogos` VALUES (1,'Sally Face','Mergulhe em uma hist├│ria sombria e emocional com Sally Face, um jogo de aventura epis├│dico em 2D que mistura mist├®rio, terror psicol├│gico e investiga├º├úo sobrenatural.\nVoc├¬ assume o papel de Sal Fisher, um adolescente solit├írio com uma pr├│tese facial e um passado tr├ígico, que se muda para um novo apartamento com o pai. Mas algo naquele pr├®dio n├úo est├í certo. Ao lado de seus amigos, Sal come├ºa a investigar uma s├®rie de acontecimentos estranhos e mortes misteriosas, desvendando segredos cada vez mais perturbadores.\nCom uma est├®tica visual ├║nica desenhada ├á m├úo, narrativa profunda e temas maduros, Sally Face oferece uma experi├¬ncia marcante, repleta de enigmas, simbolismos e emo├º├Áes intensas. Cada epis├│dio revela mais sobre os mist├®rios que cercam Sal e os horrores que se escondem por tr├ís da realidade.','https://m.media-amazon.com/images/I/81F2RM10rBL._AC_UF1000,1000_QL80_.jpg','2016-08-16'),(3,'Five nights at freddy\'s','Five Nights at FreddyÔÇÖs (FNaF) ├® um jogo de terror em primeira pessoa onde o jogador assume o papel de um vigia noturno em uma pizzaria assombrada. Durante cinco noites, voc├¬ precisa monitorar c├ómeras de seguran├ºa e sobreviver aos ataques de animatr├┤nicos assustadores que ganham vida ap├│s o expediente.','https://cdn2.steamgriddb.com/icon/25e828afe5f637410a84442d27029c38/32/256x256.png',NULL),(4,'Five nights at freddy\'s 2','Neste prequel do primeiro jogo, voc├¬ retorna como vigia noturno em uma nova pizzaria, enfrentando uma variedade ainda maior de animatr├┤nicos. O jogo remove as portas, mas adiciona uma lanterna e uma m├íscara de Freddy que deve ser usada estrategicamente. A tens├úo aumenta com m├║ltiplas amea├ºas simult├óneas e a necessidade de alternar rapidamente entre c├ómeras e equipamentos.','https://play-lh.googleusercontent.com/GYcyLlHWoZumcal0WmDJJo2rCFyl3Y0mwXm0zaD-C9gC0PJGQMhzOKHfDUVlqSDlag=w240-h480-rw',NULL),(5,'Five nights at freddy\'s 3','Ambientado 30 anos ap├│s os eventos do primeiro jogo, voc├¬ ├® contratado como operador em uma atra├º├úo de terror baseada nos antigos incidentes da pizzaria. O jogador deve lidar com falhas t├®cnicas e um ├║nico animatr├┤nico real, enquanto ├® distra├¡do por apari├º├Áes alucinat├│rias. A mec├ónica envolve monitorar e reiniciar sistemas como ├íudio, ventila├º├úo e c├ómeras.','https://cdn2.steamgriddb.com/grid/d007beaadee2cf8a702432f742825e70.png',NULL),(6,'Five nights at freddy\'s 4','Diferente dos anteriores, FNaF 4 se passa no quarto de uma crian├ºa, onde o jogador deve sobreviver a cinco noites ouvindo sons sutis e fechando portas no momento certo. Sem c├ómeras, a jogabilidade gira em torno de audi├º├úo atenta e reflexos r├ípidos para lidar com vers├Áes ainda mais sinistras dos animatr├┤nicos cl├íssicos.','https://images.steamusercontent.com/ugc/868481724755816929/1920AEDC59916A5F7943488CC32FE2C407299503/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',NULL),(7,'Five Nights at FreddyÔÇÖs: Sister Location','Desta vez, o jogador executa tarefas em uma instala├º├úo subterr├ónea enfrentando animatr├┤nicos agressivos em cen├írios variados. H├í foco narrativo e explora├º├úo.','https://cdn2.steamgriddb.com/grid/5b0787421cbf82cb40df73dc59c9e972.png','2016-10-07'),(8,'Freddy FazbearÔÇÖs Pizzeria Simulator','Durante o dia, o jogador gerencia uma pizzaria. ├Ç noite, precisa sobreviver ao trabalhar no escrit├│rio, enfrentando os horrores escondidos. Mistura humor e tens├úo.','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh9hLdq59lnJndPu2GFuK_DH8j5NBg4w2BcA&s','2017-12-04'),(9,'Ultimate Custom Night','Jogo altamente personaliz├ível onde o jogador escolhe quais animatr├┤nicos enfrentar e com qual dificuldade. Ideal para veteranos da s├®rie.','https://cdn2.steamgriddb.com/icon/f3b7e5d3eb074cde5b76e26bc0fb5776.png','2018-06-27'),(10,'Five Nights at FreddyÔÇÖs: Help Wanted','Uma colet├ónea VR dos jogos cl├íssicos com minigames interativos e visuais imersivos. O jogador executa reparos e monitora ambientes em primeira pessoa.','https://cdn2.steamgriddb.com/icon/5afd3bb639c0920782586a9843ee0785/32/512x512.png','2019-05-28'),(11,'Five Nights at FreddyÔÇÖs: Security Breach','Gregory, uma crian├ºa, precisa escapar de um shopping dominado por animatr├┤nicos. O jogo traz explora├º├úo, stealth e m├║ltiplos finais em ambiente 3D.','https://images.steamusercontent.com/ugc/1830149517980797727/3AD840F8FCC3DD9D8B158163948CD5413244468F/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false','2021-12-16');
/*!40000 ALTER TABLE `jogos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'A├º├úo','G├¬nero'),(2,'Party Game','G├¬nero'),(3,'Aventura','G├¬nero'),(4,'RPG (Role-Playing Game)','G├¬nero'),(5,'Estrat├®gia','G├¬nero'),(6,'Simula├º├úo','G├¬nero'),(7,'Corrida','G├¬nero'),(8,'Esportes','G├¬nero'),(9,'Puzzle','G├¬nero'),(10,'Plataforma','G├¬nero'),(11,'Horror','G├¬nero'),(12,'Mundo Aberto','G├¬nero'),(13,'Luta','G├¬nero'),(14,'Tiro em Primeira Pessoa(FPS)','G├¬nero'),(15,'Tiro em Terceira Pessoa(TPS)','G├¬nero'),(16,'Stealth','G├¬nero'),(17,'Hack and Slash','G├¬nero'),(18,'Boomer Shooter','G├¬nero'),(19,'Metroidvania','G├¬nero'),(20,'Battle Royale','G├¬nero'),(22,'Singleplayer','ModoDeJogo'),(23,'Multiplayer','ModoDeJogo'),(24,'Coop','ModoDeJogo'),(25,'Local Multiplayer','ModoDeJogo'),(26,'MMO','ModoDeJogo'),(27,'PvP','ModoDeJogo'),(28,'PvE','ModoDeJogo'),(29,'Fic├º├úo Cient├¡fica','Tema'),(30,'Cyberpunk','Tema'),(31,'P├│s-apocal├¡ptico','Tema'),(32,'Medieval','Tema'),(33,'Hist├│rico','Tema'),(34,'Contempor├óneo','Tema'),(35,'Terror','Tema'),(36,'Espacial','Tema'),(37,'Noir','Tema'),(38,'Faroeste','Tema'),(39,'Animes','Tema'),(40,'Narrativa N├úo Linear','Caracter├¡sticasT├®cnicas'),(41,'Crafting','Caracter├¡sticasT├®cnicas'),(42,'Customiza├º├úo de Personagem','Caracter├¡sticasT├®cnicas'),(43,'Escolhas','Caracter├¡sticasT├®cnicas'),(44,'Sobreviv├¬ncia','Caracter├¡sticasT├®cnicas'),(45,'Constru├º├úo','Caracter├¡sticasT├®cnicas'),(46,'Sandbox','Caracter├¡sticasT├®cnicas'),(47,'Roguelike','Caracter├¡sticasT├®cnicas'),(48,'Turn-Based (Baseado em Turnos)','Caracter├¡sticasT├®cnicas'),(49,'Tempo Real','Caracter├¡sticasT├®cnicas'),(50,'F├¡sica Realista','Caracter├¡sticasT├®cnicas'),(51,'Gerenciamento de Recursos','Caracter├¡sticasT├®cnicas'),(53,'2D','EstiloVisual'),(54,'3D','EstiloVisual'),(55,'PixelArt','EstiloVisual'),(56,'Cartoon','EstiloVisual'),(57,'Realista','EstiloVisual'),(59,'Indie','G├¬nero'),(60,'Cell Shading','EstiloVisual'),(62,'Low Poly','EstiloVisual'),(63,'Pc','Plataforma'),(64,'Playstation','Plataforma'),(65,'Xbox','Plataforma'),(66,'Nintendo','Plataforma'),(67,'Mobile','Plataforma'),(68,'Browser','Plataforma'),(69,'Fantasia','Tema');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `Nome` varchar(30) NOT NULL,
  `Sobrenome` varchar(30) NOT NULL,
  `Username` varchar(15) NOT NULL,
  `Sexo` enum('M','F','N') DEFAULT NULL,
  `DataNasc` date DEFAULT NULL,
  `Email` varchar(35) NOT NULL,
  `Senha` varchar(255) DEFAULT NULL,
  `fotoUrl` varchar(255) DEFAULT 'https://cdn-icons-png.flaticon.com/512/17/17004.png',
  PRIMARY KEY (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('Felipe','cursino','aaa','M','2005-12-11','felsagameplys@gmail.com','$2b$15$32b/DjO/cBnvt1YcVzoEw./TY4365QpIqiEqNNB6cLd9RUQFWI9eu','https://cdn-icons-png.flaticon.com/512/17/17004.png'),('ane','abreu','anelinda','F','2009-09-01','ane@gmail.com','$2b$15$kEg6uJi6.uPjAOdCOBAVOubfb0B.0rieeHmQXGIC7EpMaJxCkuWOW','https://media.istockphoto.com/id/140233388/pt/foto/cabe%C3%A7a-de-burro.jpg?s=1024x1024&w=is&k=20&c=sRGApNggG1eN4KL0e-Ojiz9Z_fz3jNZ09wNbveUyyj4='),('Davi','Pastore','d.pastore','M','2012-01-03','davicolegiocanopus@gmail.com','$2b$15$5/WISkLbJM5Xcd.qhy9KUeQbK.GlWjiu3mZZukIAj9SCA33leJahm','https://cdn-icons-png.flaticon.com/512/17/17004.png'),('Ivan ','Alves D\'Abreu','D\'Abreu','M','1955-11-14','iaabreu@bol.com.br','$2b$15$.BshpmJRPHR938xL8poqV.ra20G2X0i1cQxaz6cEawd5F92xzbK2O','https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/250px-Palmeiras_logo.svg.png'),('Felipe','Cursino','felsslef','M','2005-12-11','felipepastorecursino@gmail.com','$2b$15$ait6fn/KqF5VxZ2MZy2h4ultMWN50J6VxV9Q4aleOze3sEfO1MMUC','https://yt3.googleusercontent.com/oFBgMNH0BnotyGHWF2-FgmrKWVpWwFz8VCflrKKAC5C2yoxoZgB_bVdph-_wPVT7a1JOcloWCQ=s900-c-k-c0x00ffffff-no-rj'),('Roger Guedes','Glaider da Silva','Golfsap├úo','F','1760-05-04','monteirobaitola@gmail.com','$2b$15$tVDeXRiIOL226n8oZJzyhe1m6kFtuMtqQ7ATYn1yduJ9JYz1HRWT6','https://pbs.twimg.com/media/Et8kVXqWgAI2xHh?format=jpg&name=small'),('Gutsurf','Surf','Gutsurf','N','1980-02-03','gccursino360@gmail.com','$2b$15$Xr3/HKNlVu8iZ8ITxpxwHe5QgHozQhGzCxwtrZowHPoJCupiiN4KC','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRZGOL8o8CW5WlJh173qFOcBuRAn7cWCYx2Q&s'),('jenifer','Pastore','je','F','1987-06-15','Je@gmail.com','$2b$15$TZczQdvedFXZ9D67HnjLEu0Y6dLm1jWOn5qgPMBLrb3EIyjBgbKHG','https://imagens.ne10.uol.com.br/veiculos/_midias/webp/2024/07/10/rainha_das_lagrimas_dorama-27445600.webp?20240827215054'),('Leticia','Pacheco','kiik1_','F','2006-05-20','lelecabral2006@gmail.com','$2b$15$7amAGrrrm3d6i45.br5rZuNw.XM3eamJv1dKTKTCMfLdNIX.JID4S','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU9EBxKv10bPwBokrHIVzz3HRiLMSHrWftmg&s'),('Amanda','Pastore','MandaPastore','F','2000-04-07','amandinhaptb@gmail.com','$2b$15$peBZ17yTgX/0kb9wpzu7BerEuDNev.122RcOs9pYuLZgIMEhdfB76','https://cdn-icons-png.flaticon.com/512/17/17004.png'),('muri','muri','muri','M','2006-02-01','muri@gmail.com','$2b$15$JwZbfciaDgRKc8n2G8voj.BfAlua.cNGqdKGAk.U81TfvhMlMC2g.','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXToFak7SE8oaLbv32biE-yIxpu3gn_SQSMg&s'),('Pinto','Pinto','Pinto','M','2005-12-11','pinto@gmail.com','$2b$15$VeH.3qltCrjDytgTYw6YGeTOqqnF6q6WoiRCfJ9qgH7eEheRN2x/e','https://cdn-icons-png.flaticon.com/512/17/17004.png');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-23  3:05:32
