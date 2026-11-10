import React, { useState } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Bike,
  ShoppingBag,
  Settings,
  Users,
  Search,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'restaurants' | 'riders'>('overview');

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E1E1E] text-white flex flex-col">
        <div className="p-5 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#961E1E] flex items-center justify-center font-black text-xl">
              Z
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wide">ZUPIT</h1>
              <span className="text-xs text-neutral-400">Operations • Jamui</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'overview' ? 'bg-[#961E1E] text-white' : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'orders' ? 'bg-[#961E1E] text-white' : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Live Orders
            <span className="ml-auto bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
              3
            </span>
          </button>

          <button
            onClick={() => setActiveTab('restaurants')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'restaurants' ? 'bg-[#961E1E] text-white' : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            Restaurants & Menus
          </button>

          <button
            onClick={() => setActiveTab('riders')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'riders' ? 'bg-[#961E1E] text-white' : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Bike className="w-4 h-4" />
            Riders & Fleet
          </button>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold">Admin Panel</p>
              <p className="text-xs text-neutral-400">Jamui Central Hub</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, phone numbers, restaurants..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#961E1E]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-600">Jamui Dispatch Live</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Today's Orders
                  </span>
                  <div className="text-2xl font-bold text-slate-900 mt-2">18</div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +12% from yesterday
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Gross GMV
                  </span>
                  <div className="text-2xl font-bold text-slate-900 mt-2">₹5,420</div>
                  <span className="text-xs text-slate-400 mt-1 block">COD + UPI Completed</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Active Delivery Riders
                  </span>
                  <div className="text-2xl font-bold text-emerald-600 mt-2">6 Online</div>
                  <span className="text-xs text-slate-400 mt-1 block">Station Rd & Main Market</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Active Restaurants
                  </span>
                  <div className="text-2xl font-bold text-slate-900 mt-2">5 Live</div>
                  <span className="text-xs text-slate-400 mt-1 block">Accepting orders</span>
                </div>
              </div>

              {/* Live Order Queue Preview */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="font-bold text-slate-900">Recent Live Orders</h2>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#961E1E] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-red-50 text-[#961E1E] flex items-center justify-center font-bold text-sm">
                        #1042
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">Royal Biryani & Rolls</p>
                        <p className="text-xs text-slate-500">2x Chicken Biryani • ₹340 (COD)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                        <Clock className="w-3.5 h-3.5" /> Food Preparing
                      </span>
                      <button className="px-3 py-1.5 bg-[#961E1E] text-white rounded-lg text-xs font-semibold hover:bg-[#831717]">
                        Assign Rider
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                        #1041
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">Jamui Sweets & Bakers</p>
                        <p className="text-xs text-slate-500">1kg Gulab Jamun • ₹260 (UPI Paid)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        <CheckCircle className="w-3.5 h-3.5" /> Delivered
                      </span>
                      <span className="text-xs text-slate-400">Rider: Rajesh K.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Live Dispatch & Order Management</h2>
              <p className="text-sm text-slate-500">
                Full order list with manual rider dispatch override for Jamui delivery zones.
              </p>
            </div>
          )}

          {activeTab === 'restaurants' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Registered Restaurants in Jamui</h2>
                  <p className="text-sm text-slate-500">Manage store listings, menus, and item availability</p>
                </div>
                <button className="px-4 py-2 bg-[#961E1E] text-white rounded-lg text-sm font-semibold hover:bg-[#831717]">
                  + Add New Restaurant
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-900">Royal Biryani & Rolls</h3>
                    <p className="text-xs text-slate-500">Main Road, Near Post Office, Jamui</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">
                      Open & Accepting
                    </span>
                  </div>
                  <button className="text-xs font-semibold text-[#961E1E] border border-[#961E1E] px-3 py-1.5 rounded-lg hover:bg-red-50">
                    Edit Menu
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-900">Jamui Sweets & Bakers</h3>
                    <p className="text-xs text-slate-500">Station Road, Jamui</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">
                      Open & Accepting
                    </span>
                  </div>
                  <button className="text-xs font-semibold text-[#961E1E] border border-[#961E1E] px-3 py-1.5 rounded-lg hover:bg-red-50">
                    Edit Menu
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'riders' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Rider Fleet Operations</h2>
              <p className="text-sm text-slate-500">
                Track registered riders, active status, daily performance, and verification status.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

