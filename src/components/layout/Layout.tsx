import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ backgroundColor: "#0D1520" }} className="min-h-screen">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — siempre fixed */}
      <div
        className={`
          fixed top-0 left-0 bottom-0 z-30
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Footer — fixed al fondo, ancho completo */}
      <footer
        style={{
          backgroundColor: "#090F1A",
          borderTop: "1px solid #1e3a5f",
        }}
        className="fixed bottom-0 left-0 right-0 z-10 py-3 flex items-center justify-center"
      >
        <p className="text-slate-500 text-xs text-center">
          &copy; {new Date().getFullYear()} MoneyMind. Todos los derechos reservados.
        </p>
      </footer>

      {/* Main — margen izquierdo para no quedar debajo del sidebar */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar mobile */}
        <div
          style={{
            backgroundColor: "#090F1A",
            borderBottom: "1px solid #1e3a5f",
          }}
          className="flex items-center gap-4 px-4 py-3 lg:hidden"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span style={{ color: "#3ecf8e" }} className="text-lg font-bold">
            Money<span className="text-white">Mind</span>
          </span>
        </div>

        {/* pb-10 para que el contenido no quede tapado por el footer */}
        <main className="flex-1 p-4 lg:p-8 pb-12">
          <Outlet />
        </main>
      </div>

    </div>
  );
}