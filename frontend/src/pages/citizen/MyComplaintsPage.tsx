import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CITIZEN_COMPLAINT_CATEGORIES } from '../../data/citizenData';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getStatusBadgeStyle, formatDate, openGoogleMaps } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Eye,
  MapPin,
  FilePlus,
  ChevronLeft,
  ChevronRight,
  Building2,
  Loader2,
} from 'lucide-react';

import { Complaint } from '../../types';

const API_URL = 'http://localhost:5000/api';

export const MyComplaintsPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  /*
   * LOAD REAL COMPLAINTS FROM BACKEND
   */
  useEffect(() => {
    const loadComplaints = async () => {
      setLoading(true);
      setError('');

      try {
        const savedToken =
          token ||
          localStorage.getItem('urbanpulse_auth_token') ||
          sessionStorage.getItem('urbanpulse_auth_token');

        if (!savedToken) {
          setError('Please login again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/complaints`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${savedToken}`,
          },
        });

        const result = await response.json();

        console.log('Complaints API:', response.status, result);

        if (!response.ok) {
          throw new Error(
            result?.message || 'Failed to load complaints'
          );
        }

        /*
         * Support different backend response formats.
         */
        const backendComplaints =
          result?.complaints ||
          result?.data ||
          result?.results ||
          [];

        const mapped: Complaint[] = backendComplaints.map(
          (item: any) => {
            const locAddress = typeof item.location === 'string'
              ? item.location
              : (item.location?.address || 'Location not provided');

            const hasLat = typeof item.latitude === 'number' && !isNaN(item.latitude);
            const hasLng = typeof item.longitude === 'number' && !isNaN(item.longitude);

            const lat = hasLat ? item.latitude : (item.location?.lat ?? undefined);
            const lng = hasLng ? item.longitude : (item.location?.lng ?? undefined);

            return {
              id: item._id || item.id,
              ticketId:
                item.ticketId ||
                `UPN-${String(item._id || item.id).slice(-6).toUpperCase()}`,
              title: item.title || 'Untitled Complaint',
              description: item.description || '',
              category: item.category || 'General',
              priority: item.priority || 'medium',
              status: item.status || 'pending',
              location: {
                address: locAddress,
                lat: typeof lat === 'number' ? lat : 0,
                lng: typeof lng === 'number' ? lng : 0,
              },
              latitude: typeof lat === 'number' ? lat : undefined,
              longitude: typeof lng === 'number' ? lng : undefined,
              assignedDepartment:
                item.assignedDepartment ||
                item.department ||
                'General Municipal Services',
              createdAt:
                item.createdAt ||
                new Date().toISOString(),
              updatedAt:
                item.updatedAt ||
                item.createdAt ||
                new Date().toISOString(),
            };
          }
        );

        setComplaints(mapped);
      } catch (err: any) {
        console.error('Loading complaints failed:', err);

        setError(
          err?.message ||
          'Unable to load complaints from the server.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, [token]);

  /*
   * SEARCH + FILTER + SORT
   */
  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((item) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
          item.ticketId?.toLowerCase().includes(search) ||
          item.title?.toLowerCase().includes(search) ||
          item.location?.address?.toLowerCase().includes(search) ||
          item.assignedDepartment?.toLowerCase().includes(search);

        const matchesStatus =
          statusFilter === 'all' ||
          item.status === statusFilter;

        const matchesCategory =
          categoryFilter === 'all' ||
          item.category === categoryFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory
        );
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        }

        if (sortBy === 'oldest') {
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );
        }

        const priorityMap: Record<string, number> = {
          critical: 4,
          high: 3,
          medium: 2,
          low: 1,
        };

        return (
          (priorityMap[b.priority] || 0) -
          (priorityMap[a.priority] || 0)
        );
      });
  }, [
    complaints,
    searchTerm,
    statusFilter,
    categoryFilter,
    sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredComplaints.length / itemsPerPage)
  );

  const paginatedData = useMemo(() => {
    const start =
      (currentPage - 1) * itemsPerPage;

    return filteredComplaints.slice(
      start,
      start + itemsPerPage
    );
  }, [
    filteredComplaints,
    currentPage,
  ]);

  const handleOpenGoogleMaps = (item: any) => {
    openGoogleMaps(item.latitude, item.longitude, item.location);
  };

  /*
   * TABLE COLUMNS
   */
  const columns = [
    {
      header: 'Complaint ID',
      accessorKey: 'ticketId' as const,
      cell: (row: Complaint) => (
        <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
          #{row.ticketId}
        </span>
      ),
    },

    {
      header: 'Title & Location',
      cell: (row: Complaint) => (
        <div className="max-w-xs">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {row.title}
          </p>

          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
            <MapPin className="w-3 h-3" />
            {row.location?.address}
          </span>
        </div>
      ),
    },

    {
      header: 'Category',
      cell: (row: Complaint) => (
        <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {row.category}
        </span>
      ),
    },

    {
      header: 'Department',
      cell: (row: Complaint) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {row.assignedDepartment}
        </span>
      ),
    },

    {
      header: 'Priority',
      cell: (row: Complaint) => (
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {row.priority}
        </span>
      ),
    },

    {
      header: 'Status',
      cell: (row: Complaint) => (
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeStyle(
            row.status
          )}`}
        >
          {String(row.status).replace('_', ' ')}
        </span>
      ),
    },

    {
      header: 'Submitted',
      cell: (row: Complaint) => (
        <span className="text-xs text-slate-500 font-mono">
          {formatDate(row.createdAt)}
        </span>
      ),
    },

    {
      header: 'Actions',
      cell: (row: Complaint) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(
                `/citizen/complaints/${row.id}`
              )
            }
            leftIcon={
              <Eye className="w-3.5 h-3.5" />
            }
          >
            View
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenGoogleMaps(row)}
            leftIcon={
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
            }
            className="text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800"
          >
            Open in Google Maps ↗
          </Button>
        </div>
      ),
    },
  ];

  /*
   * LOADING
   */
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand-600 mx-auto" />

          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
            Loading your complaints...
          </p>
        </div>
      </div>
    );
  }

  /*
   * PAGE
   */
  return (
    <div className="space-y-6 pb-12">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            My Submitted Complaints
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track complaints submitted from your account.
          </p>
        </div>

        <Link to="/citizen/report-complaint">
          <Button
            variant="primary"
            size="lg"
            className="px-6 font-bold"
            leftIcon={
              <FilePlus className="w-4 h-4" />
            }
          >
            Report New Issue
          </Button>
        </Link>

      </div>

      {/* ERROR */}
      {error && (
        <Card className="p-5 border border-rose-500 bg-rose-950/20">
          <p className="text-sm font-bold text-rose-500">
            {error}
          </p>
        </Card>
      )}

      {/* FILTERS */}
      <Card className="p-4 space-y-3">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="all">
                All Categories
              </option>

              {CITIZEN_COMPLAINT_CATEGORIES.map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="md:col-span-2 flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">

            <button
              onClick={() => setViewMode('table')}
              className={`flex-1 p-1.5 rounded-lg ${viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                  : 'text-slate-400'
                }`}
            >
              <List className="w-4 h-4 mx-auto" />
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`flex-1 p-1.5 rounded-lg ${viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                  : 'text-slate-400'
                }`}
            >
              <LayoutGrid className="w-4 h-4 mx-auto" />
            </button>

          </div>

        </div>

      </Card>

      {/* NO DATA */}
      {paginatedData.length === 0 ? (

        <Card className="p-12 text-center space-y-3">

          <Filter className="w-12 h-12 text-slate-400 mx-auto" />

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Complaints Found
          </h3>

          <p className="text-xs text-slate-500">
            You haven't submitted any complaints matching these filters.
          </p>

        </Card>

      ) : viewMode === 'table' ? (

        <Card className="overflow-hidden">
          <Table
            data={paginatedData}
            columns={columns}
            keyExtractor={(r) => r.id}
          />
        </Card>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {paginatedData.map((item) => (

            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
            >

              <Card className="p-5 space-y-4 h-full flex flex-col justify-between">

                <div className="space-y-3">

                  <div className="flex justify-between">

                    <span className="font-mono text-xs font-bold text-brand-600">
                      #{item.ticketId}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 text-xs rounded-full border ${getStatusBadgeStyle(
                        item.status
                      )}`}
                    >
                      {String(item.status).replace(
                        '_',
                        ' '
                      )}
                    </span>

                  </div>

                  <div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {item.description}
                    </p>

                  </div>

                  <div className="space-y-2 text-xs text-slate-500">

                    <div className="flex gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.location?.address}
                    </div>

                    <div className="flex gap-2">
                      <Building2 className="w-3.5 h-3.5" />
                      {item.assignedDepartment}
                    </div>

                  </div>

                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/citizen/complaints/${item.id}`
                      )
                    }
                    leftIcon={
                      <Eye className="w-3.5 h-3.5" />
                    }
                    className="flex-1"
                  >
                    View Details
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenGoogleMaps(item)}
                    leftIcon={
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    }
                    className="flex-1 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800"
                  >
                    Open in Google Maps ↗
                  </Button>
                </div>

              </Card>

            </motion.div>

          ))}

        </div>

      )}

      {/* PAGINATION */}
      {totalPages > 1 && (

        <div className="flex items-center justify-between pt-4">

          <span className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex gap-2">

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((p) => p - 1)
              }
              leftIcon={
                <ChevronLeft className="w-4 h-4" />
              }
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage((p) => p + 1)
              }
              rightIcon={
                <ChevronRight className="w-4 h-4" />
              }
            >
              Next
            </Button>

          </div>

        </div>

      )}

    </div>
  );
};