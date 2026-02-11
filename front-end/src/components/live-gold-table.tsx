"use client";

import { motion } from "framer-motion";
import { Coins, TrendingUp, Clock, ArrowRightLeft, Zap, Landmark, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { getGoldPrices, getIsaghaPrices, getGoldPriceToday, getSarfGold, getGoldLivePrices } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

export function LiveGoldTable() {
    const [gePrices, setGePrices] = useState<any>(null);
    const [isaghaPrices, setIsaghaPrices] = useState<any>(null);
    const [gptPrices, setGptPrices] = useState<any>(null);
    const [sarfGoldPrices, setSarfGoldPrices] = useState<any>(null);
    const [glPrices, setGlPrices] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState<"gold_era" | "isagha" | "gold_price_today" | "sarf_today" | "gold_live">("gold_live");
    const { t, locale, isRTL } = useLanguage();

    useEffect(() => {
        const fetchPrices = async () => {
            const geData = await getGoldPrices();
            const isData = await getIsaghaPrices();
            const gptData = await getGoldPriceToday();
            const sarfData = await getSarfGold();
            const glData = await getGoldLivePrices();
            if (geData) setGePrices(geData);
            if (isData) setIsaghaPrices(isData);
            if (gptData) setGptPrices(gptData);
            if (sarfData) setSarfGoldPrices(sarfData);
            if (glData) setGlPrices(glData);
            setLoading(false);
        };
        fetchPrices();
        const interval = setInterval(fetchPrices, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="glass-card p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="h-10 w-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
            <span className="font-black text-sm uppercase tracking-widest">{t.table.loading}</span>
        </div>
    );

    const currentData = source === "gold_era"
        ? gePrices
        : source === "isagha"
            ? isaghaPrices?.gold
            : source === "sarf_today"
                ? sarfGoldPrices
                : source === "gold_live"
                    ? glPrices
                    : gptPrices?.current_prices;

    if (!currentData) return null;

    const items: [string, any][] = source === "gold_era" || source === "sarf_today"
        ? Object.entries(currentData).filter(([key]) => key.includes("عيار"))
        : source === "isagha"
            ? Object.entries(currentData).map(([k, v]: [string, any]) => [`عيار ${k}`, v])
            : source === "gold_live"
                ? currentData.map((item: any) => [item.name, { buy: item.buy, sell: item.sell }])
                : Object.entries(currentData).filter(([key]) => key.includes("عيار"));

    const formatCaratName = (name: string) => {
        if (locale === 'ar') return name;
        return name.replace('عيار ', 'Carat ');
    };

    return (
        <div className="glass-card overflow-hidden border-gold-500/20 shadow-2xl shadow-gold-500/5 transition-all duration-500">
            <div className="premium-header flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-gold-500/20">
                        <ArrowRightLeft className="h-4 w-4 sm:h-5 sm:w-5 text-slate-900" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-black text-gradient-gold">{t.table.title}</h3>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">{t.table.subtitle}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-white/5 gap-1">
                    <button
                        onClick={() => setSource("gold_live")}
                        className={cn(
                            "flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all outline-none",
                            source === "gold_live"
                                ? "bg-white dark:bg-slate-800 text-gold-600 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Gold Live
                    </button>
                    <button
                        onClick={() => setSource("gold_era")}
                        className={cn(
                            "flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all outline-none",
                            source === "gold_era"
                                ? "bg-white dark:bg-slate-800 text-gold-600 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Gold Ser
                    </button>
                    <button
                        onClick={() => setSource("gold_price_today")}
                        className={cn(
                            "flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all outline-none",
                            source === "gold_price_today"
                                ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <BarChart3 className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> GPT
                    </button>
                    <button
                        onClick={() => setSource("isagha")}
                        className={cn(
                            "flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all outline-none",
                            source === "isagha"
                                ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <Landmark className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> iSaga
                    </button>
                    <button
                        onClick={() => setSource("sarf_today")}
                        className={cn(
                            "flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all outline-none",
                            source === "sarf_today"
                                ? "bg-white dark:bg-slate-800 text-purple-600 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <Landmark className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Sarf
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className={cn("w-full border-collapse", isRTL ? "text-right" : "text-left")}>
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-900/30 whitespace-nowrap">
                            <th className="px-3 sm:px-6 py-4 text-[9px] sm:text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{t.table.carat}</th>
                            <th className="px-3 sm:px-6 py-4 text-[9px] sm:text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{t.table.buy}</th>
                            <th className="px-3 sm:px-6 py-4 text-[9px] sm:text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{t.table.sell}</th>
                            <th className="px-3 sm:px-6 py-4 text-[9px] sm:text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{t.table.trend}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {items.map(([name, val]: [string, any], i) => (
                            <motion.tr
                                key={`${source}-${name}`}
                                initial={{ opacity: 0, x: isRTL ? -10 : 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-gold-500/5 transition-colors"
                            >
                                <td className="px-3 sm:px-6 py-5">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                                            <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-gold-600" />
                                        </div>
                                        <span className="font-black text-foreground text-xs sm:text-base whitespace-nowrap">{formatCaratName(name)}</span>
                                    </div>
                                </td>
                                <td className="px-3 sm:px-6 py-5">
                                    <span className="text-sm sm:text-lg font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                        {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(val.buy) || 0)} <span className="text-[10px] sm:text-xs">{t.price_cards.unit}</span>
                                    </span>
                                </td>
                                <td className="px-3 sm:px-6 py-5">
                                    <span className="text-sm sm:text-lg font-black text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                        {new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(Number(val.sell) || 0)} <span className="text-[10px] sm:text-xs">{t.price_cards.unit}</span>
                                    </span>
                                </td>
                                <td className="px-3 sm:px-6 py-5">
                                    <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px] sm:text-sm">
                                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span>+0.2%</span>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="premium-footer flex flex-col sm:flex-row items-center justify-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{t.table.last_update}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span>{t.table.source}: {source === "gold_era" ? "Gold Service" : source === "gold_price_today" ? "Gold Price Today" : source === "sarf_today" ? "Sarf" : source === "gold_live" ? "Gold Price Live" : "iSaga Market"}</span>
            </div>
        </div>
    );
}
