export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function getGoldPrices() {
    try {
        const response = await fetch(`${API_URL}/prices`);
        if (!response.ok) throw new Error("Failed to fetch prices");
        return await response.json();
    } catch (error) {
        console.error("Error fetching gold prices:", error);
        return null;
    }
}

export async function getGoldProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        return await response.json();
    } catch (error) {
        console.error("Error fetching gold products:", error);
        return null;
    }
}

export async function getMakingCharges() {
    try {
        const response = await fetch(`${API_URL}/making-charges`);
        if (!response.ok) throw new Error("Failed to fetch making charges");
        return await response.json();
    } catch (error) {
        console.error("Error fetching making charges:", error);
        return null;
    }
}

export async function getIsaghaPrices() {
    try {
        const response = await fetch(`${API_URL}/isagha`);
        if (!response.ok) throw new Error("Failed to fetch isagha prices");
        return await response.json();
    } catch (error) {
        console.error("Error fetching isagha prices:", error);
        return null;
    }
}

export async function getGoldPriceToday() {
    try {
        const response = await fetch(`${API_URL}/countries/egypt`); // Backward compatibility
        if (!response.ok) throw new Error("Failed to fetch gold price today");
        return await response.json();
    } catch (error) {
        console.error("Error fetching gold price today:", error);
        return null;
    }
}

export async function getCountryPrices(slug: string) {
    try {
        const response = await fetch(`${API_URL}/countries/${slug}`);
        if (!response.ok) throw new Error(`Failed to fetch prices for ${slug}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching prices for ${slug}:`, error);
        return null;
    }
}

export async function getSarfCurrencies() {
    try {
        const response = await fetch(`${API_URL}/sarf-currencies`);
        if (!response.ok) throw new Error('Failed to fetch sarf currencies');
        return await response.json();
    } catch (error) {
        console.error('Error fetching sarf currencies:', error);
        return [];
    }
}

export async function getSarfGold() {
    try {
        const response = await fetch(`${API_URL}/sarf-gold`);
        if (!response.ok) throw new Error('Failed to fetch sarf gold');
        return await response.json();
    } catch (error) {
        console.error('Error fetching sarf gold:', error);
    }
}

export async function getGoldLiveHistory() {
    try {
        const response = await fetch(`${API_URL}/gold-live-history`);
        if (!response.ok) throw new Error('Failed to fetch gold live history');
        return await response.json();
    } catch (error) {
        console.error('Error fetching gold live history:', error);
        return [];
    }
}

export async function getGoldLiveCurrencies() {
    try {
        const response = await fetch(`${API_URL}/gold-live-currencies`);
        if (!response.ok) throw new Error('Failed to fetch gold live currencies');
        return await response.json();
    } catch (error) {
        console.error('Error fetching gold live currencies:', error);
        return [];
    }
}

export async function getGoldLivePrices() {
    try {
        const response = await fetch(`${API_URL}/gold-live-prices`);
        if (!response.ok) throw new Error('Failed to fetch gold live prices');
        return await response.json();
    } catch (error) {
        console.error('Error fetching gold live prices:', error);
        return [];
    }
}

export async function getGoldLiveProducts() {
    try {
        const response = await fetch(`${API_URL}/gold-live-products`);
        if (!response.ok) throw new Error('Failed to fetch gold live products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching gold live products:', error);
        return [];
    }
}

export async function getGoldLiveCards() {
    try {
        const response = await fetch(`${API_URL}/gold-live-cards`);
        if (!response.ok) throw new Error('Failed to fetch gold live cards');
        return await response.json();
    } catch (error) {
        console.error('Error fetching gold live cards:', error);
        return [];
    }
}

export async function getAllCountriesPrices() {
    try {
        const response = await fetch(`${API_URL}/countries`);
        if (!response.ok) throw new Error("Failed to fetch all countries prices");
        return await response.json();
    } catch (error) {
        console.error("Error fetching all countries prices:", error);
        return null;
    }
}

// --- Admin & History Functions ---

export async function getPriceHistory(days: number = 7) {
    try {
        const response = await fetch(`${API_URL}/history?days=${days}`);
        if (!response.ok) throw new Error('Failed to fetch history');
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
}

export async function getAdminSettings() {
    try {
        const response = await fetch(`${API_URL}/admin/settings`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        return await response.json();
    } catch (error) {
        console.error('Error fetching admin settings:', error);
        return {};
    }
}

export async function updateAdminSetting(key: string, value: string) {
    try {
        const response = await fetch(`${API_URL}/admin/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value })
        });
        if (!response.ok) throw new Error('Failed to update setting');
        return await response.json();
    } catch (error) {
        console.error('Error updating setting:', error);
        return { status: 'error' };
    }
}

export async function getAdminStats() {
    try {
        const response = await fetch(`${API_URL}/admin/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return await response.json();
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
}

export async function getRawCache() {
    try {
        const response = await fetch(`${API_URL}/admin/raw-cache`);
        if (!response.ok) throw new Error('Failed to fetch raw cache');
        return await response.json();
    } catch (error) {
        console.error('Error fetching raw cache:', error);
        return null;
    }
}

export async function seedHistoricalArchive() {
    try {
        const response = await fetch(`${API_URL}/admin/seed-archive`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to seed archive');
        return await response.json();
    } catch (error) {
        console.error('Error seeding archive:', error);
        return { status: 'error' };
    }
}
