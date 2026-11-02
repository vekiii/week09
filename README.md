# Week09 — pouzdanost servisa korisničke podrške

Rad u paru: **ti i Milan**. Cilj je jedna istražena korekcija izbora izvora u `policy` putanji, uz stvarne dokaze pre/posle i obrazloženu preporuku za simuliranu upotrebu. Planirano trajanje je **220 minuta rada para** (oko 3 h 40 min, uključujući čitanje), naizmenično prema dostupnosti.

## Materijali i trenutno stanje

- Kursni `weekly-assignment.md` je glavni izvor zahteva; lokalna kopija je ignorisana i ne isporučuje se kroz ovaj repo.
- [Beleška para](evidence-template.md) popunjava se tokom rada i dopunjuje u sredu.
- Kursni `nedelja-09-prethodno-citanje.pdf` je lokalni prateći materijal, ignorisan u ovom repozitorijumu. Milan preuzima svoju kopiju iz kursa.
- [Starter aplikacija](support-reliability-lab/README.md) sadrži CLI, bez UI-ja i bez živog LLM-a.
- [Izvor](support-reliability-lab/src/app.ts), [osnovni testovi](support-reliability-lab/tests/app.test.mjs), [javni podaci](support-reliability-lab/data/lab.json) i [skripte](support-reliability-lab/scripts/run.mjs) čine eksperiment.

Prilikom pripreme ovog plana pregledani su tekstualni materijali, izvor, testovi, podaci, konfiguracija i skripte. PDF nije tekstualno pročitan: u lokalnom okruženju nije dostupan PDF ekstraktor. Linkovi iz zadatka ka `pre-reading.md`, `session-material.md` i kursnim arhivama ne postoje na navedenim lokalnim putanjama; za dodatne materijale koristite kursni kanal.

**Korak 1 — priprema završen 2. novembra 2026.** Node `v24.20.0` i npm `11.19.0` odgovaraju zahtevima. Početni commit je `4fde52c33237ff800510fc57bbd0ee14d5ddd46f` (`project init`); praćeni fajlovi aplikacije odgovaraju tom commitu.

Iz direktorijuma aplikacije uspešno su izvršene sledeće provere:

| Provera | Stvarni rezultat |
| --- | --- |
| `npm.cmd ci --ignore-scripts --no-audit --no-fund --cache "$env:TEMP/week09-npm-cache" --fetch-retries=0` | Instaliran zaključani TypeScript 5.9.2; izlazni kod 0. |
| `npm.cmd run typecheck` | Provera tipova prošla; izlazni kod 0. |
| `npm.cmd test` | Build uspešan; 3 testa prošla, 0 neuspešnih, 0 preskočenih; izlazni kod 0. |

Offline instalacija prethodno nije uspela jer paket nije bio keširan (`ENOTCACHED`). Preuzimanje u sandboxu bilo je blokirano (`EACCES`); ponovljena instalacija sa odobrenim mrežnim pristupom uspela je. Npm keš je u privremenom direktorijumu, a `node_modules/` i `dist/` su ignorisani. Izvor, postojeći testovi, javni podaci, konfiguracija, lockfile i skripte nisu menjani.

**Korak 2 — provera CLI odgovora završen 2. novembra 2026.** Iz direktorijuma aplikacije izvršene su komande `npm.cmd start -- shipping`, `npm.cmd start -- refund`, `npm.cmd start -- legacy` i `npm.cmd start -- unknown`. Svaka je uspešno izgradila aplikaciju i završila kodom 0. Odgovori su upoređeni sa dokumentima i javnim kriterijumima u `data/lab.json`:

| Tema | Stvarni odgovor i citat | Zaključak prema ugovoru |
| --- | --- | --- |
| `shipping` | `ok`; `Policy: Shipping takes 3 days.`; `shipping-current`, revizija 1 | Prihvatljivo: izvor je aktivan i odgovara temi. |
| `refund` | `ok`; `Policy: Refund period: 30 days.`; `refund-old`, revizija 1 | Neprihvatljivo: izabrani izvor je arhiviran. Aktivan `refund-current`, revizija 2, zahteva odgovor `Policy: Refund period: 14 days.` i citat `refund-current`. |
| `legacy` | `ok`; `Policy: Legacy service is available.`; `legacy-old`, revizija 1 | Neprihvatljivo: postoji samo arhivirani izvor. Potreban je `refused`, bez poziva modelu. |
| `unknown` | `refused`; `Nema odgovarajućeg izvora.`; bez citata | Prihvatljivo: nema izvora za temu. Trag sadrži samo odgovor `refused`, bez modelskog događaja. |

