-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql - banco local - ambiente de desenvolvimento
*/
CREATE DATABASE air_totem;

USE air_totem;

CREATE TABLE empresa (
	idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    cnpj VARCHAR(45),
    telefone VARCHAR(45)
);

CREATE TABLE aeroporto(
	idAero INT PRIMARY KEY auto_increment,
    nome VARCHAR(45),
    cep VARCHAR(45)
);


CREATE TABLE terminal (
    idTerminal INT PRIMARY KEY AUTO_INCREMENT,
    id_empresa INT,
    id_aeroporto INT,
    FOREIGN KEY (id_empresa) REFERENCES empresa(idEmpresa),
    FOREIGN KEY (id_aeroporto) REFERENCES aeroporto(idAero)
);


CREATE TABLE tipo (
    idTipo INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20),
    CONSTRAINT check_tipo_allowed CHECK (nome IN ('Admin', 'gerente geral', 'suporte'))
);

CREATE TABLE usuario (
	idUser INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	email VARCHAR(50),
	senha VARCHAR(50),
    cpf VARCHAR(45),
    fk_tipo INT,
    FOREIGN KEY (fk_tipo) REFERENCES tipo(idTipo),
	fk_empresa INT,
	FOREIGN KEY (fk_empresa) REFERENCES empresa(idEmpresa),
    fk_aeroporto INT,
	FOREIGN KEY (fk_aeroporto) REFERENCES aeroporto(idAero)
);



CREATE TABLE totem (
	idTotem INT PRIMARY KEY AUTO_INCREMENT,
    fk_empresa INT,
	FOREIGN KEY (fk_empresa) REFERENCES terminal(id_empresa),
    fk_aeroporto INT,
	FOREIGN KEY (fk_aeroporto) REFERENCES terminal(id_aeroporto),
    inicializado DATE,
    tempo_atv LONG,
    permissao BOOLEAN
);

 CREATE TABLE sistema (
	id INT PRIMARY KEY auto_increment,
    so varchar(255),
	permissao BOOLEAN,
    inicializado datetime,
    tempo_de_atividade LONG,
    fk_totem INT,
    FOREIGN KEY (fk_totem) REFERENCES totem(idTotem)
 );
 
 CREATE TABLE processador(
	id INT PRIMARY KEY auto_increment,
    nome VARCHAR(45),
    emUso Double,
    fabricante varchar(255),
    frequencia LONG,
    fk_totem INT,
    FOREIGN KEY (fk_totem) REFERENCES totem(idTotem)
 );
 
 CREATE TABLE memoria(
	idMemoria INT PRIMARY KEY auto_increment,
    disponivel LONG,
	emUso LONG,
    total LONG,
    fk_totem INT,
    FOREIGN KEY (fk_totem) REFERENCES totem(idTotem)
 );

CREATE TABLE disco(
	idDisco INT PRIMARY KEY auto_increment,
    nome VARCHAR(45),
    total LONG,
    tipo VARCHAR(45),
    fk_totem INT,
    FOREIGN KEY (fk_totem) REFERENCES totem(idTotem)
);


CREATE TABLE rede(
	idRede INT PRIMARY KEY auto_increment,
    host_nome VARCHAR(45),
    servidores_dns LONG,
    nome_dominio VARCHAR(45),
    fk_totem INT,
    FOREIGN KEY (fk_totem) REFERENCES totem(idTotem)
);


INSERT INTO tipo(nome) VALUES ("suporte");
INSERT INTO tipo(nome) VALUES ("gerente geral");
INSERT INTO tipo(nome) VALUES ("Admin");


INSERT INTO empresa (nome, cnpj, telefone) VALUES
('Empresa A', '12345678901234', '(11) 1234-5678'),
('Empresa B', '98765432109876', '(21) 9876-5432');


INSERT INTO aeroporto (nome, cep) VALUES
('Aeroporto Internacional A', '12345-678'),
('Aeroporto Nacional B', '54321-876');


INSERT INTO terminal (id_empresa, id_aeroporto) VALUES
(1, 1),
(2, 2);


INSERT INTO usuario (nome, email, senha, cpf, fk_tipo, fk_empresa, fk_aeroporto) VALUES
('Usuário 1', 'usuario1@email.com', 'senha123', '123.456.789-00', 3, 1, 1),
('Usuário 2', 'usuario3@email.com', 'senha456', '987.654.321-00', 3, 2, 1);





-- SELECTS ---

SELECT * FROM memoria;
SELECT * FROM tipo;
SELECT * FROM usuario;
SELECT * FROM disco;
SELECT * FROM totem;
SELECT t.nome AS nome_tipo
FROM usuario u
INNER JOIN tipo t ON u.fk_tipo = t.idTipo
WHERE u.email = 'usuario@hotmail.com' AND u.senha = '12345';
SELECT * FROM rede;
SELECT * FROM aeroporto;
SELECT * FROM empresa;
SELECT * FROM terminal;



SELECT 
    e.idEmpresa AS id_empresa,
    a.idAero AS id_aeroporto
FROM 
    usuario u
INNER JOIN 
    empresa e ON u.fk_empresa = e.idEmpresa
INNER JOIN 
    aeroporto a ON a.idAero = u.fk_aeroporto
WHERE 
    u.email = 'usuario1@email.com' AND u.senha = 'senha123';


select * from usuario as u join tipo as t on u.fk_tipo = t.idTipo where u.fk_tipo = 3; 
select 
