import React, { useState } from 'react'
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react'

const Menu = () => {
  const [sections, setSections] = useState([
    {
      id: 1,
      name: "Appetizers",
      items: [
        { id: 1, name: "Caesar Salad", price: 12.99 },
        { id: 2, name: "Garlic Bread", price: 8.99 }
      ]
    },
    {
      id: 2,
      name: "Main Courses",
      items: [
        { id: 3, name: "Grilled Salmon", price: 24.99 },
        { id: 4, name: "Chicken Parmesan", price: 19.99 }
      ]
    }
  ])

  const [editingSection, setEditingSection] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [newSectionName, setNewSectionName] = useState('')
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')

  const addSection = () => {
    if (newSectionName.trim()) {
      const newSection = {
        id: Date.now(),
        name: newSectionName,
        items: []
      }
      setSections([...sections, newSection])
      setNewSectionName('')
    }
  }

  const deleteSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId))
  }

  const updateSectionName = (sectionId, newName) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, name: newName } : section
    ))
    setEditingSection(null)
  }

  const addItem = (sectionId) => {
    if (newItemName.trim() && newItemPrice.trim()) {
      const newItem = {
        id: Date.now(),
        name: newItemName,
        price: parseFloat(newItemPrice)
      }
      setSections(sections.map(section => 
        section.id === sectionId 
          ? { ...section, items: [...section.items, newItem] }
          : section
      ))
      setNewItemName('')
      setNewItemPrice('')
    }
  }

  const deleteItem = (sectionId, itemId) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, items: section.items.filter(item => item.id !== itemId) }
        : section
    ))
  }

  const updateItem = (sectionId, itemId, newName, newPrice) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: section.items.map(item => 
              item.id === itemId 
                ? { ...item, name: newName, price: parseFloat(newPrice) }
                : item
            ) 
          }
        : section
    ))
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Menu Builder</h1>
        
        {/* Add New Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Section name (e.g., Appetizers)"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={addSection}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Sections */}
        {sections.map(section => (
          <div key={section.id} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
            {/* Section Header */}
            <div className="bg-gray-100 p-4 border-b">
              {editingSection === section.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={section.name}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateSectionName(section.id, e.target.value)
                      }
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => updateSectionName(section.id, document.activeElement.value)}
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
                  <h2 className="font-semibold text-gray-800">{section.name}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSection(section.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="p-4">
              {section.items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  {editingItem === item.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        defaultValue={item.name}
                        placeholder="Item name"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={item.price}
                        placeholder="Price"
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => {
                          const nameInput = document.activeElement.parentElement.children[0]
                          const priceInput = document.activeElement.parentElement.children[1]
                          updateItem(section.id, item.id, nameInput.value, priceInput.value)
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <span className="text-gray-800">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-600">${item.price.toFixed(2)}</span>
                        <button
                          onClick={() => setEditingItem(item.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteItem(section.id, item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Add New Item */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button
                    onClick={() => addItem(section.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
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
  )
}

export default Menu