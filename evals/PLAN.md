# Plan testów – site-mechanic 3.2 (iteracja 3)

## Cel

1. **Brak regresji:** wersja 3.2 (angielska, odchudzona, z nowymi sekcjami) przechodzi stare przypadki co najmniej tak dobrze jak 2.6 (polska).
2. **Nowe funkcje działają:** przeszukiwanie kodu pod kątem slopu i sekcja „Do usunięcia”, nowe sygnały z poziomem „Niski”, reguła „zachowaj konwencje”, uczciwy projekt sprzedaży (J2, w tym DFA), psychologia perswazji (J3), raport w języku zadania.
3. **Koszt:** porównanie tokenów i czasu 3.2 z 2.6 i z modelem bez skilla.

## Konfiguracje

| Kod | Co | Przypadki |
|---|---|---|
| **A** | skill 3.2 | wszystkie 14 |
| **B** | bez skilla (sam model) | wszystkie 14 |
| **C** | skill 2.6 (polski) | 8 starych |

Razem **36 przebiegów**, po jednym na konfigurację. Drugi przebieg tylko tam, gdzie A i C różnią się wynikiem albo A nie zdał kryterium – żeby odróżnić błąd skilla od losowości.

## Przypadki

| # | Przypadek | Co sprawdza | Kryteria | Typ |
|---|---|---|---|---|
| 1 | slop-saas-landing | klaster „Generyczny SaaS”, fałszywe dowody P0, limit 12, „Do usunięcia”, przeszukiwanie kodu | 9 | regresja + 3.2 |
| 2 | brand-file-cream-serif | plik marki ma pierwszeństwo, kontrast mimo marki | 4 | regresja |
| 3 | tokens-not-brand | tokeny w kodzie ≠ marka | 2 | regresja |
| 4 | clean-page-no-false-positives | brak wymyślonych problemów | 5 | regresja |
| 5 | p0-security-seo | tryb Szybki, P0, tylko pasywnie | 5 | regresja |
| 6 | mobile-first-basics | warstwa K, brak dubli z B | 6 | regresja |
| 7 | improve-mode-polish-page | tryb Ulepszanie: plan, kopia, bez wymyślania | 4 | regresja |
| 8 | plain-language-pl | prosty język, ukryty koszt, regulamin | 4 | regresja |
| 9 | dark-patterns-shop | J2: 9 wzorców, DFA jako projekt, bez werdyktów prawnych | 9 | nowy |
| 10 | b2b-no-j2 | J2 pominięte dla B2B, J1 nadal sprawdzane | 4 | nowy |
| 11 | persuasion-honest-vs-fake | J3: wabik i zawstydzanie zgłoszone, uczciwe elementy nie; brak taktyk w zaleceniach | 6 | nowy |
| 12 | new-slop-signals | strzałki, iskierki, dithering („Niski”), tiki słowne, „Do usunięcia”, limit 12 | 8 | nowy |
| 13 | keep-conventions | usuwa ozdobniki, nie łamie konwencji układu | 5 | nowy |
| 14 | english-report | raport po angielsku, te same kluczowe ustalenia | 6 | nowy |

Razem 77 kryteriów (A, B), 39 dla C.

## Przebieg

1. **Przygotowanie**
   - Migawki skilli: `sm-snapshots/v3.2/site-mechanic` (A) i `sm-snapshots/v2.6-pl` (C).
   - Katalog roboczy: `iteration-3/<przypadek>/<A|B|C>/{inputs,outputs}`; do `inputs/` kopiujemy `files/` przypadku.
2. **Partie po 4 przebiegi** (limit równoległości), w kolejności: najpierw nowe przypadki w A, potem stare w A i C, na końcu B.
3. **Każdy przebieg** dostaje polecenie wykonawcy (niżej). Po zakończeniu zapisujemy `transcript.md` (pełna odpowiedź i lista użytych narzędzi) oraz `timing.json` (tokeny, czas).
4. **Ocena na ślepo:** oceniający nie wie, która to konfiguracja. Dostaje kryteria przypadku, odpowiedź i ślad narzędzi, a zwraca `grading.json` (format niżej).
5. **Zestawienie:** zdawalność per konfiguracja i per przypadek, tokeny i czas (średnia), lista kryteriów, w których A < C.

## Kryteria sukcesu

