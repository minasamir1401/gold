"use client";

import React, { useEffect, useRef } from 'react';
import { useLanguage } from './language-provider';

export function TradingViewChart() {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const { t, locale } = useLanguage();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const scriptId = "tradingview-widget-script";
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        const initWidget = () => {
            if (window.TradingView && chartContainerRef.current) {
                new window.TradingView.widget({
                    "width": "100%",
                    "height": 500,
                    "symbol": "OANDA:XAUUSD",
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "1",
                    "locale": locale === 'ar' ? "ar_AE" : "en",
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "container_id": "tradingview_7cc9c"
                });
            }
        };

        if (!script) {
            script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://s3.tradingview.com/tv.js";
            script.type = "text/javascript";
            script.async = true;
            script.onload = initWidget;
            document.head.appendChild(script);
        } else {
            if (window.TradingView) {
                initWidget();
            } else {
                script.onload = initWidget;
            }
        }
    }, [locale]); // Re-init on locale change

    // Embedded widget also needs locale
    const embedLocale = locale === 'ar' ? "ar_AE" : "en";
    const iframeSrc = `https://www.tradingview-widget.com/embed-widget/single-quote/?locale=${embedLocale}#%7B%22symbol%22%3A%22OANDA%3AXAUUSD%22%2C%22width%22%3A%22100%25%22%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22height%22%3A126%2C%22utm_source%22%3A%22egypt.gold-era.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22single-quote%22%7D`;

    return (
        <div className="glass-card p-4 sm:p-6 w-full space-y-6">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                {t.chart.title}
            </h3>

            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <iframe
                    scrolling="no"
                    {...({ "allowtransparency": "true" } as any)}
                    frameBorder="0"
                    src={iframeSrc}
                    title="single quote TradingView widget"
                    style={{ userSelect: "none", boxSizing: "border-box", display: "block", height: "126px", width: "100%" }}
                />
            </div>

            <div className="tradingview-widget-container rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div id="tradingview_7cc9c" ref={chartContainerRef} style={{ height: "500px", width: "100%" }} />
                <div className="p-3 bg-slate-900/50 text-[10px] font-bold text-slate-500 text-center uppercase tracking-widest border-t border-white/5">
                    <a href="https://ar.tradingview.com/symbols/XAUUSD/?exchange=OANDA" rel="noopener" target="_blank" className="hover:text-gold-500 transition-colors">
                        {t.chart.credit}
                    </a>
                </div>
            </div>
        </div>
    );
}

declare global {
    interface Window {
        TradingView: any;
    }
}
