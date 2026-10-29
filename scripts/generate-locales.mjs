import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dictionaries } from '../src/i18n.js';

const source = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const siteUrl = 'https://mmomentlatch.github.io/logomend-web';
const locales = {
  en: {
    title: 'Remove Logo, Trim Video & Add Intro Online | LogoMend',
    description: 'Remove or add video logos, trim by exact time, and insert intro or outro images free in your browser. MP4, MOV, WebM, 720p–4K. No server upload.',
    ogTitle: 'Remove logos, trim video and add intro or outro | LogoMend',
    ogDescription: 'Remove and add logos, trim precisely, and insert images at the beginning or end — locally in your browser.',
    schemaDescription: 'Free local browser video editor for removing and adding logos, precise trimming, and adding intro or outro images.',
    faq: [
      ['Is my video uploaded to a server?', 'No. LogoMend Web processes video locally in your browser with WebAssembly.'],
      ['Which formats are supported?', 'MP4, MOV and WebM provide the best compatibility. The result is exported as MP4.'],
      ['Is 4K supported?', 'Yes, but 2K and 4K require a lot of memory. LogoMend Local is recommended for large or long videos.'],
      ['Can I add an intro or outro and trim the video precisely?', 'Yes. Add a JPG, PNG or WebP image at the beginning or end, choose its duration, and enter exact trim times in minutes and seconds.']
    ]
  },
  pl: {
    title: 'Usuń logo, przytnij film i dodaj intro online | LogoMend',
    description: 'Usuwaj i dodawaj logo, dokładnie przycinaj film oraz wstawiaj intro lub outro bezpłatnie w przeglądarce. MP4, MOV, WebM, 720p–4K.',
    ogTitle: 'Usuwanie logo, przycinanie filmu i intro/outro | LogoMend',
    ogDescription: 'Usuwaj i dodawaj logo, dokładnie przycinaj oraz wstawiaj obrazy na początku lub końcu — lokalnie w przeglądarce.',
    schemaDescription: 'Bezpłatny lokalny edytor wideo w przeglądarce do usuwania i dodawania logo, dokładnego przycinania oraz wstawiania intro lub outro.',
    faq: [
      ['Czy moje wideo jest wysyłane na serwer?', 'Nie. LogoMend Web przetwarza wideo lokalnie w przeglądarce za pomocą WebAssembly.'],
      ['Jakie formaty są obsługiwane?', 'Najlepszą zgodność zapewniają MP4, MOV i WebM. Wynik jest eksportowany jako MP4.'],
      ['Czy obsługiwane jest 4K?', 'Tak, ale 2K i 4K wymagają dużo pamięci. Do dużych lub długich filmów zalecamy LogoMend Local.'],
      ['Czy mogę dodać planszę i dokładnie przyciąć film?', 'Tak. Dodaj JPG, PNG lub WebP na początku albo końcu, ustaw czas planszy i wpisz dokładny czas przycięcia w minutach i sekundach.']
    ]
  },
  de: {
    title: 'Logo entfernen, Video kürzen & Intro einfügen | LogoMend',
    description: 'Logos entfernen oder hinzufügen, Videos präzise kürzen und Intro-/Outro-Bilder kostenlos im Browser einfügen. MP4, MOV, WebM, 720p–4K.',
    ogTitle: 'Logo entfernen, Video kürzen und Intro/Outro einfügen | LogoMend',
    ogDescription: 'Logos entfernen oder hinzufügen, präzise kürzen und Bilder am Anfang oder Ende einfügen — lokal im Browser.',
    schemaDescription: 'Kostenloser lokaler Videoeditor im Browser zum Entfernen und Hinzufügen von Logos, präzisen Kürzen und Einfügen von Intro- oder Outro-Bildern.',
    faq: [
      ['Wird mein Video auf einen Server hochgeladen?', 'Nein. LogoMend Web verarbeitet Videos mit WebAssembly lokal in Ihrem Browser.'],
      ['Welche Formate werden unterstützt?', 'MP4, MOV und WebM bieten die beste Kompatibilität. Das Ergebnis wird als MP4 exportiert.'],
      ['Wird 4K unterstützt?', 'Ja, aber 2K und 4K benötigen viel Arbeitsspeicher. Für große oder lange Videos wird LogoMend Local empfohlen.'],
      ['Kann ich ein Intro oder Outro hinzufügen und genau kürzen?', 'Ja. Fügen Sie JPG, PNG oder WebP am Anfang oder Ende ein, wählen Sie die Dauer und geben Sie die genaue Schnittzeit in Minuten und Sekunden ein.']
    ]
  }
};

const schemaPattern = /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/;
const baseSchema = JSON.parse(source.match(schemaPattern)[1]);

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function localizeVisibleContent(html, language) {
  const dictionary = dictionaries[language] || {};
  const withHtml = html.replace(/(<([a-z][\w-]*)[^>]*\sdata-i18n-html="([^"]+)"[^>]*>)[\s\S]*?(<\/\2>)/gi,
    (match, opening, tag, key, closing) => dictionary[key] ? `${opening}${dictionary[key]}${closing}` : match);
  return withHtml.replace(/(<([a-z][\w-]*)[^>]*\sdata-i18n="([^"]+)"[^>]*>)[\s\S]*?(<\/\2>)/gi,
    (match, opening, tag, key, closing) => dictionary[key] ? `${opening}${escapeHtml(dictionary[key])}${closing}` : match);
}

for (const [language, metadata] of Object.entries(locales)) {
  const schema = JSON.parse(JSON.stringify(baseSchema));
  const application = schema['@graph'].find(item => item['@id']?.endsWith('#webapp'));
  const faqPage = schema['@graph'].find(item => item['@type'] === 'FAQPage');
  application.inLanguage = language;
  application.description = metadata.schemaDescription;
  faqPage.inLanguage = language;
  faqPage.mainEntity = metadata.faq.map(([name, text]) => ({
    '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text }
  }));
  let html = localizeVisibleContent(source, language)
    .replace('<html lang="uk">', `<html lang="${language}">`)
    .replace(/<title>[^<]+<\/title>/, `<title>${metadata.title}</title>`)
    .replace(/<meta name="description" content="[^"]+">/, `<meta name="description" content="${metadata.description}">`)
    .replace(`<link rel="canonical" href="${siteUrl}/">`, `<link rel="canonical" href="${siteUrl}/${language}/">`)
    .replace(/<meta property="og:title" content="[^"]+">/, `<meta property="og:title" content="${metadata.ogTitle}">`)
    .replace(/<meta property="og:description" content="[^"]+">/, `<meta property="og:description" content="${metadata.ogDescription}">`)
    .replace(`<meta property="og:url" content="${siteUrl}/">`, `<meta property="og:url" content="${siteUrl}/${language}/">`)
    .replace(schemaPattern, `<script type="application/ld+json">\n  ${JSON.stringify(schema)}\n  </script>`)
    .replace('href="./favicon.svg"', 'href="../favicon.svg"')
    .replace('src="./ads-config.js"', 'src="../ads-config.js"');
  mkdirSync(new URL(`../${language}/`, import.meta.url), { recursive: true });
  writeFileSync(new URL(`../${language}/index.html`, import.meta.url), html);
}
