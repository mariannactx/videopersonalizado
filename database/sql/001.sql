CREATE TABLE `videos_personalizados` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(45) NOT NULL,
  `descricao` VARCHAR(45) NOT NULL,
  `arquivo` VARCHAR(45) NOT NULL,
  `thumb` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `arquivo` (`arquivo` ASC));

CREATE TABLE `acervo` (
`id` INT NOT NULL AUTO_INCREMENT,
`titulo` VARCHAR(45) NOT NULL,
`descricao` VARCHAR(45) NOT NULL,
`arquivo` VARCHAR(45) NOT NULL,
`thumb` VARCHAR(45) NOT NULL,
PRIMARY KEY (`id`),
UNIQUE INDEX `arquivo` (`arquivo` ASC));

INSERT INTO `acervo` (`titulo`, `descricao`, `arquivo`, `thumb`) VALUES ('Pioneirismo do TCE', 'O pioneirismo do TCE', 'pioneirismo_tce.mp4', 'pioneirismo_tce.png');

INSERT INTO `acervo` (`titulo`, `descricao`, `arquivo`, `thumb`) VALUES ('Ferramentas de controle', 'As ferramentas de controle', 'ferramentas_de_controle.mp4', 'ferramentas_de_controle.png');