Za shipping, refund i legacy trag prikazuje izbor navedenog izvora, zatim `model: returned` i `response: ok`. Stanje izvora nije zapisano u tragu; provereno je u javnim podacima preko ID-ja i revizije. CLI kod 0 potvrđuje uspešno izvršavanje procesa, ali ne ocenjuje poslovnu ispravnost: refund i legacy krše ugovor uprkos uspešnom izvršavanju.

**Korak 3 — početna merenja završena 2. novembra 2026.** Pre izmene aplikacije i dodavanja testa izvršene su obe komande:

| Merenje | Stvarni rezultat | Sačuvani izveštaj |
| --- | --- | --- |
| `npm.cmd run evaluate` | 2/4; izlazni kod 1 | [Početna evaluacija](support-reliability-lab/runs/evaluate-661dd773-f065-4c0e-b998-2e7b39a2614d/report.json) |
| `npm.cmd run regression` | 5/7; izlazni kod 1 | [Početna regresija](support-reliability-lab/runs/regression-18f208fa-086a-4bcc-b02f-5cd089fd3469/report.json) |

U oba skupa padaju `refund` (tekst i citat) i `legacy` (status i broj poziva modelu). `shipping` i `unsupported` prolaze; u regresionom skupu prolaze i `active-account`, `suspended-account` i `invalid`. Kod 1 ovde označava stvarne neuspešne kriterijume, uz uspešan build i generisane izveštaje.

Provereno je da oba direktorijuma sadrže `report.json`, `summary.md` i sve pripadajuće tragove (4 za evaluaciju, 7 za regresiju), i da se izdvojeni tragovi podudaraju sa tragovima u izveštajima. Oba merenja beleže commit `138d162118906c7516e2bc27f6bdef0a5b40daa4` (`Step 2`), sa čistim Git stanjem u trenutku izvršavanja. Otisci izvora, build-a, podataka, skripti, testova, alata i konfiguracija podudaraju se između ova dva merenja. Aplikacioni fajlovi i dalje odgovaraju početnom starteru.

Ova dva direktorijuma dokaza sačuvana su u commitu `f6b48e1` (`Step 3`), uprkos opštem ignorisanju `runs/`. Ne prepisivati niti brisati početne izveštaje. Završna merenja još nisu izvršena; 4/4 i 7/7 ostaju očekivanja za kasniju korekciju.

Za nastavak u novom PowerShell terminalu, iz direktorijuma aplikacije, početne putanje možete ponovo postaviti ovako:

```powershell
$preEval = 'runs/evaluate-661dd773-f065-4c0e-b998-2e7b39a2614d'
$preReg = 'runs/regression-18f208fa-086a-4bcc-b02f-5cd089fd3469'
```

**Korak 4 — istraga početnog rezultata završena 2. novembra 2026.** Pregledani su sažetak, stavka `results` sa `id: refund` u početnom izveštaju, izdvojeni trag, javni podaci, policy grana i evaluator. Ovo je analiza već sačuvanog izvršavanja, bez novog evaluacionog pokretanja.

- **Opažanje:** zahtev je `{ "kind": "policy", "topic": "refund" }`. Odgovor je `ok`, navodi 30 dana i citira `refund-old`. Trag pokazuje izbor `refund-old`, reviziju 1, zatim vraćen modelski odgovor i status `ok`; izveštaj beleži `modelCalls: 1` i `lookupCalls: 0`. Provera statusa prolazi, ali provere teksta i citata padaju, pa je `passed: false`.
- **Veza sa ugovorom:** u tragu nema `state`; ID i revizija povezani su sa `data/lab.json`, gde je taj dokument arhiviran. Aktivan `refund-current`, revizija 2, iste teme propisuje 14 dana. Citat potvrđuje koji izvor je upotrebljen, ali prisustvo citata ne potvrđuje da je taj izvor prihvatljiv.
- **Uzrok potkrepljen kodom i hipoteza korekcije:** `src/app.ts`, linija 57, koristi `find(document => document.topic === request.topic)` i bira prvi dokument iste teme bez uslova za `state`. Arhivirani refund dokument je prvi u nizu. Trag sam ne objašnjava algoritam; tek povezivanje sa kodom objašnjava ovaj izbor. Kontrolisana modelska funkcija u `scripts/evidence.mjs` samo dodaje `Policy: ` tekstu izabranog dokumenta. Podaci zato podržavaju propust izbora izvora; nema osnova da ga pripišemo halucinaciji živog modela ili promptu. Hipoteza je da izbor aktivnog izvora iste teme, uz odbijanje kada takvog izvora nema, rešava refund i legacy. Efekat korekcije tek treba dokazati testom i poređenjem.
- **Kritika ocene:** `weakCheck: true` znači samo da odgovor nije prazan (`actual.text.length > 0`); ta provera ne meri važenje izvora, rok ni ispravnost citata. `recordedJudge.score: 0.95` sa obrazloženjem `Fluent and specific answer.` preuzet je iz javnog JSON-a prema tekstu odgovora. Poreklo `authored-synthetic-example-not-a-real-model-run` označava autorsku ilustraciju. Ispravan odgovor u istim podacima ima ilustrativnu ocenu 0.92. Ove ocene ne podržavaju naš kriterijum prihvatanja i nisu merenje pristrasnosti stvarnog modela; dokaz protiv prihvatanja su arhivirano stanje izvora, pogrešan rok i pali kriterijumi.

