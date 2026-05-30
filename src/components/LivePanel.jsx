import { useLaunch } from '../state/LaunchContext.jsx';
import PlaybookView from './PlaybookView.jsx';
import FunnelView from './FunnelView.jsx';
import LinksView from './LinksView.jsx';
import DatesView from './DatesView.jsx';
import DebriefView from './DebriefView.jsx';
import EmailsView from './EmailsView.jsx';

export default function LivePanel() {
  const { livePanelView, setLivePanelView } = useLaunch();

  return (
    <aside
      className="card"
      style={{
        // No sticky / maxHeight / overflow constraints — the iframe auto-
        // resizes to fit content, so the right panel grows naturally with
        // whichever view is active. We do NOT set overflowX:hidden because
        // when one axis is hidden CSS implicitly switches the other axis to
        // 'auto', producing a phantom (and broken) scrollbar. Inner views all
        // use overflow-wrap to keep long text inside their boxes instead.
        minWidth: 0,
      }}
    >
      <header className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="font-display text-lg text-brand-navy">Live build</h3>
        <div
          className="inline-flex items-center flex-wrap"
          style={{ background: 'rgba(29,32,63,0.06)', borderRadius: 12, padding: 3, maxWidth: '100%' }}
        >
          <ToggleBtn active={livePanelView === 'playbook'} onClick={() => setLivePanelView('playbook')}>
            Playbook
          </ToggleBtn>
          <ToggleBtn active={livePanelView === 'debrief'} onClick={() => setLivePanelView('debrief')}>
            Debrief
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
          <ToggleBtn active={livePanelView === 'emails'} onClick={() => setLivePanelView('emails')}>
            Emails
          </ToggleBtn>
        </div>
      </header>

      {livePanelView === 'playbook' && <PlaybookView />}
      {livePanelView === 'debrief' && <DebriefView />}
      {livePanelView === 'funnel' && <FunnelView />}
      {livePanelView === 'links' && <LinksView />}
      {livePanelView === 'dates' && <DatesView />}
      {livePanelView === 'emails' && <EmailsView />}
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
