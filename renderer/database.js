const { default: axios } = require('axios');

const newObject = description => {
  return { description, createdAt: Date.now() };
};

exports.save = async description =>
  (await axios.post('http://localhost:3000/items', newObject(description)))
    .data;

exports.all = async () => (await axios.get('http://localhost:3000/items')).data;

exports.delete = async id =>
  await axios.delete(`http://localhost:3000/items/${id}`);
