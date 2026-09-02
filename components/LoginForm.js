"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setLoading(false);
    if (error) {
      setError("E-mail ou senha incorretos.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-panel border border-line rounded-lg p-6 flex flex-col gap-4 w-full max-w-sm"
      >
        <div>
          <h1 className="text-lg font-semibold">Central de Achados</h1>
          <p className="text-xs text-white/40">Faça login pra continuar</p>
        </div>

        <input
          className="input"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {error && <p className="text-weak text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-ember hover:bg-ember/90 disabled:opacity-50 text-black font-medium text-sm px-4 py-2 rounded-md transition"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <style jsx>{`
          .input {
            background: #0f1115;
            border: 1px solid #262b35;
            border-radius: 6px;
            padding: 8px 10px;
            font-size: 14px;
            color: white;
            width: 100%;
          }
          .input:focus {
            outline: none;
            border-color: #ff7a45;
          }
        `}</style>
      </form>
    </div>
  );
}
