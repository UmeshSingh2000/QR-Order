import React, { useState } from 'react'
import { Plus, Clock, CheckCircle, XCircle, Eye, Edit3, Trash2 } from 'lucide-react'
import { Users, ShoppingCart, Menu as MenuIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client';
import { useEffect } from 'react'

const socket = io('http://localhost:3000');
const Orders = () => {
  const navigate = useNavigate()
  useEffect(() => {
  socket.on('orderReceive', (orderItems, tableNumber) => {
    const formattedItems = orderItems.map((item, index) => ({
      id: Date.now() + index, // unique id for each item
      name: item.itemname,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      size: item.size
    }));

    const total = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = {
      id: Date.now(),
      // customerName: 'Walk-in Customer',
      tableNumber: tableNumber,
      items: formattedItems,
     
      timestamp: new Date(),
      total
    };

    setOrders(prev => [newOrder, ...prev]);
    console.log('New Order received from table:', tableNumber);
  });

  return () => {
    socket.off('orderReceive');
  };
}, []);

  const [orders, setOrders] = useState([])
   console.log('Order received:', orders);

  const [showNewOrder, setShowNewOrder] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    tableNumber: '',
    items: []
  })
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: 1 })
  const [activeTab, setActiveTab] = useState('orders');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    preparing: 'bg-blue-100 text-blue-800 border-blue-200',
    ready: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const statusIcons = {
    pending: <Clock size={16} />,
    preparing: <Clock size={16} />,
    ready: <CheckCircle size={16} />,
    completed: <CheckCircle size={16} />
  }

  const addItemToNewOrder = () => {
    if (newItem.name.trim() && newItem.price.trim()) {
      const item = {
        id: Date.now(),
        name: newItem.name,
        price: parseFloat(newItem.price),
        quantity: parseInt(newItem.quantity)
      }
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items, item]
      })
      setNewItem({ name: '', price: '', quantity: 1 })
    }
  }

  const removeItemFromNewOrder = (itemId) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter(item => item.id !== itemId)
    })
  }

  const createOrder = () => {
    if (newOrder.customerName.trim() && newOrder.tableNumber.trim() && newOrder.items.length > 0) {
      const total = newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const order = {
        id: Date.now(),
        customerName: newOrder.customerName,
        tableNumber: newOrder.tableNumber,
        items: newOrder.items,
        status: 'pending',
        timestamp: new Date(),
        total
      }
      setOrders([order, ...orders])
      setNewOrder({ customerName: '', tableNumber: '', items: [] })
      setShowNewOrder(false)
    }
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const deleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId))
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)

    if (minutes < 60) {
      return `${minutes}m ago`
    } else {
      const hours = Math.floor(minutes / 60)
      return `${hours}h ${minutes % 60}m ago`
    }
  }

  const getNextStatus = (currentStatus) => {
    const statusFlow = ['pending', 'preparing', 'ready', 'completed']
    const currentIndex = statusFlow.indexOf(currentStatus)
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <button
            onClick={() => setShowNewOrder(!showNewOrder)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            New Order
          </button>
        </div>

        {/* New Order Form */}
        {showNewOrder && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="font-semibold text-gray-800 mb-4">Create New Order</h2>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                placeholder="Table Number"
                value={newOrder.tableNumber}
                onChange={(e) => setNewOrder({ ...newOrder, tableNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            {/* Add Items */}
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Add Items</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={addItemToNewOrder}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Items List */}
              {newOrder.items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <span className="text-gray-800">{item.name}</span>
                    <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-600">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeItemFromNewOrder(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {newOrder.items.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      ${newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={createOrder}
                className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Create Order
              </button>
              <button
                onClick={() => setShowNewOrder(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-3">
          {orders
            .sort((a, b) => {
              // Sort by status: active orders first, then completed
              if (a.status === 'completed' && b.status !== 'completed') return 1;
              if (a.status !== 'completed' && b.status === 'completed') return -1;
              // Within same status group, sort by timestamp (newest first)
              return b.timestamp - a.timestamp;
            })
            .map(order => {
              const isCompleted = order.status === 'completed';
              return (
                <div key={order.id} className={`rounded-lg shadow-sm overflow-hidden ${isCompleted ? 'bg-gray-100' : 'bg-white'}`}>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        
                        <p className={`text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                          Table Number: {order.tableNumber}
                        </p>
                        <p className={`text-xs ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatTime(order.timestamp)}
                        </p>
                      </div>
                      
                    </div>

                    <div className="space-y-1 mb-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className={isCompleted ? 'text-gray-500' : 'text-gray-700'}>
                            {item.name} x{item.quantity}
                          </span>
                          <span className={`font-medium ${isCompleted ? 'text-gray-500' : 'text-gray-900'}`}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className={`flex justify-between items-center pt-3 border-t ${isCompleted ? 'border-gray-200' : 'border-gray-100'}`}>
                      <div className={`font-semibold ${isCompleted ? 'text-gray-500' : 'text-gray-800'}`}>
                        Total: ${order.total.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className={`p-1 ${isCompleted ? 'text-gray-400 hover:text-gray-600' : 'text-blue-600 hover:text-blue-800'}`}
                        >
                          <Eye size={16} />
                        </button>
                        {getNextStatus(order.status) && (
                          <button
                            onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                            className={`p-1 ${isCompleted ? 'text-gray-400 hover:text-gray-600' : 'text-green-600 hover:text-green-800'}`}
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className={`p-1 ${isCompleted ? 'text-gray-400 hover:text-gray-600' : 'text-red-600 hover:text-red-800'}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders yet. Create your first order!
          </div>
        )}
      </div>
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
            className={`flex flex-col items-center text-xs transition-all duration-200 p-2 rounded-lg ${activeTab === item.id
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
  )
}

export default Orders