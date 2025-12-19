'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Badge, RoleBadge, StatusBadge } from '@/components/ui/Badge';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { LoadingTable } from '@/components/ui/Loading';
import { Alert } from '@/components/ui/Alert';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminUsersContent />
    </ProtectedRoute>
  );
}

function AdminUsersContent() {
  const [users, setUsers] = useState<any[]>([]);
  const [pendingMentors, setPendingMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  const [confirmAction, setConfirmAction] = useState<{ type: string; user: any } | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchPendingMentors();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingMentors = async () => {
    try {
      const response = await axios.get('/api/users/pending-mentors');
      setPendingMentors(response.data);
    } catch (error) {
      console.error('Error fetching pending mentors:', error);
    }
  };

  const approveMentor = async (userId: string) => {
    setProcessing(true);
    try {
      await axios.put(`/api/users/${userId}/approve-mentor`);
      fetchUsers();
      fetchPendingMentors();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error approving mentor');
    } finally {
      setProcessing(false);
      setConfirmAction(null);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setProcessing(true);
    try {
      const endpoint = currentStatus 
        ? `/api/users/${userId}/deactivate` 
        : `/api/users/${userId}/activate`;
      await axios.put(endpoint);
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error updating user status');
    } finally {
      setProcessing(false);
      setConfirmAction(null);
    }
  };

  const deleteUser = async (userId: string) => {
    setProcessing(true);
    try {
      await axios.delete(`/api/users/${userId}`);
      fetchUsers();
      fetchPendingMentors();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error deleting user');
    } finally {
      setProcessing(false);
      setConfirmAction(null);
    }
  };

  const roleStats = {
    students: users.filter(u => u.role === 'STUDENT').length,
    mentors: users.filter(u => u.role === 'MENTOR').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="skeleton h-9 w-48 mb-3" />
            <div className="skeleton h-5 w-64" />
          </div>
          <LoadingTable rows={5} cols={5} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all users and approve mentor registrations
          </p>
        </div>

        {/* Pending Alert */}
        {pendingMentors.length > 0 && (
          <div className="mb-6">
            <Alert variant="warning" title="Pending Approvals">
              <span>
                <strong>{pendingMentors.length}</strong> mentor{pendingMentors.length !== 1 ? 's' : ''} waiting for approval.{' '}
                <button 
                  onClick={() => setActiveTab('pending')}
                  className="font-semibold underline hover:no-underline"
                >
                  Review now
                </button>
              </span>
            </Alert>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{roleStats.students}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{roleStats.mentors}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mentors</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{roleStats.admins}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Pending Mentors
            {pendingMentors.length > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500 text-white">
                {pendingMentors.length}
              </span>
            )}
          </button>
        </div>

        {/* All Users Table */}
        {activeTab === 'all' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Joined</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={user.isActive ? 'active' : 'inactive'} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmAction({ 
                              type: user.isActive ? 'deactivate' : 'activate', 
                              user 
                            })}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => setConfirmAction({ type: 'delete', user })}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pending Mentors */}
        {activeTab === 'pending' && (
          pendingMentors.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✓</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                All Caught Up!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No pending mentor applications to review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingMentors.map((mentor, index) => (
                <div 
                  key={mentor.id} 
                  className="card p-6 animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg">
                        {mentor.firstName[0]}{mentor.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {mentor.firstName} {mentor.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.email}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Applied: {new Date(mentor.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => setConfirmAction({ type: 'approve', user: mentor })}
                      icon={<span>✓</span>}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      fullWidth
                      onClick={() => setConfirmAction({ type: 'reject', user: mentor })}
                      icon={<span>✕</span>}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (!confirmAction) return;
          const { type, user } = confirmAction;
          if (type === 'approve') approveMentor(user.id);
          else if (type === 'reject' || type === 'delete') deleteUser(user.id);
          else if (type === 'activate' || type === 'deactivate') toggleUserStatus(user.id, user.isActive);
        }}
        title={
          confirmAction?.type === 'approve' ? 'Approve Mentor' :
          confirmAction?.type === 'reject' ? 'Reject Application' :
          confirmAction?.type === 'delete' ? 'Delete User' :
          confirmAction?.type === 'activate' ? 'Activate User' :
          'Deactivate User'
        }
        message={
          confirmAction?.type === 'approve' 
            ? `Are you sure you want to approve ${confirmAction.user.firstName} ${confirmAction.user.lastName} as a mentor?`
            : confirmAction?.type === 'reject'
            ? `Are you sure you want to reject ${confirmAction?.user.firstName}'s mentor application? This will delete their account.`
            : confirmAction?.type === 'delete'
            ? `Are you sure you want to delete ${confirmAction?.user.firstName} ${confirmAction?.user.lastName}? This action cannot be undone.`
            : confirmAction?.type === 'activate'
            ? `Are you sure you want to activate ${confirmAction?.user.firstName}'s account?`
            : `Are you sure you want to deactivate ${confirmAction?.user.firstName}'s account?`
        }
        confirmText={
          confirmAction?.type === 'approve' ? 'Approve' :
          confirmAction?.type === 'reject' || confirmAction?.type === 'delete' ? 'Delete' :
          confirmAction?.type === 'activate' ? 'Activate' : 'Deactivate'
        }
        variant={['reject', 'delete', 'deactivate'].includes(confirmAction?.type || '') ? 'danger' : 'primary'}
        loading={processing}
      />
    </div>
  );
}