Na vrhu izveštaja `runId` i `createdAt` identifikuju izvršavanje, `node` okruženje, a `git` commit i tadašnje stanje radne kopije. `source`, `built`, `data`, `scripts`, `tests` i `toolchain` sadrže otiske fajlova; `config` beleži postavke simulacije. U ovom koraku svih 11 zabeleženih otisaka provereno je prema sadašnjim fajlovima, uz podudaranje konfiguracije i refund traga sa `actual.trace`. Polje `trace` u rezultatu je relativna putanja do izdvojenog traga. Otisci identifikuju sadržaj, ali nisu dokaz ispravnosti niti zaštita od proizvoljnog menjanja svih dokaza.

Posle korekcije očekuju se promenjeni izvor, build i skup testova, kao i novi ID i vreme izvršavanja. Javni podaci, konfiguracija, evaluator i alati ostaju isti radi kontrolisanog poređenja. Detaljno tumačenje sa referencama uneto je u [belešku para](evidence-template.md). Sledeći je **korak 5: mali opis promene i kriterijumi prihvatanja pre implementacije**.

Za kontrolnu tačku pripreme oba člana treba da razumeju: uspešno pokretanje potvrđuje da se proces izvršio, prolaz tri osnovna testa potvrđuje samo njihove provere, dok se prihvatljivost odgovora proverava posebnim kriterijumima i evaluacijom. Tri prolaza nisu potvrda spremnosti za izdanje.

## Granica promene i hipoteza

`answer()` trenutno bira prvi dokument iste teme pomoću `find`, bez provere `state`. U javnim podacima arhivirani `refund-old` prethodi aktivnom `refund-current`. Hipoteza je da izbor samo aktivnog dokumenta odgovarajuće teme rešava i pogrešan refund odgovor i neprihvatljiv legacy odgovor. To treba potvrditi tragovima i testovima pre prihvatanja izmene.

Kriterijumi prihvatanja:

- Odgovor koristi aktivan izvor iste teme, njegov tekst i njegov ID kao citat.
- Arhivirani izvor ne dobija prednost zbog položaja u nizu.
- Bez aktivnog izvora vraća se `refused`, bez poziva modelu.
- Ispravno shipping ponašanje, odbijanje nepoznate teme i postojeći regresioni slučajevi ostaju očuvani.

Implementaciona granica: minimalna izmena u `support-reliability-lab/src/app.ts` i novi `tests/source-eligibility.test.mjs`. Ne menjati javni `data/lab.json`, postojeće testove, konfiguraciju, evaluator ili account putanju. Ne uređivati generisani `dist/`. Ne dodavati UI, bazu, API ključ ili novi model.

## Plan rada i organizacija

Radimo naizmenično, ko kada stigne, bez unapred dodeljenih koraka i obaveznog istovremenog rada. Sledeći dostupni član nastavlja od poslednjeg završenog koraka, uz očuvanje redosleda eksperimenta: početni dokazi, novi test koji pada, korekcija, završni dokazi i poređenje.

Pre nastavka pregledamo poslednje commitove i belešku. Po završetku celine pravimo jasan commit i ostavljamo kratak zapis šta je urađeno, gde su dokazi i šta je sledeće. Putanje dokaza čuvamo u belešci jer promenljive iz terminala nisu dostupne drugom članu; lokalni ignorisani dokazi moraju biti preneti dogovorenim kanalom ili eksplicitno dodati u Git.

Na kraju doprinos svakog člana zapisujemo na osnovu sadržaja naših commitova i usmenog dogovora, uključujući pregled, analizu i lično proverene rezultate. Broj commitova sam po sebi ne predstavlja doprinos. Oboje treba da razumeju prihvaćenu korekciju; ko vodi završni prikaz dogovaramo naknadno.

