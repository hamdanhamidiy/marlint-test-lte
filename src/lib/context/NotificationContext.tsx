'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabase/client';
import { NotificationItem, StudentResult, Certificate } from '../supabase/types';

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
  addNotification: (notification: Omit<ExtendedNotificationItem, 'id' | 'created_at' | 'is_read'>) => Promise<void>;
  refreshRealtimeNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<ExtendedNotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const activeUserId = user?.id || profile?.id;
  const activeUserEmail = user?.email || profile?.email;

  // 1. Fetch Real Live Data from Supabase and generate actual contextual notifications
  const loadRealtimeNotifications = useCallback(async () => {
    if (!activeUserId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const storageKey = `marlins_notifications_${activeUserId}`;
      const readStatusKey = `marlins_read_notifs_${activeUserId}`;
      const deletedKey = `marlins_deleted_notifs_${activeUserId}`;

      let readIds = new Set<string>();
      let deletedIds = new Set<string>();

      try {
        const rawRead = localStorage.getItem(readStatusKey);
        if (rawRead) readIds = new Set(JSON.parse(rawRead));
        const rawDel = localStorage.getItem(deletedKey);
        if (rawDel) deletedIds = new Set(JSON.parse(rawDel));
      } catch {}

      // Purge any legacy dummy mock seed data from storage
      try {
        const legacyRaw = localStorage.getItem(storageKey);
        if (legacyRaw && (legacyRaw.includes('notif-seed-') || legacyRaw.includes('88%'))) {
          localStorage.removeItem(storageKey);
        }
      } catch {}

      const realNotifs: ExtendedNotificationItem[] = [];

      // A. Query Supabase notifications table if available
      try {
        const { data: dbNotifs } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', activeUserId)
          .order('created_at', { ascending: false })
          .limit(20);

        if (dbNotifs && dbNotifs.length > 0) {
          dbNotifs.forEach((n: any) => {
            if (!deletedIds.has(n.id) && !n.id.startsWith('notif-seed-')) {
              realNotifs.push({
                id: n.id,
                user_id: n.user_id,
                type: n.type || 'system',
                category: n.category || 'system',
                title: n.title,
                body: n.body,
                action_url: n.action_url,
                action_label: n.action_label,
                is_read: n.is_read || readIds.has(n.id),
                created_at: n.created_at,
              });
            }
          });
        }
      } catch (err) {
        console.warn('Notifications table query fallback:', err);
      }

      // B. Query Real Exam Results from Supabase & LocalStorage for THIS user
      const seenResultIds = new Set<string>();

      try {
        const { data: resultsData } = await supabase
          .from('student_results')
          .select('*')
          .eq('student_id', activeUserId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (resultsData && resultsData.length > 0) {
          resultsData.forEach((res: any) => {
            const resultKey = res.attempt_id || res.id;
            const notifId = `real-test-${resultKey}`;
            seenResultIds.add(resultKey);

            if (!deletedIds.has(notifId)) {
              const testScore = res.score !== undefined ? res.score : 0;
              const isPassed = res.is_passed;
              const testTitle = res.test_name || `Marlins Test #${res.marlint_test_number || 1}`;

              realNotifs.push({
                id: notifId,
                user_id: activeUserId,
                type: 'test_result',
                category: 'test',
                title: `Hasil Ujian: ${testTitle}`,
                body: `Evaluasi Anda memperoleh skor ${testScore}% (${isPassed ? 'LULUS Predikat Standar STCW' : 'REMEDIAL - Perlu Ujian Ulang'}). Level: ${res.level || 'A1'}.`,
                is_read: readIds.has(notifId),
                created_at: res.created_at || new Date().toISOString(),
                action_url: `/student/history`,
                action_label: 'Lihat Analisis Nilai',
              });
            }
          });
        }
      } catch (err) {
        console.warn('Student results query for notifications note:', err);
      }

      // Also check local test results
      try {
        const localResultsRaw = localStorage.getItem(`marlins_test_results_${activeUserId}`);
        if (localResultsRaw) {
          const localResults = JSON.parse(localResultsRaw);
          if (Array.isArray(localResults)) {
            localResults.forEach((res: any) => {
              const resultKey = res.attempt_id || res.id;
              if (resultKey && !seenResultIds.has(resultKey)) {
                const notifId = `real-test-${resultKey}`;
                if (!deletedIds.has(notifId)) {
                  const testScore = res.score !== undefined ? res.score : 0;
                  const isPassed = res.is_passed;
                  const testTitle = res.test_name || `Marlins Test #${res.marlint_test_number || 1}`;

                  realNotifs.push({
                    id: notifId,
                    user_id: activeUserId,
                    type: 'test_result',
                    category: 'test',
                    title: `Hasil Ujian: ${testTitle}`,
                    body: `Evaluasi Anda memperoleh skor ${testScore}% (${isPassed ? 'LULUS Predikat Standar STCW' : 'REMEDIAL - Perlu Ujian Ulang'}). Level: ${res.level || 'A1'}.`,
                    is_read: readIds.has(notifId),
                    created_at: res.created_at || new Date().toISOString(),
                    action_url: `/student/history`,
                    action_label: 'Lihat Analisis Nilai',
                  });
                }
              }
            });
          }
        }
      } catch {}

      // C. Query Real Certificates from certificates table for THIS user
      try {
        const { data: certsData } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', activeUserId)
          .eq('is_valid', true)
          .order('issued_at', { ascending: false })
          .limit(5);

        if (certsData && certsData.length > 0) {
          certsData.forEach((cert: any) => {
            const notifId = `real-cert-${cert.id || cert.certificate_number}`;
            if (!deletedIds.has(notifId)) {
              realNotifs.push({
                id: notifId,
                user_id: activeUserId,
                type: 'certificate_ready',
                category: 'certificate',
                title: `e-Sertifikat STCW 2010 Diterbitkan`,
                body: `Sertifikat resmi No. ${cert.certificate_number} telah terbit dengan verifikasi QR aktif.`,
                is_read: readIds.has(notifId),
                created_at: cert.issued_at || cert.created_at || new Date().toISOString(),
                action_url: `/student/certificates`,
                action_label: 'Unduh Sertifikat',
              });
            }
          });
        }
      } catch (err) {}

      // D. Query Real Test Entitlements (Active Unlocked Packages)
      try {
        const { data: entData } = await supabase
          .from('test_entitlements')
          .select('*')
          .eq('user_id', activeUserId)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (entData && entData.length > 0) {
          entData.forEach((ent: any) => {
            const notifId = `real-ent-${ent.id || ent.test_number}`;
            if (!deletedIds.has(notifId) && ent.test_number !== 1) { // Skip default free Test 1 to keep relevant
              realNotifs.push({
                id: notifId,
                user_id: activeUserId,
                type: 'token_redeemed',
                category: 'token',
                title: `Akses Paket #${ent.test_number} Terbuka`,
                body: `Hak akses Paket Ujian #${ent.test_number} telah aktif permanen pada akun Anda (${ent.source || 'Aktivasi Lisensi Resmi'}).`,
                is_read: readIds.has(notifId),
                created_at: ent.granted_at || ent.created_at || new Date().toISOString(),
                action_url: `/student/test/${ent.test_number}`,
                action_label: 'Mulai Ujian',
              });
            }
          });
        }
      } catch (err) {}

      // E. Load Client Custom / Transaction Notifications from localStorage
      try {
        const savedCustom = localStorage.getItem(`marlins_custom_notifs_${activeUserId}`);
        if (savedCustom) {
          const parsed = JSON.parse(savedCustom);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: ExtendedNotificationItem) => {
              if (
                !deletedIds.has(item.id) &&
                !item.id.startsWith('notif-seed-') &&
                !realNotifs.some((r) => r.id === item.id)
              ) {
                realNotifs.push({
                  ...item,
                  is_read: item.is_read || readIds.has(item.id),
                });
              }
            });
          }
        }
      } catch {}

      // F. If new account with no activities yet, provide single onboarding announcement
      if (realNotifs.length === 0) {
        realNotifs.push({
          id: `system-welcome-${activeUserId}`,
          user_id: activeUserId,
          type: 'system_welcome',
          category: 'system',
          title: 'Selamat Datang di Portal Marlin Test',
          body: 'Akun Anda aktif dan terhubung dengan sistem asesmen maritim resmi LTE Cruise Training Center.',
          is_read: false,
          created_at: new Date().toISOString(),
          action_url: '/student/tests',
          action_label: 'Pilih Paket Ujian',
        });
      }

      // Sort strictly by newest date
      realNotifs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications(realNotifs);
      localStorage.setItem(storageKey, JSON.stringify(realNotifs));
    } catch (err) {
      console.error('Error loading realtime notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [activeUserId]);

  // Initial fetch and BroadcastChannel setup
  useEffect(() => {
    loadRealtimeNotifications();

    // Cross-tab realtime synchronization
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('marlins_notifications_channel');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'NOTIFICATION_UPDATE') {
          loadRealtimeNotifications();
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [loadRealtimeNotifications]);

  // 2. Realtime Postgres Subscriptions for LIVE events (student_results, test_entitlements, certificates, notifications)
  useEffect(() => {
    if (!activeUserId) return;

    const channelName = `realtime_notifs_${activeUserId}_${Date.now()}`;
    const liveChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_results',
          filter: `student_id=eq.${activeUserId}`,
        },
        (payload) => {
          console.log('Realtime student_result detected:', payload);
          loadRealtimeNotifications();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'test_entitlements',
          filter: `user_id=eq.${activeUserId}`,
        },
        (payload) => {
          console.log('Realtime test_entitlement detected:', payload);
          loadRealtimeNotifications();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'certificates',
          filter: `user_id=eq.${activeUserId}`,
        },
        (payload) => {
          console.log('Realtime certificate detected:', payload);
          loadRealtimeNotifications();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${activeUserId}`,
        },
        (payload) => {
          console.log('Realtime notification record detected:', payload);
          loadRealtimeNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(liveChannel);
    };
  }, [activeUserId, loadRealtimeNotifications]);

  // Mark as read
  const markAsRead = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
      );

      if (typeof window !== 'undefined' && activeUserId) {
        try {
          const readStatusKey = `marlins_read_notifs_${activeUserId}`;
          const raw = localStorage.getItem(readStatusKey);
          const readSet = new Set(raw ? JSON.parse(raw) : []);
          readSet.add(id);
          localStorage.setItem(readStatusKey, JSON.stringify(Array.from(readSet)));
        } catch {}
      }

      // Also attempt updating in Supabase if it's a UUID notification
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        supabase.from('notifications').update({ is_read: true }).eq('id', id).then();
      }

      // Notify other tabs
      broadcastChannelRef.current?.postMessage({ type: 'NOTIFICATION_UPDATE' });
    },
    [activeUserId]
  );

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));

    if (typeof window !== 'undefined' && activeUserId) {
      try {
        const readStatusKey = `marlins_read_notifs_${activeUserId}`;
        const allIds = notifications.map((n) => n.id);
        localStorage.setItem(readStatusKey, JSON.stringify(allIds));
      } catch {}
    }

    // Also update in Supabase
    if (activeUserId) {
      supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', activeUserId)
        .then();
    }

    broadcastChannelRef.current?.postMessage({ type: 'NOTIFICATION_UPDATE' });
  }, [activeUserId, notifications]);

  // Delete single notification
  const deleteNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));

      if (typeof window !== 'undefined' && activeUserId) {
        try {
          const deletedKey = `marlins_deleted_notifs_${activeUserId}`;
          const raw = localStorage.getItem(deletedKey);
          const delSet = new Set(raw ? JSON.parse(raw) : []);
          delSet.add(id);
          localStorage.setItem(deletedKey, JSON.stringify(Array.from(delSet)));

          // Remove from custom storage if exists
          const customKey = `marlins_custom_notifs_${activeUserId}`;
          const rawCustom = localStorage.getItem(customKey);
          if (rawCustom) {
            const arr = JSON.parse(rawCustom).filter((x: any) => x.id !== id);
            localStorage.setItem(customKey, JSON.stringify(arr));
          }
        } catch {}
      }

      // Delete from Supabase if applicable
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        supabase.from('notifications').delete().eq('id', id).then();
      }

      broadcastChannelRef.current?.postMessage({ type: 'NOTIFICATION_UPDATE' });
    },
    [activeUserId]
  );

  // Clear all notifications
  const clearAll = useCallback(() => {
    const allIds = notifications.map((n) => n.id);
    setNotifications([]);

    if (typeof window !== 'undefined' && activeUserId) {
      try {
        const deletedKey = `marlins_deleted_notifs_${activeUserId}`;
        localStorage.setItem(deletedKey, JSON.stringify(allIds));
        localStorage.removeItem(`marlins_custom_notifs_${activeUserId}`);
        localStorage.removeItem(`marlins_notifications_${activeUserId}`);
      } catch {}
    }

    if (activeUserId) {
      supabase.from('notifications').delete().eq('user_id', activeUserId).then();
    }

    broadcastChannelRef.current?.postMessage({ type: 'NOTIFICATION_UPDATE' });
  }, [activeUserId, notifications]);

  // Add new notification in real-time
  const addNotification = useCallback(
    async (notification: Omit<ExtendedNotificationItem, 'id' | 'created_at' | 'is_read'>) => {
      const targetUserId = notification.user_id || activeUserId || 'guest';
      const newItem: ExtendedNotificationItem = {
        ...notification,
        id: `custom-notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        is_read: false,
        created_at: new Date().toISOString(),
        user_id: targetUserId,
      };

      // 1. Update State Instantly
      setNotifications((prev) => [newItem, ...prev.filter((n) => n.id !== newItem.id)]);

      // 2. Save to localStorage
      if (typeof window !== 'undefined' && targetUserId) {
        try {
          const customKey = `marlins_custom_notifs_${targetUserId}`;
          const rawCustom = localStorage.getItem(customKey);
          let customArr: ExtendedNotificationItem[] = rawCustom ? JSON.parse(rawCustom) : [];
          customArr = [newItem, ...customArr.filter((n) => n.id !== newItem.id)];
          localStorage.setItem(customKey, JSON.stringify(customArr));
        } catch {}
      }

      // 3. Attempt inserting into Supabase notifications table
      try {
        await supabase.from('notifications').insert({
          user_id: targetUserId,
          type: notification.type || 'system',
          category: notification.category || 'system',
          title: notification.title,
          body: notification.body,
          action_url: notification.action_url,
          action_label: notification.action_label,
          is_read: false,
          created_at: newItem.created_at,
        });
      } catch (dbErr) {
        console.warn('Supabase notification insert note:', dbErr);
      }

      // 4. Broadcast to other open tabs
      broadcastChannelRef.current?.postMessage({ type: 'NOTIFICATION_UPDATE' });
    },
    [activeUserId]
  );

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
        refreshRealtimeNotifications: loadRealtimeNotifications,
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
