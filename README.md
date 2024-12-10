# Projeto de Produtos - Relacionamentos entre Entidades

Este projeto utiliza o **NestJS** com **TypeORM** para gerenciar um sistema de produtos. Abaixo estão as instruções para configurar os relacionamentos entre as entidades `ProdutoEntity`, `ProdutoCaracteristicaEntity` e `ProdutoImageEntity`, e como enviar os dados de forma adequada por meio de uma requisição via **Insomnia**.

## Relacionamentos entre Entidades

### 1. **ProdutoEntity**
A entidade `ProdutoEntity` representa um produto no sistema. Ela possui os seguintes campos:

- `id`: Identificador único do produto (UUID).
- `usuarioId`: Referência ao ID do usuário dono do produto.
- `nome`: Nome do produto.
- `valor`: Preço do produto.
- `quantidade`: Quantidade disponível do produto.
- `descricao`: Descrição do produto.
- `categoria`: Categoria à qual o produto pertence.
- `createdAt`: Data de criação do produto.
- `updatedAt`: Data de última atualização do produto.
- `deletedAt`: Data de exclusão do produto (caso seja excluído).

Além disso, a entidade `ProdutoEntity` possui um relacionamento de **um para muitos** com `ProdutoCaracteristicaEntity` e `ProdutoImageEntity`.

### 2. **ProdutoCaracteristicaEntity**
A entidade `ProdutoCaracteristicaEntity` representa características específicas do produto, como "Cor", "Tamanho", "Peso", etc. Ela tem o seguinte relacionamento com a `ProdutoEntity`:

- `id`: Identificador único da característica (UUID).
- `nome`: Nome da característica (Ex: "Cor", "Tamanho").
- `descricao`: Descrição detalhada da característica.
- `produto`: Relacionamento de muitos para um com `ProdutoEntity`.

### 3. **ProdutoImageEntity**
A entidade `ProdutoImageEntity` representa imagens associadas a um produto. Ela tem o seguinte relacionamento com a `ProdutoEntity`:

- `id`: Identificador único da imagem (UUID).
- `url`: URL da imagem.
- `descricao`: Descrição da imagem (Ex: "Imagem frontal").
- `produto`: Relacionamento de muitos para um com `ProdutoEntity`.

### Relacionamento entre as entidades:
- **ProdutoEntity** tem **muitos** `ProdutoCaracteristicaEntity` e **muitos** `ProdutoImageEntity`.
- As entidades `ProdutoCaracteristicaEntity` e `ProdutoImageEntity` possuem uma chave estrangeira (`produtoId`) que referencia a `ProdutoEntity`.

### Código das Entidades

#### ProdutoEntity

```typescript
@Entity({ name: 'produtos' })
export class ProdutoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', length: 100, nullable: false })
  usuarioId: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'valor', nullable: false })
  valor: number;

  @Column({ name: 'quantidade', nullable: false })
  quantidade: number;

  @Column({ name: 'descricao', length: 100, nullable: false })
  descricao: string;

  @Column({ name: 'categoria', length: 100, nullable: false })
  categoria: string;

  @OneToMany(() => ProdutoCaracteristicaEntity, (produtoCaracteristicaEntity) => produtoCaracteristicaEntity.produto, { cascade: true, eager: true })
  caracteristicas: ProdutoCaracteristicaEntity[];

  @OneToMany(() => ProdutoImageEntity, (produtoImagemEntity) => produtoImagemEntity.produto, { cascade: true, eager: true })
  produtoImagem: ProdutoImageEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
```

### ProdutoCaracteristicaEntity
```typescript
@Entity({ name: 'produto_caracteristicas' })
export class ProdutoCaracteristicaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'descricao', length: 100, nullable: false })
  descricao: string;

  @ManyToOne(() => ProdutoEntity, (produto) => produto.caracteristicas, { orphanedRowAction: 'delete', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  produto: ProdutoEntity;
}

```

