import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const source = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const locales = {
  en: {
    title: 'Remove or Add a Logo to Video Online | LogoMend Web',
    description: 'Remove logos with background restoration or add your own logo to video for free in your browser. MP4, MOV and WebM, 720p through 4K. Files never upload to a server.',
    ogTitle: 'LogoMend Web — private in-browser video logo editor',
    ogDescription: 'Edit video locally in your browser: no registration, cloud upload or subscription.'
  },
  pl: {
    title: 'Usuń lub dodaj logo do wideo online | LogoMend Web',
    description: 'Usuwaj logo z odtwarzaniem tła lub dodawaj własne logo do wideo bezpłatnie w przeglądarce. MP4, MOV, WebM, 720p–4K. Pliki nie trafiają na serwer.',
    ogTitle: 'LogoMend Web — prywatny edytor logo w wideo',
    ogDescription: 'Edytuj wideo lokalnie w przeglądarce, bez rejestracji, chmury i abonamentu.'
  },
  de: {
    title: 'Logo im Video online entfernen oder hinzufügen | LogoMend Web',
    description: 'Logos mit Hintergrundrekonstruktion kostenlos im Browser entfernen oder eigene Logos hinzufügen. MP4, MOV, WebM, 720p bis 4K. Keine Server-Uploads.',
    ogTitle: 'LogoMend Web — privater Video-Logo-Editor im Browser',
    ogDescription: 'Videos lokal im Browser bearbeiten: ohne Anmeldung, Cloud-Upload oder Abonnement.'
  }
};

for (const [language, metadata] of Object.entries(locales)) {
  let html = source
    .replace('<html lang="uk">', `<html lang="${language}">`)
    .replace(/<title>[^<]+<\/title>/, `<title>${metadata.title}</title>`)
    .replace(/<meta name="description" content="[^"]+">/, `<meta name="description" content="${metadata.description}">`)
    .replace('<link rel="canonical" href="https://logomend.com/">', `<link rel="canonical" href="https://logomend.com/${language}/">`)
    .replace('<meta property="og:title" content="LogoMend Web — приватний редактор логотипів у відео">', `<meta property="og:title" content="${metadata.ogTitle}">`)
    .replace('<meta property="og:description" content="Обробляйте відео локально у браузері: без реєстрації, хмари й передачі файлів.">', `<meta property="og:description" content="${metadata.ogDescription}">`)
    .replace('<meta property="og:url" content="https://logomend.com/">', `<meta property="og:url" content="https://logomend.com/${language}/">`)
    .replace('href="./favicon.svg"', 'href="../favicon.svg"')
    .replace('src="./ads-config.js"', 'src="../ads-config.js"');
  mkdirSync(new URL(`../${language}/`, import.meta.url), { recursive: true });
  writeFileSync(new URL(`../${language}/index.html`, import.meta.url), html);
}
