import React, { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, Eye, Trash2, Users, ShoppingCart, Menu as MenuIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const baseURL = import.meta.env.VITE_BASE_URL;
const Socket_url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
const socket = io(Socket_url);

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [dbLoaded, setDbLoaded] = useState(false);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({ customerName: '', tableNumber: '', items: [] });
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: 1 });
  const [activeTab, setActiveTab] = useState('orders');

  const statusIcons = {
    pending: <Clock size={16} />,
    preparing: <Clock size={16} />,
    ready: <CheckCircle size={16} />,
    completed: <CheckCircle size={16} />
  };

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await axios.get(`${baseURL}/orders/get-order`);
        const fetchedOrders = response.data.map((order, index) => ({
          id: order._id || Date.now() + index,
          tableNumber: order.tableNumber,
          items: order.items.map((item, i) => ({
            id: `${index}-${i}`,
            name: item.itemname,
            quantity: item.quantity,
            price: item.price,
            size: item.size || 'N/A'
          })),
          timestamp: new Date(order.createdAt),
          total: order.totalAmount || order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          status: order.status || 'pending'
        }));

        setOrders(fetchedOrders);
        setDbLoaded(true);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    getOrder();
  }, []);

  useEffect(() => {
    socket.on('orderReceive', (orderItems, tableNumber) => {
      const formattedItems = orderItems.map((item, index) => ({
        id: Date.now() + index,
        name: item.itemname,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        size: item.size
      }));

      const total = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const newOrder = {
        id: Date.now(),
        tableNumber,
        items: formattedItems,
        timestamp: new Date(),
        total,
        status: 'pending',
      };

      setOrders(prev => [newOrder, ...prev]);
      console.log('New Order received from table:', tableNumber);
    });

    return () => {
      socket.off('orderReceive');
    };
  }, []);

  const addItemToNewOrder = () => {
    if (newItem.name.trim() && newItem.price.trim()) {
      const item = {
        id: Date.now(),
        name: newItem.name,
        price: parseFloat(newItem.price),
        quantity: parseInt(newItem.quantity)
      };
      setNewOrder({ ...newOrder, items: [...newOrder.items, item] });
      setNewItem({ name: '', price: '', quantity: 1 });
    }
  };

  const removeItemFromNewOrder = (itemId) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter(item => item.id !== itemId)
    });
  };

  const createOrder = () => {
    if (newOrder.customerName.trim() && newOrder.tableNumber.trim() && newOrder.items.length > 0) {
      const total = newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const order = {
        id: Date.now(),
        customerName: newOrder.customerName,
        tableNumber: newOrder.tableNumber,
        items: newOrder.items,
        status: 'pending',
        timestamp: new Date(),
        total
      };
      setOrders([order, ...orders]);
      setNewOrder({ customerName: '', tableNumber: '', items: [] });
      setShowNewOrder(false);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const deleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = ['pending', 'preparing', 'ready', 'completed'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <button
            onClick={() => setShowNewOrder(!showNewOrder)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={16} /> New Order
          </button>
        </div>

        {showNewOrder && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="font-semibold text-gray-800 mb-4">Create New Order</h2>
            <input type="text" placeholder="Customer Name" value={newOrder.customerName}
              onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
              className="w-full mb-2 px-3 py-2 border rounded-md text-sm" />
            <input type="text" placeholder="Table Number" value={newOrder.tableNumber}
              onChange={(e) => setNewOrder({ ...newOrder, tableNumber: e.target.value })}
              className="w-full mb-4 px-3 py-2 border rounded-md text-sm" />
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="Item name" value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-md text-sm" />
              <input type="number" placeholder="Price" value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="w-20 px-3 py-2 border rounded-md text-sm" />
              <input type="number" min="1" placeholder="Qty" value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                className="w-16 px-3 py-2 border rounded-md text-sm" />
              <button onClick={addItemToNewOrder}
                className="bg-green-500 text-white px-3 py-2 rounded-md">
                <Plus size={16} />
              </button>
            </div>

            {newOrder.items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm border-b py-1">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <button onClick={createOrder} className="flex-1 bg-blue-500 text-white py-2 rounded-md">Create Order</button>
              <button onClick={() => setShowNewOrder(false)} className="px-4 py-2 border rounded-md">Cancel</button>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length > 0 ? (
          orders.sort((a, b) => {
            if (a.status === 'completed' && b.status !== 'completed') return 1;
            if (a.status !== 'completed' && b.status === 'completed') return -1;
            return b.timestamp - a.timestamp;
          }).map(order => {
            const isCompleted = order.status === 'completed';
            return (
              <div key={order.id} className={`rounded-lg shadow-sm mb-4 ${isCompleted ? 'bg-gray-100' : 'bg-white'}`}>
                <div className="p-4">
                  <div className="mb-2">
                    <p className={`text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-700'}`}>Table: {order.tableNumber}</p>
                    <p className="text-xs text-gray-400">{formatTime(order.timestamp)}</p>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} - {`(${item.size})`} x {item.quantity} </span>
                        
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <strong>Total: ₹{order.total.toFixed(2)}</strong>
                    <div className="flex gap-2">
                     
                      {getNextStatus(order.status) && (
                        <button onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))} className="text-green-600">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button onClick={() => deleteOrder(order.id)} className="text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500">No orders yet. Create your first order!</div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-md flex justify-around py-2 z-50 lg:hidden">
        {[
          { id: 'dashboard', icon: Users, label: 'Dashboard', path: '/admin/dashboard' },
          { id: 'menu', icon: MenuIcon, label: 'Menu', path: '/admin/menu' },
          { id: 'orders', icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
        ].map(item => (
          <button key={item.id}
            onClick={() => { setActiveTab(item.id); navigate(item.path); }}
            className={`flex flex-col items-center text-xs ${activeTab === item.id ? 'text-purple-600' : 'text-gray-600'}`}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Orders;