| Korak | Okvirno vreme | Konkretan izlaz |
| --- | --- | --- |
| 1. Priprema | 20 min | Instalacija, typecheck, 3 osnovna testa; zabeležen početni commit pre novog testa i izmene aplikacije. |
| 2. Ručna provera | 20 min | Pokrenuti shipping, refund, legacy i unknown; razlikovati kod procesa od ispravnosti odgovora. |
| 3. Početno merenje | 25 min | Stvarni evaluate i regression direktorijumi; očekivano 2/4 i 5/7. Sačuvati obe putanje. |
| 4. Istraga | 40 min | Povezati refund zahtev, trag, ID/reviziju izvora, stanje u podacima, odgovor i pali kriterijum; zapisati opažanje odvojeno od hipoteze. |
| 5. Specifikacija | 15 min | Popuniti „Promena i hipoteza” u belešci pre izmene koda; potvrditi granice i kriterijume. |
| 6. Test pa korekcija | 55 min | Novi test sa sopstvenom temom, dokaz assertion pada na starom kodu, minimalna korekcija, typecheck i prolaz svih testova. |
| 7. Kontrolisano poređenje | 25 min | Novi evaluate/regression, očekivano 4/4 i 7/7; dva poređenja istih skupova i pregled završnih tragova. |
| 8. Preporuka i predaja | 20 min | Završena beleška, ograničenja, signal za praćenje, doprinosi prema commitovima i usmenom dogovoru i provereni prilozi. |

Za novi test izaberite temu različitu od refund, npr. `returns-window`, sa različitim tekstovima i ID-jevima: arhivirani dokument prvi, aktivni drugi. Uvezite stvarni `answer` iz `../dist/app.js`; eksplicitno proverite status, tekst i citat. Dodajte i proveru samo arhiviranog izvora sa brojačem koji potvrđuje nula modelskih poziva. Sintetički dokumenti pripadaju novom testu, ne javnom JSON-u.

## Komande za PowerShell

Iz root direktorijuma pređite u aplikaciju. U ovom okruženju koristite `npm.cmd`, jer PowerShell blokira `npm.ps1`; promena execution policy nije potrebna.

```powershell
Set-Location .\support-reliability-lab
node --version
npm.cmd ci --ignore-scripts --no-audit --no-fund
npm.cmd run typecheck
npm.cmd test
npm.cmd start -- shipping
npm.cmd start -- refund
npm.cmd start -- legacy
npm.cmd start -- unknown
```

Ako je zaključani TypeScript već u npm kešu, instalacija može koristiti `--offline`. Neuspešna instalacija/build je problem pripreme; ne tumačiti ga kao očekivani poslovni propust.

Početni commit startera je `4fde52c33237ff800510fc57bbd0ee14d5ddd46f` (`project init`). Priprema i prethodne dokumentacione izmene sačuvane su u commitu `80267a7` (`Step 1`). Proverite `git status --short` i `git diff --cached` pre narednog commita. Završni commit zabeležite nakon korekcije aplikacije.

Početna merenja izvršite pre dodavanja novog testa i promene aplikacije:

```powershell
$preEvalLog = @(npm.cmd run evaluate)
$preEvalExit = $LASTEXITCODE
$preEvalLog
$preEval = ($preEvalLog | Select-String '; evidence: ' | Select-Object -Last 1).Line -replace '^.*; evidence: ', ''
if (-not $preEval -or -not (Test-Path -LiteralPath "$preEval/report.json")) { throw 'Nedostaje početni evaluate izveštaj.' }

$preRegLog = @(npm.cmd run regression)
$preRegExit = $LASTEXITCODE
$preRegLog
$preReg = ($preRegLog | Select-String '; evidence: ' | Select-Object -Last 1).Line -replace '^.*; evidence: ', ''
if (-not $preReg -or -not (Test-Path -LiteralPath "$preReg/report.json")) { throw 'Nedostaje početni regression izveštaj.' }
```

Očekivani početni izlazni kod za oba merenja je 1, uz stvarne izveštaje. Otvorite `summary.md`, `report.json` i `traces/refund.json` iz `$preEval`. Trag ne sadrži stanje izvora: povežite ID i reviziju sa `data/lab.json`. Sačuvajte putanje u belešku; promenljive važe samo u tekućem terminalu.

Posle dodavanja novog testa, a **pre korekcije aplikacije**:

```powershell
npm.cmd run build
# Nastaviti samo ako je build uspešan.
node --test tests/source-eligibility.test.mjs > test-before.txt 2>&1
Get-Content test-before.txt
```

Potvrdite da je test izvršen i pada zbog pogrešnog izvora/teksta/citata, a ne zbog sintakse ili uvoza. Tek zatim promenite izvor i pregledajte diff i novi test.

