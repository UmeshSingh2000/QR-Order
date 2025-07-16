import React, { useState, useEffect } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import "./App.css";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { io } from 'socket.io-client';

const baseURL = import.meta.env.VITE_BASE_URL;
const socket = io('http://localhost:3000');

function App() {
  const [cart, setCart] = useState([]);
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
    console.log("Adding to cart:", item.itemname, size);
    setCart((prevCart) => {
      const index = prevCart.findIndex(
        (entry) => entry.itemId === item._id && entry.size === size
      );
      if (index !== -1) {
        const updated = [...prevCart];
        updated[index].quantity += 1;
        return updated;
      } else {
        return [...prevCart, { itemId: item._id, size, quantity: 1 }];
      }
    });
  };

  const orderItemLive = async () => {
    socket.emit('orderItem', cart)
  }

  const removeFromCart = (itemId, size) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex(
        (entry) => entry.itemId === itemId && entry.size === size
      );
      if (index !== -1) {
        const updated = [...prevCart];
        if (updated[index].quantity > 1) {
          updated[index].quantity -= 1;
        } else {
          updated.splice(index, 1);
        }
        return updated;
      }
      return prevCart;
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, entry) => {
      const item = menuData
        .flatMap((section) => section.menuitems)
        .find((i) => i._id === entry.itemId);
      if (item && item.price[entry.size]) {
        return total + item.price[entry.size] * entry.quantity;
      }
      return total;
    }, 0);
  };

  const createOrder = async () => {
    const tableNumber = 5;
    try {
      const response = await axios.post(`${baseURL}/orders/create-order`, {
        items: cart,
        totalAmount: getCartTotal(),
        tableNumber,
      });
      console.log(response);
      if (response.status === 201) {
        toast.success("Order Placed Succefully");
        orderItemLive();
        setCart([]);
        setShowCart(false);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getCartItemCount = () => {
    return cart.reduce((total, entry) => total + entry.quantity, 0);
  };
  const categories = menuData.map((section) => ({
    id: section._id,
    name: section.sectionname,
  }));

  return (
    <div className="bg-slate-50">
      <Toaster />
      <div className="bg-amber-400 shadow-sm sticky top-0 z-40 w-full">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Burger House</h1>
            <p className="text-sm font-bold text-[#6b240c] flex items-center">
              🍽️ Table #12
            </p>
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
                className={`text-center p-4 rounded-md border border-gray-200 shadow-sm text-sm font-medium ${activeCategory === category.id
                  ? "bg-amber-300 text-slate-800"
                  : "text-slate-900 hover:bg-slate-100"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 w-[75%] select-none">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {menuData
              .find((section) => section._id === activeCategory)
              ?.menuitems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between text-sm gap-3 rounded-lg px-3 py-2 w-full border border-gray-200 shadow-sm bg-white hover:shadow-md transition">
                    <h3 className="text-base font-semibold text-slate-800">
                      {item.itemname}
                    </h3>

                    {/* Optional: Add something like price, category, or a tag on the right */}
                    {/* <span className="text-xs text-gray-500">₹{item.price}</span> */}
                  </div>


                  {item.price && typeof item.price === "object" ? (
                    <div className="flex flex-col items-end justify-end gap-1 rounded-lg border border-gray-200 shadow-sm">
                      {Object.entries(item.price).map(([size, price]) => {
                        const cartEntry = cart.find(
                          (entry) =>
                            entry.itemId === item._id && entry.size === size
                        );
                        const quantity = cartEntry ? cartEntry.quantity : 0;

                        return (
                          <div
                            key={size}
                            className="flex items-center justify-between text-sm gap-3 rounded-lg px-3 py-2 w-full bg-white hover:shadow-md transition"
                          >
                            <span className="text-sm font-semibold bg-yellow-300 px-2 py-0.5 rounded text-slate-800 whitespace-nowrap">
                              {size.toUpperCase()} - ₹{price}
                            </span>

                            <div className="h-7 flex items-center justify-center">
                              {quantity > 0 ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => removeFromCart(item._id, size)}
                                    className="bg-yellow-300 hover:bg-yellow-400 text-slate-800 w-6 h-6 flex items-center justify-center rounded-full transition"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="text-sm font-semibold w-5 text-center">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={() => addToCart(item, size)}
                                    className="bg-yellow-300 hover:bg-yellow-400 text-slate-800 w-6 h-6 flex items-center justify-center rounded-full transition"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(item, size)}
                                  className="bg-yellow-300 hover:bg-yellow-400 text-slate-800 text-sm font-medium px-4 py-0.5 rounded-md transition"
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        );

                      })}
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item, "default")}
                      className="bg-yellow-300 hover:bg-yellow-400 text-black text-xs font-semibold py-0.5 px-3 rounded-full"
                    >
                      Add + ₹{item.price}
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {showCart && cart.length > 0 && (
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

            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {cart.map((entry, index) => {
                const { itemId, size, quantity } = entry;
                const item = menuData
                  .flatMap((section) => section.menuitems)
                  .find((i) => i._id === itemId);
                if (!item) return null;
                return (
                  <div
                    key={itemId + size}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium text-slate-800">
                        {item.itemname} ({size.toUpperCase()})
                      </h4>
                      <p className="text-sm text-slate-600">
                        ₹{item.price[size]} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromCart(itemId, size)}
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

            {/* Cart Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold">₹{getCartTotal()}</span>
              </div>

              <button
                className="w-full bg-slate-800 text-white py-4 rounded-xl font-medium hover:bg-slate-700"
                onClick={createOrder}
              >
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
          <div className="fixed bottom-6 right-6 bg-red-600 border text-amber-400 text-sm px-4 py-2 rounded-lg shadow">
            Add food first 🍔
          </div>
        ))}
    </div>
  );
}

export default App;
