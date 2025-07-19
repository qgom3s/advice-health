# Advice Health - Desafio Técnico Full Stack

> Stack utilizada:  Django, React e PostgreSQL.

## Overview do Desafio

O desafio consiste em desenvolver uma aplicação web para gerenciamento de tarefas, permitindo que os usuários criem, leiam, atualizem e excluam tarefas. A aplicação deve ser dividida em duas partes: o backend, desenvolvido em Django, e o frontend, desenvolvido em React.

**Requisitos obligatórios:**

- [x] CRUD de tarefas;
- [x] Autenticação de Usuário (Registro, Login, Logout);
- [x] Marcar tarefas como concluídas/incompletas;
- [x] Filtragem de Tarefas por categoria;
- [x] Paginação de Tarefas;
- [x] Frontend em React e,
- [x] Backend em Django.

**Requisitos opcionais:**

- [x] Criação e gerenciamento de categorias;
- [x] Compartilhamento de tarefas entre usuários;
- [x] Dockerização da aplicação (Docker + Docker Compose) e,
- [x] Testes unitários.
> ⚠️ Não foram adicionados testes no frontend devido à simplicidade da interface.

Portanto, todos os requisitos obrigatórios e opcionais foram implementados.

## Instruções de Instalação

Você precisa ter o Docker e o Docker Compose instalados em sua máquina. Siga os passos abaixo para rodar a aplicação:

1. Clone o repositório:
```bash
git clone https://github.com/qgom3s/advice-health
cd advice-health
```

2. (opcional) Crie um arquivo `.env` na raiz do projeto com as variáveis de ambiente necessárias. Você pode usar o arquivo `.env.example` como referência.

3. Execute o Docker Compose:
```bash
docker-compose up --build
```

4. Acesse a aplicação em `http://localhost:3000` para o frontend e `http://localhost:8000` para o backend.

## Considerações sobre a Tarefa

Optei por uma arquitetura separando o frontend (React) do backend (Django REST Framework) para garantir escalabilidade, manutenibilidade e flexibilidade. Essa abordagem desacoplada permite que cada parte evolua de forma independente, além de facilitar a integração com outros serviços no futuro (ex: mobile, API externa). Para desafios, essa separação é ideal, pois permite que o foco seja na implementação de funcionalidades específicas sem a complexidade de um monolito.

**Backend (Django + DRF):**

- Django REST Framework: oferece uma estrutura robusta, segura e produtiva para construção de APIs RESTful, com suporte nativo a autenticação, permissões e serialização de dados.

- JWT (JSON Web Token): utilizado para autenticação segura e stateless via `djangorestframework-simplejwt`, permitindo fácil integração com o frontend.

- CORS: habilitado com `django-cors-headers` para permitir requisições entre domínios diferentes (ex: React no `localhost:3000` e Django no `localhost:8000`).

- PostgreSQL: banco relacional confiável, bem suportado pelo Django, com suporte a relações entre tarefas, categorias e usuários.

**Frontend (React):**

- React: escolhido pela capacidade de construir interfaces dinâmicas, reutilizáveis e de rápida resposta.

- Axios: usado para comunicação com a API, facilitando o envio de tokens e o tratamento de respostas HTTP.

- Gerenciamento simples de estado com hooks (`useState`, `useEffect`), suficiente para o escopo do projeto.

**Porque desenvolver com Docker e Docker Compose:**

- Garantem isolamento dos serviços e facilidade de setup para qualquer ambiente, eliminando conflitos de dependência e simplificando o deploy.

- Uso de volumes para persistência dos dados do banco.

## Considerações Finais

A stack escolhida — Django REST Framework no backend e React no frontend — é amplamente utilizada no mercado, especialmente em aplicações com interfaces ricas e APIs robustas. A separação entre backend e frontend permite maior escalabilidade, integração com múltiplos clientes e facilita a manutenção do projeto.

Embora Django e React não sejam as tecnologias que mais domino atualmente, foi uma experiência enriquecedora resolver desafios práticos, principalmente relacionados à integração entre os serviços, autenticação via JWT, controle de CORS e consistência no fluxo de dados. Essa vivência reforçou a importância de entender os pontos de contato entre diferentes camadas da aplicação.

O projeto buscou atender às demandas do desafio com foco em clareza, organização e boas práticas, priorizando código limpo e funcional.