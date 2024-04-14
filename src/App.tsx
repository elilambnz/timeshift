import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { supabase } from "./lib/supabase";
import { SupabaseProvider } from "./providers/SupabaseProvider";
import { Session } from "@supabase/supabase-js";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <SupabaseProvider session={session}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="dashboard" element={<Dashboard session={session} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SupabaseProvider>
  );
}

export default App;