- **Regresja:** A zdaje ≥ tyle kryteriów co C na 8 starych przypadkach. Każde kryterium, które C zdał, a A nie – do analizy przed wydaniem.
- **Nowe funkcje:** A zdaje ≥ 90% kryteriów przypadków 9–14.
- **Zasady stałe:** w żadnym przebiegu A nie ma oceny punktowej, zgadywania autorstwa, werdyktu prawnego ani wymyślonych treści (każde takie naruszenie = błąd krytyczny).
- **Przewaga nad B:** różnica A − B ≥ 20 punktów procentowych.
- **Koszt:** tokeny A ≤ tokeny C (oczekiwany spadek dzięki odchudzeniu instrukcji).

## Ograniczenia

- Jeden przebieg na konfigurację – wyniki pokazują kierunek, nie pewność statystyczną.
- Oceniający to model; ręcznie sprawdzamy wszystkie kryteria oznaczone jako niezdane i losowe 10% zdanych.
- Strony testowe są małe i celowo przerysowane; nie mówią nic o skuteczności na dużych serwisach.
- Przypadki z Chrome (K, axe-browser) zależą od dostępności przeglądarki w środowisku; jej brak trzeba odnotować, a nie liczyć jako błąd skilla.

---

## Polecenie wykonawcy

Wstaw: `{ZADANIE}` z `prompt.md`, `{KATALOG}` = `iteration-3/<przypadek>/<konfiguracja>`, `{SKILL}` = ścieżka migawki.

**A i C (ze skillem):**

```text
Masz do dyspozycji skill „site-mechanic” w {SKILL}. Zacznij od przeczytania jego SKILL.md i postępuj według niego (pliki z references/, assets/ i scripts/ czytaj i uruchamiaj tak, jak skill wskazuje).

Zadanie użytkownika: „{ZADANIE}”

Pliki od użytkownika są w {KATALOG}/inputs/ – nie zmieniaj ich. Wszystko, co tworzysz (zmienione kopie, zrzuty, pliki pomocnicze), zapisuj w {KATALOG}/outputs/. Narzędzia instaluj w katalogach tymczasowych w /tmp.
Użytkownik jest niedostępny: nie zadawaj pytań, przyjmij najrozsądniejsze założenia i wypisz je w odpowiedzi.
Pełny raport dla użytkownika (w języku zadania, w markdown) zwróć jako treść swojej końcowej odpowiedzi – nie zapisuj go do pliku. Na końcu dopisz krótką notkę dla zlecającego: jakich narzędzi i skryptów użyłeś i co zapisałeś w outputs/.
```

**B (bez skilla):** to samo bez pierwszego akapitu.

## Polecenie oceniającego

```text
Oceniasz odpowiedź asystenta na zadanie audytu strony. Nie wiesz, jakiej konfiguracji użyto – oceniaj tylko to, co jest w materiale.

Materiał:
- zadanie użytkownika: {ZADANIE}
- pliki wejściowe: {KATALOG}/inputs/
- odpowiedź asystenta i ślad narzędzi: {KATALOG}/transcript.md
- pliki wynikowe: {KATALOG}/outputs/

Kryteria (każde oceniasz osobno, zero-jedynkowo):
{LISTA KRYTERIÓW Z graders/*.md}

Zasady:
- Kryterium jest zdane tylko wtedy, gdy w materiale jest na to konkretny dowód. Brak dowodu = niezdane.
- Nazwy sekcji mogą być przetłumaczone lub równoważne – liczy się treść.
- Nie dawaj punktów za intencję ani za rzeczy podobne.

Zwróć wyłącznie JSON:
{"case": "<przypadek>", "expectations": [{"text": "<kryterium>", "passed": true|false, "evidence": "<cytat lub miejsce w materiale, max 2 zdania>"}]}
```

## Kolejność partii

| Partia | Przebiegi |
|---|---|
| 1 | A: dark-patterns-shop, b2b-no-j2, persuasion-honest-vs-fake, new-slop-signals |
| 2 | A: keep-conventions, english-report, slop-saas-landing, brand-file-cream-serif |
| 3 | A: tokens-not-brand, clean-page, p0-security-seo, mobile-first-basics |
| 4 | A: improve-mode, plain-language-pl; C: slop-saas-landing, brand-file-cream-serif |
| 5 | C: tokens-not-brand, clean-page, p0-security-seo, mobile-first-basics |
| 6 | C: improve-mode, plain-language-pl; B: dark-patterns-shop, b2b-no-j2 |
| 7–9 | B: pozostałe 12 |
| 10 | ocena wszystkich 36 przebiegów (partie po 6) |
