const fs = require('fs');
const path = require('path');

const getProducts = (req, res, next) => {
  try {
    const dataPath = path.join(__dirname, '../data/products.json');
    const productsData = fs.readFileSync(dataPath, 'utf-8');
    const products = JSON.parse(productsData);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts };
