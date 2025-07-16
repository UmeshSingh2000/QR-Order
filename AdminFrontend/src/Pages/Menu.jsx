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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <MenuIcon className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Menu Builder
              </h1>
              <p className="text-sm text-gray-500">Manage your restaurant menu</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search menu items..."
                className="pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 hover:bg-white/70 focus:bg-white w-64"
              />
            </div>
            <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto p-6 space-y-8">
        {/* Add Section Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Plus className="text-white" size={16} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Add New Section</h2>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter section name (e.g., Appetizers, Main Course)"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 placeholder-gray-500"
            />
            <button
              onClick={() => addSection(newSectionName)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <Plus size={18} />
              <span className="font-medium">Add Section</span>
            </button>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={section._id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Section Header */}
              <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm p-6 border-b border-white/20">
                {editingSection === section._id ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      defaultValue={section.sectionname}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        updateSectionName(section._id, e.target.value)
                      }
                      className="flex-1 px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                      autoFocus
                    />
                    <button
                      onClick={() =>
                        updateSectionName(
                          section._id,
                          document.activeElement.value
                        )
                      }
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => setEditingSection(null)}
                      className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {section.sectionname}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {section.menuitems.length} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingSection(section._id)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteSection(section._id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Section Content */}
              <div className="p-6">
                {/* Menu Items */}
                <div className="space-y-4 mb-6">
                  {section.menuitems.map((item) => (
                    <div key={item._id} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                      {editingItem === item._id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            defaultValue={item.itemname}
                            className="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                            id={`name-${item._id}`}
                            placeholder="Item name"
                          />
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(item.price).map(([label, val]) => (
                              <div key={label} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                                <span className="text-sm font-medium text-gray-600 capitalize min-w-[60px]">{label}:</span>
                                <input
                                  defaultValue={val}
                                  placeholder="Price"
                                  className="w-20 px-2 py-1 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-sm"
                                  id={`price-${item._id}-${label}`}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2 pt-2">
                            <button
                              onClick={() => {
                                const name = document.getElementById(
                                  `name-${item._id}`
                                ).value;
                                const updated = {};
                                Object.keys(item.price).forEach((label) => {
                                  const val = document.getElementById(
                                    `price-${item._id}-${label}`
                                  ).value;
                                  updated[label] = parseFloat(val);
                                });
                                updateItem(section._id, item._id, name, updated);
                              }}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center space-x-1"
                            >
                              <Check size={16} />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center space-x-1"
                            >
                              <X size={16} />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">
                              {item.itemname}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                              {Object.entries(item.price).map(([size, value]) => (
                                <div key={size} className="inline-flex items-center space-x-1 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full">
                                  <span className="text-sm font-medium text-gray-700 capitalize">{size}</span>
                                  <span className="text-sm text-gray-500">•</span>
                                  <span className="text-sm font-bold text-purple-600">₹{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => setEditingItem(item._id)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => deleteItem(section._id, item._id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Item Form */}
                <div className="bg-gradient-to-r from-gray-50/50 to-gray-100/50 backdrop-blur-sm rounded-xl p-6 border-2 border-dashed border-gray-200 hover:border-purple-300 transition-all duration-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Plus className="text-white" size={12} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Item name (e.g., Chicken Tikka Masala)"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                    />
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Price Options</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {priceInputs.map((input, idx) => (
                          <div key={idx} className="flex space-x-2 bg-white/50 rounded-lg p-3">
                            <input
                              type="text"
                              placeholder="Size/Type"
                              value={input.key}
                              onChange={(e) => {
                                const updated = [...priceInputs];
                                updated[idx].key = e.target.value;
                                setPriceInputs(updated);
                              }}
                              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-sm"
                            />
                            <input
                              type="number"
                              placeholder="₹ Price"
                              value={input.value}
                              onChange={(e) => {
                                const updated = [...priceInputs];
                                updated[idx].value = e.target.value;
                                setPriceInputs(updated);
                              }}
                              className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            setPriceInputs([...priceInputs, { key: "", value: "" }])
                          }
                          className="px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 flex items-center space-x-1 font-medium"
                        >
                          <Plus size={16} />
                          <span>Add Size Option</span>
                        </button>
                        
                        <button
                          onClick={() =>
                            addItem(
                              section.sectionname,
                              newItemName,
                              Object.fromEntries(
                                priceInputs.map((input) => [
                                  input.key,
                                  parseFloat(input.value),
                                ])
                              )
                            )
                          }
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 font-medium"
                        >
                          <Plus size={16} />
                          <span>Add Item</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sections.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MenuIcon className="text-purple-500" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No menu sections yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first menu section above</p>
            <div className="text-sm text-gray-400">
              💡 Try adding sections like "Appetizers", "Main Course", or "Desserts"
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-white/20 shadow-2xl flex justify-around items-center py-3 z-50 lg:hidden">
        {[
          { id: 'dashboard', icon: Users, label: 'Dashboard', path: '/admin/dashboard' },
          { id: 'menu', icon: MenuIcon, label: 'Menu', path: '/admin/menu' },
          { id: 'orders', icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              navigate(item.path);
            }}
            className={`flex flex-col items-center text-xs transition-all duration-200 p-2 rounded-lg ${
              activeTab === item.id
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} className="mb-1" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Menu;