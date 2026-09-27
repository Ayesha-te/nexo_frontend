import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const DEFAULT_WHATSAPP_NUMBER = "923448252109";

export function useCurrency() {
  const [usdRatePkr, setUsdRatePkr] = useState(0);
  const [displayCurrency, setDisplayCurrency] = useState<"PKR" | "USD">("PKR");
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP_NUMBER);

  useEffect(() => {
    api("/api/accounts/settings/")
      .then((settings) => {
        setUsdRatePkr(Number(settings.usdRatePkr || 0));
        setWhatsappNumber(settings.whatsappNumber || DEFAULT_WHATSAPP_NUMBER);
      })
      .catch(() => setUsdRatePkr(0));
  }, []);

  const formatMoney = (amount: number) => {
    const value = Number(amount || 0);
    if (displayCurrency === "USD" && usdRatePkr > 0) {
      return `$${(value / usdRatePkr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `Rs. ${value.toLocaleString()}`;
  };

  return { usdRatePkr, displayCurrency, setDisplayCurrency, formatMoney, whatsappNumber };
}
