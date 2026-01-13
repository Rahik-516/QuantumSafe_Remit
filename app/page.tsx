'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, cubicBezier } from 'framer-motion';
import { FiDollarSign, FiAlertTriangle, FiLock, FiCpu, FiGlobe, FiSend, FiEdit, FiMessageCircle, FiStar, FiShield, FiCheckCircle, FiZap, FiClock, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  
  // Parallax transforms for background elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: cubicBezier(0.4, 0, 0.2, 1),
      },
    },
  };

  const headlineVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: cubicBezier(0.4, 0, 0.2, 1),
      },
    },
  };

  const gradientTextVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: cubicBezier(0.4, 0, 0.2, 1),
        delay: 0.3,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: cubicBezier(0.4, 0, 0.2, 1),
      },
    },
    hover: {
      y: -3,
      transition: {
        duration: 0.2,
        ease: cubicBezier(0.4, 0, 0.2, 1),
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const trustIndicatorVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: cubicBezier(0.4, 0, 0.2, 1),
        delay: 0.9,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-emerald-50">
      {/* Animated Background Elements */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(3deg); }
          66% { transform: translateY(-10px) rotate(-3deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-25px) rotate(-3deg) scale(1.05); }
          66% { transform: translateY(-15px) rotate(3deg) scale(0.95); }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.3),
                        0 0 40px rgba(99, 102, 241, 0.2),
                        0 0 60px rgba(99, 102, 241, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.4),
                        0 0 60px rgba(99, 102, 241, 0.3),
                        0 0 90px rgba(99, 102, 241, 0.2);
          }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
          70% { box-shadow: 0 0 0 40px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up-slow {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes text-glow {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(99, 102, 241, 0.3),
                         0 0 20px rgba(16, 185, 129, 0.2);
          }
          50% { 
            text-shadow: 0 0 20px rgba(99, 102, 241, 0.4),
                         0 0 30px rgba(16, 185, 129, 0.3);
          }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s infinite; }
        .animate-slide-in-left { animation: slide-in-left 1s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-slide-in-right { animation: slide-in-right 1s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-fade-in-up-slow { animation: fade-in-up-slow 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }
        .animate-slide-in-up { animation: slide-in-up 0.7s ease-out; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .animate-text-glow { animation: text-glow 4s ease-in-out infinite; }
        .hero-gradient-text {
          background: linear-gradient(135deg, #4F46E5 0%, #10B981 50%, #4F46E5 100%);
          background-size: 200% 200%;
          animation: gradient-shift 6s ease infinite;
        }
        .feature-card { transition: all 0.3s ease; }
        .feature-card:hover { transform: translateY(-8px); }
        .trust-badge { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .trust-badge:hover { transform: translateY(-4px); }
        .comparison-row { transition: all 0.3s ease; }
        .comparison-row:hover { background-color: rgba(249, 250, 251, 0.8); }
        .faq-item { transition: all 0.3s ease; }
        .faq-answer { 
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                      opacity 0.3s ease, 
                      padding 0.3s ease;
          overflow: hidden;
        }
        .faq-answer.open { max-height: 1000px; opacity: 1; }
        .faq-answer.closed { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; }
        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .btn-primary:hover::before {
          width: 300px;
          height: 300px;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3),
                      0 10px 20px rgba(16, 185, 129, 0.2);
        }
        .btn-secondary {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .btn-secondary:hover {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.15);
        }
      `}</style>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Enhanced Ambient Background Effects with Parallax */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Primary floating gradient blob with parallax */}
          <motion.div 
            style={{ y: shouldReduceMotion ? 0 : y1 }}
            className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-indigo-300 to-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
          />
          
          {/* Secondary floating gradient blob with parallax */}
          <motion.div 
            style={{ y: shouldReduceMotion ? 0 : y2 }}
            className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-emerald-300 to-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"
          />
          
          {/* Tertiary accent blob with parallax */}
          <motion.div 
            style={{ y: shouldReduceMotion ? 0 : y3, animationDelay: '1s' }}
            className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          />
          
          {/* Subtle grid overlay for depth */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0e7ff_1px,transparent_1px),linear-gradient(to_bottom,#e0e7ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)] opacity-10"></div>
          
          {/* Glowing orbs for premium feel */}
          <motion.div 
            animate={shouldReduceMotion ? {} : {
              opacity: [0.15, 0.25, 0.15],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-20 w-32 h-32 bg-indigo-400 rounded-full filter blur-2xl opacity-20"
          />
          <motion.div 
            animate={shouldReduceMotion ? {} : {
              opacity: [0.15, 0.25, 0.15],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
            className="absolute bottom-1/3 right-32 w-40 h-40 bg-emerald-400 rounded-full filter blur-2xl opacity-20"
          />
        </div>

        {/* Hero Content with Framer Motion */}
        <motion.div 
          className="relative z-10 text-center space-y-8 max-w-5xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Headline with Text Reveal Animation */}
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight"
            variants={headlineVariants}
          >
            <motion.span 
              className="block mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              Secure Remittances for Your
            </motion.span>
            <motion.span 
              className="block mt-4 text-black"
              variants={gradientTextVariants}
            >
              Bangladeshi Family
            </motion.span>
          </motion.h1>
          
          {/* Subheading with Refined Typography */}
          <motion.div variants={itemVariants}>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
              Send money home with <span className="font-bold text-indigo-700">quantum-safe encryption</span> and <span className="font-bold text-emerald-700">AI-powered emotion recognition</span>. 
              <span className="block mt-2 text-gray-600 text-base md:text-lg">Your remittances now support meaningful impact through smart vault allocations.</span>
            </p>
          </motion.div>

          {/* CTA Buttons with Premium Interactions */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-5 justify-center pt-8 px-4"
            variants={itemVariants}
          >
            <motion.div
              variants={buttonVariants}
              whileHover={shouldReduceMotion ? {} : "hover"}
              whileTap={shouldReduceMotion ? {} : "tap"}
            >
              <Link
                href="/signup"
                className="btn-primary px-10 py-5 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-2xl flex items-center justify-center gap-3 group"
              >
                <motion.div
                  animate={shouldReduceMotion ? {} : {
                    rotate: [0, 12, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FiSend className="w-6 h-6" />
                </motion.div>
                <span>Get Started Free</span>
              </Link>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              whileHover={shouldReduceMotion ? {} : "hover"}
              whileTap={shouldReduceMotion ? {} : "tap"}
            >
              <Link
                href="/login"
                className="btn-secondary px-10 py-5 border-2 border-indigo-600 text-indigo-700 rounded-xl font-bold text-lg hover:border-indigo-700 flex items-center justify-center gap-2"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>

          {/* Subtle Trust Indicators */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-gray-500"
            variants={trustIndicatorVariants}
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <FiShield className="w-4 h-4 text-indigo-600" />
              <span>Bank-Grade Security</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <FiLock className="w-4 h-4 text-emerald-600" />
              <span>Quantum-Resistant</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <FiCheckCircle className="w-4 h-4 text-indigo-600" />
              <span>Zero Hidden Fees</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative">
          {/* Subtle background accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-white to-emerald-50/50 rounded-3xl blur-3xl"></div>
          
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {/* Badge 1: Quantum-Safe */}
              <div className="trust-badge group animate-scale-in text-center" style={{ animationDelay: '0.1s' }}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 mb-4 group-hover:from-indigo-200 group-hover:to-indigo-100 transition-all duration-300">
                  <FiShield className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
                  ML‑KEM‑768
                </div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Quantum-Safe</p>
              </div>

              {/* Badge 2: 100% Secure */}
              <div className="trust-badge group animate-scale-in text-center" style={{ animationDelay: '0.2s' }}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 mb-4 group-hover:from-emerald-200 group-hover:to-emerald-100 transition-all duration-300">
                  <FiCheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
                  100%
                </div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Secure</p>
              </div>

              {/* Badge 3: AI-Powered */}
              <div className="trust-badge group animate-scale-in text-center" style={{ animationDelay: '0.3s' }}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 mb-4 group-hover:from-indigo-200 group-hover:to-indigo-100 transition-all duration-300">
                  <FiZap className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
                  AI‑Powered
                </div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Smart Allocation</p>
              </div>

              {/* Badge 4: 24/7 Available */}
              <div className="trust-badge group animate-scale-in text-center" style={{ animationDelay: '0.4s' }}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 mb-4 group-hover:from-emerald-200 group-hover:to-emerald-100 transition-all duration-300">
                  <FiClock className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
                  24/7
                </div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Available</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Why Choose QuantumSafe - Problem/Solution/Impact Framework */}
      <section id="why-quantumsafe" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* ====================== PART 1: THE PROBLEM ====================== */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-3 animate-fade-in-up tracking-tight">
            Remittances Are Powerful — But Broken
          </h2>
          <p className="text-center text-gray-700 font-semibold mb-6 max-w-3xl mx-auto animate-fade-in-up text-base" style={{ animationDelay: '0.1s' }}>
            <span className="text-blue-600">$32.81 billion</span> sent home to Bangladesh in 2025 (22% growth, 6-7% of GDP)
          </p>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto animate-fade-in-up text-sm" style={{ animationDelay: '0.15s' }}>
            Yet families lose billions to fees, fraud, and outdated security. And <span className="font-semibold text-gray-700">86% is spent on consumption</span> when it could drive lasting impact.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Problem 1: High Fees */}
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up border border-gray-100 hover:border-teal-200 overflow-hidden hover:scale-105"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="p-8 md:p-10 flex flex-col h-full">
                {/* Icon */}
                <div className="text-6xl mb-6 text-center text-teal-600">
                  <FiDollarSign className="w-16 h-16 mx-auto" />
                </div>

                {/* Main Stat - Prominent with Gradient */}
                <div className="text-center mb-2 pb-4 border-b-2 border-teal-100">
                  <div className="text-6xl md:text-7xl font-extrabold mb-1 leading-tight bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text">
                    $1.48<span className="text-5xl">B</span>
                  </div>
                </div>

                {/* Secondary Headline */}
                <div className="text-center mb-5">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                    Lost Annually
                  </h3>
                </div>

                {/* Details */}
                <div className="space-y-4 flex-grow">
                  <p className="text-gray-700 font-semibold text-base leading-relaxed">
                    5–10% fee rate on every remittance
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">
                    Bangladesh families hemorrhage billions through hidden charges and transfer costs that could otherwise strengthen households and communities. These fees represent genuine economic loss across the diaspora.
                  </p>
                </div>

                {/* CTA Benefit */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-sm text-teal-700 font-semibold italic text-justify">
                    ✓ QuantumSafe: Zero hidden fees. 100% of your remittance arrives.
                  </p>
                </div>
              </div>
            </div>

            {/* Problem 2: Fraud & Scams */}
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up border border-gray-100 hover:border-teal-200 overflow-hidden hover:scale-105"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="p-8 md:p-10 flex flex-col h-full">
                {/* Icon */}
                <div className="text-6xl mb-6 text-center text-teal-600">
                  <FiAlertTriangle className="w-16 h-16 mx-auto" />
                </div>

                {/* Main Stat - Prominent with Gradient */}
                <div className="text-center mb-2 pb-4 border-b-2 border-teal-100">
                  <div className="text-6xl md:text-7xl font-extrabold mb-1 leading-tight bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text">
                    $250<span className="text-5xl">M</span>
                  </div>
                </div>

                {/* Secondary Headline */}
                <div className="text-center mb-5">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                    Yearly Fraud Losses
                  </h3>
                </div>

                {/* Details */}
                <div className="space-y-4 flex-grow">
                  <p className="text-gray-700 font-semibold text-base leading-relaxed">
                    Migration fraud & unauthorized access
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">
                    Traditional remittance systems lack modern security infrastructure, leaving diaspora communities vulnerable to scams, phishing attacks, and fraudulent transfers. Vulnerable families lose life savings.
                  </p>
                </div>

                {/* CTA Benefit */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-sm text-teal-700 font-semibold italic text-justify">
                    ✓ QuantumSafe: Bank-grade security with ML-KEM-768 encryption.
                  </p>
                </div>
              </div>
            </div>

            {/* Problem 3: Quantum Threats */}
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up border border-gray-100 hover:border-teal-200 overflow-hidden hover:scale-105"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="p-8 md:p-10 flex flex-col h-full">
                {/* Icon */}
                <div className="text-6xl mb-6 text-center text-teal-600">
                  <FiLock className="w-16 h-16 mx-auto" />
                </div>

                {/* Main Stat - Prominent with Gradient */}
                <div className="text-center mb-2 pb-4 border-b-2 border-teal-100">
                  <div className="text-6xl md:text-7xl font-extrabold mb-1 leading-tight bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text">
                    2030
                  </div>
                </div>

                {/* Secondary Headline */}
                <div className="text-center mb-5">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                    Encryption at Risk
                  </h3>
                </div>

                {/* Details */}
                <div className="space-y-4 flex-grow">
                  <p className="text-gray-700 font-semibold text-base leading-relaxed">
                    Quantum computers will break current encryption
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">
                    Financial data transmitted today through legacy systems may be harvested and stored by sophisticated actors. When quantum computing matures, this data can be decrypted retroactively—a real and growing threat.
                  </p>
                </div>

                {/* CTA Benefit */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-sm text-teal-700 font-semibold italic text-justify">
                    ✓ QuantumSafe: Future-proof cryptography protecting you today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================== PART 2: THE SOLUTION ====================== */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4 animate-fade-in-up">
            QuantumSafe Remit Fixes This
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up text-lg" style={{ animationDelay: '0.1s' }}>
            A new approach to remittances: secure, transparent, and built for impact.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Solution 1: Quantum-Safe Encryption */}
            <div
              className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="text-5xl mb-4"><FiLock className="w-12 h-12 mx-auto text-emerald-600" /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quantum-Safe Encryption</h3>
              <p className="text-gray-700 leading-relaxed">
                Uses <strong>ML-KEM-768 post-quantum cryptography</strong> to protect transactions even from future quantum attacks.
              </p>
              <div className="mt-4 text-sm text-emerald-700 font-semibold">✓ Future-proof security</div>
            </div>

            {/* Solution 2: AI-Powered Smart Remittance */}
            <div
              className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="text-5xl mb-4"><FiCpu className="w-12 h-12 mx-auto text-emerald-600" /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Smart Remittance</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>AI understands your intent</strong> and helps allocate funds wisely between personal support and community impact.
              </p>
              <div className="mt-4 text-sm text-emerald-700 font-semibold">✓ Smarter allocation decisions</div>
            </div>

            {/* Solution 3: Transparent Impact Vaults */}
            <div
              className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="text-5xl mb-4"><FiGlobe className="w-12 h-12 mx-auto text-emerald-600" /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Impact Vaults</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Track how your money</strong> supports education, healthcare, renewable energy, and community projects in real-time.
              </p>
              <div className="mt-4 text-sm text-emerald-700 font-semibold">✓ Verified impact tracking</div>
            </div>
          </div>
        </div>

        {/* ====================== PART 3: THE IMPACT ====================== */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-2 animate-fade-in-up">
            The Real-World Impact
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up text-lg" style={{ animationDelay: '0.1s' }}>
            Why QuantumSafe matters for Bangladesh and the diaspora.
          </p>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stat 1 */}
            <div
              className="bg-white border-2 border-indigo-300 p-6 md:p-8 rounded-xl shadow-md text-center animate-fade-in-up hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="text-4xl font-bold text-indigo-600 mb-2">$32.81B</div>
              <p className="text-sm text-gray-600 font-medium">Remittances sent to Bangladesh in 2025</p>
              <div className="mt-3 text-xs text-gray-500">Supporting millions of families nationwide</div>
            </div>

            {/* Stat 2 */}
            <div
              className="bg-white border-2 border-emerald-300 p-6 md:p-8 rounded-xl shadow-md text-center animate-fade-in-up hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="text-4xl font-bold text-emerald-600 mb-2">20–30%</div>
              <p className="text-sm text-gray-600 font-medium">Projected diaspora adoption in 3 years</p>
              <div className="mt-3 text-xs text-gray-500">Early adopters securing families first</div>
            </div>

            {/* Stat 3 */}
            <div
              className="bg-white border-2 border-blue-300 p-6 md:p-8 rounded-xl shadow-md text-center animate-fade-in-up hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">$296–444M</div>
              <p className="text-sm text-gray-600 font-medium">Potential annual savings from reduced fees & fraud</p>
              <div className="mt-3 text-xs text-gray-500">More money staying with families</div>
            </div>

            {/* Stat 4 */}
            <div
              className="bg-white border-2 border-purple-300 p-6 md:p-8 rounded-xl shadow-md text-center animate-fade-in-up hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">1–2%</div>
              <p className="text-sm text-gray-600 font-medium">Potential GDP growth boost</p>
              <div className="mt-3 text-xs text-gray-500">Long-term economic impact through impact vaults</div>
            </div>
          </div>

          {/* Closing Statement */}
          <div
            className="bg-gradient-to-r from-indigo-600 to-emerald-600 text-white p-8 md:p-10 rounded-xl text-center shadow-lg animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            <p className="text-lg md:text-xl font-semibold leading-relaxed">
              Your remittance can secure families today — and build Bangladesh tomorrow.
            </p>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <Link
              href="/signup"
              className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-2xl hover:scale-105 transition transform duration-300 flex items-center justify-center gap-2"
            >
              <FiSend className="w-5 h-5" /> Start Your Secure Remittance
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Section: Traditional vs QuantumSafe */}
      <section id="comparison" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in-up">
            Traditional Remittance vs QuantumSafe Remit
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            See how QuantumSafe Remit delivers superior security, transparency, and value.
          </p>
        </div>

        {/* Desktop: Side-by-Side Comparison Cards */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Traditional Remittance Column */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden h-full">
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-5 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-700 text-center">Traditional Remittance</h3>
              </div>
              <div className="p-8 space-y-6">
                
                {/* Row 1: Encryption */}
                <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <FiX className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Encryption</div>
                    <div className="text-lg font-semibold text-gray-700">RSA / ECC encryption</div>
                    <div className="text-sm text-gray-500 mt-1">Vulnerable to quantum attacks</div>
                  </div>
                </div>

                {/* Row 2: Fees */}
                <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <FiX className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Fees</div>
                    <div className="text-lg font-semibold text-gray-700">5–10% hidden fees</div>
                    <div className="text-sm text-gray-500 mt-1">Money lost to intermediaries</div>
                  </div>
                </div>

                {/* Row 3: Impact Tracking */}
                <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <FiX className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Impact Tracking</div>
                    <div className="text-lg font-semibold text-gray-700">No impact tracking</div>
                    <div className="text-sm text-gray-500 mt-1">No visibility on fund usage</div>
                  </div>
                </div>

                {/* Row 4: Fraud Protection */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <FiX className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Fraud Protection</div>
                    <div className="text-lg font-semibold text-gray-700">High fraud risk</div>
                    <div className="text-sm text-gray-500 mt-1">Limited fraud detection</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* QuantumSafe Remit Column */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-xl overflow-hidden h-full relative">
              {/* Premium Badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Recommended
              </div>
              
              <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 px-6 py-5 border-b border-emerald-300">
                <h3 className="text-2xl font-bold text-white text-center">QuantumSafe Remit</h3>
              </div>
              <div className="p-8 space-y-6 bg-gradient-to-b from-emerald-50/30 to-white">
                
                {/* Row 1: Encryption */}
                <div className="flex items-start gap-4 pb-6 border-b border-emerald-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FiCheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Encryption</div>
                    <div className="text-lg font-bold text-gray-900">Post‑quantum encryption</div>
                    <div className="text-sm text-emerald-700 mt-1 font-medium">ML‑KEM‑768 quantum-safe</div>
                  </div>
                </div>

                {/* Row 2: Fees */}
                <div className="flex items-start gap-4 pb-6 border-b border-emerald-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FiCheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Fees</div>
                    <div className="text-lg font-bold text-gray-900">0 hidden fees</div>
                    <div className="text-sm text-emerald-700 mt-1 font-medium">100% transparency</div>
                  </div>
                </div>

                {/* Row 3: Impact Tracking */}
                <div className="flex items-start gap-4 pb-6 border-b border-emerald-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FiCheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Impact Tracking</div>
                    <div className="text-lg font-bold text-gray-900">Live impact dashboard</div>
                    <div className="text-sm text-emerald-700 mt-1 font-medium">Real-time vault tracking</div>
                  </div>
                </div>

                {/* Row 4: Fraud Protection */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FiCheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Fraud Protection</div>
                    <div className="text-lg font-bold text-gray-900">AI fraud warnings</div>
                    <div className="text-sm text-emerald-700 mt-1 font-medium">Proactive risk detection</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Mobile: Stacked Comparison Table */}
        <div className="lg:hidden space-y-4 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          
          {/* Row 1: Encryption */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden comparison-row">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">Encryption Method</div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <FiX className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-700">Traditional:</div>
                  <div className="text-sm text-gray-600">RSA / ECC encryption</div>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">QuantumSafe:</div>
                  <div className="text-sm text-emerald-700 font-medium">Post‑quantum encryption (ML‑KEM‑768)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Fees */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden comparison-row">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">Fees</div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <FiX className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-700">Traditional:</div>
                  <div className="text-sm text-gray-600">5–10% hidden fees</div>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">QuantumSafe:</div>
                  <div className="text-sm text-emerald-700 font-medium">0 hidden fees</div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Impact Tracking */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden comparison-row">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">Impact Tracking</div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <FiX className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-700">Traditional:</div>
                  <div className="text-sm text-gray-600">No impact tracking</div>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">QuantumSafe:</div>
                  <div className="text-sm text-emerald-700 font-medium">Live impact dashboard</div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Fraud Protection */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden comparison-row">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">Fraud Protection</div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <FiX className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-700">Traditional:</div>
                  <div className="text-sm text-gray-600">High fraud risk</div>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">QuantumSafe:</div>
                  <div className="text-sm text-emerald-700 font-medium">AI fraud warnings</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <p className="text-gray-600 mb-6">Make the switch to quantum-safe remittances today.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-2xl hover:scale-105 transition transform duration-300"
          >
            <FiShield className="w-5 h-5" /> Get Started with QuantumSafe
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gradient-to-r from-indigo-600 to-emerald-600 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
            How It Works
          </h2>
          <p className="text-center text-indigo-100 mb-16 max-w-2xl mx-auto">
            4 simple steps to secure remittances with impact
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Sign Up', desc: 'Create your secure account', icon: 'edit2' },
              { num: '2', title: 'Share Your Values', desc: 'Tell us about your family', icon: 'message' },
              { num: '3', title: 'AI Analysis', desc: 'Get smart recommendations', icon: 'brain' },
              { num: '4', title: 'Send Securely', desc: 'Quantum-safe remittance', icon: 'rocket' },
            ].map((step, idx) => (
              <div
                key={idx}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600 mb-4 shadow-lg hover:scale-110 transition transform duration-300">
                  {step.icon === 'edit2' && <FiEdit className="w-8 h-8" />}
                  {step.icon === 'message' && <FiMessageCircle className="w-8 h-8" />}
                  {step.icon === 'brain' && <FiCpu className="w-8 h-8" />}
                  {step.icon === 'rocket' && <FiSend className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-indigo-100">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 animate-fade-in-up">
          Ready to Transform Your Remittances?
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Join thousands of Bangladeshi families sending money home securely and meaningfully.
        </p>
        <Link
          href="/signup"
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-2xl hover:scale-105 transition transform duration-300 inline-block animate-fade-in-up flex items-center justify-center gap-2"
          style={{ animationDelay: '0.4s' }}
        >
          <FiStar className="w-5 h-5" /> Start Your Journey
        </Link>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in-up">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Everything you need to know about QuantumSafe Remit
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              question: 'What is QuantumSafe Remit?',
              answer: 'QuantumSafe Remit is a next‑generation remittance platform designed for the global Bangladeshi diaspora. It combines quantum‑resistant encryption, AI‑powered insights, and transparent impact tracking to make remittances more secure, affordable, and meaningful.'
            },
            {
              question: 'How is QuantumSafe Remit different from traditional remittance services?',
              answer: 'Unlike traditional remittance platforms, QuantumSafe Remit eliminates hidden fees, protects transactions with post‑quantum encryption, detects fraud risks in real time, and allows users to track the real‑world impact of their transfers.'
            },
            {
              question: 'What is post‑quantum encryption and why does it matter?',
              answer: 'Post‑quantum encryption is designed to stay secure even against future quantum computers. QuantumSafe Remit uses ML‑KEM‑768‑based cryptography to protect sensitive financial data from "harvest now, decrypt later" attacks.'
            },
            {
              question: 'Are there any hidden fees when sending money?',
              answer: 'No. QuantumSafe Remit is built with a zero‑hidden‑fee model so users always know exactly how much money reaches their family.'
            },
            {
              question: 'How does the AI help users?',
              answer: 'The AI analyzes transaction intent and usage patterns to provide non‑intrusive recommendations, fraud warnings, and optional allocation into impact categories like education, healthcare, or sustainability.'
            },
            {
              question: 'What are Impact Vaults?',
              answer: 'Impact Vaults allow users to optionally allocate a portion of their remittance toward long‑term initiatives such as education, healthcare, and sustainable infrastructure, while still fully supporting their families.'
            },
            {
              question: 'Can I track how my remittance makes an impact?',
              answer: 'Yes. QuantumSafe Remit provides a live impact dashboard showing where funds were allocated, what projects were supported, and their estimated social outcomes.'
            },
            {
              question: 'Is QuantumSafe Remit safe to use?',
              answer: 'Yes. The platform uses bank‑grade security, quantum‑resistant encryption, AI‑based fraud detection, and transparent monitoring to ensure a high level of safety and trust.'
            }
          ].map((faq, index) => (
            <div
              key={index}
              className="faq-item bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
                aria-expanded={openFaqIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openFaqIndex === index ? (
                    <FiChevronUp className="w-6 h-6 text-indigo-600 transition-transform duration-300" />
                  ) : (
                    <FiChevronDown className="w-6 h-6 text-gray-400 transition-transform duration-300" />
                  )}
                </div>
              </button>
              
              <div
                id={`faq-answer-${index}`}
                className={`faq-answer ${openFaqIndex === index ? 'open' : 'closed'}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                {openFaqIndex === index && (
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Bottom CTA */}
        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <p className="text-gray-600 mb-6">Still have questions? We're here to help.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition transform duration-300"
          >
            <FiSend className="w-5 h-5" /> Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
