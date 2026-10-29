const uk = {
  'engine.waiting': 'Рушій готовий до запуску',
  'engine.note': 'FFmpeg завантажиться лише перед обробкою',
  'remove.empty': 'Область ще не виділена',
  'add.empty': 'Логотип ще не вибрано',
  'tabs.cover': 'Заставка',
  'cover.uploadTitle': 'Завантажте зображення',
  'cover.uploadText': 'Для YouTube радимо 16:9 · 1280×720 або 1920×1080',
  'cover.choose': 'Обрати JPG, PNG або WebP',
  'cover.empty': 'Зображення ще не вибрано',
  'cover.positionTitle': 'Де показати заставку',
  'cover.positionText': 'Додайте її перед відео або після нього',
  'cover.start': 'На початку',
  'cover.end': 'У кінці',
  'cover.duration': 'Тривалість',
  'cover.seconds': '{value} с',
  'cover.fitLabel': 'Заповнення кадру',
  'cover.fitCover': 'На весь кадр · краї можуть обрізатися',
  'cover.fitContain': 'Показати повністю · можливі поля',
  'trim.exactStart': 'Точний початок',
  'trim.exactEnd': 'Точний кінець',
  'trim.minutesShort': 'хв',
  'trim.secondsShort': 'с',
  'progress.loading': 'Готуємо відеорушій…',
  'progress.loadingText': 'Один раз завантажуємо FFmpeg WebAssembly у ваш браузер.',
  'runtime.invalidVideo': 'Оберіть відеофайл MP4, MOV, WebM, MKV або AVI.',
  'runtime.tooLarge': 'Цей файл завеликий для надійної роботи у браузері. Використайте LogoMend Local для відео понад 1,5 ГБ.',
  'runtime.largeWarning': 'Файл великий. Браузеру може не вистачити пам’яті. Для довгих або 2K/4K-відео краще використати LogoMend Local. Продовжити?',
  'runtime.videoError': 'Браузер не може показати попередній перегляд цього формату. Спробуйте MP4 (H.264), MOV або WebM.',
  'runtime.rectangle': 'Область: {w} × {h} px · x {x}, y {y}',
  'runtime.brush': 'Маска пензля: {count} штр. · {w} × {h} px',
  'runtime.logoReady': 'Логотип: {name}',
  'runtime.coverReady': 'Заставка: {name}',
  'runtime.invalidCover': 'Оберіть зображення JPG, PNG або WebP.',
  'runtime.engineLoading': 'Завантажуємо FFmpeg WebAssembly…',
  'runtime.engineLoaded': 'Рушій готовий',
  'runtime.engineCached': 'Повторні запуски будуть швидшими',
  'runtime.reading': 'Підключаємо відео без зайвої копії в пам’яті…',
  'runtime.processing': 'Обробляємо відео…',
  'runtime.fastCover': 'Швидко додаємо заставку…',
  'runtime.fastCoverText': 'Кодуємо лише зображення, а відео та звук копіюємо без втрати якості.',
  'runtime.fastCoverFallback': 'Вмикаємо сумісний режим…',
  'runtime.finalizing': 'Готуємо MP4 для завантаження…',
  'runtime.failed': 'Перевірте, чи браузеру вистачає оперативної пам’яті, і спробуйте коротше відео.\n\nТехнічні деталі: {message}',
  'runtime.delogoBrush': 'Швидкий delogo працює лише з прямокутником. Для кисті виберіть «Розумне — FFmpeg» або OpenCV.',
  'runtime.opencvLoading': 'Завантажуємо OpenCV.js…',
  'runtime.opencvFrames': 'Готуємо кадри для OpenCV…',
  'runtime.opencvFrame': 'OpenCV відновлює кадр {current} із {total}',
  'runtime.opencvAssembling': 'Збираємо кадри та повертаємо звук…',
  'runtime.opencvStageScript': 'OpenCV.js 4.13.0 · завантаження модуля',
  'runtime.opencvStageRuntime': 'OpenCV.js 4.13.0 · компіляція WebAssembly',
  'runtime.opencvStageReady': 'OpenCV.js 4.13.0 · модуль готовий',
  'runtime.opencvLimit': 'OpenCV Web розрахований на короткі фрагменти до 15 секунд і роздільну здатність не вище 1080p. Обріжте відео або використайте LogoMend Local.',
  'runtime.opencvUnavailable': 'Ця офіційна збірка OpenCV.js не містить функцію inpaint.',
  'runtime.play': 'Відтворити',
  'runtime.pause': 'Пауза',
  'runtime.drawBrush': 'Замалюйте лише букви або знак',
  'runtime.drawRect': 'Протягніть рамку поверх логотипа',
  'runtime.moveLogo': 'Перетягніть логотип у потрібне місце',
  'runtime.coverStart': 'Заставка буде додана на початок відео',
  'runtime.coverEnd': 'Заставка буде додана в кінець відео'
};

