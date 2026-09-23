import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/ui/SearchBar';
import { Table } from '../../components/ui/Table';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { User, Role } from '../../types';
import { UserPlus } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token =
        localStorage.getItem('urbanpulse_auth_token') ||
        sessionStorage.getItem('urbanpulse_auth_token');

      if (!token) {
        throw new Error('Admin authentication token missing');
      }

      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch user directory');
      }

      const mappedUsers: User[] = (data.users || []).map((u: any) => ({
        id: u._id,
        name: u.fullName || u.username || 'Unknown User',
        email: u.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.username || u.fullName || 'User')}`,
        role: u.role as Role,
        status: u.isActive ? 'active' : 'suspended',
        department: u.department || (u.role === 'citizen' ? 'General Citizen' : 'Municipal Staff'),
        createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent',
      }));

      setUsers(mappedUsers);
    } catch (err: any) {
      console.error('Error loading users:', err);
      setError(err.message || 'Error loading user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newIsActive = currentStatus !== 'active';
    try {
      const token =
        localStorage.getItem('urbanpulse_auth_token') ||
        sessionStorage.getItem('urbanpulse_auth_token');
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: newIsActive }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, status: newIsActive ? 'active' : 'suspended' } : u
          )
        );
      } else {
        alert(data.message || 'Failed to update user status');
      }
    } catch (err: any) {
      console.error('Error toggling status:', err);
      alert('Failed to reach backend server');
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'User',
      cell: (row: User) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.name} size="sm" />
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{row.name}</p>
            <span className="text-xs text-slate-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (row: User) => (
        <Badge variant={row.role === 'admin' ? 'primary' : row.role === 'staff' ? 'info' : 'default'}>
          {row.role.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Department / Organization',
      cell: (row: User) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {row.department || 'General Citizen'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row: User) => (
        <Badge variant={row.status === 'active' ? 'success' : 'warning'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Joined Date',
      accessorKey: 'createdAt' as const,
    },
    {
      header: 'Actions',
      cell: (row: User) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleToggleStatus(row.id, row.status)}
          disabled={row.role === 'admin'}
          className="text-xs border-slate-700 hover:bg-slate-800"
        >
          {row.status === 'active' ? 'Suspend' : 'Activate'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Staff Directory"
        subtitle="Manage citizen access, municipal staff roles, and administrative permissions"
        actions={
          <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
            Add Staff Member
          </Button>
        }
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Search users by name or email..." className="w-full sm:w-80" />

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      ) : loading ? (
        <div className="p-8 text-center text-slate-400 text-sm">Loading user directory from MongoDB...</div>
      ) : (
        <Table data={filtered} columns={columns} keyExtractor={(r) => r.id} />
      )}
    </div>
  );
};

