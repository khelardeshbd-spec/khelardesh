/**
 * lib/activity.ts
 * Server-side activity logger — writes to the immutable ActivityLog table.
 * Never call this from client components.
 */

import { supabaseAdmin } from './supabase';
import type { SessionUser } from './rbac';

export type ActionType =
  // Article actions
  | 'article.create'
  | 'article.update'
  | 'article.delete'
  | 'article.publish'
  | 'article.archive'
  // Employee management
  | 'employee.create'
  | 'employee.update_permissions'
  | 'employee.deactivate'
  | 'employee.activate'
  | 'employee.delete'
  // Admin management (super admin only)
  | 'admin.block'
  | 'admin.unblock'
  // Auth
  | 'auth.login'
  | 'auth.logout';

export interface LogActivityParams {
  actor: SessionUser;
  action: ActionType;
  targetType?: string;
  targetId?: string;
  targetLabel?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log an activity to the ActivityLog table.
 * Errors are silently swallowed to avoid blocking the main operation.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  const { actor, action, targetType, targetId, targetLabel, metadata } = params;
  try {
    const { error } = await supabaseAdmin.from('ActivityLog').insert({
      actor_id: actor.id || actor.username,
      actor_display_name: actor.displayName,
      actor_role: actor.role,
      action,
      target_type: targetType ?? null,
      target_id: targetId ?? null,
      target_label: targetLabel ?? null,
      metadata: metadata ?? null,
    });
    if (error) {
      console.error('[ActivityLog] Insert error:', error.message);
    }
  } catch (e) {
    console.error('[ActivityLog] Unexpected error:', e);
  }
}
