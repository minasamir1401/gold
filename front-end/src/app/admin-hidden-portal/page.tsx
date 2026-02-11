"use client";

import { useEffect, useState } from "react";
import { getAdminSettings, updateAdminSetting, getAdminStats, seedHistoricalArchive, getRawCache } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Shield, Power, Activity, Clock, Database, Globe, Zap, AlertCircle, DatabaseBackup, ListTree, Code2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPortal() {
    const [settings, setSettings] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [rawCache, setRawCache] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [seeding, setSeeding] = useState(false);
    const [activeTab, setActiveTab] = useState<"config" | "live" | "raw">("config");

    const scrapers = [
        { id: "gold_era", name: "Gold Era Egypt", icon: Zap, color: "text-gold-600", desc: "المصدر الرئيسي للأسعار في مصر، يسحب من الموقع الرسمي لشركة Gold Era." },
        { id: "isagha", name: "iSaga Market", icon: Shield, color: "text-blue-600", desc: "يسحب أسعار الذهب والفضة من سوق iSaga، المصدر الأكثر شعبية للمصريين." },
        { id: "sarf_today", name: "Sarf Today", icon: Globe, color: "text-purple-600", desc: "يوفر أسعار العملات الحية (سوق سوداء وبنوك) بجانب أسعار الذهب." },
        { id: "gold_live", name: "Gold Price Live", icon: Activity, color: "text-emerald-600", desc: "يسحب السجل التاريخي (30 يوم) وأسعار السبائك والعملات العالمية." },
        { id: "countries", name: "Arab Countries", icon: Globe, color: "text-red-500", desc: "يغطي أسعار الذهب في 14 دولة عربية بتحديثات دورية." },
    ];

    const fetchAll = async () => {
        const [sData, stData, rData] = await Promise.all([
            getAdminSettings(),
            getAdminStats(),
            activeTab === "raw" ? getRawCache() : Promise.resolve(null)
        ]);
        if (sData) setSettings(sData);
        if (stData) setStats(stData);
        if (rData) setRawCache(rData);
        setLoading(false);
    };

    useEffect(() => {
        fetchAll();
        const interval = setInterval(fetchAll, activeTab === "raw" ? 5000 : 30000);
        return () => clearInterval(interval);
    }, [activeTab]);

    const toggleScraper = async (id: string) => {
        const enabled = JSON.parse(settings.enabled_scrapers || "[]");
        let newEnabled;
        if (enabled.includes(id)) {
            newEnabled = enabled.filter((i: string) => i !== id);
        } else {
            newEnabled = [...enabled, id];
        }
        setSaving(id);
        await updateAdminSetting("enabled_scrapers", JSON.stringify(newEnabled));
        setSettings({ ...settings, enabled_scrapers: JSON.stringify(newEnabled) });
        setSaving(null);
    };

    const updateInterval = async (key: string, val: string) => {
        setSaving(key);
        await updateAdminSetting(key, val);
        setSettings({ ...settings, [key]: val });
        setSaving(null);
    };

    const handleSeed = async () => {
        if (!confirm("هل أنت متأكد؟ سيتم سحب بيانات تاريخية لمدة شهر وإضافتها لقاعدة البيانات.")) return;
        setSeeding(true);
        const res = await seedHistoricalArchive();
        setSeeding(false);
        if (res.status === "success") {
            alert("تم سحب البيانات التاريخية بنجاح!");
            fetchAll();
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-gold-600">جاري الدخول إلى بوابة التحكم...</div>;

    const enabledList = JSON.parse(settings?.enabled_scrapers || "[]");

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-20">
            <Navbar />

            <main className="mx-auto max-w-5xl px-4 pt-40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-slate-900 border-2 border-gold-500/50 flex items-center justify-center text-gold-500 shadow-2xl">
                            <Shield className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">لوحة التحكم السرية</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-bold">إدارة عمليات الاستخراج والإعدادات العامة للموقع</p>
                        </div>
                    </div>

                    <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <button
                            onClick={() => setActiveTab("config")}
                            className={cn("px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2", activeTab === "config" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                        >
                            <Settings className="h-3.5 w-3.5" />
                            الإعدادات
                        </button>
                        <button
                            onClick={() => setActiveTab("live")}
                            className={cn("px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2", activeTab === "live" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                        >
                            <Activity className="h-3.5 w-3.5" />
                            حالة السحب
                        </button>
                        <button
                            onClick={() => setActiveTab("raw")}
                            className={cn("px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2", activeTab === "raw" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                        >
                            <Code2 className="h-3.5 w-3.5" />
                            البيانات الخام
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card p-6 bg-white dark:bg-slate-900/50 border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-4 text-slate-400">
                            <Clock className="h-5 w-5" />
                            <span className="text-xs font-black">آخر تحديث مباشر</span>
                        </div>
                        <div className="text-xl font-black text-slate-900 dark:text-white truncate">
                            {new Date(stats?.cache_last_updated).toLocaleTimeString("ar-EG")}
                        </div>
                    </div>
                    <div className="glass-card p-6 bg-white dark:bg-slate-900/50 border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-4 text-slate-400">
                            <Database className="h-5 w-5" />
                            <span className="text-xs font-black">حجم الأرشيف</span>
                        </div>
                        <div className="text-xl font-black text-gold-600">
                            {stats?.db_snapshots_count} لقطة مخزنة
                        </div>
                    </div>
                    <div className="glass-card p-6 bg-white dark:bg-slate-900/50 border-white/5 border-l-4 border-l-emerald-500">
                        <div className="flex items-center gap-3 mb-4 text-slate-400">
                            <DatabaseBackup className="h-5 w-5" />
                            <span className="text-xs font-black">عمليات الصيانة</span>
                        </div>
                        <button
                            onClick={handleSeed}
                            disabled={seeding}
                            className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-2"
                        >
                            <RefreshCw className={cn("h-3 w-3", seeding && "animate-spin")} />
                            {seeding ? "جاري سحب التاريخ..." : "سحب البيانات التاريخية (Archive)"}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "config" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="config">
                            <section className="mb-12">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <Zap className="h-6 w-6 text-gold-500" />
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white">إدارة مصادر البيانات</h2>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            const newEnabled = enabledList.length > 0 ? [] : scrapers.map(s => s.id);
                                            await updateAdminSetting("enabled_scrapers", JSON.stringify(newEnabled));
                                            setSettings({ ...settings, enabled_scrapers: JSON.stringify(newEnabled) });
                                        }}
                                        className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-gold-600 transition-colors"
                                    >
                                        {enabledList.length > 0 ? "تعطيل الكل" : "تشغيل الكل"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {scrapers.map((s) => (
                                        <div key={s.id} className="glass-card p-5 bg-white dark:bg-slate-900/80 border-slate-100 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center", s.color)}>
                                                        <s.icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">{s.name}</h3>
                                                        <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">{enabledList.includes(s.id) ? "نشط الآن" : "متوقف"}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleScraper(s.id)}
                                                    disabled={saving === s.id}
                                                    className={cn(
                                                        "h-8 px-3 rounded-lg font-black text-[10px] transition-all",
                                                        enabledList.includes(s.id) ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-600"
                                                    )}
                                                >
                                                    {enabledList.includes(s.id) ? "إيقاف" : "تشغيل"}
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <Settings className="h-6 w-6 text-slate-400" />
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">إعدادات التردد الزمني</h2>
                                </div>
                                <div className="glass-card p-8 bg-white dark:bg-slate-900/80 border-slate-100 dark:border-white/5 space-y-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h4 className="font-black mb-1 text-slate-900 dark:text-slate-100">تردد سحب البيانات (Scrape Interval)</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">كم مرة يتم سحب السعر الحي من المواقع (بالثواني)</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {[30, 60, 300, 600].map(int => (
                                                <button
                                                    key={int}
                                                    onClick={() => updateInterval("scrape_interval", int.toString())}
                                                    className={cn(
                                                        "h-12 w-16 rounded-xl font-black text-sm border-2 transition-all",
                                                        settings.scrape_interval === int.toString()
                                                            ? "bg-slate-900 border-gold-500 text-gold-500"
                                                            : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200"
                                                    )}
                                                >
                                                    {int}s
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h4 className="font-black mb-1 text-slate-900 dark:text-slate-100">تردد النسخ الاحتياطي (Backup Interval)</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">متى يتم حفظ نسخة دائمة في قاعدة البيانات (بالثواني)</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {[600, 1800, 3600].map(int => (
                                                <button
                                                    key={int}
                                                    onClick={() => updateInterval("backup_interval", int.toString())}
                                                    className={cn(
                                                        "h-12 w-16 rounded-xl font-black text-sm border-2 transition-all",
                                                        settings.backup_interval === int.toString()
                                                            ? "bg-slate-900 border-gold-500 text-gold-500"
                                                            : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200"
                                                    )}
                                                >
                                                    {int / 60}m
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === "live" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="live">
                            <div className="glass-card p-8 bg-white dark:bg-slate-900/80 border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-3 mb-8">
                                    <ListTree className="h-6 w-6 text-gold-500" />
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">ملخص البيانات المحملة حالياً</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">أسعار الذهب (أساسي)</h4>
                                        <div className="space-y-2">
                                            {Object.entries(rawCache?.prices || {}).slice(0, 5).map(([k, v]: [string, any]) => (
                                                <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20">
                                                    <span className="text-sm font-bold dark:text-slate-200">{k}</span>
                                                    <span className="text-sm font-black text-gold-600 font-mono">{v.sell}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">الأسواق الدولية والدول العربية</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20">
                                                <span className="text-sm font-bold dark:text-slate-200">الدول المغطاة</span>
                                                <span className="text-sm font-black text-blue-600">{Object.keys(rawCache?.countries || {}).length} دول</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20">
                                                <span className="text-sm font-bold dark:text-slate-200">العملات الحية</span>
                                                <span className="text-sm font-black text-purple-600">{rawCache?.sarf_currencies?.length || 0} عملة</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20">
                                                <span className="text-sm font-bold dark:text-slate-200">تاريخ Live</span>
                                                <span className="text-sm font-black text-emerald-600">{rawCache?.gold_live_history?.length || 0} يوم</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "raw" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="raw">
                            <div className="glass-card p-6 bg-black/40 border-gold-500/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Live JSON Stream</span>
                                    </div>
                                </div>
                                <pre className="text-xs font-mono text-emerald-400 overflow-auto max-h-[600px] p-4 bg-black/40 rounded-xl scrollbar-hide">
                                    {JSON.stringify(rawCache, null, 2)}
                                </pre>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
