import { useLaunch } from '../state/LaunchContext.jsx';
import PlaybookView from './PlaybookView.jsx';
import FunnelView from './FunnelView.jsx';
import LinksView from './LinksView.jsx';
import DatesView from './DatesView.jsx';

export default function LivePanel() {
  const { livePanelView, setLivePanelView } = useLaunch();

  return (
    <aside
      className="card"
      style={{ position: 'sticky', top: 16, maxHeight: 'calc(100vh - 32px)', overflowY: 'auto' }}
    >
      <header className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="font-display text-lg text-brand-navy">Live build</h3>
        <div
          className="inline-flex items-center"
          style={{ background: 'rgba(29,32,63,0.06)', borderRadius: 999, padding: 3 }}
        >
          <ToggleBtn active={livePanelView === 'playbook'} onClick={() => setLivePanelView('playbook')}>
            Playbook
          </ToggleBtn>
          <ToggleBtn active={livePanelView === 'funnel'} onClick={() => setLivePanelView('funnel')}>
            Funnel
          </ToggleBtn>
          <ToggleBtn active={livePanelView === 'links'} onClick={() => setLivePanelView('links')}>
            Links
          </ToggleBtn>
          <ToggleBtn active={livePanelView === 'dates'} onClick={() => setLivePanelView('dates')}>
            Dates
          </ToggleBtn>
        </div>
      </header>

      {livePanelView === 'playbook' && <PlaybookView />}
      {livePanelView === 'funnel' && <FunnelView />}
      {livePanelView === 'links' && <LinksView />}
      {livePanelView === 'dates' && <DatesView />}
    </aside>
  );
}

function ToggleBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-semibold uppercase tracking-wider"
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        background: active ? '#1D203F' : 'transparent',
        color: active ? '#fff' : 'rgba(29,32,63,0.7)',
        transition: 'background 120ms, color 120ms',
      }}
    >
      {children}
    </button>
  );
}
