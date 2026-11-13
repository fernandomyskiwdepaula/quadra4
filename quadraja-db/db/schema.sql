-- QuadraJá 4: estrutura do banco (SQLite)
PRAGMA foreign_keys = ON;
CREATE TABLE esportes (
  id        VARCHAR(20)  PRIMARY KEY,
  nome      VARCHAR(40)  NOT NULL,
  apelido   VARCHAR(40)  NOT NULL
);

CREATE TABLE pisos (
  id    VARCHAR(20) PRIMARY KEY,
  nome  VARCHAR(40) NOT NULL
);

CREATE TABLE comodidades (
  id    VARCHAR(20) PRIMARY KEY,
  nome  VARCHAR(40) NOT NULL,
  icone VARCHAR(30)
);

CREATE TABLE cidades (
  id    INT         PRIMARY KEY,
  nome  VARCHAR(40) NOT NULL,
  uf    CHAR(2)     NOT NULL
);

CREATE TABLE anunciantes (
  id        INT          PRIMARY KEY,
  nome      VARCHAR(60)  NOT NULL,
  telefone  VARCHAR(15),
  verificado BOOLEAN     NOT NULL DEFAULT TRUE
);

CREATE TABLE quadras (
  id           INT           PRIMARY KEY,
  nome         VARCHAR(60)   NOT NULL,
  esporte_id   VARCHAR(20)   NOT NULL,
  bairro       VARCHAR(40)   NOT NULL,
  cidade_id    INT           NOT NULL,
  rua          VARCHAR(80)   NOT NULL,
  preco_hora   DECIMAL(8,2)  NOT NULL CHECK (preco_hora > 0),
  piso_id      VARCHAR(20)   NOT NULL,
  tamanho_m2   INT           NOT NULL,
  capacidade   INT           NOT NULL,
  nota         DECIMAL(2,1)  NOT NULL CHECK (nota BETWEEN 0 AND 5),
  avaliacoes   INT           NOT NULL DEFAULT 0,
  destaque     BOOLEAN       NOT NULL DEFAULT FALSE,
  anunciante_id INT          NOT NULL,
  distancia_km DECIMAL(4,1),
  descricao    TEXT,
  FOREIGN KEY (esporte_id)    REFERENCES esportes(id),
  FOREIGN KEY (cidade_id)     REFERENCES cidades(id),
  FOREIGN KEY (piso_id)       REFERENCES pisos(id),
  FOREIGN KEY (anunciante_id) REFERENCES anunciantes(id)
);

-- Relação N:N entre quadras e comodidades
CREATE TABLE quadra_comodidades (
  quadra_id     INT         NOT NULL,
  comodidade_id VARCHAR(20) NOT NULL,
  PRIMARY KEY (quadra_id, comodidade_id),
  FOREIGN KEY (quadra_id)     REFERENCES quadras(id),
  FOREIGN KEY (comodidade_id) REFERENCES comodidades(id)
);

-- Horários de início livres hoje (17h a 22h), como no card "Vago hoje"
CREATE TABLE horarios_livres (
  quadra_id INT NOT NULL,
  hora      INT NOT NULL CHECK (hora BETWEEN 7 AND 22),
  PRIMARY KEY (quadra_id, hora),
  FOREIGN KEY (quadra_id) REFERENCES quadras(id)
);

CREATE TABLE usuarios (
  id     INT          PRIMARY KEY,
  nome   VARCHAR(60)  NOT NULL,
  email  VARCHAR(80)  NOT NULL UNIQUE,
  cidade_id INT,
  FOREIGN KEY (cidade_id) REFERENCES cidades(id)
);

CREATE TABLE favoritos (
  usuario_id INT NOT NULL,
  quadra_id  INT NOT NULL,
  PRIMARY KEY (usuario_id, quadra_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (quadra_id)  REFERENCES quadras(id)
);

-- Reserva: 1, 2 ou 3 horas; total = preço x horas + taxa de serviço de 7%
CREATE TABLE reservas (
  id          INTEGER      PRIMARY KEY,
  usuario_id  INT          NOT NULL,
  quadra_id   INT          NOT NULL,
  data_jogo   DATE         NOT NULL,
  hora_inicio INT          NOT NULL CHECK (hora_inicio BETWEEN 7 AND 22),
  duracao_h   INT          NOT NULL CHECK (duracao_h BETWEEN 1 AND 3),
  subtotal    DECIMAL(8,2) NOT NULL,
  taxa        DECIMAL(8,2) NOT NULL,
  total       DECIMAL(8,2) NOT NULL,
  status      VARCHAR(12)  NOT NULL DEFAULT 'confirmada',
  UNIQUE (quadra_id, data_jogo, hora_inicio),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (quadra_id)  REFERENCES quadras(id)
);

CREATE INDEX idx_quadras_cidade_esporte ON quadras (cidade_id, esporte_id);
CREATE INDEX idx_quadras_preco ON quadras (preco_hora);

