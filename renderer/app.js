const { ipcRenderer } = require('electron');
const database = require('./database');
const menu = require('./menu');

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
  menu.enableMenu({ disable: ['new', 'delete'] });
};

const hideModal = () => {
  modal.style.display = 'none';

  const menus = ['new'];
  if (canRemove()) menus.push('delete');
  menu.enableMenu({ enable: menus });
};

const clearInput = () => {
  inputDescription.value = '';
};

const canRemove = () => document.querySelectorAll('.item.selected').length > 0;

const renderDelete = () => {
  const anySelected = canRemove();
  buttonDelete.style.display = anySelected ? 'block' : 'none';

  let menus;
  if (canRemove()) {
    menus = { enable: ['delete'] };
  } else {
    menus = { disable: ['delete'] };
  }
  menu.enableMenu(menus);
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

    const buttonNode = document.createElement('button');
    buttonNode.setAttribute('class', 'button-save');
    buttonNode.innerText = 'Save to File';

    const checkNode = document.createElement('input');
    checkNode.setAttribute('class', 'item-check');
    checkNode.setAttribute('type', 'checkbox');

    itemNode.appendChild(descriptionNode);
    itemNode.appendChild(buttonNode);
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

    itemNode.addEventListener('mouseenter', () => {
      buttonNode.style.display = 'block';
    });

    itemNode.addEventListener('mouseleave', () => {
      buttonNode.style.display = 'none';
    });

    buttonNode.addEventListener('click', e => {
      e.cancelBubble = true;
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

menu.enableMenu({ disable: ['delete'] });
