import { LaunchProvider } from './state/LaunchContext.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  return (
    <LaunchProvider>
      <Dashboard />
    </LaunchProvider>
  );
}
