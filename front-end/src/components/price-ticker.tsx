"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getGoldPrices, getSarfCurrencies } from "@/lib/api";

export function PriceTicker() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [goldData, currencyData] = await Promise.all([
                    getGoldPrices(),
                    getSarfCurrencies()
                ]);

                const formatted: any[] = [];

                // Process Gold Prices
                if (goldData) {
                    Object.entries(goldData).forEach(([key, val]: [string, any]) => {
                        let name = key;
                        if (key === "gold_pound") name = "جنيه ذهب";
                        if (key === "gold_ounce") name = "أوقية ذهب";
                        if (key === "silver_ounce") name = "أوقية فضة";
                        if (key === "silver_gram_24") name = "فضة 999";

                        // Parse values safely (remove commas if string)
                        const parse = (v: any) => {
                            if (typeof v === 'string') return parseFloat(v.replace(/,/g, ''));
                            return Number(v);
                        };

                        const buyFormatted = (val.buy ? parse(val.buy) : 0).toLocaleString("ar-EG");
                        const sellFormatted = (val.sell ? parse(val.sell) : 0).toLocaleString("ar-EG");

                        if (key.includes("عيار")) {
                            formatted.push({
                                name,
                                price: `بيع: ${sellFormatted} / شراء: ${buyFormatted}`,
                                color: "text-gold-500"
                            });
                        } else {
                            formatted.push({
                                name,
                                price: `${sellFormatted} ج.م`,
                                color: "text-gold-500"
                            });
                        }
                    });
                }

                // Process Currencies
                if (Array.isArray(currencyData)) {
                    currencyData.forEach((curr: any) => {
                        formatted.push({
                            name: curr.name,
                            price: `بيع: ${curr.sell} / شراء: ${curr.buy}`,
                            color: "text-emerald-400"
                        });
                    });
                }

                setItems(formatted);
            } catch (e) {
                console.error("Ticker fetch error:", e);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="bg-slate-900 text-white overflow-hidden py-2 border-b border-white/5 whitespace-nowrap dir-ltr">
            <motion.div
                animate={{ x: [0, -2000] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "transform" }}
                className="flex items-center gap-12 px-4 whitespace-nowrap"
            >
                {/* Duplicate the list to create seamless loop effect */}
                {[...items, ...items].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-xs font-bold">
                        <span className="text-slate-400">{item.name}</span>
                        <span className={item.color}>{item.price}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-700" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
