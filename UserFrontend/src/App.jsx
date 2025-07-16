import React, { useState } from "react";
import {
  Plus,
  Minus,
  ShoppingCart,
  Star,
  Clock,
  Flame,
  Leaf,
} from "lucide-react";
import "./App.css";

function App() {
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState("combos");
  const [showCart, setShowCart] = useState(false);

  const categories = [
    { id: "combos", name: "Combos", icon: "👑" },
    { id: "whopperDeluxe", name: "Whopper Deluxe", icon: "👑" },
    { id: "monsoonMania", name: "Monsoon Mania", icon: "🌧" },
    { id: "premiumBurgers", name: "New Premium Burgers", icon: "🍔" },
    { id: "koreanSpicy", name: "Korean Spicy Fest", icon: "🌶️" },
    { id: "originalWhopper", name: "Original Whopper", icon: "🍟" },
  ];

  const menuData = {
    combos: [
      {
        id: 1,
        name: "BK Veggie Burger Meal",
        description: "2 Veggie Burgers + Fries + Cookie Crunch Sundae + Coke",
        price: 1035,
        spicy: false,
        vegetarian: true,
        time: "15 min",
        rating: 4.7,
      },
      {
        id: 2,
        name: "BK Chicken Burger Meal",
        description: "2 Chicken Burgers + Fries + Cookie Crunch Sundae + Coke",
        price: 1075,
        spicy: true,
        vegetarian: false,
        time: "18 min",
        rating: 4.8,
      },
    ],
    whopperDeluxe: [
      {
        id: 3,
        name: "Deluxe Veg Whopper",
        description: "Jumbo Veg Whopper with cheese, fries & coke",
        price: 1195,
        spicy: false,
        vegetarian: true,
        time: "20 min",
        rating: 4.6,
      },
    ],
    monsoonMania: [
      {
        id: 4,
        name: "Spicy Chicken Storm",
        description: "Spicy Chicken Whopper + Fries + Dessert",
        price: 1125,
        spicy: true,
        vegetarian: false,
        time: "15 min",
        rating: 4.4,
      },
    ],
    premiumBurgers: [
      {
        id: 5,
        name: "Crispy Paneer Royale",
        description: "Crispy fried paneer patty with sauces and cheese",
        price: 935,
        spicy: false,
        vegetarian: true,
        time: "12 min",
        rating: 4.9,
      },
    ],
    koreanSpicy: [
      {
        id: 6,
        name: "Korean Fiery Chicken",
        description: "Korean spicy grilled chicken with smoky mayo",
        price: 1025,
        spicy: true,
        vegetarian: false,
        time: "17 min",
        rating: 4.5,
      },
    ],
    originalWhopper: [
      {
        id: 7,
        name: "Original Chicken Whopper",
        description:
          "Classic flame-grilled chicken whopper with lettuce & sauce",
        price: 935,
        spicy: false,
        vegetarian: false,
        time: "14 min",
        rating: 4.3,
      },
    ],
  };

  const addToCart = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
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
      const item = Object.values(menuData)
        .flat()
        .find((item) => item.id === parseInt(itemId));
      if (item) total += item.price * quantity;
    });
    return total;
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="bg-slate-50">
      {/* Navbar - Full Width */}
      <div className="bg-yellow-400 shadow-sm sticky top-0 z-40 w-full">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Burger House</h1>
            <p className="text-sm font-bold text-[#6b240c] drop-shadow-sm flex items-center space-x-1">
              <span>🍽️</span>
              <span>Table #12</span>
            </p>
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

      {/* Main Section */}
      <div className="flex">
        {/* Sidebar */}
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
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 w-[75%]">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {menuData[activeCategory]?.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4"
              >
                {/* Item Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-brown-800">
                      {item.name}
                    </h3>
                    {/* {item.vegetarian ? (
        <img src="/veg-icon.png" alt="Veg" className="w-4 h-4 mt-1" />
      ) : (
        <img src="/nonveg-icon.png" alt="Non-Veg" className="w-4 h-4 mt-1" />
      )} */}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-semibold text-brown-900">
                      ₹{item.price}/-
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-yellow-300 hover:bg-yellow-400 text-black text-sm font-semibold py-1 px-4 rounded-full"
                    >
                      Add +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Modal */}
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
              {Object.entries(cart).map(([itemId, quantity]) => {
                const item = Object.values(menuData)
                  .flat()
                  .find((i) => i.id === parseInt(itemId));
                if (!item) return null;
                return (
                  <div
                    key={itemId}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium text-slate-800">
                        {item.name}
                      </h4>
                      <p className="text-sm text-slate-600">
                        ₹{item.price} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
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

      {/* Floating Cart Button */}
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
