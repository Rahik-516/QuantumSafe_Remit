"use client";

import Link from 'next/link';
import { FiLock, FiMenu, FiX, FiHome, FiLogIn, FiUserPlus, FiShield, FiUser, FiLogOut, FiChevronDown, FiZap } from 'react-icons/fi';
import { MdLockOutline } from 'react-icons/md';
import { RiRobot2Line } from 'react-icons/ri';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Check for authenticated user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open & manage focus
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
      // Trap focus: move focus to menu on open
      if (menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        if (firstElement) setTimeout(() => firstElement.focus(), 0);
      }
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
      // Restore focus to trigger button on close
      if (triggerRef.current) triggerRef.current.focus();
    }
  }, [isMenuOpen]);

  // Handle Escape key to close menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    closeMenu();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-gradient-to-r from-indigo-600 to-emerald-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16 md:h-20">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
              <motion.div 
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                  scrolled 
                    ? 'bg-gradient-to-br from-indigo-500 to-emerald-500' 
                    : 'bg-white/20'
                }`}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiLock className={`w-5 h-5 ${scrolled ? 'text-white' : 'text-white'}`} />
              </motion.div>
              <div className="flex flex-col">
                <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  QuantumSafe
                </span>
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  scrolled ? 'text-indigo-600' : 'text-indigo-100'
                }`}>
                  Secure Remit
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  scrolled 
                    ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <FiHome className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/#features"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  scrolled 
                    ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Features
              </Link>
              <Link
                href="/#why-quantumsafe"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  scrolled 
                    ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Why Us
              </Link>
              <Link
                href="/#how-it-works"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  scrolled 
                    ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                How It Works
              </Link>
              <Link
                href="/#faq"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  scrolled 
                    ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                FAQ
              </Link>
              {!loading && (
                user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        scrolled 
                          ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' 
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      <FiUser className="w-4 h-4" />
                      <span className="max-w-[150px] truncate">{user.email}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        scrolled 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        scrolled 
                          ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' 
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      <FiLogIn className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                    <Link
                      href="/signup"
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ml-2 ${
                        scrolled 
                          ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105' 
                          : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-lg'
                      }`}
                    >
                      <FiUserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )
              )}
            </div>

            {/* Mobile Hamburger Button - Always visible, clickable to toggle menu */}
            <motion.button
              ref={triggerRef}
              onClick={toggleMenu}
              className={`md:hidden p-3 rounded-xl transition-all duration-300 relative z-[1001] ${
                scrolled 
                  ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200' 
                  : 'text-white hover:bg-white/20 active:bg-white/30'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </motion.div>
            </motion.button>
          </nav>
        </div>
      </header>

      {/* Add padding top to account for fixed navbar */}
      <div className="h-16 md:h-20"></div>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">QuantumSafe Remit</h3>
              <p className="text-gray-400">
                Quantum-safe remittance solutions for the Bangladeshi diaspora
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="text-gray-400 space-y-2">
                <li><Link href="#" className="hover:text-white">Secure Authentication</Link></li>
                <li><Link href="#" className="hover:text-white">AI Analysis</Link></li>
                <li><Link href="#" className="hover:text-white">Quantum Encryption</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="text-gray-400 space-y-2">
                <li><Link href="#" className="hover:text-white">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 QuantumSafe Remit. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 
        MOBILE MENU & OVERLAY PORTAL
        Positioned at body level (outside header) to avoid stacking context issues.
        Uses position: fixed + inset: 0 to stay viewport-fixed and clickable after scroll.
        z-index: 9999 for menu, 9998 for overlay ensures they layer above all content.
      */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay - Fixed to viewport, high z-index */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
              onClick={closeMenu}
              role="presentation"
              aria-hidden="true"
              style={{
                WebkitBackdropFilter: 'blur(4px)',
                backdropFilter: 'blur(4px)',
              }}
            />
            
            {/* Mobile Menu Panel - Glassmorphism with fixed positioning */}
            <motion.div
              ref={menuRef}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 z-[9999] md:hidden overflow-y-auto"
              style={{
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.93) 50%, rgba(249, 250, 251, 0.90) 100%)',
                WebkitBackdropFilter: 'blur(12px)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="p-5 sm:p-6 space-y-6 pb-12">
                {/* Menu Header with Gradient Background */}
                <motion.div 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={closeMenu}
                  className="pb-5 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl p-4 border-2 border-indigo-100 relative overflow-hidden cursor-pointer hover:shadow-md transition-all"
                >
                  {/* Decorative gradient background */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-200 to-emerald-200 rounded-full opacity-20 -mr-12 -mt-12"></div>
                  
                  <div className="relative flex items-center gap-3">
                    <motion.div 
                      className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <FiShield className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">QuantumSafe</h3>
                      <p className="text-xs font-semibold text-indigo-600 tracking-wide">SECURE REMIT</p>
                    </div>
                  </div>
                </motion.div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  {[
                    { href: "/", label: "Home", desc: "Back to homepage", icon: FiHome, delay: 0.15 },
                    { href: "/#features", label: "Features", desc: "Our key features", icon: FiShield, delay: 0.2 },
                    { href: "/#why-quantumsafe", label: "Why Us", desc: "Learn about our solution", icon: FiShield, delay: 0.25 },
                    { href: "/#how-it-works", label: "How It Works", desc: "Simple 4-step process", icon: FiShield, delay: 0.3 },
                    { href: "/#faq", label: "FAQ", desc: "Common questions", icon: FiShield, delay: 0.35 },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: item.delay }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-emerald-50 hover:text-indigo-700 transition-all duration-300 group relative overflow-hidden"
                        >
                          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-emerald-100 group-hover:from-indigo-200 group-hover:to-emerald-200 transition-all duration-300 shadow-sm">
                            <Icon className="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{item.label}</div>
                            <div className="text-xs text-gray-500 group-hover:text-indigo-600 transition-colors">{item.desc}</div>
                          </div>
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ x: 3 }}
                          >
                            <FiChevronDown className="w-4 h-4 text-indigo-600 rotate-[270deg]" />
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Auth Section Divider */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4 }}
                  className="border-t-2 border-gradient-to-r from-indigo-100 via-emerald-100 to-indigo-100 origin-left"
                ></motion.div>

                {/* Authentication Section */}
                {!loading && (
                  user ? (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="space-y-3"
                    >
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Logged In</p>
                      <Link
                        href="/dashboard"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 hover:from-indigo-100 hover:to-blue-100 transition-all duration-300 group border-2 border-indigo-200"
                      >
                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-200 group-hover:bg-indigo-300 transition-colors shadow-md">
                          <FiUser className="w-5 h-5 text-indigo-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 truncate text-sm">{user.email}</div>
                          <div className="text-xs text-indigo-600">View dashboard</div>
                        </div>
                      </Link>

                      <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 text-red-700 hover:from-red-100 hover:to-pink-100 transition-all duration-300 group border-2 border-red-200 font-semibold"
                      >
                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-200 group-hover:bg-red-300 transition-colors shadow-md">
                          <FiLogOut className="w-5 h-5 text-red-700" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-gray-900">Logout</div>
                          <div className="text-xs text-red-600">Sign out of account</div>
                        </div>
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="space-y-3"
                    >
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Get Started</p>
                      <Link
                        href="/login"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 text-gray-700 hover:from-gray-100 hover:to-blue-100 transition-all duration-300 group border-2 border-gray-200 hover:border-indigo-300"
                      >
                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-200 group-hover:bg-indigo-200 transition-colors shadow-md">
                          <FiLogIn className="w-5 h-5 text-gray-700 group-hover:text-indigo-700" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 group-hover:text-indigo-700">Login</div>
                          <div className="text-xs text-gray-600 group-hover:text-indigo-600">Access your account</div>
                        </div>
                      </Link>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href="/signup"
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white hover:shadow-xl hover:shadow-indigo-300/50 transition-all duration-300 group border-2 border-indigo-400 font-semibold"
                        >
                          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors">
                            <FiUserPlus className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold">Sign Up</div>
                            <div className="text-xs text-indigo-100">Create new account</div>
                          </div>
                          <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                            <FiChevronDown className="w-5 h-5 rotate-[270deg]" />
                          </motion.div>
                        </Link>
                      </motion.div>
                    </motion.div>
                  )
                )}

                {/* Features Highlight with Better Design */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="pt-5 border-t-2 border-gray-200"
                >
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 px-2">Why QuantumSafe?</p>
                  <div className="space-y-3">
                    {[
                      { title: "Quantum-Safe", desc: "encryption", color: "emerald", Icon: MdLockOutline },
                      { title: "Zero", desc: "hidden fees", color: "indigo", Icon: FiZap },
                      { title: "AI-powered", desc: "insights", color: "emerald", Icon: RiRobot2Line },
                    ].map((feature, idx) => {
                      const FeatureIcon = feature.Icon;
                      return (
                        <motion.div 
                          key={idx}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.6 + idx * 0.05 }}
                          className={`flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-${feature.color}-50 to-blue-50 border-l-4 border-${feature.color}-500 hover:shadow-md transition-all`}
                        >
                          <motion.div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0 ${
                              feature.color === 'emerald'
                                ? 'bg-emerald-200'
                                : 'bg-indigo-200'
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            <FeatureIcon className={`w-4 h-4 ${
                              feature.color === 'emerald'
                                ? 'text-emerald-600'
                                : 'text-indigo-600'
                            }`} />
                          </motion.div>
                          <div className="text-sm text-gray-700">
                            <span className="font-bold text-gray-900">{feature.title}</span> {feature.desc}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Footer CTA */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.75 }}
                  className="pt-4 text-center border-t-2 border-gray-200"
                >
                  <p className="text-xs text-gray-500 italic">🔒 Secured with quantum-resistant encryption</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
