import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Check, X } from "lucide-react";
import axios from "axios";
const baseurl = import.meta.env.VITE_BASE_URL;

const Menu = () => {
  const [sections, setSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [priceInputs, setPriceInputs] = useState([{ key: "", value: "" }]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get(`${baseurl}/menu/getMenuItem`);
        setSections(response.data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };
    fetchMenuData();
  }, []);

  const addSection = async(sectionname) => {
    try{
    const response = await axios.post(`${baseurl}/menu/createSection`, { sectionname: newSectionName });
    if (response.status === 201) {
      setSections([...sections, { _id: Date.now().toString(), sectionname: newSectionName, menuitems: [] }]);
      setNewSectionName("");
    }
  } catch (error) {
    console.error("Error creating section:", error);
  }
};

  const deleteSection = (sectionId) => {
    setSections(sections.filter((section) => section._id !== sectionId));
  };

  const updateSectionName = (sectionId, newName) => {
    setSections(
      sections.map((section) =>
        section._id === sectionId ? { ...section, sectionname: newName } : section
      )
    );
    setEditingSection(null);
  };

  const addItem = (sectionname,itemname,price) => {
    try{
      const response = axios.post(`${baseurl}/menu/addMenuItem`, {
        sectionname,
        itemname,
        price: Object.fromEntries(priceInputs.map(input => [input.key, parseFloat(input.value)]))
      });
      if (response.status === 201) {
        setSections(
          sections.map((section) =>
            section._id === sectionId
              ? { ...section, menuitems: [...section.menuitems, response.data] }
              : section
          )
        );
        setNewItemName("");
        setPriceInputs([{ key: "", value: "" }]);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const deleteItem = (sectionId, itemId) => {
    setSections(
      sections.map((section) =>
        section._id === sectionId
          ? {
              ...section,
              menuitems: section.menuitems.filter((item) => item._id !== itemId),
            }
          : section
      )
    );
  };

  const updateItem = (sectionId, itemId, newName, updatedPrices) => {
    setSections(
      sections.map((section) =>
        section._id === sectionId
          ? {
              ...section,
              menuitems: section.menuitems.map((item) =>
                item._id === itemId ? { ...item, itemname: newName, price: updatedPrices } : item
              ),
            }
          : section
      )
    );
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Menu Builder</h1>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Section name"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            onClick={() => addSection(newSectionName)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <Plus size={16} />
          </button>
        </div>

        {sections.map((section) => (
          <div key={section._id} className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="bg-gray-100 p-4 border-b">
              {editingSection === section._id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={section.sectionname}
                    onKeyDown={(e) => e.key === "Enter" && updateSectionName(section._id, e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => updateSectionName(section._id, document.activeElement.value)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Check size={16} />
                  </button>
                  <button onClick={() => setEditingSection(null)} className="text-gray-600 hover:text-gray-800">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">{section.sectionname}</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingSection(section._id)} className="text-blue-600">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => deleteSection(section._id)} className="text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              {section.menuitems.map((item) => (
                <div key={item._id} className="mb-3 border-b pb-2">
                  {editingItem === item._id ? (
                    <div className="flex gap-2 flex-wrap">
                      <input
                        type="text"
                        defaultValue={item.itemname}
                        className="px-2 py-1 border rounded text-sm"
                        id={`name-${item._id}`}
                      />
                      {Object.entries(item.price).map(([label, val]) => (
                        <input
                          key={label}
                          defaultValue={val}
                          placeholder={label}
                          className="w-24 px-2 py-1 border rounded text-sm capitalize"
                          id={`price-${item._id}-${label}`}
                        />
                      ))}
                      <button
                        onClick={() => {
                          const name = document.getElementById(`name-${item._id}`).value;
                          const updated = {};
                          Object.keys(item.price).forEach((label) => {
                            const val = document.getElementById(`price-${item._id}-${label}`).value;
                            updated[label] = parseFloat(val);
                          });
                          updateItem(section._id, item._id, name, updated);
                        }}
                        className="text-green-600"
                      >
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditingItem(null)} className="text-gray-600">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <div className="font-medium text-gray-800">{item.itemname}</div>
                        <div className="text-sm text-gray-600">
                          {Object.entries(item.price).map(([size, value]) => (
                            <span key={size} className="mr-3">
                              <span className="capitalize">{size}</span>: ₹{value}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingItem(item._id)} className="text-blue-600">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => deleteItem(section._id, item._id)} className="text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add new item */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2 flex-wrap mb-2">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  />
                  {priceInputs.map((input, idx) => (
                    <div key={idx} className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Size"
                        value={input.key}
                        onChange={(e) => {
                          const updated = [...priceInputs];
                          updated[idx].key = e.target.value;
                          setPriceInputs(updated);
                        }}
                        className="w-20 px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={input.value}
                        onChange={(e) => {
                          const updated = [...priceInputs];
                          updated[idx].value = e.target.value;
                          setPriceInputs(updated);
                        }}
                        className="w-24 px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => setPriceInputs([...priceInputs, { key: "", value: "" }])}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    + Size
                  </button>
                  <button
                    onClick={() => addItem(section.sectionname, newItemName, Object.fromEntries(priceInputs.map(input => [input.key, parseFloat(input.value)])))}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No sections yet. Add your first section above!
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
