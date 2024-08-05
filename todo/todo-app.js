(function () {
  //создаем массив для сохранения дел
  let listArray = [];
  let listName = "";

  //создаём заголовок
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    // возвращаем заголовок
    return appTitle;
  }

  //создаем форму
  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");
    // стили формы
    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Enter new task name";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Add task";

    // делаем кнопку не активной
    button.disabled = true;
    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // создаём функцию, для проверки, если input не пустой, делать кнопку активной
    input.addEventListener("input", function () {
      if (input.value !== "") {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    });

    return {
      form,
      input,
      button,
    };
  }
  //создаём лист
  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  // создаём элемент списка
  function createTodoItem(obj) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    //добавляем стили элементу списка
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = obj.name;

    //стили для кнопок у элемента списка
    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Done";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Delete";

    // если у задания статус - сделано, добавляем элементу списка стиль успешной операции
    if (obj.done == true) {
      item.classList.add("list-group-item-success");
    }

    doneButton.addEventListener("click", function () {
      item.classList.toggle("list-group-item-success");

      for (const listItem of listArray) {
        if (listItem.id == obj.id) {
          listItem.done = !listItem.done;
        }
        //сохраниение для выполненного дела
        saveList(listArray, listName);
      }
    });
    // функция удаления кнопки, запрашивает соглашение на удаление
    deleteButton.addEventListener("click", function () {
      if (confirm("Are you sure?")) {
        item.remove();

        for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id == obj.id) {
            listArray.splice(i, 1);
          }
        }
      }
      //сохранение при удалении
      saveList(listArray, listName);
    });
    // объединяем кнопки элемента в отдельный блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  //Создаём функцию для получения уникального id
  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      // при нахождении большего ID, присваиваем max значение самого большого числа
      if (item.id > max) {
        max = item.id;
      }
    }
    // возвращаем максимальное число прибавляя 1
    return max + 1;
  }
// создаём функцию для сохранения данных в localStorage
  function saveList(arr, keyName) {
  // преобразовываем массив в строку
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  // основная фуекция создания приложения , сюда добавляем элементы
  function createTodoApp(
    container,
    title = "Tasks list",
    keyName,
    defArray = []
  ) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
//делаем переменную keyName - глобальной
    listName = keyName;

    listArray = defArray;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
// при первом запуске приложения, нужно расшифровать массив
    let localData = localStorage.getItem(listName);
//проверка на пустоту, если localData не пустая , делаем расшифровку
    if (localData !== null && localData !== "") {
      // превращаем из строки в массив
      listArray = JSON.parse(localData);
    }

    for (const itemList of listArray) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    // добавляем для формы отправку
    todoItemForm.form.addEventListener("submit", function (e) {
      //прерываем действие по умолчанию
      e.preventDefault();

      // делаем проверку формы , если форма пустая прерываем создание элемента
      if (!todoItemForm.input.value) {
        return;
      }

      let newItem = {
        id: getNewID(listArray),
        name: todoItemForm.input.value,
        done: false,
      };

      let todoItem = createTodoItem(newItem);

      listArray.push(newItem);
// сохраняем список при добавлении дела
      saveList(listArray, listName);

      todoList.append(todoItem.item);

      // после каждой отправки , деактивируем кнопку
      todoItemForm.button.disabled = true;
      //после отправки обновляем форму
      todoItemForm.input.value = "";
    });
  }

  window.createTodoApp = createTodoApp;
})();
