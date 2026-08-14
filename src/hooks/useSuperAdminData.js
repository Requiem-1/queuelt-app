import { useState, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const INITIAL_SUPERADMIN_VENUES = [
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

export const INITIAL_STAFF = [
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

export const INITIAL_CATEGORIES = [
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
    description: 'Gym desks, locker rooms, and trainer consultations',
    venueCount: 2,
    status: 'Active',
    color: 'blue',
  },
  {
    id: 'cat4',
    name: 'Academic',
    slug: 'academic',
    description: 'Library counters, study lab access, and registrar offices',
    venueCount: 3,
    status: 'Active',
    color: 'purple',
  },
  {
    id: 'cat5',
    name: 'Events',
    slug: 'events',
    description: 'Auditorium admissions and event registration desks',
    venueCount: 2,
    status: 'Active',
    color: 'rose',
  },
];

export const useSuperAdminData = () => {
  const [activeTab, setActiveTab] = useState('venues');
  const [venues, setVenues] = useState(INITIAL_SUPERADMIN_VENUES);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & form state
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Filtered lists
  const filteredVenues = useMemo(() => {
    if (!searchQuery.trim()) return venues;
    const q = searchQuery.toLowerCase();
    return venues.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.code.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
    );
  }, [venues, searchQuery]);

  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return staff;
    const q = searchQuery.toLowerCase();
    return staff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.assignedVenue.toLowerCase().includes(q)
    );
  }, [staff, searchQuery]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  // Venue CRUD
  const handleSaveVenue = useCallback((venueData) => {
    if (editingVenue) {
      setVenues((prev) =>
        prev.map((v) => (v.id === editingVenue.id ? { ...v, ...venueData } : v))
      );
      toast.success(`Updated venue "${venueData.name}"`);
    } else {
      const newVenue = {
        id: `v_${Date.now()}`,
        tokensIssued: 0,
        status: 'Active',
        ...venueData,
      };
      setVenues((prev) => [...prev, newVenue]);
      toast.success(`Created venue "${venueData.name}"`);
    }
    setIsVenueModalOpen(false);
    setEditingVenue(null);
  }, [editingVenue]);

  const handleDeleteVenue = useCallback((venueId) => {
    setVenues((prev) => prev.filter((v) => v.id !== venueId));
    toast.success('Venue removed from platform');
  }, []);

  const handleToggleVenueStatus = useCallback((venueId) => {
    setVenues((prev) =>
      prev.map((v) => {
        if (v.id !== venueId) return v;
        const nextStatus = v.status === 'Active' ? 'Deactivated' : 'Active';
        toast.success(`Venue "${v.name}" status: ${nextStatus}`);
        return { ...v, status: nextStatus };
      })
    );
  }, []);

  // Staff CRUD
  const handleSaveStaff = useCallback((staffData) => {
    if (editingStaff) {
      setStaff((prev) =>
        prev.map((s) => (s.id === editingStaff.id ? { ...s, ...staffData } : s))
      );
      toast.success(`Updated staff "${staffData.name}"`);
    } else {
      const newStaffMember = {
        id: `s_${Date.now()}`,
        status: 'Active',
        avatar: '',
        ...staffData,
      };
      setStaff((prev) => [...prev, newStaffMember]);
      toast.success(`Invited "${staffData.name}" to platform`);
    }
    setIsStaffModalOpen(false);
    setEditingStaff(null);
  }, [editingStaff]);

  const handleDeleteStaff = useCallback((staffId) => {
    setStaff((prev) => prev.filter((s) => s.id !== staffId));
    toast.success('Staff member removed');
  }, []);

  // Category CRUD
  const handleSaveCategory = useCallback((categoryData) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...categoryData } : c))
      );
      toast.success(`Updated category "${categoryData.name}"`);
    } else {
      const newCat = {
        id: `cat_${Date.now()}`,
        venueCount: 0,
        status: 'Active',
        color: 'blue',
        ...categoryData,
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success(`Created category "${categoryData.name}"`);
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  }, [editingCategory]);

  const handleDeleteCategory = useCallback((categoryId) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    toast.success('Category removed');
  }, []);

  return {
    activeTab,
    setActiveTab,
    venues,
    staff,
    categories,
    searchQuery,
    setSearchQuery,
    filteredVenues,
    filteredStaff,
    filteredCategories,
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
  };
};

export default useSuperAdminData;
