'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { NotificationItem } from '../supabase/types';

export interface ExtendedNotificationItem extends NotificationItem {
  category?: 'test' | 'certificate' | 'token' | 'article' | 'system';
  action_url?: string;
  action_label?: string;
}

interface NotificationContextType {
  notifications: ExtendedNotificationItem[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (notification: Omit<ExtendedNotificationItem, 'id' | 'created_at' | 'is_read'>) => void;
  resetDefaultNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<ExtendedNotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const activeUserId = user?.id || profile?.id || 'guest_user';

  // Seed standard high-value notifications for the student
  const getInitialSeedNotifications = useCallback((userId: string, userName: string): ExtendedNotificationItem[] => {
    const now = Date.now();
    return [
      {
        id: `notif-seed-1-${userId}`,
        user_id: userId,
        type: 'test_result',
        category: 'test',
        title: 'Hasil Ujian Marlins Test #1 Tersedia',
        body: 'Selamat! Anda telah menyelesaikan evaluasi Marlins Placement Test dengan skor 88% (Predikat Lulus Level B2).',
        is_read: false,
        created_at: new Date(now - 1000 * 60 * 15).toISOString(), // 15 mins ago
        action_url: '/student/history',
        action_label: 'Lihat Rincian Skor',
      },
      {
        id: `notif-seed-2-${userId}`,
        user_id: userId,
        type: 'certificate_ready',
        category: 'certificate',
        title: 'e-Sertifikat STCW 2010 Siap Diunduh',
        body: 'Dokumen kelulusan resmi berstandar IMO STCW Anda telah terverifikasi dengan QR Code aktif.',
        is_read: false,
        created_at: new Date(now - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        action_url: '/student/certificates',
        action_label: 'Unduh Sertifikat',
      },
      {
        id: `notif-seed-3-${userId}`,
        user_id: userId,
        type: 'token_redeemed',
        category: 'token',
        title: 'Token Akses Berhasil Diaktivasi',
        body: 'Voucher lisensi Paket Ujian #1 & #2 aktif secara permanen untuk akun Anda.',
        is_read: true,
        created_at: new Date(now - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        action_url: '/student/tests',
        action_label: 'Buka Paket Ujian',
      },
      {
        id: `notif-seed-4-${userId}`,
        user_id: userId,
        type: 'new_article',
        category: 'article',
        title: 'Modul SMCP Baru: Standard Marine VHF',
        body: 'Materi pembelajaran kosakata komunikasi darurat kapal telah ditambahkan oleh instruktur.',
        is_read: true,
        created_at: new Date(now - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        action_url: '/student/articles',
        action_label: 'Pelajari Modul',
      },
      {
        id: `notif-seed-5-${userId}`,
        user_id: userId,
        type: 'system_announcement',
        category: 'system',
        title: 'Pembaruan Standar Penilaian Maritim 2026',
        body: 'Platform Marlin Test telah disesuaikan dengan regulasi IMO Model Course 3.17 edisi terbaru.',
        is_read: true,
        created_at: new Date(now - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        action_url: '/student/level',
        action_label: 'Cek Matriks CEFR',
      },
    ];
  }, []);

  // Load from localStorage or initialize with seed
  useEffect(() => {
    if (!activeUserId) return;

    try {
      setLoading(true);
      const storageKey = `marlins_notifications_${activeUserId}`;
      const savedData = localStorage.getItem(storageKey);

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNotifications(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Failed parsing stored notifications, reseeding', e);
        }
      }

      // Initialize with seed
      const seeds = getInitialSeedNotifications(activeUserId, profile?.full_name || 'Pelaut');
      setNotifications(seeds);
      localStorage.setItem(storageKey, JSON.stringify(seeds));
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [activeUserId, profile?.full_name, getInitialSeedNotifications]);

  // Persist to localStorage whenever notifications change
  const saveToStorage = useCallback((updated: ExtendedNotificationItem[]) => {
    if (typeof window === 'undefined' || !activeUserId) return;
    try {
      const storageKey = `marlins_notifications_${activeUserId}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving notifications to storage:', err);
    }
  }, [activeUserId]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, is_read: true } : item));
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((item) => ({ ...item, is_read: true }));
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    if (typeof window !== 'undefined' && activeUserId) {
      localStorage.removeItem(`marlins_notifications_${activeUserId}`);
    }
  }, [activeUserId]);

  const addNotification = useCallback((notification: Omit<ExtendedNotificationItem, 'id' | 'created_at' | 'is_read'>) => {
    const newItem: ExtendedNotificationItem = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      is_read: false,
      created_at: new Date().toISOString(),
      user_id: notification.user_id || activeUserId,
    };

    setNotifications((prev) => {
      const updated = [newItem, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, [activeUserId, saveToStorage]);

  const resetDefaultNotifications = useCallback(() => {
    const seeds = getInitialSeedNotifications(activeUserId, profile?.full_name || 'Pelaut');
    setNotifications(seeds);
    saveToStorage(seeds);
  }, [activeUserId, profile?.full_name, getInitialSeedNotifications, saveToStorage]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        addNotification,
        resetDefaultNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
