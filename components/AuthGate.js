"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LoginForm from "./LoginForm";
import TopNav from "./TopNav";

export default function AuthGate({ children }) {
  // undefined = ainda verificando, null = deslogado, objeto = logado
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, novaSessao) => {
      setSession(novaSessao);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/40 text-sm">
        Carregando...
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return (
    <>
      <TopNav userEmail={session.user.email} onLogout={handleLogout} />
      {children}
    </>
  );
}
