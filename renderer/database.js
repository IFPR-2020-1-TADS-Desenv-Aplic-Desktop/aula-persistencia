const newObject = description => {
  const id = Math.round(Math.random() * Math.pow(10, 10));
  return { id, description };
};

const data = [newObject('Sample 1'), newObject('Sample 2')];

exports.save = description => {
  data.push(newObject(description));
  return this.all();
};

exports.all = () => {
  return data;
};

exports.delete = id => {
  const index = data.findIndex(item => item.id === id);

  data.splice(index, 1);
  return this.all();
};