```powershell
npm.cmd run typecheck
npm.cmd test
node --test tests/source-eligibility.test.mjs > test-after.txt 2>&1
Get-Content test-after.txt
```

Nakon uspešnih provera generišite završne dokaze:

```powershell
$postEvalLog = @(npm.cmd run evaluate)
$postEvalExit = $LASTEXITCODE
$postEvalLog
$postEval = ($postEvalLog | Select-String '; evidence: ' | Select-Object -Last 1).Line -replace '^.*; evidence: ', ''
if (-not $postEval -or -not (Test-Path -LiteralPath "$postEval/report.json")) { throw 'Nedostaje završni evaluate izveštaj.' }

$postRegLog = @(npm.cmd run regression)
$postRegExit = $LASTEXITCODE
$postRegLog
$postReg = ($postRegLog | Select-String '; evidence: ' | Select-Object -Last 1).Line -replace '^.*; evidence: ', ''
if (-not $postReg -or -not (Test-Path -LiteralPath "$postReg/report.json")) { throw 'Nedostaje završni regression izveštaj.' }

npm.cmd run compare -- "$preEval/report.json" "$postEval/report.json"
npm.cmd run compare -- "$preReg/report.json" "$postReg/report.json"
```

Očekuju se završni izlazni kodovi 0. `compare` mora porediti evaluate sa evaluate i regression sa regression, uz iste podatke, konfiguraciju, skripte i slučajeve. Za završni refund proverite `refund-current`, reviziju 2; za legacy proverite `refused` i `modelCalls: 0`. Ako rezultat odstupa, sačuvajte ga i navedite šta nije potvrđeno.

## Tumačenje i preporuka

U belešci objasnite zašto neprazan odgovor (`weakCheck`) i ilustrativna ocena 0.95 ne potvrđuju važeći izvor. `recordedJudge` je autorski sintetički primer, ne stvarno merenje LLM-a. Codex-ov predlog koda i testa nije nezavisni dokaz: uporedite očekivanja sa ugovorom, proverite stvarni pad/prolaz novog testa i neizmenjeni javni skup.

Preporuku donesite iz ostvarenih rezultata. Poznati rizik nepoznatog naloga ostaje van obavezne korekcije i van javnih sedam slučajeva; 7/7 ne opravdava izdavanje celog servisa. Eventualno ograničenje na policy putanju mora biti stvarno sprovodivo. U suprotnom je „ne izdati” opravdana preporuka. Kontrolisana modelska zamena i mali skup ne dokazuju pouzdanost živog modela ili produkcije.

Predlog signala za simulaciju: proveravati svaki policy citat prema sačuvanom korpusu važećem u trenutku odgovora. Jedan citat arhiviranog/nepostojećeg izvora pokreće obustavu policy simulacije; dogovoreni član para istražuje trag i verziju korpusa. Nastavak tek nakon otklanjanja uzroka i ponovljenih ciljnih i regresionih provera. Ovo je predlog procesa, bez implementacije infrastrukture.

## Kontrolna lista predaje

- [ ] Izmenjeni `src/app.ts` i novi `tests/source-eligibility.test.mjs`.
- [ ] Početni i završni commit, ili tačno objašnjenje nedostajućih metapodataka.
- [ ] Četiri stvarna run direktorijuma: pre/posle za evaluate i regression, svaki sa izveštajem, sažetkom i tragovima.
- [ ] `test-before.txt` i `test-after.txt` za isti dodatni test.
- [ ] Popunjen `evidence-template.md`, sa putanjama dokaza, tumačenjem, AI pomoći, doprinosom oba člana, preporukom i signalom.
- [ ] Proveren sadržaj predaje: bez `node_modules/`, generisanog `dist/`, tajni i stvarnih korisničkih podataka.

Ugnježdeni `.gitignore` već isključuje `support-reliability-lab/runs/` i ZIP arhive. Root `.gitignore` čuva ta pravila i ostavlja test-before/test-after izlaze dostupnim za Git. Ako dokaze predajete kroz Git, iz direktorijuma aplikacije dodajte **samo četiri izabrana direktorijuma** komandom `git add -f -- runs/STVARNO-IME` za svaki, pa proverite staged sadržaj. Alternativno ih predajte zasebnim arhivom potvrđenim kanalom. Sam commit koda nije zamena za dokaze.

Pre predaje dogovorite ko ove nedelje vodi prikaz i potvrdite rok i kanal predaje u kursu; zadatak ne navodi konkretan termin. U sredu dopunite istu belešku tutorovom nezavisnom proverom, incidentom i revidiranom preporukom, bez obaveznog novog programiranja.
