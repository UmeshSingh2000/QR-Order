import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { Users, ShoppingCart, DollarSign, TrendingUp, Bell, Search, Settings, Menu as MenuIcon } from 'lucide-react'

const AdminLayout = () => {
  const stats = [
    { id: 1, name: 'Total Users', value: '12,345', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { id: 2, name: 'Total Orders', value: '8,721', change: '+5%', icon: ShoppingCart, color: 'bg-green-500' },
    { id: 3, name: 'Revenue', value: '$45,231', change: '+18%', icon: DollarSign, color: 'bg-purple-500' },
    { id: 4, name: 'Growth', value: '23.5%', change: '+3%', icon: TrendingUp, color: 'bg-orange-500' },
  ]

  const monthlyData = [
    { month: 'Jan', users: 400, orders: 240, revenue: 2400 },
    { month: 'Feb', users: 300, orders: 139, revenue: 2210 },
    { month: 'Mar', users: 200, orders: 980, revenue: 2290 },
    { month: 'Apr', users: 278, orders: 390, revenue: 2000 },
    { month: 'May', users: 189, orders: 480, revenue: 2181 },
    { month: 'Jun', users: 239, orders: 380, revenue: 2500 },
  ]

  const pieData = [
    { name: 'Desktop', value: 45, color: '#8884d8' },
    { name: 'Mobile', value: 35, color: '#82ca9d' },
    { name: 'Tablet', value: 20, color: '#ffc658' },
  ]

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', product: 'Laptop Pro', amount: '$1,299', status: 'Completed' },
    { id: '#12346', customer: 'Jane Smith', product: 'Smartphone X', amount: '$899', status: 'Processing' },
    { id: '#12347', customer: 'Bob Johnson', product: 'Headphones', amount: '$199', status: 'Shipped' },
    { id: '#12348', customer: 'Alice Brown', product: 'Tablet Mini', amount: '$449', status: 'Pending' },
    { id: '#12349', customer: 'Charlie Wilson', product: 'Smart Watch', amount: '$299', status: 'Completed' },
  ]

  const topProducts = [
    { name: 'Laptop Pro', sales: 245, revenue: '$318,755' },
    { name: 'Smartphone X', sales: 189, revenue: '$169,811' },
    { name: 'Headphones', sales: 156, revenue: '$31,044' },
    { name: 'Tablet Mini', sales: 98, revenue: '$44,002' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Processing': return 'bg-blue-100 text-blue-800'
      case 'Shipped': return 'bg-purple-100 text-purple-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-md font-semibold mb-4">Monthly Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-md font-semibold mb-4">Device Usage</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-md font-semibold">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-medium">
                <tr>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3 font-medium">{order.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-inner flex justify-around items-center py-2 z-50 lg:hidden">
        <button className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600">
          <Users size={20} />
          <span>Dashboard</span>
        </button>
        <button className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600">
          <MenuIcon size={20} />
          <span>Menu</span>
        </button>
        <button className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600">
          <ShoppingCart size={20} />
          <span>Orders</span>
        </button>
      </div>
    </div>
  )
}

export default AdminLayout
