const { ipcRenderer } = require('electron');
const database = require('./database');

const modal = document.querySelector('#modal');
const buttonShowModal = document.querySelector('#button-show-modal');
const buttonCloseModal = document.querySelector('#button-close-modal');
const buttonAdd = document.querySelector('#button-add');
const buttonDelete = document.querySelector('#button-delete');
const inputDescription = document.querySelector('#input');
const form = document.querySelector('#form');
const itemList = document.querySelector('#items');
const noItems = document.querySelector('#no-items');

const showModal = () => {
  modal.style.display = 'flex';
  clearInput();
  inputDescription.focus();
};

const hideModal = () => {
  modal.style.display = 'none';
};

const clearInput = () => {
  inputDescription.value = '';
};

const renderDelete = () => {
  const anySelected = document.querySelectorAll('.item.selected').length > 0;
  buttonDelete.style.display = anySelected ? 'block' : 'none';
};

const save = description => {
  clearInput();
  database.save(description);
  hideModal();
  render();
};

buttonShowModal.addEventListener('click', showModal);
buttonCloseModal.addEventListener('click', hideModal);

form.addEventListener('submit', e => {
  e.preventDefault();
  save(inputDescription.value);
});

const remove = () => {
  const selectedItems = document.querySelectorAll('.item.selected');
  selectedItems.forEach(itemNode => database.delete(itemNode.dataset.id));
  render();
};

buttonDelete.addEventListener('click', () => {
  remove();
});

const render = () => {
  const items = database.all();
  itemList.innerHTML = '';
  noItems.style.display = items.length ? 'none' : 'block';

  items.forEach(item => {
    const itemNode = document.createElement('div');
    itemNode.setAttribute('class', 'item');
    itemNode.setAttribute('data-id', item.id);

    const descriptionNode = document.createElement('h2');
    descriptionNode.innerText = item.description;

    const checkNode = document.createElement('input');
    checkNode.setAttribute('class', 'item-check');
    checkNode.setAttribute('type', 'checkbox');

    itemNode.appendChild(descriptionNode);
    itemNode.appendChild(checkNode);

    itemList.appendChild(itemNode);

    checkNode.addEventListener('click', e => {
      e.cancelBubble = true;
      itemNode.classList.remove('selected');
      if (checkNode.checked) {
        itemNode.classList.add('selected');
      }
      renderDelete();
    });

    itemNode.addEventListener('click', () => {
      checkNode.click();
    });
  });
  renderDelete();
};

document.addEventListener('DOMContentLoaded', () => {
  render();
});

// IPC

ipcRenderer.on('menu-add-click', () => {
  showModal();
});

ipcRenderer.on('menu-delete-click', () => {
  remove();
});
