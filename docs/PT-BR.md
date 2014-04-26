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

Toda action quando é executada recebe como parâmentro a *[Intent](#intents)* que a invocou.
 
#### Criando controllers
Para criar um controller, você deve criar um novo arquivo no diretório destinados a controllers e criar um modulo e implementa-lo herdando do modulo `SFG.Controller`. Além disso todos os controllers devem ser nomeados usando [CamelCase](http://pt.wikipedia.org/wiki/CamelCase) e sucedidos pelo sufixo `Controller`. Este mesmo nome deve ser usado no arquivo.

**Ex:** Se meu controller chama-se `Contacts` então será nomeado como `ContactsController`.


A estrutura básica do meu controller ficaria da seguinte forma:


```javascript
# js/controllers/ContactsController.js

define('ContactsController', ['SFG', 'SFG.Controller'], function (SFG, Controller) {
    return SFG.extend(Controller, {
        main: function (intent) {
            //...
        }

		// ...
	});
});
```

Por padrão sempre que um controller é invocado por uma *[Intent](#intents)* sem ser definida uma action em especifica, a action `main` será chamada. Isso pode ser útil em controllers que não possuirão mais de uma tela. Você pode criar apenas a action `main` e quando estiver criando uma *[Intent](#intents)* não precisará especificar qual action será chamada.


Existem alguns métodos e atributos padrões implementados no modulo `SFG.Controller` que são importantes que sejam conhecidos.


#### Atributos do controller
| Atributo        | Tipo       | Valor padrão   | Descrição                        |
|:----------------|:----------:|:--------------:|:---------------------------------|
|***transition*** | `String`   | `null`         | Efeito de transição que será usado na entrada do controller ou na troca de actions |
|***view***       | `Object`   | `null`         | Objecto do Zepto referente ao layout do controller |
|***data***       | `Object`   |                | Objecto para guardar dados que pode ser usados entre actions enquanto a instancia do controller existir |

#### Métodos do controller

***initialize():*** Metódo executado sempre que uma instancia de um controller é criada.

***destroy():*** Metódo executado antes que uma instancia de um controller seja destruída.

***get(*** `String` *key* ***):*** Retorno um dado salvo na instancia do controller.

***set(*** `String` *key*, `Mixed` *value* ***):*** Salva um dado na instancia do controller.

***loadResources(*** `Function` *callback* ***):*** Carrega o recursos que o controller irá precisar.

***unloadResources():*** Destrói todos os recursos criados pelo controller.

***waitForResult(*** `Function` *callback* ***):*** Define um callback para receber os resultados de uma *Intent* que será iniciada.

***startIntent(*** `Intent` *intent* ***):*** Executa uma *[Intent](#intents)*.

***getViewByAction(*** `String` *action* ***):*** Retorna um objeto do Zepto referente ao elemento que contem a estrutura da tela de um action especifica.

***on(*** `String` *event*, `Object` *element*, `Function` *callback* ***):*** Atribui um handler a um evento de um elemento da tela da action ativa. Esse handler será destruído sempre que uma action ou controller for alterado, ou seja, sempre que uma tela deixar de ser exibida o evento não será mais capturado. Esse comportamento não se aplica se você iniciar uma nova *[Intent](#intents)* que retornará algum resultado.


### Layouts
Todo controller deve possuir um arquivo de layout com todas as telas das actions do mesmo. 

O arquivo deve está na pasta de layout e deve receber o nome do controller todo em letras minúsculas e em caso de nomes compostos, separados por underline.

**Ex:** 
```
ContactsController > contacts.html
ContactsManagerController > contacts_manager.html
``` 

A cada elemento que represente uma tela deve possuir a class `action` e ter o atributo `data-action` especificando a qual action aquela tela pertence.


Seguindo o exemplo do controller de contatos, adicionaremos mais uma action ao controller, isso resultará em:


```javascript
# js/controllers/ContactsController.js

define('ContactsController', ['SFG', 'SFG.Controller'], function (SFG, Controller) {
    return SFG.extend(Controller, {
        main: function (intent) {
            //...
        },
        show: function (intent) {
            //...
        }
	});
});
```

```html
# layouts/contacts.html

<section class="action" data-action="main">
	// ...
</section>
<section class="action" data-action="show">
	// ...
</section>
```


###Intents
A navegação entre telas no so.fastgat é feita a partir de Intents. Uma intent é um objeto que contem informações de qual o controller e action que será invocado, os dados que serão passados de uma tela para outra alem de informar se deverá ser mantido ou não os recursos que foram carregados pela tela anterior.

Uma Intent por ser criada de duas formas.

A primeira é ser representada por um elemento na tela que possua a class `intent` e os atributos `data-intent`, `data-intent-data` e `data-intent-forResults`

***data-intent***: Recebe o caminho do controller e action que será invocado. O caminho devera ser descrito seguindo o padrão `controller#action`. O nome do controller deve está todo em minúsculo e em casos de nome composto, separado por underline. Por exemplo: `contacts_manager#show`

***data-intent-data*** *(opcional)*: Dados opcionais que poderão ser passados para a próxima tela.

***data-intent-forResults*** *(opcional)*: Define se a tela que será exibida retornará algum informação para a tela atual. Os valores possíveis são `true` e `false`. Quando true, conserva a instancia do controller e os recursos da tela atual.

```html
<button 
    class="intent" 
    data-intent="contacts#show"
    data-intent-data='{"name": "John Doe"}' 
    data-intent-forResults="true"
>Show!</button>
```


###Ciclo de vida



###Transições

