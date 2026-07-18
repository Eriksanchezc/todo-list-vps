const API_URL = '/api/tasks';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const filterInput = document.getElementById('filter-input');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');
const statusMessage = document.getElementById('status-message');

let allTasks = [];

// Mostrar mensajes de error temporales
function showStatus(msg) {
  statusMessage.textContent = msg;
  setTimeout(() => (statusMessage.textContent = ''), 3000);
}

// Obtener tareas del backend
async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al cargar tareas');
    allTasks = await res.json();
    renderTasks(allTasks);
  } catch (err) {
    showStatus('No se pudieron cargar las tareas. Revisa el backend.');
    console.error(err);
  }
}

// Renderizar la lista de tareas en el DOM
function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }
  emptyMessage.style.display = 'none';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} />
      <span class="task-title">${escapeHtml(task.title)}</span>
      <div class="task-actions">
        <button class="edit-btn" title="Editar">✏️</button>
        <button class="delete-btn" title="Eliminar">🗑️</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Escapar HTML para evitar inyección al mostrar títulos
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Crear tarea (INSERT)
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Error al crear tarea');
    taskInput.value = '';
    await fetchTasks();
  } catch (err) {
    showStatus('No se pudo agregar la tarea.');
    console.error(err);
  }
});

// Delegación de eventos para editar / eliminar / marcar completado
taskList.addEventListener('click', async (e) => {
  const li = e.target.closest('.task-item');
  if (!li) return;
  const id = li.dataset.id;

  // Eliminar (DELETE)
  if (e.target.classList.contains('delete-btn')) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      await fetchTasks();
    } catch (err) {
      showStatus('No se pudo eliminar la tarea.');
      console.error(err);
    }
  }

  // Editar (UPDATE del título)
  if (e.target.classList.contains('edit-btn') || e.target.classList.contains('task-title')) {
    const currentTitle = li.querySelector('.task-title').textContent;
    const newTitle = prompt('Editar tarea:', currentTitle);
    if (newTitle === null || newTitle.trim() === '' || newTitle === currentTitle) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      if (!res.ok) throw new Error('Error al editar');
      await fetchTasks();
    } catch (err) {
      showStatus('No se pudo editar la tarea.');
      console.error(err);
    }
  }
});

// Marcar como completada (UPDATE del estado)
taskList.addEventListener('change', async (e) => {
  if (e.target.type !== 'checkbox') return;
  const li = e.target.closest('.task-item');
  const id = li.dataset.id;
  const completed = e.target.checked;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error('Error al actualizar estado');
    await fetchTasks();
  } catch (err) {
    showStatus('No se pudo actualizar el estado.');
    console.error(err);
  }
});

// Filtro en tiempo real (sobre los datos ya cargados, sin llamar al backend)
filterInput.addEventListener('input', () => {
  const term = filterInput.value.toLowerCase().trim();
  const filtered = allTasks.filter(task =>
    task.title.toLowerCase().includes(term)
  );
  renderTasks(filtered);
});

// Carga inicial
fetchTasks();
