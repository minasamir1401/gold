"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Coins, Calculator, CircleDollarSign, RefreshCcw, Menu, X, Bell, Globe, Banknote } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { PriceTicker } from "./price-ticker";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { locale, setLocale, t, isRTL } = useLanguage();

    const navigation = [
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', href: "/", icon: LayoutDashboard },
        { name: t.nav.gold, href: "/gold", icon: Coins },
        { name: t.nav.calc, href: "/calculator", icon: Calculator },
        { name: t.nav.countries, href: "/countries", icon: Globe },
        { name: t.nav.currencies, href: "/currencies", icon: Banknote },
        { name: t.nav.contact, href: "/contact", icon: Bell },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center no-print">
            <PriceTicker />
            <div className="w-full flex justify-center p-2 sm:p-4">
                <nav
                    className={cn(
                        "w-full max-w-7xl transition-all duration-500 rounded-2xl sm:rounded-3xl border border-white/20 dark:border-white/5",
                        scrolled
                            ? "bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-2xl py-2 px-2 sm:px-6"
                            : "bg-transparent py-2.5 sm:py-4 px-2 sm:px-6"
                    )}
                >
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-4 lg:gap-12">
                            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                                <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center flex-shrink-0">
                                    <div className="absolute inset-0 bg-gold-500 rounded-lg sm:rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300 opacity-20" />
                                    <div className="relative h-7 w-7 sm:h-9 sm:w-9 bg-gold-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
                                        <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                </div>
                                <span className="text-base sm:text-2xl font-black tracking-tighter text-foreground whitespace-nowrap">
                                    <span className="xs:hidden font-black uppercase tracking-tighter">GS</span>
                                    <span className="hidden xs:inline">Gold<span className="text-gold-600 dark:text-gold-500">Service</span></span>
                                </span>
                            </Link>

                            <div className="hidden lg:block">
                                <div className="flex items-center gap-2">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 overflow-hidden",
                                                    isActive
                                                        ? "text-primary-600 dark:text-primary-400 bg-primary-500/10"
                                                        : "text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-950"
                                                )}
                                            >
                                                <item.icon className={cn("h-4 w-4 transition-transform duration-300", isActive && "scale-110")} />
                                                {item.name}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="nav-active"
                                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full mb-1"
                                                    />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-3">
                            <button
                                onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
                                className="flex h-8 sm:h-10 px-2 sm:px-3 items-center justify-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors border border-transparent dark:border-white/5 font-black text-[10px] sm:text-xs"
                            >
                                <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden xs:inline-block">{locale === 'ar' ? 'EN' : 'عربي'}</span>
                                <span className="xs:hidden">{locale === 'ar' ? 'EN' : 'AR'}</span>
                            </button>
                            <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors border border-transparent dark:border-white/5">
                                <Bell className="h-5 w-5" />
                            </div>
                            <ThemeToggle />
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="lg:hidden flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-950 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-900 transition-colors border border-transparent dark:border-white/5"
                            >
                                {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden p-4"
                            >
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-6 rounded-2xl text-[10px] sm:text-sm font-bold transition-all",
                                                    isActive
                                                        ? "bg-primary/10 text-primary border border-primary/20"
                                                        : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                                <span className="text-center line-clamp-1">{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </nav>
            </div>
        </div>
    );
}
