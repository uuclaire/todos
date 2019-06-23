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
          class="todo-content"
          style="${item.checked ? 'text-decoration: line-through;' : ''}"
        >
          ${item.value}
        </span>
        <input 
          type="text" 
          class="todo-edit" 
          style="${item.editing ? '' : 'display:none;'}"
          value="${item.value}"
        >
        <button class="btn-delete">删除</button>
      </li>
    `
  }

  list.innerHTML = html;
};
var renderBtnAll = function () {
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].checked) {
      btnCheck.checked = true;
      btnClear.style.display = 'inline';
      return;
    } else {
      btnCheck.checked = false;
      btnClear.style.display = 'none';
    }
  }
  if (todos.length === 0) {
    btnCheck.checked = false;
    btnClear.style.display = 'none';
  }
};

var initEvents = function () {
  initAddEvent();
  initItemEvent();
  initOperationEvent();
};

var initAddEvent = function () {
  var addTodo = function () {
    var todo = field.value;
    if (todo) {
      todos.push({
        checked: false,
        // Status.all -> true
        // Status.active -> true
        // Status.completed -> false
        visible: filter !== Status.completed,
        value: todo,
        editing: false,
      });

      renderTodos();
      renderBtnAll();
    }
  };

  btnAdd.addEventListener('click', addTodo);
  field.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      addTodo();
    }
  });
};
var initItemEvent = function () {
  var handler = function (e) {
    var target = e.target;
    var classList = target.classList;
    var li = target.parentNode;
    var idx = li.getAttribute('data-idx')

    if (e.type === 'click' && classList.contains('btn-finish')) {
      todos[idx].checked = target.checked;
    } else if (e.type === 'click' && classList.contains('btn-delete')) {
      todos.splice(idx, 1);
    } else if (e.type === "dblclick" && classList.contains('todo-content')) {
      todos[idx].editing = true;
      setTimeout(function () {
        list.querySelector(`[data-idx="${idx}"] .todo-edit`).focus();
      });
    } else if ((e.type === 'focusout' || e.key === 'Enter') && classList.contains('todo-edit')) {
      todos[idx].editing = false;
      todos[idx].value = target.value;
    } else {
      return;
    }

    renderTodos();
    renderBtnAll();
  }

  list.addEventListener('click', handler);
  list.addEventListener('dblclick', handler);
  list.addEventListener('focusout', handler);
  list.addEventListener('keyup', handler)
};
var initOperationEvent = function () {
  btnCheck.addEventListener('click', function () {
    for (var i = 0; i < todos.length; i++) {
      todos[i].checked = btnCheck.checked;
    }

    renderTodos();
    renderBtnAll();
  });

  btnAll.addEventListener('click', function () {
    filter = Status.all;
    for (var i = 0; i < todos.length; i++) {
      var todo = todos[i];
      todo.visible = true;
    }

    renderTodos();
    renderBtnAll();
  });
  btnActive.addEventListener('click', function () {
    filter = Status.active;
    for (var i = 0; i < todos.length; i++) {
      var todo = todos[i];
      todo.visible = !todo.checked;
    }

    renderTodos();
    renderBtnAll();
  });
  btnCompleted.addEventListener('click', function () {
    filter = Status.completed;
    for (var i = 0; i < todos.length; i++) {
      var todo = todos[i];
      todo.visible = todo.checked;
    }

    renderTodos();
    renderBtnAll();
  });

  btnClear.addEventListener('click', function () {
    todos = todos.filter(function (todo) {
      return !todo.checked;
    });
    renderTodos();
    renderBtnAll();
  });
};

init();