### ProdutoImageEntity
```typescript
@Entity({ name: 'produto_imagens' })
export class ProdutoImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'url', length: 100, nullable: false })
  url: string;

  @Column({ name: 'descricao', length: 100, nullable: false })
  descricao: string;

  @ManyToOne(() => ProdutoEntity, (produto) => produto.produtoImagem, { orphanedRowAction: 'delete', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  produto: ProdutoEntity;
}

```
Com base nessa relação entre as tabelas, e com o banco de dados ja estrurado com a FK na tabela de produto_caracteristica e em produto_imagem, quando enviamos o json no body da requisição, ela ja alimenta ambas as tabelas, mas para isso, o body da req deve seguir como no exemplo abaixo:

```
{
  "usuarioId": "123e4567-e89b-12d3-a456-426614174000", 
  "nome": "Smartphone X1000",
  "valor": 1500,
  "quantidade": 50,
  "descricao": "O smartphone X1000 é a escolha ideal para quem busca inovação.",
  "categoria": "Eletrônicos",
  "caracteristicas": [
    {
      "nome": "Cor",
      "descricao": "Preto"
    },
    {
      "nome": "Tela",
      "descricao": "6.5 polegadas"
    },
    {
      "nome": "Processador",
      "descricao": "Octa-core 2.8 GHz"
    }
  ],
  "imagens": [
    {
      "url": "http://exemplo.com/imagem_frontal.jpg",
      "descricao": "Imagem frontal do Smartphone X1000"
    },
    {
      "url": "http://exemplo.com/imagem_lateral.jpg",
      "descricao": "Imagem lateral do Smartphone X1000"
    }
  ]
}

```

Com isso, foi criado um produto novo, com as características e imagens sendo armazenadas diretamente numa tabela única, utilizando o conceito de relacionamento.


### **Configuração do `imports` no NestJS**

- **O que são `imports`?**
  - O `imports` no NestJS é um campo que você configura dentro de cada **module** (módulo). Ele serve para registrar e disponibilizar funcionalidades de outros módulos para que o módulo atual possa utilizá-las. 
  - No caso de entidades, usamos o `TypeOrmModule.forFeature([NomeDaEntidade])` para registrar as entidades que serão utilizadas dentro do módulo. Isso permite que o NestJS saiba sobre as entidades e crie o repositório adequado para interagir com o banco de dados.

- **Como o `imports` é utilizado?**
  - No NestJS, ao criar uma entidade, é necessário importar essa entidade dentro de um módulo, para que o repositório da entidade seja registrado e você possa utilizar o **`Repository`** da entidade para realizar operações no banco de dados.
  - Exemplo:
    ```typescript
    @Module({
      imports: [TypeOrmModule.forFeature([ProdutoEntity, ProdutoCaracteristicaEntity, ProdutoImageEntity])],
      providers: [ProdutoService],
      controllers: [ProdutoController]
    })
    export class ProdutoModule {}
    ```
    - O **`TypeOrmModule.forFeature`** registra as entidades que são necessárias dentro desse módulo para interagir com o banco de dados.
  
- Fazendo isso, eu torno possível o acesso das tabelas do banco de dados, nos módulos, como no módulo do controller, e do provider (service)
- Uma coisa importante a se dizer, o que torna possível realizar os update, delete, save e etc nos service, é o `Repository` do typeorm, com ele isso se torna possível, mas para que eu consiga acessar as tabelas e realizar esses feitos nas tabelas, so funciona se passarmos o `imports` e realizarmos o padrão acima.

## Rodando o Projeto com Docker

### 1. **Clone o repositório e instale as dependências**

```bash
npm install
```

Para rodar o docker com o banco de dados, fazendo rodar o banco na url do pgAdmin 4: http://localhost:8081
```bash
  docker compose up -d
```

Para rodar o servidor
```bash
  npm run start:dev
```




