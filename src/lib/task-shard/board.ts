import { COLUMNS, type ColumnId, type Task } from './types';
import { loadTasks, addTask, updateTask, deleteTask, generateId } from './storage';

export function initBoard(root: HTMLElement): void {
  let tasks = loadTasks();
  let expandedId: string | null = null;

  function render(): void {
    tasks = loadTasks();
    root.innerHTML = '';

    // Add new-task button
    const addBtn = document.createElement('button');
    addBtn.className = 'ts-add-btn';
    addBtn.textContent = '+ New Task';
    addBtn.addEventListener('click', () => openForm());
    root.appendChild(addBtn);

    const board = document.createElement('div');
    board.className = 'ts-board';

    for (const col of COLUMNS) {
      const colEl = document.createElement('div');
      colEl.className = `ts-column ts-col-${col.id}`;
      colEl.dataset.column = col.id;

      const header = document.createElement('h3');
      header.textContent = col.label;
      const count = tasks.filter((t) => t.column === col.id).length;
      const badge = document.createElement('span');
      badge.className = 'ts-count';
      badge.textContent = String(count);
      header.appendChild(badge);
      colEl.appendChild(header);

      const cardList = document.createElement('div');
      cardList.className = 'ts-card-list';

      // Drop zone events
      colEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        colEl.classList.add('ts-drag-over');
      });
      colEl.addEventListener('dragleave', (e) => {
        if (!colEl.contains(e.relatedTarget as Node)) {
          colEl.classList.remove('ts-drag-over');
        }
      });
      colEl.addEventListener('drop', (e) => {
        e.preventDefault();
        colEl.classList.remove('ts-drag-over');
        const taskId = e.dataTransfer?.getData('text/plain');
        if (!taskId) return;
        const task = tasks.find((t) => t.id === taskId);
        if (task && task.column !== col.id) {
          tasks = updateTask({ ...task, column: col.id });
          expandedId = null;
          render();
        }
      });

      for (const task of tasks.filter((t) => t.column === col.id)) {
        cardList.appendChild(renderCard(task));
      }

      colEl.appendChild(cardList);
      board.appendChild(colEl);
    }

    root.appendChild(board);

    // Modal container
    const modal = document.createElement('div');
    modal.id = 'ts-modal';
    modal.className = 'ts-modal-overlay';
    modal.style.display = 'none';
    root.appendChild(modal);
  }

  function renderCard(task: Task): HTMLElement {
    const card = document.createElement('div');
    card.className = 'ts-card' + (expandedId === task.id ? ' ts-expanded' : '');
    card.dataset.id = task.id;
    card.draggable = true;

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer?.setData('text/plain', task.id);
      card.classList.add('ts-dragging');
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('ts-dragging');
    });

    const title = document.createElement('div');
    title.className = 'ts-card-title';
    title.textContent = task.title;

    const desc = document.createElement('div');
    desc.className = 'ts-card-desc';
    desc.textContent = task.shortDescription;

    const due = document.createElement('div');
    due.className = 'ts-card-due';
    due.textContent = task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : '';

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(due);

    if (expandedId === task.id) {
      const full = document.createElement('div');
      full.className = 'ts-card-full';
      full.textContent = task.fullDescription || '(no details)';

      const actions = document.createElement('div');
      actions.className = 'ts-card-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'ts-edit-btn';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openForm(task);
      });
      actions.appendChild(editBtn);

      const delBtn = document.createElement('button');
      delBtn.className = 'ts-delete-btn';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tasks = deleteTask(task.id);
        expandedId = null;
        render();
      });
      actions.appendChild(delBtn);

      card.appendChild(full);
      card.appendChild(actions);
    }

    card.addEventListener('click', () => {
      expandedId = expandedId === task.id ? null : task.id;
      render();
    });

    return card;
  }

  function openForm(existing?: Task): void {
    const modal = root.querySelector('#ts-modal') as HTMLElement;
    if (!modal) return;

    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="ts-form">
        <h3>${existing ? 'Edit Task' : 'New Task'}</h3>
        <label>Title<input id="ts-f-title" type="text" value="${existing?.title ?? ''}" /></label>
        <label>Short Description<input id="ts-f-short" type="text" value="${existing?.shortDescription ?? ''}" /></label>
        <label>Full Description<textarea id="ts-f-full">${existing?.fullDescription ?? ''}</textarea></label>
        <label>Due Date<input id="ts-f-due" type="date" value="${existing?.dueDate ?? ''}" /></label>
        <label>Column
          <select id="ts-f-col">
            ${COLUMNS.map((c) => `<option value="${c.id}" ${(existing?.column ?? 'todo') === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
          </select>
        </label>
        <div class="ts-form-actions">
          <button id="ts-f-save">Save</button>
          <button id="ts-f-cancel">Cancel</button>
        </div>
      </div>
    `;

    modal.querySelector('#ts-f-cancel')!.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    modal.querySelector('#ts-f-save')!.addEventListener('click', () => {
      const title = (modal.querySelector('#ts-f-title') as HTMLInputElement).value.trim();
      if (!title) return;

      const task: Task = {
        id: existing?.id ?? generateId(),
        title,
        shortDescription: (modal.querySelector('#ts-f-short') as HTMLInputElement).value.trim(),
        fullDescription: (modal.querySelector('#ts-f-full') as HTMLTextAreaElement).value.trim(),
        dueDate: (modal.querySelector('#ts-f-due') as HTMLInputElement).value,
        column: (modal.querySelector('#ts-f-col') as HTMLSelectElement).value as ColumnId,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      };

      if (existing) {
        tasks = updateTask(task);
      } else {
        tasks = addTask(task);
      }
      expandedId = null;
      modal.style.display = 'none';
      render();
    });
  }

  render();
}
