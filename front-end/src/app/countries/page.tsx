"use client";

import { Navbar } from "@/components/navbar";
import { Globe, ArrowRight, Coins } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

export default function CountriesPage() {
    const { t, isRTL, locale } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");

    const countries = [
        { name: (t.countries.names as any)["egypt"] || "مصر", slug: "egypt", flag: "🇪🇬", currency: "EGP" },
        { name: (t.countries.names as any)["saudi-arabia"] || "السعودية", slug: "saudi-arabia", flag: "🇸🇦", currency: "SAR" },
        { name: (t.countries.names as any)["united-arab-emirates"] || "الإمارات", slug: "united-arab-emirates", flag: "🇦🇪", currency: "AED" },
        { name: (t.countries.names as any)["kuwait"] || "الكويت", slug: "kuwait", flag: "🇰🇼", currency: "KWD" },
        { name: (t.countries.names as any)["qatar"] || "قطر", slug: "qatar", flag: "🇶🇦", currency: "QAR" },
        { name: (t.countries.names as any)["bahrain"] || "البحرين", slug: "bahrain", flag: "🇧🇭", currency: "BHD" },
        { name: (t.countries.names as any)["oman"] || "عمان", slug: "oman", flag: "🇴🇲", currency: "OMR" },
        { name: (t.countries.names as any)["jordan"] || "الأردن", slug: "jordan", flag: "🇯🇴", currency: "JOD" },
        { name: (t.countries.names as any)["lebanon"] || "لبنان", slug: "lebanon", flag: "🇱🇧", currency: "LBP" },
        { name: (t.countries.names as any)["iraq"] || "العراق", slug: "iraq", flag: "🇮🇶", currency: "IQD" },
        { name: (t.countries.names as any)["yemen"] || "اليمن", slug: "yemen", flag: "🇾🇪", currency: "YER" },
        { name: (t.countries.names as any)["palestine"] || "فلسطين", slug: "palestine", flag: "🇵🇸", currency: "ILS" },
        { name: (t.countries.names as any)["algeria"] || "الجزائر", slug: "algeria", flag: "🇩🇿", currency: "DZD" },
        { name: (t.countries.names as any)["morocco"] || "المغرب", slug: "morocco", flag: "🇲🇦", currency: "MAD" },
    ];

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                <header className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-6"
                    >
                        <Globe className="h-5 w-5" />
                        <span className="text-sm font-black uppercase tracking-widest">{t.countries_page.badge}</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
                        {t.countries_page.title1} <span className="text-gradient-gold">{t.countries_page.title2}.</span>
                    </h1>
                    <p className="text-slate-500 font-bold max-w-2xl mx-auto">
                        {t.countries_page.subtitle}
                    </p>
                </header>

                {/* Search Bar */}
                <div className="mb-10 max-w-md mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t.countries_page.search_placeholder}
                            className={cn(
                                "w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-white/5 rounded-2xl p-4 font-bold text-slate-900 dark:text-white focus:border-gold-500 outline-none transition-colors",
                                isRTL ? "pr-12" : "pl-12"
                            )}
                        />
                        <Globe className={cn("absolute top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400", isRTL ? "right-4" : "left-4")} />
                    </div>
                </div>

                {/* Countries Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCountries.map((country, index) => (
                        <motion.div
                            key={country.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href={`/countries/${country.slug}`}>
                                <div className="glass-card p-6 min-h-[160px] flex flex-col justify-between hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{country.flag}</span>
                                            <div>
                                                <h3 className="font-black text-xl">{country.name}</h3>
                                                <p className="text-xs text-slate-500 font-bold">{country.currency}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className={cn("h-5 w-5 text-gold-500 transition-transform", isRTL ? "group-hover:translate-x-1" : "group-hover:translate-x-1 rotate-0", !isRTL && "rotate-0")} />
                                    </div>

                                    <div className="flex items-center gap-2 text-sm mt-auto">
                                        <Coins className="h-4 w-4 text-gold-500" />
                                        <span className="text-slate-600 dark:text-slate-400 font-bold">
                                            {t.countries_page.view_live}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {filteredCountries.length === 0 && (
                    <div className="text-center py-20">
                        <Globe className="h-20 w-20 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold">{t.countries_page.no_results}</p>
                    </div>
                )}
            </main>
        </div>
    );
}
