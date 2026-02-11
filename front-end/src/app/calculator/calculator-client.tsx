"use client";

import { Navbar } from "@/components/navbar";
import { Calculator, Coins, Landmark, RefreshCw, Scale, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getGoldPrices, getIsaghaPrices } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

export default function CalculatorPage() {
    const { t, locale, isRTL } = useLanguage();
    const [prices, setPrices] = useState<any>(null);
    const [isaghaPrices, setIsaghaPrices] = useState<any>(null);
    const [selectedKarat, setSelectedKarat] = useState("21");
    const [weight, setWeight] = useState<number>(0);
    const [workmanship, setWorkmanship] = useState<number>(0);
    const [workmanshipType, setWorkmanshipType] = useState<"fixed" | "percent">("fixed");
    const [tax, setTax] = useState<number>(0);
    const [taxType, setTaxType] = useState<"fixed" | "percent">("fixed");
    const [total, setTotal] = useState<number>(0);
    const [source, setSource] = useState<"gold_era" | "isagha">("gold_era");

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(num);
    };

    useEffect(() => {
        const fetchData = async () => {
            const geData = await getGoldPrices();
            const isData = await getIsaghaPrices();
            if (geData) setPrices(geData);
            if (isData) setIsaghaPrices(isData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const currentPrices = source === "gold_era" ? prices : isaghaPrices?.gold;
        if (!currentPrices) return;

        const pricePerGram = parseFloat(currentPrices[`عيار ${selectedKarat}`]?.sell || currentPrices[selectedKarat]?.sell || "0");
        const baseValue = weight * pricePerGram;

        const totalWorkmanship = workmanshipType === "fixed"
            ? weight * workmanship
            : baseValue * (workmanship / 100);

        const totalTax = taxType === "fixed"
            ? weight * tax
            : (baseValue + totalWorkmanship) * (tax / 100);

        setTotal(baseValue + totalWorkmanship + totalTax);
    }, [selectedKarat, weight, workmanship, workmanshipType, tax, taxType, prices, isaghaPrices, source]);

    const karats = ["24", "22", "21", "18", "14"];

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                <header className="mb-8 sm:mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-600 dark:text-gold-400 mb-6"
                    >
                        <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest">{t.calculator_client.title}</span>
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground mb-4">
                        {locale === 'ar' ? (
                            <>احسب قيمة <span className="text-gradient-gold">استثمارك.</span></>
                        ) : (
                            <>{t.calculator_client.title} <span className="text-gradient-gold">{t.calculator_client.title_span}</span></>
                        )}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 font-bold max-w-2xl mx-auto">{t.calculator_client.subtitle}</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 space-y-8">
                        <div className="glass-card p-4 sm:p-10 relative overflow-hidden">
                            <div className={`absolute top-0 ${isRTL ? "right-0" : "left-0"} p-8 opacity-5`}>
                                <Scale className="h-24 w-24 sm:h-40 sm:w-40 text-gold-500" />
                            </div>

                            <div className="relative space-y-8">
                                <div>
                                    <label className={`block text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest mb-4 ${isRTL ? "text-right" : "text-left"}`}>{t.calculator_client.source_label}</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <button
                                            onClick={() => setSource("gold_era")}
                                            className={cn(
                                                "p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2 text-sm sm:text-base",
                                                source === "gold_era"
                                                    ? "border-gold-500 bg-gold-500/10 text-gold-600"
                                                    : "border-slate-100 dark:border-slate-800 text-slate-400"
                                            )}
                                        >
                                            <Zap className="h-4 w-4" /> Gold Service
                                        </button>
                                        <button
                                            onClick={() => setSource("isagha")}
                                            className={cn(
                                                "p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2 text-sm sm:text-base",
                                                source === "isagha"
                                                    ? "border-blue-500 bg-blue-500/10 text-blue-600"
                                                    : "border-slate-100 dark:border-slate-800 text-slate-400"
                                            )}
                                        >
                                            <Landmark className="h-4 w-4" /> iSaga
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-black text-slate-500 uppercase tracking-widest mb-4 ${isRTL ? "text-right" : "text-left"}`}>{t.calculator_client.karat_label}</label>
                                    <div className={`flex flex-wrap gap-3 ${!isRTL && "flex-row"}`}>
                                        {karats.map((k) => (
                                            <button
                                                key={k}
                                                onClick={() => setSelectedKarat(k)}
                                                className={cn(
                                                    "px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-base",
                                                    selectedKarat === k
                                                        ? "gold-gradient-bg text-slate-900 shadow-lg"
                                                        : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                                                )}
                                            >
                                                {locale === 'ar' ? `عيار ${k}` : `Carat ${k}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className={`block text-sm font-black text-slate-500 uppercase tracking-widest ${isRTL ? "text-right" : "text-left"}`}>{t.calculator_client.weight_label}</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={weight || ""}
                                                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                                                className={cn(
                                                    "w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 font-black text-lg sm:text-xl text-slate-900 dark:text-white focus:border-gold-500 outline-none transition-colors",
                                                    isRTL ? "pl-4 pr-12" : "pr-4 pl-12"
                                                )}
                                                placeholder="0.00"
                                            />
                                            <span className={`absolute top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm sm:text-base ${isRTL ? "right-4" : "left-4"}`}>{t.calculator_client.gram}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className={`flex justify-between items-center mb-3 ${!isRTL && "flex-row-reverse"}`}>
                                            <label className="text-sm font-black text-slate-500 uppercase tracking-widest">{t.calculator_client.workmanship_label}</label>
                                            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                                                <button
                                                    onClick={() => setWorkmanshipType("fixed")}
                                                    className={cn("px-3 py-1 text-[10px] font-black rounded-lg transition-all", workmanshipType === "fixed" ? "bg-white dark:bg-slate-800 shadow-sm text-gold-600" : "text-slate-400")}
                                                >{t.calculator_client.fixed}</button>
                                                <button
                                                    onClick={() => setWorkmanshipType("percent")}
                                                    className={cn("px-3 py-1 text-[10px] font-black rounded-lg transition-all", workmanshipType === "percent" ? "bg-white dark:bg-slate-800 shadow-sm text-gold-600" : "text-slate-400")}
                                                >%</button>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={workmanship || ""}
                                                onChange={(e) => setWorkmanship(parseFloat(e.target.value) || 0)}
                                                className={cn(
                                                    "w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl p-4 font-black text-xl text-slate-900 dark:text-white focus:border-gold-500 outline-none transition-colors",
                                                    isRTL ? "pl-4 pr-12" : "pr-4 pl-12"
                                                )}
                                                placeholder="0.00"
                                            />
                                            <span className={`absolute top-1/2 -translate-y-1/2 font-bold text-slate-400 ${isRTL ? "right-4" : "left-4"}`}>{workmanshipType === "fixed" ? t.calculator_client.unit : "%"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className={`flex justify-between items-center mb-3 ${!isRTL && "flex-row-reverse"}`}>
                                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest">{t.calculator_client.tax_label}</label>
                                        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                                            <button
                                                onClick={() => setTaxType("fixed")}
                                                className={cn("px-3 py-1 text-[10px] font-black rounded-lg transition-all", taxType === "fixed" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600" : "text-slate-400")}
                                            >{t.calculator_client.fixed}</button>
                                            <button
                                                onClick={() => setTaxType("percent")}
                                                className={cn("px-3 py-1 text-[10px] font-black rounded-lg transition-all", taxType === "percent" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600" : "text-slate-400")}
                                            >%</button>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={tax || ""}
                                            onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                                            className={cn(
                                                "w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl p-4 font-black text-xl text-slate-900 dark:text-white focus:border-gold-500 outline-none transition-colors",
                                                isRTL ? "pl-4 pr-12" : "pr-4 pl-12"
                                            )}
                                            placeholder="0.00"
                                        />
                                        <span className={`absolute top-1/2 -translate-y-1/2 font-bold text-slate-400 ${isRTL ? "right-4" : "left-4"}`}>{taxType === "fixed" ? t.calculator_client.unit : "%"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`glass-card p-8 flex items-center gap-6 bg-gold-500/5 border-gold-500/10 ${!isRTL && "flex-row-reverse text-right"}`}>
                            <div className="h-14 w-14 rounded-2xl gold-gradient-bg flex items-center justify-center shadow-xl shadow-gold-500/20 flex-shrink-0">
                                <ShieldCheck className="h-8 w-8 text-slate-900" />
                            </div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                                <h4 className="font-black text-lg mb-1">{t.calculator_client.efficiency_title}</h4>
                                <p className="text-slate-500 font-bold text-sm leading-relaxed">
                                    {t.calculator_client.efficiency_desc}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-8">
                        <div className="glass-card p-10 blue-gradient-bg text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden h-full">
                            <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-white/10 rounded-full blur-3xl" />

                            <div className="relative flex flex-col h-full">
                                <div className={`flex items-center justify-between mb-10 ${!isRTL && "flex-row-reverse"}`}>
                                    <h3 className="text-2xl font-black">{t.calculator_client.summary_title}</h3>
                                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Coins className="h-6 w-6 text-gold-100" />
                                    </div>
                                </div>

                                <div className="space-y-6 flex-grow">
                                    <div className={`flex justify-between items-center py-4 border-b border-white/10 ${!isRTL && "flex-row-reverse"}`}>
                                        <span className="font-bold opacity-80 text-sm italic">{t.calculator_client.price_per_gram}</span>
                                        <span className="font-black text-lg">
                                            {formatNumber(parseFloat(source === "gold_era" ? (prices?.[`عيار ${selectedKarat}`]?.sell || "0") : (isaghaPrices?.gold?.[selectedKarat]?.sell || "0")))} {t.calculator_client.unit}
                                        </span>
                                    </div>
                                    <div className={`flex justify-between items-center py-4 border-b border-white/10 ${!isRTL && "flex-row-reverse"}`}>
                                        <span className="font-bold opacity-80 text-sm italic">
                                            {t.calculator_client.total_workmanship} {workmanshipType === "percent" && `(${workmanship}%)`}
                                        </span>
                                        <span className="font-black text-lg">
                                            {formatNumber(workmanshipType === "fixed" ? (workmanship * weight) : (weight * parseFloat(source === "gold_era" ? (prices?.[`عيار ${selectedKarat}`]?.sell || "0") : (isaghaPrices?.gold?.[selectedKarat]?.sell || "0")) * workmanship / 100))} {t.calculator_client.unit}
                                        </span>
                                    </div>
                                    <div className={`flex justify-between items-center py-4 border-b border-white/10 ${!isRTL && "flex-row-reverse"}`}>
                                        <span className="font-bold opacity-80 text-sm italic">
                                            {t.calculator_client.total_tax} {taxType === "percent" && `(${tax}%)`}
                                        </span>
                                        <span className="font-black text-lg">
                                            {formatNumber(taxType === "fixed" ? (tax * weight) : (total - (weight * parseFloat(source === "gold_era" ? (prices?.[`عيار ${selectedKarat}`]?.sell || "0") : (isaghaPrices?.gold?.[selectedKarat]?.sell || "0"))) - (workmanshipType === "fixed" ? (workmanship * weight) : (weight * parseFloat(source === "gold_era" ? (prices?.[`عيار ${selectedKarat}`]?.sell || "0") : (isaghaPrices?.gold?.[selectedKarat]?.sell || "0")) * workmanship / 100))))} {t.calculator_client.unit}
                                        </span>
                                    </div>
                                    <div className={`flex justify-between items-center py-4 border-b border-white/10 ${!isRTL && "flex-row-reverse"}`}>
                                        <span className="font-bold opacity-80 text-sm italic">{t.calculator_client.total_weight}</span>
                                        <span className="font-black text-lg">{weight} {t.calculator_client.gram}</span>
                                    </div>
                                </div>

                                <div className={`mt-8 sm:mt-12 ${isRTL ? "text-right" : "text-left"}`}>
                                    <p className="text-blue-100 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-2">{t.calculator_client.total_estimated}</p>
                                    <div className={`flex flex-wrap items-baseline gap-2 sm:gap-3 ${!isRTL && "flex-row-reverse justify-end"}`}>
                                        <span className="text-4xl sm:text-6xl font-black">{formatNumber(total)}</span>
                                        <span className="text-xl sm:text-2xl font-bold opacity-80">{t.calculator_client.unit}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.print()}
                                    className="mt-10 w-full py-5 rounded-3xl bg-white text-blue-600 font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 no-print"
                                >
                                    <ShieldCheck className="h-5 w-5" />
                                    {t.calculator_client.download_pdf}
                                </button>

                                {/* Hidden Printable Invoice */}
                                <div className={`print-only p-10 bg-white text-black ${isRTL ? "rtl" : "ltr text-left"}`}>
                                    <div className={`flex justify-between items-center border-b-2 border-gold-500 pb-6 mb-8 text-black ${!isRTL && "flex-row-reverse"}`}>
                                        <div className={isRTL ? "text-right" : "text-left"}>
                                            <h1 className="text-3xl font-black text-blue-900">{isRTL ? "جولد سيرفيس" : "Gold Service"}</h1>
                                            <p className="font-bold text-slate-500">{isRTL ? "عرض سعر ذهب استثماري" : "Investment Gold Price Quote"}</p>
                                        </div>
                                        <div className={`${isRTL ? "text-left" : "text-right"} font-bold text-sm`}>
                                            <p>{isRTL ? "التاريخ" : "Date"}: {new Date().toLocaleDateString(locale === 'ar' ? "ar-EG" : "en-US")}</p>
                                            <p>{isRTL ? "الوقت" : "Time"}: {new Date().toLocaleTimeString(locale === 'ar' ? "ar-EG" : "en-US")}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-50 rounded-xl">
                                                <p className="text-xs font-black text-slate-400 mb-1">{t.calculator_client.karat_label}</p>
                                                <p className="font-black text-xl">{locale === 'ar' ? `عيار ${selectedKarat}` : `Carat ${selectedKarat}`}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-xl">
                                                <p className="text-xs font-black text-slate-400 mb-1">{t.calculator_client.total_weight}</p>
                                                <p className="font-black text-xl">{weight} {t.calculator_client.gram}</p>
                                            </div>
                                        </div>

                                        <table className={`w-full border-collapse ${isRTL ? "text-right" : "text-left"}`}>
                                            <thead>
                                                <tr className="bg-slate-900 text-white">
                                                    <th className="p-3">{isRTL ? "الوصف" : "Description"}</th>
                                                    <th className={isRTL ? "p-3 text-left" : "p-3 text-right"}>{isRTL ? "القيمة (ج.م)" : "Value (EGP)"}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b">
                                                    <td className="p-3 font-bold text-sm">{t.calculator_client.price_per_gram}</td>
                                                    <td className={`p-3 font-black ${isRTL ? "text-left" : "text-right"}`}>{formatNumber(parseFloat(source === "gold_era" ? (prices?.[`عيار ${selectedKarat}`]?.sell || "0") : (isaghaPrices?.gold?.[selectedKarat]?.sell || "0")))}</td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="p-3 font-bold text-sm">{t.calculator_client.total_workmanship}</td>
                                                    <td className={`p-3 font-black ${isRTL ? "text-left" : "text-right"}`}>{formatNumber(workmanshipType === "fixed" ? (workmanship * weight) : (weight * parseFloat(source === "gold_era" ? (prices?.[`عيار ${selectedKarat}`]?.sell || "0") : (isaghaPrices?.gold?.[selectedKarat]?.sell || "0")) * workmanship / 100))}</td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="p-3 font-bold text-sm">{t.calculator_client.total_tax}</td>
                                                    <td className={`p-3 font-black ${isRTL ? "text-left" : "text-right"}`}>{formatNumber(taxType === "fixed" ? (tax * weight) : (total - (weight * parseFloat(source === "gold_era" ? (prices?.[`عيار ${selectedKarat}`]?.sell || "0") : (isaghaPrices?.gold?.[selectedKarat]?.sell || "0"))) - (workmanshipType === "fixed" ? (workmanship * weight) : (weight * parseFloat(source === "gold_era" ? (prices?.[`عيار ${selectedKarat}`]?.sell || "0") : (isaghaPrices?.gold?.[selectedKarat]?.sell || "0")) * workmanship / 100))))}</td>
                                                </tr>
                                                <tr className="bg-gold-50 text-gold-900">
                                                    <td className="p-4 text-lg font-black">{isRTL ? "القيمة الإجمالية" : "Total Value"}</td>
                                                    <td className={`p-4 text-2xl font-black ${isRTL ? "text-left" : "text-right"}`}>{formatNumber(total)} {t.calculator_client.unit}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div className="mt-12 text-center text-[10px] text-slate-400 font-bold border-t pt-6">
                                            <p>{isRTL ? "هذا السعر تقريبي استرشادي بناءً على أسعار السوق في لحظة العرض." : "This price is a preliminary guide based on market prices at the time of quotation."}</p>
                                            <p>Gold Service Egypt © {new Date().getFullYear()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isaghaPrices && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mt-20 glass-card p-10"
                    >
                        <div className={`flex items-center gap-4 mb-10 ${!isRTL && "flex-row-reverse text-right"}`}>
                            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                <Landmark className="h-7 w-7 text-blue-500" />
                            </div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                                <h2 className="text-2xl font-black">{t.calculator_client.isagha_comparison}</h2>
                                <p className="text-slate-500 font-bold">{t.calculator_client.isagha_subtitle}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-right">
                            {/* Silver Prices */}
                            <div className="space-y-4">
                                <h3 className={`font-black flex items-center gap-2 text-slate-400 uppercase tracking-widest text-sm mb-6 ${!isRTL && "flex-row-reverse"}`}>
                                    <span className="h-2 w-2 rounded-full bg-slate-400" /> {t.calculator_client.silver_prices}
                                </h3>
                                {Object.entries(isaghaPrices?.silver || {}).map(([purity, val]: [string, any]) => (
                                    <div key={purity} className={`flex justify-between items-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 ${!isRTL && "flex-row-reverse"}`}>
                                        <span className="font-bold">{t.calculator_client.silver_karat} {purity}</span>
                                        <div className={isRTL ? "text-right" : "text-left"}>
                                            <p className="font-black text-slate-900 dark:text-white">{formatNumber(parseFloat(val?.sell || "0"))} {t.calculator_client.unit}</p>
                                            <p className="text-[10px] font-bold text-slate-400">{t.gold_details.col_buy}: {formatNumber(parseFloat(val?.buy || "0"))}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Isagha Gold Prices */}
                            <div className="lg:col-span-2 space-y-4">
                                <h3 className={`font-black flex items-center gap-2 text-gold-500 uppercase tracking-widest text-sm mb-6 ${!isRTL && "flex-row-reverse"}`}>
                                    <span className="h-2 w-2 rounded-full bg-gold-500" /> {t.calculator_client.gold_prices_isagha}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.entries(isaghaPrices?.gold || {}).slice(0, 6).map(([karat, val]: [string, any]) => (
                                        <div key={karat} className={`flex justify-between items-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 ${!isRTL && "flex-row-reverse"}`}>
                                            <span className="font-bold">{t.calculator_client.gold_karat} {karat}</span>
                                            <div className={isRTL ? "text-right" : "text-left"}>
                                                <p className="font-black text-gold-600">{formatNumber(parseFloat(val.sell))} {t.calculator_client.unit}</p>
                                                <p className="text-[10px] font-bold text-slate-400">{t.gold_details.col_buy}: {formatNumber(parseFloat(val.buy))}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
