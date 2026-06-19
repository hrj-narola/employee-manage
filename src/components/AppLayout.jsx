import { Outlet, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ title = 'NexaHR' }) {
  const { tenantId } = useParams();

  return (
    <div className="app-layout">
      <Sidebar tenantId={tenantId} />
      <div className="main-content">
        <Topbar title={title} />
        <main className="page-content animate-fade">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
