import React, { useState, useEffect } from "react";
import { Clock,Star,Plus, Minus, ShoppingCart,X } from "lucide-react";
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
  
  const orderItemLive = async (tableNumber) => {
    socket.emit('orderItem', cart,tableNumber)
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
         orderItemLive(tableNumber);
        toast.success("Order Placed Succefully");
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
  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 min-h-screen">
    {/* Header */}
    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 shadow-lg sticky top-0 z-40 w-full">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-full p-2 shadow-md">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🍔</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-sm">Burger House</h1>
            <p className="text-sm font-medium text-orange-100 flex items-center">
              <Clock size={14} className="mr-1" />
              Table #12 • Est. 15 min
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative bg-white text-orange-600 p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <ShoppingCart size={22} />
          {getCartItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md animate-pulse">
              {getCartItemCount()}
            </span>
          )}
        </button>
      </div>
    </div>

    <div className="flex">
      {/* Sidebar */}
      <div className="w-[25%] bg-white shadow-lg py-6 h-[calc(100vh-80px)] sticky top-20 border-r border-orange-100">
        <div className="px-4 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Categories</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"></div>
        </div>
        <div className="flex flex-col space-y-2 px-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`text-center p-4 rounded-md border border-gray-200 shadow-sm text-sm font-medium ${
                activeCategory === category.id
                  ? "bg-amber-300 text-slate-800"
                  : "text-slate-900 hover:bg-slate-100"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-[75%] select-none">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {categories.find((c) => c.id === activeCategory)?.name}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"></div>
          </div>

          <div className="space-y-6">
            {menuData
              .find((section) => section._id === activeCategory)
              ?.menuitems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-orange-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {item.itemname}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description || "Delicious and freshly prepared"}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-orange-600">
                        <Star size={12} className="fill-current mr-1" />
                        <span className="font-medium">Popular choice</span>
                      </div>
                    </div>
                  </div>

                  {/* Price/Size Options */}
                  {item.price && typeof item.price === "object" ? (
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200 space-y-4">
                      {Object.entries(item.price).map(([size, price]) => {
                        const cartEntry = cart.find(
                          (entry) => entry.itemId === item._id && entry.size === size
                        );
                        const quantity = cartEntry ? cartEntry.quantity : 0;

                        return (
                          <div
                            key={size}
                            className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                                {size.toUpperCase()}
                              </span>
                              <span className="text-lg font-bold text-gray-800">₹{price}</span>
                            </div>

                            <div className="flex items-center">
                              {quantity > 0 ? (
                                <div className="flex items-center space-x-3 bg-orange-100 rounded-full px-2 py-1">
                                  <button
                                    onClick={() => removeFromCart(item._id, size)}
                                    className="bg-white hover:bg-orange-200 text-orange-600 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 shadow-sm"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="text-lg font-bold text-orange-600 w-8 text-center">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={() => addToCart(item, size)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 shadow-sm"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(item, size)}
                                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold px-6 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                  Add to Cart
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
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Add to Cart • ₹{item.price}
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>

    {/* Cart Modal */}
    {showCart && cart.length > 0 && (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[80vh] overflow-hidden">
          {/* Cart Header */}
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Order</h2>
              <button
                onClick={() => setShowCart(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-orange-100 mt-1">Table #12</p>
          </div>

          {/* Cart Items */}
          <div className="p-6 overflow-y-auto max-h-[50vh] space-y-4">
            {cart.map((entry) => {
              const { itemId, size, quantity } = entry;
              const item = menuData
                .flatMap((section) => section.menuitems)
                .find((i) => i._id === itemId);
              if (!item) return null;

              return (
                <div
                  key={itemId + size}
                  className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1">
                      {item.itemname}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                        {size.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        ₹{item.price[size]} each
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white rounded-full px-2 py-1 shadow-sm">
                      <button
                        onClick={() => removeFromCart(itemId, size)}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-gray-800 w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item, size)}
                        className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-gray-800">Total Amount</span>
              <span className="text-3xl font-bold text-orange-600">₹{getCartTotal()}</span>
            </div>
            <button
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={createOrder}
            >
              Place Order
            </button>
            <p className="text-center text-gray-500 text-sm mt-2">
              Estimated delivery: 15-20 minutes
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Floating Cart Button */}
    {!showCart && (
      <div className="fixed bottom-6 right-6 z-40">
        {getCartItemCount() > 0 ? (
          <button
            onClick={() => setShowCart(true)}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <ShoppingCart size={24} />
              <span className="font-bold text-lg">₹{getCartTotal()}</span>
            </div>
          </button>
        ) : (
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-4 py-3 rounded-full shadow-lg animate-bounce">
            <div className="flex items-center space-x-2">
              <span>🍔</span>
              <span className="font-medium">Add food first!</span>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);
}

export default App;

//  return (
//     <div className="bg-gradient-to-br from-orange-50 to-yellow-50 min-h-screen max-w-sm mx-auto">
//       {/* Mobile Header */}
//       <div className="bg-gradient-to-r from-orange-500 to-yellow-500 shadow-lg sticky top-0 z-40 w-full rounded-b-3xl">
//         <div className="px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="bg-white rounded-full p-2 shadow-md">
//               <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">🍔</span>
//               </div>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-white drop-shadow-sm">Burger House</h1>
//               <p className="text-xs font-medium text-orange-100 flex items-center">
//                 <Clock size={12} className="mr-1" />
//                 Table #12 • Est. 15 min
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => setShowCart(!showCart)}
//             className="relative bg-white text-orange-600 p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
//           >
//             <ShoppingCart size={20} />
//             {getCartItemCount() > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md animate-pulse">
//                 {getCartItemCount()}
//               </span>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Category Tabs */}
//       <div className="bg-white shadow-sm sticky top-20 z-30 px-4 py-3 overflow-x-auto">
//         <div className="flex space-x-2 min-w-max">
//           {categories.map((category) => (
//             <button
//               key={category.id}
//               onClick={() => setActiveCategory(category.id)}
//               className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
//                 activeCategory === category.id
//                   ? "bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               {category.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Mobile Menu Items */}
//       <div className="px-4 py-4 pb-24">
//         <div className="mb-4">
//           <h2 className="text-2xl font-bold text-gray-800 mb-1">
//             {categories.find(c => c.id === activeCategory)?.name}
//           </h2>
//           <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"></div>
//         </div>
        
//         <div className="space-y-4">
//           {menuData
//             .find((section) => section._id === activeCategory)
//             ?.menuitems.map((item) => (
//               <div
//                 key={item._id}
//                 className="bg-white rounded-2xl shadow-md p-4 border border-orange-100"
//               >
//                 {/* Mobile Item Header */}
//                 <div className="mb-3">
//                   <h3 className="text-lg font-bold text-gray-800 mb-1">
//                     {item.itemname}
//                   </h3>
//                   <p className="text-gray-600 text-sm leading-relaxed mb-2">
//                     {item.description || "Delicious and freshly prepared"}
//                   </p>
//                   <div className="flex items-center text-xs text-orange-600">
//                     <Star size={12} className="fill-current mr-1" />
//                     <span className="font-medium">Popular choice</span>
//                   </div>
//                 </div>

//                 {/* Mobile Size Options */}
//                 {item.price && typeof item.price === "object" ? (
//                   <div className="space-y-2">
//                     {Object.entries(item.price).map(([size, price]) => {
//                       const cartEntry = cart.find(
//                         (entry) =>
//                           entry.itemId === item._id && entry.size === size
//                       );
//                       const quantity = cartEntry ? cartEntry.quantity : 0;

//                       return (
//                         <div
//                           key={size}
//                           className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 border border-orange-200"
//                         >
//                           <div className="flex items-center space-x-2">
//                             <span className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold">
//                               {size.toUpperCase()}
//                             </span>
//                             <span className="text-base font-bold text-gray-800">
//                               ₹{price}
//                             </span>
//                           </div>

//                           <div className="flex items-center">
//                             {quantity > 0 ? (
//                               <div className="flex items-center space-x-2 bg-white rounded-full px-2 py-1 shadow-sm">
//                                 <button
//                                   onClick={() => removeFromCart(item._id, size)}
//                                   className="bg-orange-100 hover:bg-orange-200 text-orange-600 w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-200"
//                                 >
//                                   <Minus size={14} />
//                                 </button>
//                                 <span className="text-sm font-bold text-orange-600 w-6 text-center">
//                                   {quantity}
//                                 </span>
//                                 <button
//                                   onClick={() => addToCart(item, size)}
//                                   className="bg-orange-500 hover:bg-orange-600 text-white w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-200"
//                                 >
//                                   <Plus size={14} />
//                                 </button>
//                               </div>
//                             ) : (
//                               <button
//                                 onClick={() => addToCart(item, size)}
//                                 className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold px-4 py-2 rounded-full text-sm transition-all duration-200 shadow-md hover:shadow-lg"
//                               >
//                                 Add
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => addToCart(item, "default")}
//                     className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
//                   >
//                     Add to Cart • ₹{item.price}
//                   </button>
//                 )}
//               </div>
//             ))}
//         </div>
//       </div>

//       {/* Mobile Cart Modal */}
//       {showCart && cart.length > 0 && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-end">
//           <div className="bg-white w-full rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden animate-slide-up">
//             {/* Mobile Cart Header */}
//             <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-white">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold">Your Order</h2>
//                 <button
//                   onClick={() => setShowCart(false)}
//                   className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-200"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//               <p className="text-orange-100 mt-1 text-sm">Table #12</p>
//             </div>

//             {/* Mobile Cart Items */}
//             <div className="p-4 overflow-y-auto max-h-[60vh]">
//               <div className="space-y-3">
//                 {cart.map((entry, index) => {
//                   const { itemId, size, quantity } = entry;
//                   const item = menuData
//                     .flatMap((section) => section.menuitems)
//                     .find((i) => i._id === itemId);
//                   if (!item) return null;
                  
//                   return (
//                     <div
//                       key={itemId + size}
//                       className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 border border-orange-200"
//                     >
//                       <div className="flex-1">
//                         <h4 className="font-bold text-gray-800 text-sm mb-1">
//                           {item.itemname}
//                         </h4>
//                         <div className="flex items-center space-x-2">
//                           <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
//                             {size.toUpperCase()}
//                           </span>
//                           <span className="text-xs text-gray-600">
//                             ₹{item.price[size]} each
//                           </span>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center space-x-2">
//                         <div className="flex items-center space-x-1 bg-white rounded-full px-2 py-1 shadow-sm">
//                           <button
//                             onClick={() => removeFromCart(itemId, size)}
//                             className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
//                           >
//                             <Minus size={12} />
//                           </button>
//                           <span className="font-bold text-gray-800 w-6 text-center text-sm">
//                             {quantity}
//                           </span>
//                           <button
//                             onClick={() => addToCart(item, size)}
//                             className="w-6 h-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
//                           >
//                             <Plus size={12} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Mobile Cart Footer */}
//             <div className="p-4 bg-gray-50 border-t border-gray-200">
//               <div className="flex justify-between items-center mb-3">
//                 <span className="text-base font-bold text-gray-800">Total Amount</span>
//                 <span className="text-2xl font-bold text-orange-600">₹{getCartTotal()}</span>
//               </div>
//               <button
//                 className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-4 rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl"
//                 onClick={createOrder}
//               >
//                 Place Order
//               </button>
//               <p className="text-center text-gray-500 text-xs mt-2">
//                 Estimated delivery: 15-20 minutes
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Mobile Floating Cart Button */}
//       {!showCart && (
//         <div className="fixed bottom-4 right-4 z-40">
//           {getCartItemCount() > 0 ? (
//             <button
//               onClick={() => setShowCart(true)}
//               className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white p-3 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
//             >
//               <div className="flex items-center space-x-2">
//                 <ShoppingCart size={20} />
//                 <span className="font-bold text-sm">₹{getCartTotal()}</span>
//               </div>
//             </button>
//           ) : (
//             <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-2 rounded-full shadow-lg animate-bounce">
//               <div className="flex items-center space-x-1">
//                 <span>🍔</span>
//                 <span className="font-medium">Add food first!</span>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }