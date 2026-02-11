"use client";

import { Navbar } from "@/components/navbar";
import { PriceCard } from "@/components/price-card";
import { CurrencyConverter } from "@/components/currency-converter";
import { LiveGoldTable } from "@/components/live-gold-table";
import { Coins, CircleDollarSign, Euro, Landmark, ArrowLeft, Zap, ShieldCheck, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getGoldPrices } from "@/lib/api";

import { TradingViewChart } from "@/components/trading-view-chart";
import { CountriesGrid } from "@/components/countries-grid";
import { useLanguage } from "@/components/language-provider";
import { LivePriceCards } from "@/components/live-price-cards";

export interface HomeClientProps {
  initialPrices: any;
}

export default function HomeClient({ initialPrices }: HomeClientProps) {
  const [livePrices, setLivePrices] = useState<any>(initialPrices);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const fetchPrices = async () => {
      const data = await getGoldPrices();
      if (data) setLivePrices(data);
    };

    if (!initialPrices) fetchPrices();

    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, [initialPrices]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        {/* Atmospheric Background Icons */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ willChange: "transform" }}
          className="absolute top-40 left-10 opacity-5 pointer-events-none"
        >
          <Coins className="h-64 w-64 text-gold-500 shadow-2xl" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{ willChange: "transform" }}
          className="absolute bottom-20 right-10 opacity-5 pointer-events-none"
        >
          <CircleDollarSign className="h-48 w-48 text-primary-500" />
        </motion.div>

        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/10 blur-[120px] rounded-full" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-600 dark:text-gold-400 mb-8"
            >
              <Zap className="h-4 w-4 fill-gold-500 text-gold-500" />
              <span className="text-xs font-black uppercase tracking-wider">{t.hero.live}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
            >
              {t.hero.title1} <br />
              {t.hero.title2} <span className="text-gradient-gold">{t.hero.title3}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-xl font-medium"
            >
              {t.hero.desc}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <button className="px-6 py-4 sm:px-10 sm:py-5 rounded-2xl sm:rounded-3xl gold-gradient-bg text-slate-900 font-black shadow-2xl shadow-gold-600/30 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base">
                {t.hero.now}
              </button>
              <button className="px-6 py-4 sm:px-10 sm:py-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-slate-100 transition-all text-sm sm:text-base">
                {t.hero.workmanship}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Market Pulse Grid */}
        <div className="mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-black text-emerald-500 uppercase tracking-widest">{t.market.live_now}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{t.market.pulse}</h2>
            </div>
            <button className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-black hover:gap-4 transition-all text-sm sm:text-base">
              {t.market.all_prices} <ArrowLeft className={cn("h-4 w-4 sm:h-5 sm:w-5 transition-transform", !isRTL && "rotate-180")} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-12">
            <PriceCard
              title={t.price_cards["24k_sell"]}
              price={parseFloat(livePrices?.["عيار 24"]?.sell || "4100")}
              change={2.54}
              unit={t.price_cards.unit}
              icon={Coins}
              lastUpdated={livePrices ? t.market.last_updated : t.market.loading}
              trend="up"
              variant="gold"
            />
            <PriceCard
              title={t.price_cards["21k_sell"]}
              price={parseFloat(livePrices?.["عيار 21"]?.sell || "3587")}
              change={1.82}
              unit={t.price_cards.unit}
              icon={Coins}
              lastUpdated={livePrices ? t.market.last_updated : t.market.loading}
              trend="up"
              variant="gold"
            />
            <PriceCard
              title={t.price_cards.usd}
              price={48.65}
              change={-0.12}
              unit={t.price_cards.unit}
              icon={CircleDollarSign}
              lastUpdated={t.market.last_updated}
              trend="down"
              variant="blue"
            />
            <PriceCard
              title={t.price_cards.sar}
              price={12.97}
              change={0.05}
              unit={t.price_cards.unit}
              icon={Landmark}
              lastUpdated={t.market.last_updated}
              trend="up"
            />
          </div>

          <div className="space-y-6">
            <LivePriceCards />
            <LiveGoldTable />
            <div className="flex justify-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 dark:bg-slate-800/50 px-4 py-1.5 rounded-full">
                {t.market.source_disclaimer}
              </span>
            </div>
          </div>
        </div>

        {/* Countries Grid */}
        <CountriesGrid />

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          <div className="lg:col-span-8 space-y-10">
            <TradingViewChart />
            <div className="glass-card p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
              <div className="relative h-20 w-20 sm:h-32 sm:w-32 flex-shrink-0 animate-float">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <div className="relative h-full w-full bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <ShieldCheck className="h-10 w-10 sm:h-16 sm:w-16 text-emerald-500" />
                </div>
              </div>
              <div className="text-center md:text-right">
                <h3 className="text-xl sm:text-2xl font-black mb-3 italic">استثمر بأمان وشفافية</h3>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  نحن نعتمد على مصادر بيانات رسمية وموثوقة بنسبة 100%. نظامنا يقوم بتحديث الأسعار كل دقيقة لضمان حصولك على أدق المعلومات في الوقت الفعلي.
                </p>
                <div className="mt-6 flex justify-center md:justify-start gap-6">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-primary">+50</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">مصدر بيانات</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-primary">24/7</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">مراقبة السوق</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <CurrencyConverter />
            <div className="glass-card p-8 blue-gradient-bg text-white">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-6 w-6 opacity-70" />
                <h4 className="font-bold uppercase tracking-widest text-sm text-blue-100">مؤشر الأسواق العالمية</h4>
              </div>
              <div className="space-y-6">
                {[
                  { name: "S&P 500", value: "5,026", change: "+1.2%" },
                  { name: "NASDAQ", value: "15,990", change: "+0.8%" },
                  { name: "DOW JONES", value: "38,677", change: "-0.3%" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                    <span className="font-bold">{item.name}</span>
                    <div className="text-right">
                      <p className="font-black">{item.value}</p>
                      <p className={cn("text-xs font-bold", item.change.startsWith("+") ? "text-emerald-300" : "text-rose-300")}>
                        {item.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main >

      <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 mb-20">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 bg-gold-600 rounded-lg flex items-center justify-center">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter">
                {isRTL ? (
                  <>جولد<span className="text-gold-600 dark:text-gold-500">سيرفيس</span></>
                ) : (
                  <>Gold<span className="text-gold-600 dark:text-gold-500">Service</span></>
                )}
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-500 max-w-xs leading-relaxed font-bold">
              {t.footer.desc}
            </p>
          </div>
          <div>
            <h5 className="font-black mb-6 uppercase tracking-widest text-xs">{t.footer.platform}</h5>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li className="hover:text-primary cursor-pointer transition-colors">{t.footer.about}</li>
              <li className="hover:text-primary cursor-pointer transition-colors">{t.footer.security}</li>
              <li className="hover:text-primary cursor-pointer transition-colors">{t.footer.app}</li>
            </ul>
          </div>
          <div>
            <h5 className="font-black mb-6 uppercase tracking-widest text-xs">{t.footer.support}</h5>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li className="hover:text-primary cursor-pointer transition-colors">{t.footer.help}</li>
              <li className="hover:text-primary cursor-pointer transition-colors">{t.footer.contact}</li>
              <li className="hover:text-primary cursor-pointer transition-colors">{t.footer.terms}</li>
            </ul>
          </div>
        </div>
        <div className="py-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-inherit">
          <p className="text-xs text-slate-400 font-bold tracking-widest">© {new Date().getFullYear()} {isRTL ? 'جولد سيرفيس' : 'GOLD SERVICE'}. {t.footer.rights}</p>
          <div className="flex gap-8">
            {["X", "INSTAGRAM", "LINKEDIN"].map(social => (
              <span key={social} className="text-[10px] font-black text-slate-400 hover:text-primary cursor-pointer tracking-widest transition-colors">{social}</span>
            ))}
          </div>
        </div>
      </footer>
    </div >
  );
}
