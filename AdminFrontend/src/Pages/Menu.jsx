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
  const [newPrices, setNewPrices] = useState({ small: "", medium: "", large: "" });

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

  const addSection = () => {
    if (newSectionName.trim()) {
      const newSection = {
        _id: Date.now().toString(),
        sectionname: newSectionName,
        menuitems: [],
      };
      setSections([...sections, newSection]);
      setNewSectionName("");
    }
  };

  const deleteSection = (sectionName) => {
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

  const addItem = (sectionId) => {
    if (!newItemName.trim()) return;

    const price = {};
    Object.entries(newPrices).forEach(([key, val]) => {
      if (val) price[key] = parseFloat(val);
    });

    const newItem = {
      _id: Date.now().toString(),
      itemname: newItemName,
      price,
    };

    setSections(
      sections.map((section) =>
        section._id === sectionId
          ? { ...section, menuitems: [...section.menuitems, newItem] }
          : section
      )
    );

    setNewItemName("");
    setNewPrices({ small: "", medium: "", large: "" });
  };

  const deleteItem = async (sectionname, itemname) => {
    try {
      const response = await axios.delete(`${baseurl}/menu/deleteMenuItem/${sectionname}/${itemname}`);
      if (response.status === 200) {
        setSections(
          sections.map((section) =>
            section.sectionname === sectionname
              ? {
                ...section,
                menuitems: section.menuitems.filter((item) => item.itemname !== itemname),
              }
              : section
          )
        );
      }
    }
    catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const updateItem = (sectionId, itemId, newName, updatedPrices) => {
    setSections(
      sections.map((section) =>
        section._id === sectionId
          ? {
            ...section,
            menuitems: section.menuitems.map((item) =>
              item._id === itemId
                ? { ...item, itemname: newName, price: updatedPrices }
                : item
            ),
          }
          : section
      )
    );
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Menu Builder</h1>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Section name (e.g., Pizzas)"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={addSection}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section._id} className="bg-white rounded-lg shadow-sm mb-6">
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
                  <button
                    onClick={() => setEditingSection(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">{section.sectionname}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSection(section._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteSection(section._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 overflow-x-auto">
              {section.menuitems.length > 0 && (() => {
                const sizeLabels = Array.from(
                  new Set(section.menuitems.flatMap(item => Object.keys(item.price || {})))
                );

                return (
                  <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-md">
                    <thead className="bg-gray-100 text-gray-800 font-semibold">
                      <tr>
                        <th className="px-4 py-2">Item Name</th>
                        {sizeLabels.map(size => (
                          <th key={size} className="px-4 py-2 capitalize">{size}</th>
                        ))}
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.menuitems.map(item => (
                        <tr key={item._id} className="border-t">
                          {editingItem === item._id ? (
                            <>
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  defaultValue={item.itemname}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                              </td>
                              {sizeLabels.map(size => (
                                <td key={size} className="px-4 py-2">
                                  <input
                                    type="number"
                                    defaultValue={item.price[size] || ""}
                                    placeholder={size}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  />
                                </td>
                              ))}
                              <td className="px-4 py-2 text-right flex gap-2 justify-end">
                                <button
                                  onClick={() => {
                                    const row = document.activeElement.closest("tr");
                                    const nameInput = row.children[0].querySelector("input").value;
                                    const updatedPrices = {};
                                    sizeLabels.forEach((size, idx) => {
                                      const val = row.children[idx + 1].querySelector("input").value;
                                      if (val) updatedPrices[size] = parseFloat(val);
                                    });
                                    updateItem(section._id, item._id, nameInput, updatedPrices);
                                  }}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="text-gray-600 hover:text-gray-800"
                                >
                                  <X size={16} />
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-2">{item.itemname}</td>
                              {sizeLabels.map(size => (
                                <td key={size} className="px-4 py-2">
                                  {item.price[size] !== undefined ? `₹${item.price[size]}` : "-"}
                                </td>
                              ))}
                              <td className="px-4 py-2 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => setEditingItem(item._id)} className="text-blue-600 hover:text-blue-800">
                                    <Edit3 size={16} />
                                  </button>
                                  <button onClick={() => deleteItem(section.sectionname, item.itemname)} className="text-red-600 hover:text-red-800">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="col-span-4 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  {["small", "medium", "large"].map((size) => (
                    <input
                      key={size}
                      type="number"
                      placeholder={size}
                      value={newPrices[size]}
                      onChange={(e) =>
                        setNewPrices({ ...newPrices, [size]: e.target.value })
                      }
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm capitalize"
                    />
                  ))}
                  <button
                    onClick={() => addItem(section._id)}
                    className="col-span-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
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
