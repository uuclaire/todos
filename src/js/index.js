var list = document.getElementById('todos');
var field = document.getElementById('field');
var btnAdd = document.getElementById('btn-add');
var btnCheck = document.getElementById('btn-check');
var btnAll = document.getElementById('btn-all');
var btnActive = document.getElementById('btn-active');
var btnCompleted = document.getElementById('btn-completed');
var btnClear = document.getElementById('btn-clear');

var Status = {
  all: 0,
  active: 1,
  completed: 2,
};

// Model数据
var filter = Status.all;
var todos = [];

// View视图
// 渲染
var View = {};

// Controller控制器
// 数据处理
var Controller = {};

// 自顶向下逐步求精的过程
function init() {
  recoverTodos(); // 从localStorage里面恢复todos记录
  renderTodos(); // 渲染todos记录到页面中
  initEvents(); // 初始化所有事件
}

var recoverTodos = function () {};
var renderTodos = function () {
  var html = '';
  for (var i = 0; i < todos.length; i++) {
    var item = todos[i];
    html += `
      <li 
        style="${!item.visible ? 'display: none;' : ''}"
        class="todo-item" 
        data-idx="${i}"
      >
        <input type="checkbox" class="btn-finish" ${item.checked ? 'checked' : ''}>
        <span 
          style="${item.checked ? 'text-decoration: line-through;' : ''}"
        >
          ${item.value}
        <span>
        <button class="btn-delete">删除</button>
      </li>
    `
  }

  list.innerHTML = html;
};
var initEvents = function () {
  initAddEvent();
  initItemEvent();
  initOperationEvent();
};

var initAddEvent = function () {
  btnAdd.addEventListener('click', function () {
    var todo = field.value;

    if (todo) {
      todos.push({
        checked: false,
        // Status.all -> true
        // Status.active -> true
        // Status.completed -> false
        visible: filter !== Status.completed,
        value: todo,
      });
      renderTodos();
    }
  });
};
var initItemEvent = function () {
  list.addEventListener('click', function (e) {
    var target = e.target;
    var classList = target.classList;
    var li = target.parentNode;
    var idx = li.getAttribute('data-idx');

    if (classList.contains('btn-finish')) {
      todos[idx].checked = true;
    } else if (classList.contains('btn-delete')) {
      todos.splice(idx, 1);
    }

    renderTodos();
  });
};
var initOperationEvent = function () {
  btnCheck.addEventListener('click', function () {
    for (var i = 0; i < todos.length; i++) {
      todos[i].checked = btnCheck.checked;
    }

    renderTodos();
  });

  btnAll.addEventListener('click', function () {
    filter = Status.all;
    for (var i = 0; i < todos.length; i++) {
      var todo = todos[i];
      todo.visible = true;
    }

    renderTodos();
  });
  btnActive.addEventListener('click', function () {
    filter = Status.active;
    for (var i = 0; i < todos.length; i++) {
      var todo = todos[i];
      todo.visible = !todo.checked;
    }

    renderTodos();
  });
  btnCompleted.addEventListener('click', function () {
    filter = Status.completed;
    for (var i = 0; i < todos.length; i++) {
      var todo = todos[i];
      todo.visible = todo.checked;
    }

    renderTodos();
  });

  btnClear.addEventListener('click', function () {
    todos = todos.filter(function (todo) {
      return !todo.checked;
    });

    renderTodos();
  });
};

init();