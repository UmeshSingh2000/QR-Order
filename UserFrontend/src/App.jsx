import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Star, Clock, Flame, Leaf } from 'lucide-react';
import './App.css'

function App() {

  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState('appetizers');
  const [showCart, setShowCart] = useState(false);


  const menuData = {
    appetizers: [
      {
        id: 1,
        name: "Truffle Arancini",
        description: "Crispy risotto balls with truffle oil, parmesan, and herbs",
        price: 16,
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300&h=200&fit=crop",
        spicy: false,
        vegetarian: true,
        time: "15 min",
        rating: 4.8
      },
      {
        id: 2,
        name: "Spicy Tuna Tartare",
        description: "Fresh tuna with avocado, citrus, and chili oil on crispy wonton",
        price: 22,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop",
        spicy: true,
        vegetarian: false,
        time: "10 min",
        rating: 4.9
      },
      {
        id: 3,
        name: "Burrata & Prosciutto",
        description: "Creamy burrata with San Daniele prosciutto, figs, and honey",
        price: 18,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
        spicy: false,
        vegetarian: false,
        time: "5 min",
        rating: 4.7
      }
    ],
    mains: [
      {
        id: 4,
        name: "Wagyu Ribeye",
        description: "12oz A5 wagyu with roasted bone marrow and seasonal vegetables",
        price: 85,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop",
        spicy: false,
        vegetarian: false,
        time: "25 min",
        rating: 4.9
      },
      {
        id: 5,
        name: "Lobster Risotto",
        description: "Creamy arborio rice with fresh lobster, saffron, and microgreens",
        price: 42,
        image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop",
        spicy: false,
        vegetarian: false,
        time: "20 min",
        rating: 4.8
      },
      {
        id: 6,
        name: "Mushroom Wellington",
        description: "Flaky pastry with wild mushrooms, chestnuts, and herb sauce",
        price: 32,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
        spicy: false,
        vegetarian: true,
        time: "30 min",
        rating: 4.6
      }
    ],
    desserts: [
      {
        id: 7,
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with molten center, vanilla ice cream",
        price: 14,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop",
        spicy: false,
        vegetarian: true,
        time: "15 min",
        rating: 4.9
      },
      {
        id: 8,
        name: "Tiramisu",
        description: "Classic Italian dessert with espresso-soaked ladyfingers",
        price: 12,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop",
        spicy: false,
        vegetarian: true,
        time: "5 min",
        rating: 4.7
      }
    ]
  };

  const categories = [
    { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
    { id: 'mains', name: 'Main Courses', icon: '🍽' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' }
  ];

  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    let total = 0;
    Object.entries(cart).forEach(([itemId, quantity]) => {
      const item = Object.values(menuData).flat().find(item => item.id === parseInt(itemId));
      if (item) total += item.price * quantity;
    });
    return total;
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Bella Vista</h1>
              <p className="text-sm text-slate-600">Table #12</p>
            </div>
            <button 
              onClick={() => setShowCart(!showCart)}
              className="relative bg-slate-800 text-white p-3 rounded-full hover:bg-slate-700 transition-colors"
            >
              <ShoppingCart size={20} />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-16 z-30 bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-4">
          {menuData[activeCategory].map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                    <div className="flex items-center space-x-1">
                      {item.spicy && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                          <Flame size={12} className="mr-1" />
                          Spicy
                        </span>
                      )}
                      {item.vegetarian && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                          <Leaf size={12} className="mr-1" />
                          Veg
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-3 leading-relaxed">{item.description}</p>
                  <div className="flex items-center space-x-4 text-slate-500 text-sm">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {item.time}
                    </div>
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-500 mr-1" />
                      {item.rating}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-3">
                  <span className="text-xl font-bold text-slate-800">${item.price}</span>
                  <div className="flex items-center space-x-3">
                    {cart[item.id] > 0 && (
                      <>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-medium text-slate-800 min-w-[20px] text-center">
                          {cart[item.id]}
                        </span>
                      </>
                    )}
                    <button
                      onClick={() => addToCart(item)}
                      className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      {showCart && getCartItemCount() > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Your Order</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              {Object.entries(cart).map(([itemId, quantity]) => {
                const item = Object.values(menuData).flat().find(item => item.id === parseInt(itemId));
                if (!item) return null;
                
                return (
                  <div key={itemId} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">{item.name}</h4>
                      <p className="text-sm text-slate-600">${item.price} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromCart(parseInt(itemId))}
                        className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-medium min-w-[20px] text-center">{quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-slate-800">Total</span>
                <span className="text-2xl font-bold text-slate-800">${getCartTotal()}</span>
              </div>
              
              <button className="w-full bg-slate-800 text-white py-4 rounded-xl font-medium hover:bg-slate-700 transition-colors">
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {getCartItemCount() > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 bg-slate-800 text-white p-4 rounded-full shadow-lg hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <ShoppingCart size={20} />
            <span className="font-medium">${getCartTotal()}</span>
          </div>
        </button>
      )}
    </div>
  );
}

export default App

