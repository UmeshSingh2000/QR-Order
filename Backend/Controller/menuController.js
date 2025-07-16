const Menu = require('../Database/Models/menuSchema');

const addMenuItem = async (req, res) => {
  const { sectionname, itemname, price } = req.body;

  // Basic validation
  if (!sectionname || !itemname || typeof price !== 'object' || price === null || Array.isArray(price)) {
    return res.status(400).json({
      message: 'sectionname, itemname, and a valid price object (e.g., { half: 100, full: 200 }) are required'
    });
  }

  try {
    // Find if section already exists
    let section = await Menu.findOne({ sectionname });

    if (section) {
      // Check for duplicate item
      const itemExists = section.menuitems.some(
        item => item.itemname.toLowerCase() === itemname.toLowerCase()
      );

      if (itemExists) {
        return res.status(400).json({ message: 'Item already exists in this section' });
      }

      // Add new item to existing section
      section.menuitems.push({ itemname, price });
      await section.save();

      return res.status(200).json({
        message: 'Item added to existing section',
        section
      });
    } else {
      // Create new section and add the item
      const newSection = new Menu({
        sectionname,
        menuitems: [{ itemname, price }]
      });
      await newSection.save();

      return res.status(201).json({
        message: 'New section and item created',
        section: newSection
      });
    }
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const addMultipleMenuItems = async (req, res) => {
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Request body must be a non-empty array' });
  }

  try {
    const groupedBySection = {};

    // Step 1: Group valid items by sectionname
    for (const item of items) {
      const { sectionname, itemname, price } = item;

      // Basic validation for each item
      if (
        !sectionname ||
        !itemname ||
        typeof price !== 'object' ||
        price === null ||
        Array.isArray(price)
      ) {
        continue; // skip invalid
      }

      const key = sectionname.toLowerCase();

      if (!groupedBySection[key]) {
        groupedBySection[key] = {
          originalName: sectionname,
          items: []
        };
      }

      groupedBySection[key].items.push({ itemname, price });
    }

    // Step 2: Save items into their sections
    for (const key in groupedBySection) {
      const { originalName, items } = groupedBySection[key];

      let section = await Menu.findOne({ sectionname: originalName });

      if (section) {
        // Add only new items (avoid duplicates)
        for (const newItem of items) {
          const exists = section.menuitems.some(
            i => i.itemname.toLowerCase() === newItem.itemname.toLowerCase()
          );

          if (!exists) {
            section.menuitems.push(newItem);
          }
        }

        await section.save();
      } else {
        // Create new section
        const newSection = new Menu({
          sectionname: originalName,
          menuitems: items
        });

        await newSection.save();
      }
    }

    res.status(200).json({ message: 'Menu items added successfully' });
  } catch (error) {
    console.error('Error adding multiple menu items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteMenuItem = async (req, res) => {
    const { sectionname, itemname } = req.body;

    if (!sectionname || !itemname) {
        return res.status(400).json({ message: 'sectionname and itemname are required' });
    }

    try {
        const section = await Menu.findOne({ sectionname });

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        const itemIndex = section.menuitems.findIndex(item => item.itemname.toLowerCase() === itemname.toLowerCase());

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in this section' });
        }

        section.menuitems.splice(itemIndex, 1);
        await section.save();

        res.status(200).json({ message: 'Item deleted successfully', section });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getMenuItem = async (req, res) => {
    try {
        const menu = await Menu.find();
        if (!menu || menu.length === 0) {
            return res.status(404).json({ message: 'No menu items found' });
        }
        res.status(200).json(menu);
    } catch (error) {
        console.error('Error fetching menu item:', error);
        res.status(500).json({ message: 'Server error' });

    }
}

module.exports = {
    addMenuItem,
    addMultipleMenuItems,
    deleteMenuItem,
    getMenuItem
};
