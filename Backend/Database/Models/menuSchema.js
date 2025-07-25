const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
  sectionname: {
    type: String,
    required: true
  },
  menuitems: [
    {
      itemname: {
        type: String,
      },
      price: {
        type: Map,
        of: Number, // allows dynamic sizes like half/full or small/medium/large
      }
    }
  ]
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
