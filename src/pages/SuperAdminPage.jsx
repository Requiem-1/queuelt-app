import { useState } from 'react';
import {
  Building2,
  Users,
  FolderTree,
  Activity,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import useSuperAdminData from '../hooks/useSuperAdminData';
import VenuesTab from '../components/superadmin/VenuesTab';
import StaffTab from '../components/superadmin/StaffTab';
import CategoriesTab from '../components/superadmin/CategoriesTab';
import GlobalConfigTab from '../components/superadmin/GlobalConfigTab';

export const SuperAdminPage = () => {
  const {
    activeTab,
    setActiveTab,
    filteredVenues,
    filteredStaff,
    filteredCategories,
    searchQuery,
    setSearchQuery,
    isVenueModalOpen,
    setIsVenueModalOpen,
    editingVenue,
    setEditingVenue,
    isStaffModalOpen,
    setIsStaffModalOpen,
    editingStaff,
    setEditingStaff,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    editingCategory,
    setEditingCategory,
    handleSaveVenue,
    handleDeleteVenue,
    handleToggleVenueStatus,
    handleSaveStaff,
    handleDeleteStaff,
    handleSaveCategory,
    handleDeleteCategory,
  } = useSuperAdminData();

  // Local form states for modals
  const [venueForm, setVenueForm] = useState({ name: '', code: '', category: 'Dining', capacity: 200, operatingHours: '08:00 AM - 08:00 PM' });
  const [staffForm, setStaffForm] = useState({ name: '', email: '', role: 'admin', assignedVenue: 'College Cafe', assignedCounter: 'All Counters' });
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '' });

  const openVenueModal = (venue = null) => {
    if (venue) {
      setEditingVenue(venue);
      setVenueForm({ name: venue.name, code: venue.code, category: venue.category, capacity: venue.capacity || 200, operatingHours: venue.operatingHours || '08:00 AM - 08:00 PM' });
    } else {
      setEditingVenue(null);
      setVenueForm({ name: '', code: '', category: 'Dining', capacity: 200, operatingHours: '08:00 AM - 08:00 PM' });
    }
    setIsVenueModalOpen(true);
  };

  const openStaffModal = (member = null) => {
    if (member) {
      setEditingStaff(member);
      setStaffForm({ name: member.name, email: member.email, role: member.role, assignedVenue: member.assignedVenue, assignedCounter: member.assignedCounter || 'All Counters' });
    } else {
      setEditingStaff(null);
      setStaffForm({ name: '', email: '', role: 'admin', assignedVenue: 'College Cafe', assignedCounter: 'All Counters' });
    }
    setIsStaffModalOpen(true);
  };

  const openCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({ name: cat.name, slug: cat.slug || '', description: cat.description || '' });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', slug: '', description: '' });
    }
    setIsCategoryModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              Superadmin Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
            Global Platform Management
          </h1>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('venues')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'venues'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Venues ({filteredVenues.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'staff'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff & Access ({filteredStaff.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'categories'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Taxonomy ({filteredCategories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'config'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Health & Telemetry</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'venues' && (
        <VenuesTab
          venues={filteredVenues}
          onOpenAddModal={() => openVenueModal()}
          onEditVenue={(v) => openVenueModal(v)}
          onDeleteVenue={handleDeleteVenue}
          onToggleStatus={handleToggleVenueStatus}
        />
      )}

      {activeTab === 'staff' && (
        <StaffTab
          staff={filteredStaff}
          onOpenInviteModal={() => openStaffModal()}
          onEditStaff={(s) => openStaffModal(s)}
          onDeleteStaff={handleDeleteStaff}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesTab
          categories={filteredCategories}
          onOpenAddModal={() => openCategoryModal()}
          onEditCategory={(c) => openCategoryModal(c)}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {activeTab === 'config' && <GlobalConfigTab />}

      {/* Venue Modal */}
      {isVenueModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                {editingVenue ? 'Edit Venue' : 'Create New Venue'}
              </h3>
              <button onClick={() => setIsVenueModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveVenue(venueForm);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Venue Name</label>
                <input
                  type="text"
                  required
                  value={venueForm.name}
                  onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })}
                  placeholder="e.g. City Food Pavilion"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={venueForm.code}
                    onChange={(e) => setVenueForm({ ...venueForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. CFP"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Category</label>
                  <select
                    value={venueForm.category}
                    onChange={(e) => setVenueForm({ ...venueForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  >
                    <option value="Dining">Dining</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Academic">Academic</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-xs"
              >
                {editingVenue ? 'Save Changes' : 'Create Venue'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Staff Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                {editingStaff ? 'Edit Staff Permissions' : 'Invite Staff Member'}
              </h3>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveStaff(staffForm);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  placeholder="sarah@example.com"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Role</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Assigned Venue</label>
                  <input
                    type="text"
                    value={staffForm.assignedVenue}
                    onChange={(e) => setStaffForm({ ...staffForm, assignedVenue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-xs"
              >
                {editingStaff ? 'Save Changes' : 'Send Platform Invite'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveCategory(categoryForm);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Dining"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Brief description of venues in this category..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-xs"
              >
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
