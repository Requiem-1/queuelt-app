import { useState } from 'react';
import {
  Building2,
  Users,
  FolderTree,
  Plus,
  Edit3,
  Trash2,
  Power,
  ShieldCheck,
  UserPlus,
  Search,
  X,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INITIAL_VENUES = [
  {
    id: 'v1',
    name: 'College Cafe',
    code: 'CAF',
    category: 'Dining',
    countersCount: 3,
    capacity: 250,
    status: 'Active',
    tokensIssued: 1420,
    operatingHours: '08:00 AM - 08:00 PM',
  },
  {
    id: 'v2',
    name: 'Gym Desk & Fitness',
    code: 'GYM',
    category: 'Fitness',
    countersCount: 2,
    capacity: 100,
    status: 'Active',
    tokensIssued: 680,
    operatingHours: '06:00 AM - 10:00 PM',
  },
  {
    id: 'v3',
    name: 'Library Lab & Study Desk',
    code: 'LIB',
    category: 'Academic',
    countersCount: 4,
    capacity: 180,
    status: 'Active',
    tokensIssued: 940,
    operatingHours: '09:00 AM - 09:00 PM',
  },
  {
    id: 'v4',
    name: 'CityCare Medical Clinic',
    code: 'MED',
    category: 'Healthcare',
    countersCount: 2,
    capacity: 80,
    status: 'Deactivated',
    tokensIssued: 310,
    operatingHours: '08:00 AM - 05:00 PM',
  },
  {
    id: 'v5',
    name: 'Campus Event Pavilion',
    code: 'EVT',
    category: 'Events',
    countersCount: 3,
    capacity: 500,
    status: 'Active',
    tokensIssued: 1150,
    operatingHours: '10:00 AM - 11:00 PM',
  },
];

const INITIAL_STAFF = [
  {
    id: 's1',
    name: 'Alex',
    email: 'alex@example.com',
    role: 'superadmin',
    assignedVenue: 'College Cafe',
    assignedCounter: 'All Counters',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 's2',
    name: 'Sarah',
    email: 'sarah@example.com',
    role: 'admin',
    assignedVenue: 'College Cafe',
    assignedCounter: 'Veg Counter',
    status: 'Active',
    avatar: '',
  },
  {
    id: 's3',
    name: 'Michael',
    email: 'michael@example.com',
    role: 'admin',
    assignedVenue: 'Gym Desk & Fitness',
    assignedCounter: 'Personal Trainer Desk',
    status: 'Active',
    avatar: '',
  },
  {
    id: 's4',
    name: 'Angela',
    email: 'angela@example.com',
    role: 'admin',
    assignedVenue: 'Library Lab & Study Desk',
    assignedCounter: 'Reference Desk',
    status: 'Pending Invite',
    avatar: '',
  },
  {
    id: 's5',
    name: 'Jan',
    email: 'jan@example.com',
    role: 'admin',
    assignedVenue: 'CityCare Medical Clinic',
    assignedCounter: 'General OPD',
    status: 'Active',
    avatar: '',
  },
];

const INITIAL_CATEGORIES = [
  {
    id: 'cat1',
    name: 'Dining',
    slug: 'dining',
    description: 'Cafeterias, food courts, and bistro counters',
    venueCount: 4,
    status: 'Active',
    color: 'amber',
  },
  {
    id: 'cat2',
    name: 'Healthcare',
    slug: 'healthcare',
    description: 'OPD clinics, pharmacy, and triage desks',
    venueCount: 2,
    status: 'Active',
    color: 'emerald',
  },
  {
    id: 'cat3',
    name: 'Fitness',
    slug: 'fitness',
    description: 'Gym equipment desks, locker check-ins, PT sessions',
    venueCount: 3,
    status: 'Active',
    color: 'blue',
  },
  {
    id: 'cat4',
    name: 'Events',
    slug: 'events',
    description: 'Auditorium ticketing, registration, and VIP check-in',
    venueCount: 2,
    status: 'Active',
    color: 'purple',
  },
  {
    id: 'cat5',
    name: 'Academic',
    slug: 'academic',
    description: 'Student services, library desks, and lab check-in',
    venueCount: 5,
    status: 'Active',
    color: 'indigo',
  },
];

export const SuperAdminPage = () => {
  const { user, setUserRole } = useAuth();
  const [activeTab, setActiveTab] = useState('venues'); // 'venues' | 'staff' | 'categories'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // State data for CRUD
  const [venues, setVenues] = useState(INITIAL_VENUES);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  // Modals state
  const [isAddVenueOpen, setIsAddVenueOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [isInviteStaffOpen, setIsInviteStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form states
  const [venueForm, setVenueForm] = useState({ name: '', code: '', category: 'Dining', capacity: 200, operatingHours: '09:00 AM - 06:00 PM' });
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'admin', assignedVenue: 'College Cafe', assignedCounter: 'Veg Counter' });
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '', color: 'blue' });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // --- VENUE HANDLERS ---
  const handleSaveVenue = (e) => {
    e.preventDefault();
    if (!venueForm.name || !venueForm.code) return;

    if (editingVenue) {
      setVenues((prev) =>
        prev.map((v) => (v.id === editingVenue.id ? { ...v, ...venueForm } : v))
      );
      showToast(`Updated venue "${venueForm.name}" successfully!`);
    } else {
      const newVenue = {
        id: `v-${Date.now()}`,
        ...venueForm,
        countersCount: 2,
        status: 'Active',
        tokensIssued: 0,
      };
      setVenues((prev) => [...prev, newVenue]);
      showToast(`New venue "${venueForm.name}" added successfully!`);
    }
    setIsAddVenueOpen(false);
    setEditingVenue(null);
    setVenueForm({ name: '', code: '', category: 'Dining', capacity: 200, operatingHours: '09:00 AM - 06:00 PM' });
  };

  const handleToggleVenueStatus = (id) => {
    setVenues((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        const nextStatus = v.status === 'Active' ? 'Deactivated' : 'Active';
        showToast(`Venue "${v.name}" status changed to ${nextStatus}`);
        return { ...v, status: nextStatus };
      })
    );
  };

  const handleDeleteVenue = (id, name) => {
    setVenues((prev) => prev.filter((v) => v.id !== id));
    showToast(`Venue "${name}" removed from infrastructure.`);
  };

  // --- STAFF HANDLERS ---
  const handleInviteStaff = (e) => {
    e.preventDefault();
    if (!inviteForm.email || !inviteForm.name) return;

    if (editingStaff) {
      setStaffList((prev) =>
        prev.map((s) => (s.id === editingStaff.id ? { ...s, ...inviteForm } : s))
      );
      showToast(`Updated staff account details for "${inviteForm.name}"`);
    } else {
      const newStaff = {
        id: `s-${Date.now()}`,
        ...inviteForm,
        status: 'Pending Invite',
        avatar: '',
      };
      setStaffList((prev) => [...prev, newStaff]);
      showToast(`Admin invitation sent to ${inviteForm.email}!`);
    }
    setIsInviteStaffOpen(false);
    setEditingStaff(null);
    setInviteForm({ name: '', email: '', role: 'admin', assignedVenue: 'College Cafe', assignedCounter: 'Veg Counter' });
  };

  const handleDeleteStaff = (id, name) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    showToast(`Access revoked for staff account "${name}"`);
  };

  // --- CATEGORY HANDLERS ---
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryForm.name) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...categoryForm } : c))
      );
      showToast(`Category "${categoryForm.name}" updated!`);
    } else {
      const newCategory = {
        id: `cat-${Date.now()}`,
        ...categoryForm,
        slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        venueCount: 0,
        status: 'Active',
      };
      setCategories((prev) => [...prev, newCategory]);
      showToast(`Category "${categoryForm.name}" created!`);
    }
    setIsAddCategoryOpen(false);
    setEditingCategory(null);
    setCategoryForm({ name: '', slug: '', description: '', color: 'blue' });
  };

  const handleToggleCategoryStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nextStatus = c.status === 'Active' ? 'Deactivated' : 'Active';
        showToast(`Category "${c.name}" ${nextStatus}`);
        return { ...c, status: nextStatus };
      })
    );
  };

  // Filtered lists
  const filteredVenues = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignedVenue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-w-0 overflow-x-hidden space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-5 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold text-sm shadow-2xl flex items-center gap-3 border border-zinc-700 dark:border-zinc-200">
            <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header & Dev Role Control Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-zinc-200 dark:border-zinc-800/80 pb-6 min-w-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Super Admin Global Control Center
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-950/60 text-purple-400 border border-purple-800/50">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Superadmin Mode
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Organization-wide venue infrastructure, staff privilege management, and queue taxonomy controls.
          </p>
        </div>

        {/* Role Switcher Helper for Testing */}
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 pl-2">Testing Role:</span>
          <button
            type="button"
            onClick={() => setUserRole('superadmin')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
              user?.role === 'superadmin'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Superadmin
          </button>
          <button
            type="button"
            onClick={() => setUserRole('admin')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
              user?.role === 'admin'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Registered Venues
            </p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white mt-1">{venues.length}</p>
            <p className="text-xs text-emerald-500 font-bold mt-1">
              {venues.filter((v) => v.status === 'Active').length} Active Infrastructure
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Assigned Staff Accounts
            </p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white mt-1">{staffList.length}</p>
            <p className="text-xs text-purple-400 font-bold mt-1">
              {staffList.filter((s) => s.role === 'superadmin').length} Superadmins • {staffList.filter((s) => s.role === 'admin').length} Admins
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Queue Taxonomy
            </p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white mt-1">{categories.length}</p>
            <p className="text-xs text-emerald-500 font-bold mt-1">Global Categories Active</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shrink-0">
            <FolderTree className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={() => setActiveTab('venues')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'venues'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Venue Infrastructure ({venues.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Accounts ({staffList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>System Categories ({categories.length})</span>
          </button>
        </div>

        {/* Search & Action Input */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dynamic Add Button based on active tab */}
          {activeTab === 'venues' && (
            <button
              type="button"
              onClick={() => {
                setEditingVenue(null);
                setVenueForm({ name: '', code: '', category: 'Dining', capacity: 200, operatingHours: '09:00 AM - 06:00 PM' });
                setIsAddVenueOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-500/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Venue</span>
            </button>
          )}

          {activeTab === 'staff' && (
            <button
              type="button"
              onClick={() => {
                setEditingStaff(null);
                setInviteForm({ name: '', email: '', role: 'admin', assignedVenue: 'College Cafe', assignedCounter: 'Veg Counter' });
                setIsInviteStaffOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-500/20 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite New Admin</span>
            </button>
          )}

          {activeTab === 'categories' && (
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', slug: '', description: '', color: 'blue' });
                setIsAddCategoryOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-500/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: VENUE INFRASTRUCTURE MANAGER */}
      {activeTab === 'venues' && (
        <div className="rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Venue &amp; Code</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Counters &amp; Capacity</th>
                  <th className="py-3.5 px-5">Total Tokens</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 font-medium">
                {filteredVenues.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                          {v.code}
                        </span>
                        <div>
                          <p className="font-extrabold text-sm text-zinc-900 dark:text-white">{v.name}</p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Hours: {v.operatingHours}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {v.category}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-zinc-700 dark:text-zinc-300">
                      <p className="font-bold">{v.countersCount} Counters</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Max Cap: {v.capacity} guests</p>
                    </td>
                    <td className="py-4 px-5 font-black text-zinc-900 dark:text-white">
                      {v.tokensIssued.toLocaleString()}
                    </td>
                    <td className="py-4 px-5">
                      {v.status === 'Active' ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-zinc-800 text-zinc-400 border border-zinc-700">
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingVenue(v);
                            setVenueForm({
                              name: v.name,
                              code: v.code,
                              category: v.category,
                              capacity: v.capacity,
                              operatingHours: v.operatingHours,
                            });
                            setIsAddVenueOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Edit Venue"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Toggle Status Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleVenueStatus(v.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            v.status === 'Active'
                              ? 'text-amber-500 hover:bg-amber-500/10'
                              : 'text-emerald-500 hover:bg-emerald-500/10'
                          }`}
                          title={v.status === 'Active' ? 'Deactivate Venue' : 'Activate Venue'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteVenue(v.id, v.name)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Delete Venue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STAFF & MANAGER ACCOUNT MANAGEMENT */}
      {activeTab === 'staff' && (
        <div className="rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Staff Member</th>
                  <th className="py-3.5 px-5">Role Tag</th>
                  <th className="py-3.5 px-5">Assigned Venue &amp; Counter</th>
                  <th className="py-3.5 px-5">Account Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 font-medium">
                {filteredStaff.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        {s.avatar ? (
                          <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-blue-500" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 border border-blue-400 text-xs">
                            {s.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-extrabold text-sm text-zinc-900 dark:text-white">{s.name}</p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      {s.role === 'superadmin' ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-purple-500/15 text-purple-400 border border-purple-500/30 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-purple-400" />
                          superadmin
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          admin
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-zinc-700 dark:text-zinc-300">
                      <p className="font-bold">{s.assignedVenue}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{s.assignedCounter}</p>
                    </td>
                    <td className="py-4 px-5">
                      {s.status === 'Active' ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Pending Invite
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStaff(s);
                            setInviteForm({
                              name: s.name,
                              email: s.email,
                              role: s.role,
                              assignedVenue: s.assignedVenue,
                              assignedCounter: s.assignedCounter,
                            });
                            setIsInviteStaffOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Edit Staff Account"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Revoke / Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(s.id, s.name)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Revoke Access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM CATEGORY MANAGER */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 shrink-0 font-black">
                    <Tag className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-black text-zinc-900 dark:text-white">{c.name}</h3>
                    <p className="text-[11px] text-zinc-400 font-mono">/{c.slug}</p>
                  </div>
                </div>
                {c.status === 'Active' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-zinc-800 text-zinc-400 border border-zinc-700">
                    Disabled
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{c.description}</p>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-400">{c.venueCount} Assigned Venues</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(c);
                      setCategoryForm({ name: c.name, slug: c.slug, description: c.description, color: c.color });
                      setIsAddCategoryOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleCategoryStatus(c.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Toggle Status"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: ADD / EDIT VENUE MODAL */}
      {isAddVenueOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                    {editingVenue ? 'Edit Venue Details' : 'Add New Venue'}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Register infrastructure queue location</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddVenueOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVenue} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 mb-1">Venue Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. College Cafe"
                  value={venueForm.name}
                  onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1">Venue Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CAF"
                    value={venueForm.code}
                    onChange={(e) => setVenueForm({ ...venueForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
                  <select
                    value={venueForm.category}
                    onChange={(e) => setVenueForm({ ...venueForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1">Capacity Limit</label>
                  <input
                    type="number"
                    value={venueForm.capacity}
                    onChange={(e) => setVenueForm({ ...venueForm, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={venueForm.operatingHours}
                    onChange={(e) => setVenueForm({ ...venueForm, operatingHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddVenueOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-blue-500/20"
                >
                  {editingVenue ? 'Save Changes' : 'Create Venue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INVITE / EDIT STAFF MODAL */}
      {isInviteStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                    {editingStaff ? 'Edit Staff Account' : 'Invite New Admin'}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Assign staff privileges to venue counters</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteStaffOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteStaff} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah.j@example.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1">System Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1">Assigned Venue</label>
                  <select
                    value={inviteForm.assignedVenue}
                    onChange={(e) => setInviteForm({ ...inviteForm, assignedVenue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {venues.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 mb-1">Assigned Counter Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Veg Counter / All Counters"
                  value={inviteForm.assignedCounter}
                  onChange={(e) => setInviteForm({ ...inviteForm, assignedCounter: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsInviteStaffOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-purple-500/20"
                >
                  {editingStaff ? 'Save Changes' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT CATEGORY MODAL */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <FolderTree className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                    {editingCategory ? 'Edit Queue Category' : 'Add New Category'}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Classify venue types and queues</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dining / Healthcare"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Brief overview of queues in this category..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
