INSERT INTO tb_endereco (tipo, logradouro, numero, complemento, cep, cidade, estado)
VALUES
	('Avenida', 'Avenida Rodrigues Moreira', 167, 'complemento 2', '86044768', 'Curitiba', 'Paraná'),
	('Rua', 'Rua Uberlândia', 241, 'Apt 502', '86062600', 'Londrina', 'Paraná'),
	('Vila', 'Rua Gertrudes Barreto', 49, '', '69058560', 'Manaus', 'Amazonas'),
	('Colônia', 'Rua Antenor Câmara', 4, '', '62665970', 'Curitiba', 'Paraná'),
	('Rua', 'Rua Espacial', 553, 'Apt 3', '64059240', 'Ouro Preto', 'Minas Gerais'),
	('Rua', 'Rua Francisco Neto', 21, '', '68900080', 'Curitiba', 'Paraná'),
	('Avenida', 'Avenida General Ataíde Teive', 76, '', '69304360', 'Boa Vista', 'Roraima'),
	('Rua', 'Rua Joaquim Pansiera', 5, '', '13421762', 'Curitiba', 'Paraná'),
	('Estação', 'Travessa Jardim', 40, '', '69902473', 'São Paulo', 'São Paulo'),
	('Rua', 'Rua Professor Joaquim Bezerra', 5, 'Apt 205', '64030430', 'Rio de Janeiro', 'Rio de Janeiro'),
	('Rua', 'Rua Aluízio de Azevedo', 708, '', '76961776', 'Curitiba', 'Paraná'),
	('Rua', 'Rua Marcos Costa', 83, '', '82620264', 'Curitiba', 'Paraná');

INSERT INTO tb_cliente (id_endereco, id_gerente, nome, email, cpf, salario, aprovado)
VALUES
	(1, 1, 'Maria Almeida', 'cliente', '21690014253', 3000, true),
	(2, 1, 'Luiz Sérgio', 'luiz@email.com', '79783044699', 2500, true),
	(3, 1, 'Leandro Otávio', 'leandro@email.com', '45049287600', 7200, true),
	(4, 1, 'Marina Helena', 'mariahelena@email.com', '33911477929', 4000, false),
	(5, 1, 'Fábio Anthony Murilo Ramos', 'fabio@email.com', '96492784510', 5000, false),
	(6, 1, 'Thiago Emanuel', 'thiago@email.com', '68123327390', 10000, false),
	(7, 2, 'Heloisa Emanuelly dos Santos', 'heloisa@email.com', '64233750626', 1500, true),
	(8, 2, 'Victor Ian Isaac', 'victor@email.com', '32350500861', 2400, true),
	(9, 2, 'Luciana Alícia Daniela', 'luciana@email.com', '22513544099', 9800, true),
	(10, 2, 'Aurora Dias', 'aurora@email.com', '43703069309', 1200, false),
	(11, 2, 'Aline Giovana', 'aline@email.com', '60374857474', 8765, false),
	(12, 2, 'Márcio Ian Novaes', 'marcio@email.com', '74649087082', 4600, false);