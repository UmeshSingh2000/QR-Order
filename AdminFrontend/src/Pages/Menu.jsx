import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Check, X, Search, Filter, MoreVertical } from "lucide-react";
import {Users, ShoppingCart, DollarSign, Menu as MenuIcon} from 'lucide-react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
const baseurl = import.meta.env.VITE_BASE_URL;

const Menu = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [priceInputs, setPriceInputs] = useState([{ key: "", value: "" }]);
  const [activeTab, setActiveTab] = useState('menu');

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

  const addSection = async (sectionname) => {
    try {
      const response = await axios.post(`${baseurl}/menu/createSection`, {
        sectionname: newSectionName,
      });
      if (response.status === 201) {
        setSections([
          ...sections,
          {
            _id: Date.now().toString(),
            sectionname: newSectionName,
            menuitems: [],
          },
        ]);
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
        section._id === sectionId
          ? { ...section, sectionname: newName }
          : section
      )
    );
    setEditingSection(null);
  };

  const addItem = (sectionname, itemname, price) => {
    try {
      const response = axios.post(`${baseurl}/menu/addMenuItem`, {
        sectionname,
        itemname,
        price: Object.fromEntries(
          priceInputs.map((input) => [input.key, parseFloat(input.value)])
        ),
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
              menuitems: section.menuitems.filter(
                (item) => item._id !== itemId
              ),
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
    <div className="min-h-screen bg-white pb-24 max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 border-b shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MenuIcon className="text-purple-600" size={22} />
          <h1 className="text-lg font-semibold text-gray-800">Menu Builder</h1>
        </div>
      </header>

      {/* Add Section */}
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add New Section
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Section name"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            <button
              onClick={() => addSection(newSectionName)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Add
            </button>
          </div>
        </div>

        {/* Sections */}
        {sections.map((section, index) => (
          <div key={section._id} className="mb-6 border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              {editingSection === section._id ? (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    defaultValue={section.sectionname}
                    onKeyDown={(e) =>
                      e.key === "Enter" && updateSectionName(section._id, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                  />
                  <button onClick={() => updateSectionName(section._id, document.activeElement.value)}>
                    <Check size={18} className="text-green-600" />
                  </button>
                  <button onClick={() => setEditingSection(null)}>
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-medium text-gray-800 text-sm">{section.sectionname}</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingSection(section._id)}>
                      <Edit3 size={16} className="text-blue-600" />
                    </button>
                    <button onClick={() => deleteSection(section._id)}>
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Items */}
            <div className="space-y-3">
              {section.menuitems.map((item) => (
                <div key={item._id} className="bg-white border p-3 rounded-md">
                  {editingItem === item._id ? (
                    <>
                      <input
                        type="text"
                        defaultValue={item.itemname}
                        className="w-full mb-2 px-3 py-2 border rounded-md text-sm"
                        id={`name-${item._id}`}
                      />
                      {Object.entries(item.price).map(([label, val]) => (
                        <div key={label} className="flex gap-2 mb-2 items-center">
                          <input
                            defaultValue={label}
                            readOnly
                            className="flex-1 px-2 py-1 border rounded-md text-sm bg-gray-100"
                          />
                          <input
                            defaultValue={val}
                            type="number"
                            className="w-24 px-2 py-1 border rounded-md text-sm"
                            id={`price-${item._id}-${label}`}
                          />
                        </div>
                      ))}
                      <div className="flex justify-end gap-2">
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
                          className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="px-3 py-1 bg-gray-400 text-white rounded-md text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.itemname}</p>
                        <div className="text-xs text-gray-500 mt-1 space-x-1">
                          {Object.entries(item.price).map(([size, value]) => (
                            <span key={size}>{size}: ₹{value}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button onClick={() => setEditingItem(item._id)}>
                          <Edit3 size={16} className="text-blue-600" />
                        </button>
                        <button onClick={() => deleteItem(section._id, item._id)}>
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Item */}
            <div className="mt-4">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name"
                className="w-full mb-2 px-3 py-2 border rounded-md text-sm"
              />
              {priceInputs.map((input, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={input.key}
                    placeholder="Size"
                    onChange={(e) => {
                      const updated = [...priceInputs];
                      updated[i].key = e.target.value;
                      setPriceInputs(updated);
                    }}
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                  />
                  <input
                    type="number"
                    value={input.value}
                    placeholder="₹"
                    onChange={(e) => {
                      const updated = [...priceInputs];
                      updated[i].value = e.target.value;
                      setPriceInputs(updated);
                    }}
                    className="w-20 px-2 py-2 border rounded-md text-sm"
                  />
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setPriceInputs([...priceInputs, { key: "", value: "" }])}
                  className="text-sm text-purple-600"
                >
                  + Add Price Option
                </button>
                <button
                  onClick={() =>
                    addItem(section.sectionname, newItemName, Object.fromEntries(
                      priceInputs.map(input => [input.key, parseFloat(input.value)])
                    ))
                  }
                  className="ml-auto px-4 py-2 bg-purple-600 text-white rounded-md text-sm"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sections.length === 0 && (
        <div className="text-center p-8 text-gray-500 text-sm">
          No sections yet. Start by adding one above!
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around items-center py-2 z-50">
        {[
          { id: 'dashboard', icon: Users, label: 'Dashboard', path: '/admin/dashboard' },
          { id: 'menu', icon: MenuIcon, label: 'Menu', path: '/admin/menu' },
          { id: 'orders', icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              navigate(tab.path);
            }}
            className={`flex flex-col items-center text-xs ${
              activeTab === tab.id ? 'text-purple-600' : 'text-gray-500'
            }`}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Menu;