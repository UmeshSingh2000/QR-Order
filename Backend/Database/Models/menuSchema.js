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
        required: true
      },
      price: {
        type: Map,
        of: Number, // allows dynamic sizes like half/full or small/medium/large
        required: true
      }
    }
  ]
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
