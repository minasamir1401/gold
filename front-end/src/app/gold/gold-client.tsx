"use client";

import { Navbar } from "@/components/navbar";
import { PriceCard } from "@/components/price-card";
import { LiveGoldTable } from "@/components/live-gold-table";
import { Coins, Scale } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getGoldPrices } from "@/lib/api";

import { TradingViewChart } from "@/components/trading-view-chart";
import { CountriesGrid } from "@/components/countries-grid";
import { GoldLiveHistory } from "@/components/gold-live-history";
import { GoldLiveDetails } from "@/components/gold-live-details";
import { HistoricalPriceChart } from "@/components/historical-price-chart";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

export interface GoldClientProps {
    initialData: any;
}

export default function GoldClient({ initialData }: GoldClientProps) {
    const [livePrices, setLivePrices] = useState<any>(initialData);
    const { t, locale, isRTL } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            const pricesData = await getGoldPrices();
            if (pricesData) setLivePrices(pricesData);
        };

        if (!initialData) fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [initialData]);

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn("flex items-center gap-4 mb-4", !isRTL && "flex-row-reverse justify-end")}
                    >
                        <div className="h-12 w-12 rounded-2xl gold-gradient-bg flex items-center justify-center shadow-xl shadow-gold-500/20">
                            <Coins className="h-7 w-7 text-slate-900" />
                        </div>
                        <div className={cn(isRTL ? "text-right" : "text-left")}>
                            <h1 className="text-3xl font-black text-foreground text-gradient-gold lowercase">{t.gold_page.title}</h1>
                            <p className="text-secondary font-bold italic">{t.gold_page.subtitle}</p>
                        </div>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
                    <div className="lg:col-span-2 space-y-10">
                        <LiveGoldTable />
                        <TradingViewChart />
                        <HistoricalPriceChart />
                    </div>

                    <div className="space-y-8">
                        <PriceCard
                            title={t.gold_page["21k_buy"]}
                            price={parseFloat(livePrices?.["عيار 21"]?.buy || livePrices?.["21"]?.buy || "0")}
                            change={1.1}
                            unit={t.gold_page.unit_gram}
                            icon={Coins}
                            lastUpdated={livePrices ? t.gold_page.now : t.gold_page.loading}
                            trend="up"
                            variant="gold"
                        />

                        <div className="glass-card p-8 blue-gradient-bg text-white">
                            <h3 className="text-xl font-bold mb-4">{t.gold_page.cashback_title}</h3>
                            <p className="mb-6 text-sm opacity-90 leading-relaxed">
                                {t.gold_page.cashback_desc}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                                    <span className="text-sm font-bold">{t.gold_page.intact_cover}</span>
                                    <span className="font-black">~24-28 {t.price_cards.unit}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/5">
                                    <span className="text-sm font-bold">{t.gold_page.opened_cover}</span>
                                    <span className="font-black">~11 {t.price_cards.unit}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 group overflow-hidden">
                            <div className="flex items-center gap-3 mb-6">
                                <Scale className="h-6 w-6 text-gold-500" />
                                <h3 className="font-black text-lg">{t.gold_page.major_units}</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: t.gold_page.ounce, price: livePrices?.["gold_ounce"]?.sell || livePrices?.["أوقية الذهب"]?.sell },
                                    { label: t.gold_page.pound, price: livePrices?.["gold_pound"]?.sell || livePrices?.["جنيه الذهب"]?.sell },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        <span className="text-sm font-bold text-slate-500">{item.label}</span>
                                        <span className="font-black text-gold-600">{item.price ? new Intl.NumberFormat(locale === 'ar' ? "ar-EG" : "en-US").format(item.price) : "..."}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <CountriesGrid />

                <GoldLiveDetails />
                <GoldLiveHistory />
            </main>
        </div>
    );
}
