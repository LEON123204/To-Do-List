const addTodoBtn = document.getElementById("addTodoBtn");
const inputTag = document.getElementById("todoInput");
const todoListUl = document.getElementById("todoList");
const remaining = document.getElementById("remaining-count");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
let currentFilter = "all";

let todoText;
let todos = [];
let todoString = localStorage.getItem("todos");
if (todoString) {
  todos = JSON.parse(todoString);
}

const populateTodos = () => {
  let filteredTodos = todos;
  if (currentFilter === "active") {
    filteredTodos = todos.filter((todo) => !todo.isCompleted);
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter((todo) => todo.isCompleted);
  }
  let string = "";
  for (const todo of filteredTodos) {
    string += `<li id="${todo.id}" class="todo-item ${
      todo.isCompleted ? "completed" : ""
    }">
      <input type="checkbox" class="todo-checkbox" ${
        todo.isCompleted ? "checked" : ""
      }>
      <span class="todo-text">${todo.title}</span>
      <button class="delete-btn">×</button>
    </li>`;
  }
  todoListUl.innerHTML = string;

  const todoCheckboxes = document.querySelectorAll(".todo-checkbox");

  todoCheckboxes.forEach((element) => {
    element.addEventListener("click", (e) => {
      if (e.target.checked) {
        element.parentNode.classList.add("completed");
        todos = todos.map((todo) => {
          if (todo.id == element.parentNode.id) {
            return { ...todo, isCompleted: true };
          } else {
            return todo;
          }
        });
          remaining.innerHTML = todos.filter((item) => { return item.isCompleted !== true}).length
        localStorage.setItem("todos", JSON.stringify(todos));
      } else {
        element.parentNode.classList.remove("completed");

        todos = todos.map((todo) => {
          if (todo.id == element.parentNode.id) {
            return { ...todo, isCompleted: false };
          } else {
            return todo;
          }
        });
        remaining.innerHTML = todos.filter((item) => { return item.isCompleted !== true}).length
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    });
  });

clearCompletedBtn.addEventListener("click", () => {
  todos =todos.filter((todo) => todo.isCompleted === false);
  populateTodos()
  localStorage.setItem("todos", JSON.stringify(todos));
});



  let deleteBtns = document.querySelectorAll(".delete-btn");

  deleteBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      if(!confirm("Are you sure you want to delete this todo?")){
        return;
      }
      todos = todos.filter((todo) => {
        return ( todo.id) !== e.target.parentNode.id;
      });
      localStorage.setItem("todos", JSON.stringify(todos));
      populateTodos();
    });
  });
  remaining.innerHTML = todos.filter((item) => { return item.isCompleted !== true}).length
};
addTodoBtn.addEventListener("click", () => {
  todoText = inputTag.value;

  if(todoText.trim().length<4){
    alert("Todo text must be at least 4 characters long.");
    return;
  }

  inputTag.value = "";
  let todo = {
    id: "todo-" + Date.now(),
    title: todoText,
    isCompleted: false,
  };
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
  populateTodos();
});

const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentFilter = this.getAttribute('data-filter');
    populateTodos();
  });
});

populateTodos();
