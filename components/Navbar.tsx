"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span
              className="text-lg font-bold neon-text"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              星屿工作室
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-blue-200 hover:text-cyan-400 transition-colors text-sm">
              服务项目
            </Link>
            <Link href="/#process" className="text-blue-200 hover:text-cyan-400 transition-colors text-sm">
              开发流程
            </Link>
            <Link href="/#cases" className="text-blue-200 hover:text-cyan-400 transition-colors text-sm">
              案例展示
            </Link>
            <Link
              href="/order"
              className="btn-primary px-5 py-2 rounded-full text-sm"
            >
              立即下单
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-blue-200"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link href="/#services" className="text-blue-200 hover:text-cyan-400 transition-colors py-2" onClick={() => setOpen(false)}>服务项目</Link>
            <Link href="/#process" className="text-blue-200 hover:text-cyan-400 transition-colors py-2" onClick={() => setOpen(false)}>开发流程</Link>
            <Link href="/#cases" className="text-blue-200 hover:text-cyan-400 transition-colors py-2" onClick={() => setOpen(false)}>案例展示</Link>
            <Link href="/order" className="btn-primary px-5 py-2 rounded-full text-sm text-center" onClick={() => setOpen(false)}>立即下单</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
