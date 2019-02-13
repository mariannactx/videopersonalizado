CREATE TABLE `videos_personalizados` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(45) NOT NULL,
  `descricao` VARCHAR(45) NOT NULL,
  `arquivo` VARCHAR(45) NOT NULL,
  `thumb` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `arquivo` (`arquivo` ASC));

ALTER TABLE `acervo` 
CHANGE COLUMN `arquivo` `arquivo` VARCHAR(45) NOT NULL ,
ADD COLUMN `titulo` VARCHAR(45) NOT NULL AFTER `id`,
ADD COLUMN `descricao` VARCHAR(45) NOT NULL AFTER `titulo`,
ADD COLUMN `thumb` VARCHAR(45) NULL AFTER `arquivo`,
ADD UNIQUE INDEX `arquivo_UNIQUE` (`arquivo` ASC);

ALTER TABLE `acervo` 
AUTO_INCREMENT = 1 ;

INSERT INTO `acervo` (`titulo`, `descricao`, `arquivo`, `thumb`) VALUES ('Pioneirismo do TCE', 'O pioneirismo do TCE', 'pioneirismo_tce.mp4', 'pioneirismo_tce.png');

INSERT INTO `acervo` (`titulo`, `descricao`, `arquivo`, `thumb`) VALUES ('Ferramentas de controle', 'As ferramentas de controle', 'ferramentas_de_controle.mp4', 'ferramentas_de_controle.png');