'use client';

import React, { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import EmptyState from '@/components/EmptyState';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const userRoles = ['Admin', 'Yogi', 'Volunteer', 'User'];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [roleMessage, setRoleMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/auth/admin/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError('An error occurred while fetching users');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const updateRole = async (userId: string, role: string) => {
    const previousUsers = users;
    setUpdatingUserId(userId);
    setRoleMessage(null);
    setUsers((currentUsers) =>
      currentUsers.map((user) => (user._id === userId ? { ...user, role } : user))
    );

    try {
      const response = await fetch('/api/auth/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user role');
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) => (user._id === userId ? { ...user, role: data.role } : user))
      );
      setRoleMessage('Role updated successfully.');
    } catch (err) {
      setUsers(previousUsers);
      setRoleMessage(err instanceof Error ? err.message : 'Failed to update user role.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isLoading) return <div className="p-6 text-sm text-[color:var(--muted)]">Loading users...</div>;
  if (error) return <div className="p-6 text-sm admin-btn-danger">{error}</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Users</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">All users</h1>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
          Assign app access roles for dashboard and volunteer-enabled features.
        </p>
      </section>

      {roleMessage ? (
        <div className="admin-card px-5 py-4 text-sm text-[color:var(--muted)]">{roleMessage}</div>
      ) : null}

      {users.length === 0 ? (
        <EmptyState
          icon={<FiUsers className="w-7 h-7 text-[color:var(--muted)]" />}
          title="No users found"
          message="Registered users will appear here."
        />
      ) : (
      <section className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-5 font-semibold">{user.name}</td>
                  <td className="px-6 py-5 text-sm text-[color:var(--muted)]">{user.email}</td>
                  <td className="px-6 py-5">
                    <select
                      className="admin-input min-w-[150px]"
                      value={user.role || 'User'}
                      disabled={updatingUserId === user._id}
                      onChange={(event) => updateRole(user._id, event.target.value)}
                    >
                      {userRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      )}
    </div>
  );
}