const en = {
  'nav.editor': 'Editor', 'nav.how': 'How it works', 'nav.faq': 'FAQ',
  'header.private': 'Files stay on your device', 'header.language': 'Language',
  'hero.eyebrow': 'FREE · RIGHT IN YOUR BROWSER', 'hero.title': 'Remove the old logo.<br><em>Add your own.</em>',
  'hero.lead': 'Remove or add logos, trim video precisely, and insert an intro or outro image. Everything is free and processed locally in your browser.', 'hero.cta': 'Edit a video', 'hero.local': 'local processing',
  'ads.label': 'ADVERTISEMENT', 'ads.placeholder': 'Space for responsive Google AdSense',
  'app.eyebrow': 'VIDEO EDITOR', 'app.title': 'Create a clean version of your video',
  'engine.waiting': 'Engine ready to start', 'engine.note': 'FFmpeg loads only when processing begins',
  'upload.title': 'Drop your video here', 'upload.subtitle': 'or click to choose a file', 'upload.privacyTitle': 'Privacy built in', 'upload.privacyText': 'The file is read only by your browser and is never sent anywhere.',
  'stage.drawRect': 'Drag a box over the logo', 'file.replace': 'Replace', 'tabs.remove': 'Remove', 'tabs.add': 'Add logo', 'tabs.cover': 'Intro / outro',
  'remove.areaTitle': 'Select the area', 'remove.areaText': 'Work on a paused frame', 'remove.rectangle': '▭ Rectangle', 'remove.brush': '⌁ Brush', 'remove.brushSize': 'Brush size', 'remove.undo': '↶ Undo', 'remove.clear': 'Clear', 'remove.empty': 'No area selected yet',
  'remove.methodTitle': 'Choose a method', 'remove.methodText': 'Local background restoration modes', 'method.smart': 'Smart — FFmpeg', 'method.smartText': 'Rebuilds the background from a mask', 'method.delogo': 'Quick — delogo', 'method.delogoText': 'Rectangle areas only', 'method.opencv': 'OpenCV restoration', 'method.opencvText': 'Rebuilds every frame · up to 15 seconds', 'remove.strength': 'Restoration radius',
  'add.uploadTitle': 'Upload your logo', 'add.uploadText': 'Transparent PNG gives the best result', 'add.choose': 'Choose PNG, JPG or WebP', 'add.empty': 'No logo selected yet', 'add.positionTitle': 'Place it on the frame', 'add.positionText': 'Drag the logo where you want it', 'add.size': 'Size', 'add.opacity': 'Opacity',
  'cover.uploadTitle': 'Upload an image', 'cover.uploadText': 'For YouTube, use 16:9 · 1280×720 or 1920×1080', 'cover.choose': 'Choose JPG, PNG or WebP', 'cover.empty': 'No image selected yet', 'cover.positionTitle': 'Choose where it appears', 'cover.positionText': 'Add the image before or after the video', 'cover.start': 'At the beginning', 'cover.end': 'At the end', 'cover.duration': 'Duration', 'cover.seconds': '{value} s', 'cover.fitLabel': 'Frame fitting', 'cover.fitCover': 'Fill frame · edges may be cropped', 'cover.fitContain': 'Show whole image · bars may appear',
  'export.title': 'Export quality', 'export.text': 'Original resolution is preserved', 'export.maximum': 'Maximum · CRF 18', 'export.high': 'High · CRF 21', 'export.compact': 'Compact · CRF 25',
  'trim.title': 'Trim video', 'trim.text': 'Remove extra time from the beginning or end', 'trim.start': 'Start', 'trim.end': 'End', 'trim.exactStart': 'Exact start', 'trim.exactEnd': 'Exact end', 'trim.minutesShort': 'min', 'trim.secondsShort': 'sec', 'trim.duration': 'Result duration', 'trim.reset': 'Reset',
  'process.start': 'Process video', 'process.note': 'On the first run, the browser downloads about 32 MB of engine files.',
  'progress.eyebrow': 'LOCAL PROCESSING', 'progress.loading': 'Preparing the video engine…', 'progress.loadingText': 'FFmpeg WebAssembly is loaded into your browser once.', 'progress.cancel': 'Cancel',
  'result.eyebrow': 'READY', 'result.title': 'Your new video is ready', 'result.text': 'Preview the result and save the MP4 copy to your device.', 'result.nextTitle': 'Want to keep editing?', 'result.nextText': 'Use this result as the next source: add a logo, intro/outro image, or trim it.', 'result.continue': 'Continue editing', 'result.download': 'Download MP4', 'result.back': 'Edit this step', 'result.new': 'Another video',
  'error.title': 'Video processing failed', 'error.back': 'Go back',
  'how.eyebrow': 'A SIMPLE PROCESS', 'how.title': 'From video to result in three steps', 'how.step1Title': 'Add a video', 'how.step1Text': 'Choose a file from your computer. It will not be uploaded to our server.', 'how.step2Title': 'Mark the logo', 'how.step2Text': 'Paint a precise brush mask or select a rectangle.', 'how.step3Title': 'Save the result', 'how.step3Text': 'Preview the finished video and download the MP4 to your device.',
  'compare.eyebrow': 'TWO PRODUCTS', 'compare.title': 'Web for convenience.<br>Local for maximum power.', 'compare.text': 'The browser edition is ideal for short videos and quick fixes. For long 2K/4K files and STTN AI restoration, use LogoMend Local.', 'compare.web1': 'No installation', 'compare.web2': 'In-browser processing', 'compare.web3': 'Logo removal and overlay, trimming, intro and outro images', 'compare.current': 'You are here', 'compare.local1': 'For large files', 'compare.local2': 'STTN and multi-frame modes', 'compare.local3': 'Faster on a powerful PC', 'compare.download': 'Download for Windows →',
  'faq.eyebrow': 'FREQUENTLY ASKED QUESTIONS', 'faq.title': 'Good to know', 'faq.q1': 'Is my video uploaded to a server?', 'faq.a1': 'No. The file is processed in your browser memory with WebAssembly. We never receive its contents.', 'faq.q2': 'Which formats and resolutions are supported?', 'faq.a2': 'MP4, MOV and WebM work best. 720p, 1080p, 2K and 4K are supported, but large videos require more memory.', 'faq.q3': 'Why is Web slower than Local?', 'faq.a3': 'Browsers isolate processing and impose stricter memory limits. Local uses native FFmpeg and is better for large files.', 'faq.q4': 'Will the logo disappear perfectly?', 'faq.a4': 'The result depends on the background, motion and logo size. OpenCV and FFmpeg rebuild the selected area from neighboring pixels; very complex moving backgrounds are better handled by Local AI modes.', 'faq.q5': 'Can I remove any watermark?', 'faq.a5': 'Only process your own material or video you have permission to edit. Removing someone else’s attribution may violate their rights.', 'faq.q6': 'Can I add an intro or outro and trim the video precisely?', 'faq.a6': 'Yes. Add a JPG, PNG or WebP image at the beginning or end, choose its duration, and enter exact trim times in minutes and seconds.',
  'footer.tagline': 'A private video editor that runs on your device.', 'footer.privacy': 'Privacy', 'footer.terms': 'Terms', 'footer.rights': 'All rights reserved.',
  'runtime.invalidVideo': 'Choose an MP4, MOV, WebM, MKV or AVI video file.', 'runtime.tooLarge': 'This file is too large for reliable browser processing. Use LogoMend Local for videos over 1.5 GB.', 'runtime.largeWarning': 'This is a large file and your browser may run out of memory. LogoMend Local is recommended for long or 2K/4K video. Continue?', 'runtime.videoError': 'Your browser cannot preview this format. Try MP4 (H.264), MOV or WebM.', 'runtime.rectangle': 'Area: {w} × {h} px · x {x}, y {y}', 'runtime.brush': 'Brush mask: {count} stroke(s) · {w} × {h} px', 'runtime.logoReady': 'Logo: {name}', 'runtime.coverReady': 'Intro/outro image: {name}', 'runtime.invalidCover': 'Choose a JPG, PNG or WebP image.', 'runtime.engineLoading': 'Loading FFmpeg WebAssembly…', 'runtime.engineLoaded': 'Engine ready', 'runtime.engineCached': 'Later runs will start faster', 'runtime.reading': 'Reading the video without duplicating it in memory…', 'runtime.processing': 'Processing video…', 'runtime.fastCover': 'Adding the image quickly…', 'runtime.fastCoverText': 'Only the image is encoded; compatible video and audio are copied without quality loss.', 'runtime.fastCoverFallback': 'Switching to compatibility mode…', 'runtime.finalizing': 'Preparing the MP4 download…', 'runtime.failed': 'Check that the browser has enough memory and try a shorter video.\n\nTechnical details: {message}', 'runtime.delogoBrush': 'Quick delogo only supports rectangles. For a brush mask choose Smart — FFmpeg or OpenCV.', 'runtime.opencvLoading': 'Loading OpenCV.js…', 'runtime.opencvFrames': 'Preparing frames for OpenCV…', 'runtime.opencvFrame': 'OpenCV is restoring frame {current} of {total}', 'runtime.opencvAssembling': 'Reassembling frames and restoring audio…', 'runtime.opencvStageScript': 'OpenCV.js 4.13.0 · loading module', 'runtime.opencvStageRuntime': 'OpenCV.js 4.13.0 · compiling WebAssembly', 'runtime.opencvStageReady': 'OpenCV.js 4.13.0 · module ready', 'runtime.opencvLimit': 'OpenCV Web is designed for clips up to 15 seconds and resolutions up to 1080p. Trim the video or use LogoMend Local.', 'runtime.opencvUnavailable': 'This official OpenCV.js build does not include inpaint.', 'runtime.play': 'Play', 'runtime.pause': 'Pause', 'runtime.drawBrush': 'Paint only the letters or symbol', 'runtime.drawRect': 'Drag a box over the logo', 'runtime.moveLogo': 'Drag the logo where you want it', 'runtime.coverStart': 'The image will be added at the beginning', 'runtime.coverEnd': 'The image will be added at the end'
};

