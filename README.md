# Projeto de Backend com Express e PostgreSQL

Este é um projeto simples de backend desenvolvido com Express.js e PostgreSQL. Ele fornece uma API para gerenciar informações de usuários, incluindo nome, sobrenome, email, data de nascimento, idade e signo do zodíaco.

## Pré-requisitos

Certifique-se de ter o Node.js e o npm instalados em seu sistema. Além disso, é necessário ter o PostgreSQL instalado e em execução em sua máquina.

## Configuração do Projeto

1. **Clonar o repositório:**
```
git clone https://github.com/caiquenaimi/back_banco.git
```
2. **Instalar dependências:**
```
npm install
```
4. **Configurar o banco de dados:** 
- Crie um banco de dados PostgreSQL com o nome 'aulaback':
  ```
  CREATE DATABASE aulaback;
  ```
- Ajuste as credenciais do banco de dados no arquivo `app.js`, se necessário.

## Inicializando o Servidor

Para iniciar o servidor Express, execute o seguinte comando:
```
npm run dev
```
O servidor será iniciado na porta 3000 por padrão.

## Rotas Disponíveis

- **GET /usuarios:** Retorna todos os usuários cadastrados.
- **GET /usuarios/:id:** Retorna um usuário específico com base no ID fornecido.
- **POST /usuarios:** Adiciona um novo usuário.
- **PUT /usuarios/:id:** Atualiza as informações de um usuário existente.
- **DELETE /usuarios/:id:** Exclui um usuário com base no ID fornecido.

## Testando as Rotas

Você pode usar ferramentas como Postman ou simplesmente acessar as rotas no navegador ou em qualquer cliente HTTP para testar as funcionalidades.

## Créditos

Este projeto foi desenvolvido como parte de um exercício prático para praticar o uso do Express.js e PostgreSQL.

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.


