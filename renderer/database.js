const Store = require('electron-store');

const store = new Store({ name: 'data' });

const newObject = description => {
  const id = Math.round(Math.random() * Math.pow(10, 10));
  return { id, description, createdAt: Date.now() };
};

exports.save = description => {
  const item = newObject(description);
  store.set(`data.${item.id}`, item);

  return this.all();
};

exports.all = () => {
  const rootObject = store.get('data');

  let data;
  if (rootObject) {
    data = Object.values(rootObject).sort((a, b) => a.createdAt - b.createdAt);
  } else {
    data = [];
  }

  return data;
};

exports.delete = id => {
  store.delete(`data.${id}`);

  return this.all();
};
