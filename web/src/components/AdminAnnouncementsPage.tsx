import { AdminAnnouncementsPanel } from './AdminAnnouncementsPanel';

interface AdminAnnouncementsPageProps {
  hasContentAdminAccess: boolean;
  authLoading?: boolean;
}

export function AdminAnnouncementsPage({ hasContentAdminAccess, authLoading }: AdminAnnouncementsPageProps) {
  if (authLoading) {
    return (
      <div className="ff-admin-page">
        <div className="ff-admin-page-body">
          <div className="ff-admin-empty-state p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary-500/30 border-t-primary-500" />
            <p className="mt-4 text-slate-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasContentAdminAccess) {
    return (
      <div className="ff-admin-page">
        <div className="ff-admin-page-body">
          <div className="ff-admin-danger-dialog rounded-[28px] p-8 text-center">
            <h1 className="mb-4 font-public text-3xl font-bold tracking-[-0.045em] text-red-300">Access Denied</h1>
            <p className="text-slate-200/78">You must be an admin or content admin to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ff-admin-page">
      <div className="ff-admin-page-body">
        <AdminAnnouncementsPanel />
      </div>
    </div>
  );
}