const pl = {
  ...en,
  'nav.editor': 'Edytor', 'nav.how': 'Jak to działa', 'nav.faq': 'Pytania', 'header.private': 'Pliki pozostają na urządzeniu', 'header.language': 'Język',
  'hero.eyebrow': 'BEZPŁATNIE · W PRZEGLĄDARCE', 'hero.title': 'Usuń stare logo.<br><em>Dodaj własne.</em>', 'hero.lead': 'Usuwaj lub dodawaj logo, dokładnie przycinaj film i wstawiaj planszę na początku albo końcu. Bezpłatnie i lokalnie w przeglądarce.', 'hero.cta': 'Edytuj wideo', 'hero.local': 'przetwarzanie lokalne',
  'app.title': 'Utwórz czystą wersję wideo', 'engine.waiting': 'Silnik gotowy do uruchomienia', 'engine.note': 'FFmpeg pobierze się dopiero przed obróbką',
  'upload.title': 'Przeciągnij wideo tutaj', 'upload.subtitle': 'lub kliknij, aby wybrać plik', 'upload.privacyTitle': 'Prywatność w standardzie', 'upload.privacyText': 'Plik odczytuje wyłącznie Twoja przeglądarka i nigdzie go nie wysyła.',
  'tabs.remove': 'Usuń', 'tabs.add': 'Dodaj logo', 'tabs.cover': 'Plansza', 'remove.areaTitle': 'Zaznacz obszar', 'remove.areaText': 'Pracuj na zatrzymanej klatce', 'remove.rectangle': '▭ Prostokąt', 'remove.brush': '⌁ Pędzel', 'remove.brushSize': 'Grubość pędzla', 'remove.undo': '↶ Cofnij', 'remove.clear': 'Wyczyść', 'remove.empty': 'Nie zaznaczono obszaru',
  'remove.methodTitle': 'Wybierz metodę', 'remove.methodText': 'Lokalne tryby odtwarzania tła', 'method.smart': 'Inteligentne — FFmpeg', 'method.smartText': 'Odtwarza tło według maski', 'method.delogo': 'Szybkie — delogo', 'method.delogoText': 'Tylko prostokątny obszar', 'method.opencv': 'Odtwarzanie OpenCV', 'method.opencvText': 'Odtwarza każdą klatkę · do 15 sekund', 'remove.strength': 'Promień odtwarzania',
  'add.uploadTitle': 'Wczytaj logo', 'add.uploadText': 'Najlepszy będzie PNG z przezroczystością', 'add.choose': 'Wybierz PNG, JPG lub WebP', 'add.empty': 'Nie wybrano logo', 'add.positionTitle': 'Umieść na kadrze', 'add.positionText': 'Przeciągnij logo w wybrane miejsce', 'add.size': 'Rozmiar', 'add.opacity': 'Przezroczystość',
  'cover.uploadTitle': 'Wczytaj obraz', 'cover.uploadText': 'Do YouTube użyj 16:9 · 1280×720 lub 1920×1080', 'cover.choose': 'Wybierz JPG, PNG lub WebP', 'cover.empty': 'Nie wybrano obrazu', 'cover.positionTitle': 'Wybierz miejsce planszy', 'cover.positionText': 'Dodaj obraz przed filmem lub po nim', 'cover.start': 'Na początku', 'cover.end': 'Na końcu', 'cover.duration': 'Czas trwania', 'cover.seconds': '{value} s', 'cover.fitLabel': 'Dopasowanie kadru', 'cover.fitCover': 'Wypełnij kadr · krawędzie mogą być przycięte', 'cover.fitContain': 'Pokaż cały obraz · możliwe pasy',
  'export.title': 'Jakość eksportu', 'export.text': 'Oryginalna rozdzielczość zostanie zachowana', 'process.start': 'Przetwórz wideo', 'process.note': 'Przy pierwszym uruchomieniu przeglądarka pobierze około 32 MB silnika.',
  'trim.title': 'Przytnij wideo', 'trim.text': 'Usuń fragment z początku lub końca', 'trim.start': 'Początek', 'trim.end': 'Koniec', 'trim.exactStart': 'Dokładny początek', 'trim.exactEnd': 'Dokładny koniec', 'trim.minutesShort': 'min', 'trim.secondsShort': 's', 'trim.duration': 'Długość wyniku', 'trim.reset': 'Resetuj',
  'result.title': 'Nowe wideo jest gotowe', 'result.text': 'Obejrzyj rezultat i zapisz kopię MP4 na urządzeniu.', 'result.nextTitle': 'Chcesz kontynuować?', 'result.nextText': 'Użyj wyniku jako nowego źródła: dodaj logo, planszę początkową/końcową lub przytnij film.', 'result.continue': 'Kontynuuj edycję', 'result.download': 'Pobierz MP4', 'result.back': 'Edytuj ten krok', 'result.new': 'Inne wideo',
  'how.title': 'Od wideo do rezultatu w trzech krokach', 'how.step1Title': 'Dodaj wideo', 'how.step1Text': 'Wybierz plik z komputera. Nie zostanie wysłany na nasz serwer.', 'how.step2Title': 'Zaznacz logo', 'how.step2Text': 'Namaluj dokładną maskę pędzlem lub zaznacz prostokąt.', 'how.step3Title': 'Zapisz wynik', 'how.step3Text': 'Obejrzyj gotowe wideo i pobierz MP4.',
  'ads.label': 'REKLAMA', 'ads.placeholder': 'Miejsce na responsywną reklamę Google AdSense', 'app.eyebrow': 'EDYTOR WIDEO', 'error.title': 'Nie udało się przetworzyć wideo', 'error.back': 'Wróć', 'how.eyebrow': 'PROSTY PROCES',
  'compare.eyebrow': 'DWA PRODUKTY', 'compare.title': 'Web dla wygody.<br>Local dla maksymalnej mocy.', 'compare.text': 'Wersja przeglądarkowa jest idealna do krótkich filmów i szybkich poprawek. Do długich plików 2K/4K i odtwarzania AI STTN użyj LogoMend Local.', 'compare.web1': 'Bez instalacji', 'compare.web2': 'Przetwarzanie w przeglądarce', 'compare.web3': 'Usuwanie i dodawanie logo, przycinanie oraz plansze', 'compare.current': 'Jesteś tutaj', 'compare.local1': 'Do dużych plików', 'compare.local2': 'Tryby STTN i wieloklatkowe', 'compare.local3': 'Szybciej na wydajnym komputerze', 'compare.download': 'Pobierz dla Windows →',
  'faq.eyebrow': 'CZĘSTO ZADAWANE PYTANIA', 'faq.title': 'Warto wiedzieć', 'faq.q1': 'Czy moje wideo jest wysyłane na serwer?', 'faq.a1': 'Nie. Plik jest przetwarzany w pamięci przeglądarki za pomocą WebAssembly. Nie otrzymujemy jego zawartości.', 'faq.q2': 'Jakie formaty i rozdzielczości są obsługiwane?', 'faq.a2': 'Najlepiej działają MP4, MOV i WebM. Obsługiwane są 720p, 1080p, 2K i 4K, ale duże filmy wymagają więcej pamięci.', 'faq.q3': 'Dlaczego Web jest wolniejszy niż Local?', 'faq.a3': 'Przeglądarki izolują przetwarzanie i mają surowsze limity pamięci. Local używa natywnego FFmpeg i lepiej nadaje się do dużych plików.', 'faq.q4': 'Czy logo zniknie całkowicie niewidocznie?', 'faq.a4': 'Wynik zależy od tła, ruchu i rozmiaru logo. OpenCV i FFmpeg odbudowują zaznaczony obszar z sąsiednich pikseli; złożone ruchome tło lepiej obsługują tryby AI w Local.', 'faq.q5': 'Czy mogę usunąć każdy znak wodny?', 'faq.a5': 'Przetwarzaj tylko własne materiały lub filmy, na których edycję masz zgodę. Usuwanie cudzych oznaczeń autorstwa może naruszać prawa.', 'faq.q6': 'Czy mogę dodać planszę i dokładnie przyciąć film?', 'faq.a6': 'Tak. Dodaj JPG, PNG lub WebP na początku albo końcu, ustaw czas planszy i wpisz dokładny czas przycięcia w minutach i sekundach.',
  'runtime.fastCover': 'Szybkie dodawanie planszy…', 'runtime.fastCoverText': 'Kodujemy tylko obraz, a zgodne wideo i dźwięk kopiujemy bez utraty jakości.', 'runtime.fastCoverFallback': 'Włączamy tryb zgodności…',
  'footer.tagline': 'Prywatny edytor wideo działający na Twoim urządzeniu.', 'footer.privacy': 'Prywatność', 'footer.terms': 'Warunki', 'footer.rights': 'Wszelkie prawa zastrzeżone.',
  'runtime.invalidVideo': 'Wybierz plik MP4, MOV, WebM, MKV lub AVI.', 'runtime.tooLarge': 'Plik jest zbyt duży do niezawodnej pracy w przeglądarce. Dla wideo ponad 1,5 GB użyj LogoMend Local.', 'runtime.largeWarning': 'To duży plik i przeglądarce może zabraknąć pamięci. Dla długich lub 2K/4K nagrań zalecamy LogoMend Local. Kontynuować?', 'runtime.videoError': 'Przeglądarka nie może wyświetlić tego formatu. Spróbuj MP4 (H.264), MOV lub WebM.', 'runtime.rectangle': 'Obszar: {w} × {h} px · x {x}, y {y}', 'runtime.brush': 'Maska pędzla: {count} · {w} × {h} px', 'runtime.logoReady': 'Logo: {name}', 'runtime.coverReady': 'Plansza: {name}', 'runtime.invalidCover': 'Wybierz obraz JPG, PNG lub WebP.', 'runtime.engineLoading': 'Ładowanie FFmpeg WebAssembly…', 'runtime.engineLoaded': 'Silnik gotowy', 'runtime.engineCached': 'Kolejne uruchomienia będą szybsze', 'runtime.reading': 'Odczyt wideo do pamięci lokalnej…', 'runtime.processing': 'Przetwarzanie wideo…', 'runtime.finalizing': 'Przygotowanie pliku MP4…', 'runtime.failed': 'Sprawdź dostępną pamięć przeglądarki i spróbuj krótszego wideo.\n\nSzczegóły: {message}', 'runtime.delogoBrush': 'Szybki delogo obsługuje tylko prostokąt. Dla pędzla wybierz Inteligentne — FFmpeg lub OpenCV.', 'runtime.play': 'Odtwórz', 'runtime.pause': 'Pauza', 'runtime.drawBrush': 'Zamaluj tylko litery lub znak', 'runtime.drawRect': 'Przeciągnij ramkę nad logo', 'runtime.moveLogo': 'Przeciągnij logo w wybrane miejsce', 'runtime.coverStart': 'Obraz zostanie dodany na początku filmu', 'runtime.coverEnd': 'Obraz zostanie dodany na końcu filmu'
};

