#so.fastgap

### Algumas notas importantes
- O so.fastgap usa o padrão AMD em seu desenvolvimento, caso não tenha conhecimento sobre ele, é aconselhável pesquisar um pouco sobre o mesmo. 

### Estrutura de diretórios

```
|-- dist
|-- docs
+-- src
    +-- assets
    |   |-- css
    |   |-- images
    |   |-- js
    |   |   |-- controllers
    |   |   |-- core
    |   |   +-- models
    |   +-- layouts
    +-- vendor

```


- `dist`: Onde ficarão os arquivos finais do aplicativo após o build.
- `docs`: Onde se encontram os arquivos da documentação.
- `src`: Diretório com os arquivos fonte do projeto
- `src/assets`: Diretório com os arquivos fonte do projeto.
- `src/assets/css`: Arquivos de estilo.
- `src/assets/images`: Imagens usadas no projeto.
- `src/assets/js/controllers`: Controllers usados no projeto
- `src/assets/js/core`: Diretório com os arquivos de base do so.fastgap
- `src/assets/js/models`: Models usados no projeto.
- `src/vendor`: Diretório destinado as bibliotecas de terceiros.


### Controllers 

No so.fastgap um controller representa um conjunto de telas do aplicativo que servem a um propósito comum. 
Poderíamos usar como exemplo de controller uma seção de contatos, onde você pode listar, criar/editar, ver detalhes e excluir contatos.

Um controller pode ter uma ou mais telas e cada uma dessas telas devem ser representadas com uma action.

#### O que são actions?
Actions são métodos do controller que são responsáveis por implementar toda a lógica que será usada na sua respectiva tela.

#### Criando controllers
Para criar um controller, você deve criar um novo arquivo no diretório destinados a controllers e criar um modulo e implementa-lo herdando do modulo `SFG.Controller`. Além disso todos os controllers devem ser nomeados usando [CamelCase](http://pt.wikipedia.org/wiki/CamelCase) e sucedidos pelo sufixo `Controller`.

**Ex:** Se meu controller chama-se `Contacts` então será nomeado como `ContactsController`.


A estrutura básica do meu controller ficaria da seguinte forma:
```javascript
define('ContactsController', ['SFG', 'SFG.Controller'], function (SFG, Controller) {
    return SFG.extend(Controller, {
        main: function (intent) {
            //...
        }

		// ...
	});
});
```

Por padrão sempre que um controller é invocado por uma *Intent* sem ser definida uma action em especifica, a action `main` será chamada. Isso pode ser útil em controllers que não possuirão mais de uma tela. Você pode criar apenas a action `main` e quando estiver criando uma *Intent* não precisará especificar qual action será chamada.


Existem alguns métodos e atributos padrões implementados no modulo `SFG.Controller` que são importantes que sejam conhecidos.


#### Atributos do controller
| Atributo        | Tipo       | Valor padrão   | Descrição                        |
|:----------------|:----------:|:--------------:|:---------------------------------|
|**`transition`** | `String`   | `null`         | Efeito de transição que será usado na entrada do controller ou na troca de actions |
|**`view`**       | `Object`   | `null`         | Objecto do Zepto referente ao layout do controller |
|**`data`**       | `Object`   |                | Objecto para guardar dados que pode ser usados entre actions enquanto a instancia do controller existir |

#### Métodos do controller

***initialize():*** Metódo executado sempre que uma instancia de um controller é criada.

***destroy():*** Metódo executado antes que uma instancia de um controller seja destruída.

***get(*** `String` *key* ***):*** Retorno um dado salvo na instancia do controller.

***set(*** `String` *key*, `Mixed` *value* ***):*** Salva um dado na instancia do controller.

***loadResources(*** `Function` *callback* ***):*** Carrega o recursos que o controller irá precisar.

***unloadResources():*** Destrói todos os recursos criados pelo controller.

***waitForResult(*** `Function` *callback* ***):*** Define um callback para receber os resultados de uma *Intent* que será iniciada.

***startIntent(*** `Intent` *intent* ***):*** Executa uma *Intent*.

***getViewByAction(*** `String` *action* ***):*** Retorna um objeto do Zepto referente ao elemento que contem a estrutura da tela de um action especifica.

***on(*** `String` *event*, `Object` *element*, `Function` *callback* ***):*** Atribui um handler a um evento de um elemento da tela da action ativa. Esse handler será destruído sempre que uma action ou controller for alterado, ou seja, sempre que uma tela deixar de ser exibida o evento não será mais capturado. Esse comportamento não se aplica se você iniciar uma nova Intent que retornará algum resultado.



#### Layouts


###Intents
A navegação 

###Transições

####Ciclo de vida