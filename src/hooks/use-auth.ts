'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

interface Permission {
  permission_name: string;
  resource: string;
  action: string;
}

interface Role {
  id: string;
  is_primary: boolean;
  assigned_at: string;
  roles: {
    id: string;
    name: string;
    description: string;
    level: number;
  } | {
    id: string;
    name: string;
    description: string;
    level: number;
  }[];
}

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  bio: string | null;
  website: string | null;
  timezone: string;
  language: string;
  email_notifications: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return { user, loading };
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPermissions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('get_user_permissions', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error fetching permissions:', error);
        setPermissions([]);
      } else {
        setPermissions(data || []);
      }
      
      setLoading(false);
    };

    fetchPermissions();
  }, [supabase]);

  const hasPermission = (permissionName: string) => {
    return permissions.some((p) => p.permission_name === permissionName);
  };

  const can = (action: string, resource: string) => {
    return hasPermission(`${resource}:${action}`);
  };

  return { permissions, hasPermission, can, loading };
}

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchRoles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          is_primary,
          assigned_at,
          roles:role_id (
            id,
            name,
            description,
            level
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching roles:', error);
        setRoles([]);
      } else {
        setRoles(data || []);
      }
      
      setLoading(false);
    };

    fetchRoles();
  }, [supabase]);

  const hasRole = (roleName: string) => {
    return roles.some((r) => {
      const roleData = Array.isArray(r.roles) ? r.roles[0] : r.roles;
      return roleData?.name === roleName;
    });
  };

  const hasAnyRole = (roleNames: string[]) => {
    return roleNames.some(name => hasRole(name));
  };

  const isAdmin = () => hasAnyRole(['super_admin', 'admin']);
  const isSuperAdmin = () => hasRole('super_admin');

  return { 
    roles, 
    hasRole, 
    hasAnyRole, 
    isAdmin, 
    isSuperAdmin, 
    loading 
  };
}

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  const updateProfile = async (updates: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'No user logged in' };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error) {
      setProfile(data);
    }

    return { data, error };
  };

  return { profile, loading, updateProfile };
}
