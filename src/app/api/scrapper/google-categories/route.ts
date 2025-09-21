// /app/api/google/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/restaurants"; // ou dynamique via query

export const GET = async (req: NextRequest) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled"
    ]
  });

  const places = await getGoogleMapsData(browser);
  await browser.close();

  return NextResponse.json(places);
};

const getGoogleMapsData = async (browser: Browser) => {
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "accept-language": "fr-FR,fr;q=0.9,en;q=0.8"
  });

  await page.goto(GOOGLE_MAPS_URL, { waitUntil: "networkidle2" });

  // Si Google affiche le bouton "Accepter les cookies"
  try {
    await page.waitForSelector('.UywwFc-vQzf8d', { timeout: 5000 });
    await page.click('.UywwFc-vQzf8d');
  } catch (_) {}

  // Attente chargement des résultats
  await page.waitForSelector('[role="feed"]', { timeout: 20000 });
  await scrollPage(page);

  const places = await parsePlaces(page);
  return places;
};

const parsePlaces = async (page: any) => {
  try {
    await page.waitForSelector('.qBF1Pd', { timeout: 60000 });
    const elements = await page.$$('.Nv2PK');

    const places = await Promise.all(elements.slice(0, 8).map(async (el: any) => {
      const name = await el.$eval('.qBF1Pd', (e: any) => e.textContent?.trim() || "N/A");
      const image = await el.$eval('div img', (img: any) => img.getAttribute('src') || "N/A").catch(() => "N/A");
      const rating = await el.$eval('.MW4etd', (e: any) => e.textContent?.trim() || "N/A").catch(() => "N/A");
      const reviews = await el.$eval('.UY7F9 + span', (e: any) => e.textContent?.trim().replace(/\D/g, '') || "0").catch(() => "0");
      const link = await el.$eval('a', (e: any) => e.getAttribute("href")?.trim() || "N/A").catch(() => "N/A");

      // 🔍 Extraction catégorie visible
      const category = await el.$$eval('span', (spans: any[]) => {
        const match = spans.find((el) => {
          const text = el.textContent?.trim();
          return text && /^[A-ZÉÀÂ].{2,}/.test(text) && !/\d/.test(text);
        });
        return match ? match.textContent?.trim() : "N/A";
      }).catch(() => "N/A");

      return { name, image, rating, reviews, link, category };
    }));

    return places;
  } catch (error) {
    console.error("Erreur dans parsePlaces:", error);
    return [];
  }
};

const scrollPage = async (page: any) => {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      const scrollContainer = document.querySelector('[role="feed"]');
      if (!scrollContainer) return resolve();

      let lastHeight = scrollContainer.scrollHeight;
      let attempts = 0;
      const maxAttempts = 10;

      const scrollInterval = setInterval(() => {
        scrollContainer.scrollTop = lastHeight;
        attempts++;

        setTimeout(() => {
          const newHeight = scrollContainer.scrollHeight;
          if (newHeight === lastHeight || attempts >= maxAttempts) {
            clearInterval(scrollInterval);
            resolve();
          }
          lastHeight = newHeight;
        }, 800);
      }, 1500);
    });
  });
};