const de = {
  ...en,
  'nav.editor': 'Editor', 'nav.how': 'So funktioniert es', 'nav.faq': 'Fragen', 'header.private': 'Dateien bleiben auf Ihrem Gerät', 'header.language': 'Sprache',
  'hero.eyebrow': 'KOSTENLOS · DIREKT IM BROWSER', 'hero.title': 'Altes Logo entfernen.<br><em>Eigenes hinzufügen.</em>', 'hero.lead': 'Logos entfernen oder hinzufügen, Videos präzise kürzen und Intro- oder Outro-Bilder einfügen. Kostenlos und lokal im Browser.', 'hero.cta': 'Video bearbeiten', 'hero.local': 'lokale Verarbeitung',
  'app.title': 'Erstellen Sie eine saubere Videoversion', 'engine.waiting': 'Engine startbereit', 'engine.note': 'FFmpeg wird erst vor der Verarbeitung geladen',
  'upload.title': 'Video hier ablegen', 'upload.subtitle': 'oder klicken, um eine Datei auszuwählen', 'upload.privacyTitle': 'Datenschutz integriert', 'upload.privacyText': 'Die Datei wird nur von Ihrem Browser gelesen und nirgendwohin gesendet.',
  'tabs.remove': 'Entfernen', 'tabs.add': 'Logo hinzufügen', 'tabs.cover': 'Intro / Outro', 'remove.areaTitle': 'Bereich auswählen', 'remove.areaText': 'Arbeiten Sie mit einem pausierten Bild', 'remove.rectangle': '▭ Rechteck', 'remove.brush': '⌁ Pinsel', 'remove.brushSize': 'Pinselgröße', 'remove.undo': '↶ Rückgängig', 'remove.clear': 'Leeren', 'remove.empty': 'Noch kein Bereich ausgewählt',
  'remove.methodTitle': 'Methode wählen', 'remove.methodText': 'Lokale Modi zur Hintergrundrekonstruktion', 'method.smart': 'Intelligent — FFmpeg', 'method.smartText': 'Rekonstruiert den Hintergrund per Maske', 'method.delogo': 'Schnell — delogo', 'method.delogoText': 'Nur rechteckige Bereiche', 'method.opencv': 'OpenCV-Wiederherstellung', 'method.opencvText': 'Rekonstruiert jedes Bild · bis 15 Sekunden', 'remove.strength': 'Rekonstruktionsradius',
  'add.uploadTitle': 'Logo hochladen', 'add.uploadText': 'Transparentes PNG liefert das beste Ergebnis', 'add.choose': 'PNG, JPG oder WebP wählen', 'add.empty': 'Noch kein Logo ausgewählt', 'add.positionTitle': 'Im Bild platzieren', 'add.positionText': 'Ziehen Sie das Logo an die gewünschte Stelle', 'add.size': 'Größe', 'add.opacity': 'Deckkraft',
  'cover.uploadTitle': 'Bild hochladen', 'cover.uploadText': 'Für YouTube 16:9 verwenden · 1280×720 oder 1920×1080', 'cover.choose': 'JPG, PNG oder WebP wählen', 'cover.empty': 'Noch kein Bild ausgewählt', 'cover.positionTitle': 'Position wählen', 'cover.positionText': 'Bild vor oder nach dem Video einfügen', 'cover.start': 'Am Anfang', 'cover.end': 'Am Ende', 'cover.duration': 'Dauer', 'cover.seconds': '{value} s', 'cover.fitLabel': 'Bildanpassung', 'cover.fitCover': 'Rahmen füllen · Ränder können beschnitten werden', 'cover.fitContain': 'Ganzes Bild · Balken sind möglich',
  'export.title': 'Exportqualität', 'export.text': 'Die Originalauflösung bleibt erhalten', 'process.start': 'Video verarbeiten', 'process.note': 'Beim ersten Start lädt der Browser etwa 32 MB Engine-Dateien.',
  'trim.title': 'Video kürzen', 'trim.text': 'Anfang oder Ende entfernen', 'trim.start': 'Anfang', 'trim.end': 'Ende', 'trim.exactStart': 'Genauer Anfang', 'trim.exactEnd': 'Genaues Ende', 'trim.minutesShort': 'Min', 'trim.secondsShort': 'Sek', 'trim.duration': 'Ergebnisdauer', 'trim.reset': 'Zurücksetzen',
  'result.title': 'Ihr neues Video ist fertig', 'result.text': 'Prüfen Sie das Ergebnis und speichern Sie die MP4-Kopie.', 'result.nextTitle': 'Weiter bearbeiten?', 'result.nextText': 'Nutzen Sie das Ergebnis als neue Quelle: Logo, Intro-/Outro-Bild hinzufügen oder kürzen.', 'result.continue': 'Weiter bearbeiten', 'result.download': 'MP4 herunterladen', 'result.back': 'Diesen Schritt ändern', 'result.new': 'Anderes Video',
  'how.title': 'In drei Schritten zum Ergebnis', 'how.step1Title': 'Video hinzufügen', 'how.step1Text': 'Wählen Sie eine Datei. Sie wird nicht auf unseren Server hochgeladen.', 'how.step2Title': 'Logo markieren', 'how.step2Text': 'Malen Sie eine genaue Maske oder wählen Sie ein Rechteck.', 'how.step3Title': 'Ergebnis speichern', 'how.step3Text': 'Prüfen Sie das fertige Video und laden Sie die MP4-Datei herunter.',
  'ads.label': 'WERBUNG', 'ads.placeholder': 'Platz für responsive Google-AdSense-Werbung', 'app.eyebrow': 'VIDEOEDITOR', 'error.title': 'Videoverarbeitung fehlgeschlagen', 'error.back': 'Zurück', 'how.eyebrow': 'EINFACHER ABLAUF',
  'compare.eyebrow': 'ZWEI PRODUKTE', 'compare.title': 'Web für Komfort.<br>Local für maximale Leistung.', 'compare.text': 'Die Browser-Version eignet sich für kurze Videos und schnelle Korrekturen. Für lange 2K/4K-Dateien und STTN-KI-Wiederherstellung verwenden Sie LogoMend Local.', 'compare.web1': 'Keine Installation', 'compare.web2': 'Verarbeitung im Browser', 'compare.web3': 'Logos entfernen und hinzufügen, kürzen sowie Intro/Outro', 'compare.current': 'Sie sind hier', 'compare.local1': 'Für große Dateien', 'compare.local2': 'STTN- und Mehrbild-Modi', 'compare.local3': 'Schneller auf einem leistungsstarken PC', 'compare.download': 'Für Windows herunterladen →',
  'faq.eyebrow': 'HÄUFIG GESTELLTE FRAGEN', 'faq.title': 'Gut zu wissen', 'faq.q1': 'Wird mein Video auf einen Server hochgeladen?', 'faq.a1': 'Nein. Die Datei wird mit WebAssembly im Speicher Ihres Browsers verarbeitet. Wir erhalten ihren Inhalt nicht.', 'faq.q2': 'Welche Formate und Auflösungen werden unterstützt?', 'faq.a2': 'MP4, MOV und WebM funktionieren am besten. 720p, 1080p, 2K und 4K werden unterstützt, große Videos benötigen jedoch mehr Speicher.', 'faq.q3': 'Warum ist Web langsamer als Local?', 'faq.a3': 'Browser isolieren die Verarbeitung und haben strengere Speichergrenzen. Local verwendet natives FFmpeg und eignet sich besser für große Dateien.', 'faq.q4': 'Verschwindet das Logo vollkommen unauffällig?', 'faq.a4': 'Das Ergebnis hängt von Hintergrund, Bewegung und Logogröße ab. OpenCV und FFmpeg rekonstruieren den Bereich aus benachbarten Pixeln; komplexe bewegte Hintergründe sind für die KI-Modi von Local besser geeignet.', 'faq.q5': 'Kann ich jedes Wasserzeichen entfernen?', 'faq.a5': 'Bearbeiten Sie nur eigenes Material oder Videos, für deren Bearbeitung Sie eine Erlaubnis haben. Das Entfernen fremder Urheberkennzeichnungen kann Rechte verletzen.', 'faq.q6': 'Kann ich ein Intro oder Outro hinzufügen und genau kürzen?', 'faq.a6': 'Ja. Fügen Sie JPG, PNG oder WebP am Anfang oder Ende ein, wählen Sie die Dauer und geben Sie die genaue Schnittzeit in Minuten und Sekunden ein.',
  'runtime.fastCover': 'Intro/Outro wird schnell eingefügt…', 'runtime.fastCoverText': 'Nur das Bild wird codiert; kompatibles Video und Audio werden ohne Qualitätsverlust kopiert.', 'runtime.fastCoverFallback': 'Kompatibilitätsmodus wird aktiviert…',
  'footer.tagline': 'Ein privater Videoeditor, der auf Ihrem Gerät läuft.', 'footer.privacy': 'Datenschutz', 'footer.terms': 'Bedingungen', 'footer.rights': 'Alle Rechte vorbehalten.',
  'runtime.invalidVideo': 'Wählen Sie eine MP4-, MOV-, WebM-, MKV- oder AVI-Datei.', 'runtime.tooLarge': 'Die Datei ist für eine zuverlässige Browser-Verarbeitung zu groß. Nutzen Sie LogoMend Local für Videos über 1,5 GB.', 'runtime.largeWarning': 'Diese Datei ist groß und der Browser könnte zu wenig Speicher haben. Für lange oder 2K/4K-Videos empfehlen wir LogoMend Local. Fortfahren?', 'runtime.videoError': 'Ihr Browser kann dieses Format nicht anzeigen. Versuchen Sie MP4 (H.264), MOV oder WebM.', 'runtime.rectangle': 'Bereich: {w} × {h} px · x {x}, y {y}', 'runtime.brush': 'Pinselmaske: {count} Strich(e) · {w} × {h} px', 'runtime.logoReady': 'Logo: {name}', 'runtime.coverReady': 'Intro-/Outro-Bild: {name}', 'runtime.invalidCover': 'Wählen Sie ein JPG-, PNG- oder WebP-Bild.', 'runtime.engineLoading': 'FFmpeg WebAssembly wird geladen…', 'runtime.engineLoaded': 'Engine bereit', 'runtime.engineCached': 'Weitere Starts werden schneller', 'runtime.reading': 'Video wird in den lokalen Speicher gelesen…', 'runtime.processing': 'Video wird verarbeitet…', 'runtime.finalizing': 'MP4-Download wird vorbereitet…', 'runtime.failed': 'Prüfen Sie den verfügbaren Browserspeicher und versuchen Sie ein kürzeres Video.\n\nDetails: {message}', 'runtime.delogoBrush': 'Schnelles delogo unterstützt nur Rechtecke. Für Pinselmasken wählen Sie Intelligent — FFmpeg oder OpenCV.', 'runtime.play': 'Abspielen', 'runtime.pause': 'Pause', 'runtime.drawBrush': 'Nur Buchstaben oder Symbol übermalen', 'runtime.drawRect': 'Rechteck über das Logo ziehen', 'runtime.moveLogo': 'Logo an die gewünschte Stelle ziehen', 'runtime.coverStart': 'Das Bild wird am Anfang eingefügt', 'runtime.coverEnd': 'Das Bild wird am Ende eingefügt'
};

export const dictionaries = { uk, en, pl, de };

export function languageFromPage() {
  const declared = document.documentElement.lang?.slice(0, 2);
  return dictionaries[declared] ? declared : 'uk';
}

export function createTranslator(language) {
  return (key, vars = {}) => {
    const value = dictionaries[language]?.[key] ?? dictionaries.en[key] ?? uk[key] ?? key;
    return Object.entries(vars).reduce((text, [name, replacement]) => text.replaceAll(`{${name}}`, String(replacement)), value);
  };
}

export function applyTranslations(language) {
  const t = createTranslator(language);
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const value = dictionaries[language]?.[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    const value = dictionaries[language]?.[element.dataset.i18n];
    if (value) element.innerHTML = value;
  });
  return t;
}
