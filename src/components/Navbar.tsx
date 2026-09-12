'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { FullLogo } from '@/components/FullLogo';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 h-12 md:h-14 flex items-center justify-between px-3 md:px-5 border-b border-border shrink-0 bg-bg-surface">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <FullLogo iconClassName="w-7 h-7 md:w-8 md:h-8" textClassName="h-[30px] md:h-[34px]" />
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">About</Link>
            <Link href="/resources" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">Tutorials</Link>
            <Link href="/privacy" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">Terms</Link>
          </div>
          <div className="hidden md:block w-px h-4 bg-border mx-2"></div>
          <div className="hidden md:flex items-center gap-1">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-bg-subtle transition-colors" title="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-1.5 -mr-1 text-secondary hover:text-primary hover:bg-bg-subtle rounded-lg transition-colors" title="Menu">
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="relative flex flex-col w-64 max-w-[80%] h-full bg-bg-surface shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
                <FullLogo iconClassName="h-[20px] w-auto" textClassName="h-[22px] w-auto" />
              </Link>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 text-secondary hover:text-primary rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <div className="flex flex-col p-2 overflow-visible">
              <div className="flex flex-col mb-2 pb-2 border-b border-border space-y-1">
                <button onClick={() => { toggleTheme(); setIsMenuOpen(false); }} className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors w-full text-left">
                  <span>Theme</span>
                  <span className="px-2.5 py-1 bg-bg-subtle border border-border rounded-full text-xs font-bold text-primary capitalize">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                </button>
              </div>

              <div className="p-2 flex flex-col gap-1 border-t border-border">
                <Link href="/about" onClick={() => setIsMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors">
                  About
                </Link>
                <Link href="/resources" onClick={() => setIsMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors">
                  Tutorials
                </Link>
                <Link href="/privacy" onClick={() => setIsMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" onClick={() => setIsMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
