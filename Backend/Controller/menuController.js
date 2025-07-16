const Menu = require('../Database/Models/menuSchema');

// Add or update a menu item to a section
const addMenuItem = async (req, res) => {
    const { sectionname, itemname, price } = req.body;

    if (!sectionname || !itemname || !price) {
        return res.status(400).json({ message: 'sectionname, itemname, and price are required' });
    }

    try {
        // Check if section exists
        let section = await Menu.findOne({ sectionname });

        if (section) {
            // Check if item already exists in that section
            const itemExists = section.menuitems.some(item => item.itemname.toLowerCase() === itemname.toLowerCase());

            if (itemExists) {
                return res.status(400).json({ message: 'Item already exists in this section' });
            }

            // Push new item to existing section
            section.menuitems.push({ itemname, price });
            await section.save();
            return res.status(200).json({ message: 'Item added to existing section', section });
        } else {
            // Create new section with item
            const newSection = new Menu({
                sectionname,
                menuitems: [{ itemname, price }]
            });
            await newSection.save();
            return res.status(201).json({ message: 'New section and item created', section: newSection });
        }
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addMenuItem
};
