'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CreateAdmin() {
  const [formData, setFormData] = useState({
    name: 'Admin',
    email: '',
    password: '',
    role: 'Admin'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateAdmin = async () => {
    // Validation
    if (!formData.email || !formData.password) {
      setMessage('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      const response = await axios.post('/api/auth/create-admin', formData);
      
      if (response.data.status === 200) {
        setSuccess(true);
        setMessage(response.data.message);
      } else {
        setSuccess(false);
        setMessage(response.data.message || 'Failed to create admin user');
      }
    } catch (error: any) {
      setSuccess(false);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while creating admin user');
      }
      console.error('Error creating admin:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] flex items-center justify-center">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-panel">
        <h1 className="mb-6 text-center font-display text-[clamp(24px,2.8vw,30px)] leading-[1.2] text-[color:var(--ink)]">Create Admin User</h1>
        
        {message && (
          <div className={`p-4 mb-6 rounded ${success ? 'bg-[color:var(--accent-200)]/40 text-[color:var(--primary)]' : 'bg-[color:var(--danger)]/10 text-[color:var(--danger)]'}`}>
            {message}
          </div>
        )}
        
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-[14px] font-medium text-[color:var(--muted)]">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter admin email"
              className="admin-input w-full"
              required
              disabled={loading || success}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="mb-2 block text-[14px] font-medium text-[color:var(--muted)]">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter admin password"
              className="admin-input w-full"
              required
              disabled={loading || success}
            />
          </div>
          
          <div>
            <label htmlFor="name" className="mb-2 block text-[14px] font-medium text-[color:var(--muted)]">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Admin name"
              className="admin-input w-full"
              disabled={loading || success}
            />
          </div>
        </div>
        
        <button
          onClick={handleCreateAdmin}
          disabled={loading || success || !formData.email || !formData.password}
          className={`btn w-full ${
            success ? 'bg-[color:var(--success)] hover:bg-[color:var(--success)]' : 'btn-primary'
          }`}
        >
          {loading ? 'Creating...' : success ? 'Admin Created Successfully' : 'Create Admin User'}
        </button>
        
        {success && (
          <div className="mt-4 text-center">
            <a href="/admin/login" className="text-[color:var(--primary)] hover:underline">
              Go to Admin Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 