import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import "./App.css";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

function App() {
  const [cart, setCart] = useState({});
  const [menuData, setMenuData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${baseURL}/menu/getMenuItem`);
        setMenuData(response.data);
        setActiveCategory(response.data[0]?._id);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);

  const addToCart = (item, size) => {
    const key = `${item._id}_${size}`;
    setCart((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
  };

  const removeFromCart = (key) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[key] > 1) {
        newCart[key]--;
      } else {
        delete newCart[key];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    let total = 0;
    Object.entries(cart).forEach(([key, quantity]) => {
      const [itemId, size] = key.split("_");
      const item = menuData.flatMap((section) => section.menuitems).find((item) => item._id === itemId);
      if (item && item.price[size]) {
        total += item.price[size] * quantity;
      }
    });
    return total;
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const categories = menuData.map((section) => ({
    id: section._id,
    name: section.sectionname,
  }));

  return (
    <div className="bg-slate-50">
      <div className="bg-yellow-400 shadow-sm sticky top-0 z-40 w-full">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Burger House</h1>
            <p className="text-sm font-bold text-[#6b240c] flex items-center">🍽️ Table #12</p>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-slate-800 text-white p-3 rounded-full hover:bg-slate-700"
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

      <div className="flex">
        <div className="w-[25%] bg-slate-50 shadow-md py-4 h-[calc(100vh-80px)] sticky top-20">
          <div className="flex flex-col space-y-2 px-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`text-center p-4 rounded-md text-sm font-medium ${
                  activeCategory === category.id
                    ? "bg-yellow-300 text-slate-800"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 w-[75%]">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {menuData.find((section) => section._id === activeCategory)?.menuitems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4"
              >
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold text-brown-800">{item.itemname}</h3>
                </div>

                {item.price && typeof item.price === 'object' ? (
                  <div className="flex items-end justify-end gap-2">
                    {Object.entries(item.price).map(([size, price]) => (
                      <button
                        key={size}
                        onClick={() => addToCart(item, size)}
                        className="bg-yellow-300 px-2 py-1 rounded-md text-sm font-semibold text-slate-800 hover:bg-yellow-400"
                      >
                        {size.toUpperCase()} - ₹{price}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item, "default")}
                    className="bg-yellow-300 hover:bg-yellow-400 text-black text-sm font-semibold py-1 px-4 rounded-full"
                  >
                    Add + ₹{item.price}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCart && getCartItemCount() > 0 && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 z-50 flex items-center">
          <div className="bg-white w-full max-w-md mx-auto rounded-2xl p-6 max-h-[70vh] overflow-y-auto">
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
              {Object.entries(cart).map(([key, quantity]) => {
                const [itemId, size] = key.split("_");
                const item = menuData.flatMap((section) => section.menuitems).find((i) => i._id === itemId);
                if (!item) return null;
                return (
                  <div key={key} className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-slate-800">{item.itemname} ({size.toUpperCase()})</h4>
                      <p className="text-sm text-slate-600">₹{item.price[size]} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromCart(key)}
                        className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => addToCart(item, size)}
                        className="w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center"
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
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold">₹{getCartTotal()}</span>
              </div>
              <button className="w-full bg-slate-800 text-white py-4 rounded-xl font-medium hover:bg-slate-700">
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {!showCart &&
        (getCartItemCount() > 0 ? (
          <button
            onClick={() => setShowCart(true)}
            className="fixed bottom-6 right-6 bg-slate-800 text-white p-4 rounded-full shadow-lg hover:bg-slate-700"
          >
            <div className="flex items-center space-x-2">
              <ShoppingCart size={20} />
              <span>₹{getCartTotal()}</span>
            </div>
          </button>
        ) : (
          <div className="fixed bottom-6 right-6 bg-red-600 border text-yellow-400 text-sm px-4 py-2 rounded-lg shadow">
            Add food first 🍔
          </div>
        ))}
    </div>
  );
}

export default App;