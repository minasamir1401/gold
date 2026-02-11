"use client";

import { CurrencyTable } from "@/components/currency-table";
import { GoldLiveCurrencies } from "@/components/gold-live-currencies";
import { Navbar } from "@/components/navbar";
import { useLanguage } from "@/components/language-provider";

export default function CurrenciesPage() {
    const { t } = useLanguage();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CurrencyExchangeRate",
        "name": t.currencies.title,
        "description": t.currencies.parallel_market,
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <main className="container mx-auto px-4 py-8 pt-32">
                <h1 className="text-3xl font-black mb-6 text-center text-gradient-gold">{t.currencies.title}</h1>
                <CurrencyTable />
                <GoldLiveCurrencies />
            </main>
        </div>
    );
}
