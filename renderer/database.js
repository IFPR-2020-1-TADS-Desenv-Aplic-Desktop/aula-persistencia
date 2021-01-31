const newObject = description => {
  const id = Math.round(Math.random() * Math.pow(10, 10));
  return { id, description };
};

exports.save = description => {
  const data = this.all();
  data.push(newObject(description));

  localStorage.setItem('data', JSON.stringify(data))

  return this.all();
};

exports.all = () => {
  const jsonData = localStorage.data;
  if (!jsonData) {
    data = [];
  } else {
    data = JSON.parse(jsonData);
  }

  return data;
};

exports.delete = id => {
  const data = this.all();

  const index = data.findIndex(item => item.id == id);

  data.splice(index, 1);
  localStorage.setItem('data', JSON.stringify(data))

  return this.all();
};
