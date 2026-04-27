import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LoginModal } from '@/components/LoginModal';
import { Home } from '@/pages/Home';
import { SpotMap } from '@/pages/SpotMap';
import { SpotList } from '@/pages/SpotList';
import { SpotDetail } from '@/pages/SpotDetail';
import { Timeline } from '@/pages/Timeline';
import { RoutePlan } from '@/pages/RoutePlan';
import { Upload } from '@/pages/Upload';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar
          user={user}
          onLoginClick={() => setLoginOpen(true)}
          onLogout={() => setUser(null)}
        />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<SpotMap />} />
            <Route path="/spots" element={<SpotList />} />
            <Route path="/spot/:id" element={<SpotDetail />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/route-plan" element={<RoutePlan />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onLogin={(u) => setUser(u)}
      />
      <Toaster />
    </HashRouter>
  );
}

export default App;