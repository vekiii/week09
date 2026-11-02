**Kratka beleška para: Nedelja 9**

# Tumačenje dokaza i preporuka izdanja

Priložite automatske `report.json`, `summary.md` i direktorijume tragova. Ne prepisujte metapodatke, hash-eve ili rezultate po slučaju. Popunite samo naredne odeljke kratkim odgovorima. Dokaz i kratko objašnjenje dopunjuju se, ne dupliraju.

## Promena i hipoteza

- Članovi para i ko ove nedelje vodi prikaz:
- Polazni/završni commit i putanje generisanih početnih/završnih izveštaja: starter `4fde52c33237ff800510fc57bbd0ee14d5ddd46f` (`project init`); početna merenja izvršena na commitu `138d162118906c7516e2bc27f6bdef0a5b40daa4` (`Step 2`), uz čisto Git stanje i isti aplikacioni sadržaj. Sačuvani su [početna evaluacija](support-reliability-lab/runs/evaluate-661dd773-f065-4c0e-b998-2e7b39a2614d/report.json) i [početna regresija](support-reliability-lab/runs/regression-18f208fa-086a-4bcc-b02f-5cd089fd3469/report.json), sa sažecima i tragovima u istim direktorijumima. Završni commit korekcije i završna merenja još ne postoje. Detalji pripreme i početnih merenja su u README-u.
- Koji problem smo opazili, koji trag ga podržava i zašto smo očekivali da ova izmena pomogne: za policy temu refund odgovor navodi 30 dana i citira `refund-old`; [početni refund trag](support-reliability-lab/runs/evaluate-661dd773-f065-4c0e-b998-2e7b39a2614d/traces/refund.json) potvrđuje izvor i reviziju 1. Stanje povezujemo preko ID-ja i revizije sa [javnim podacima](support-reliability-lab/data/lab.json): izvor je arhiviran, a aktivni `refund-current`, revizija 2, zahteva 14 dana. Izveštaj zato odbacuje tekst i citat uprkos statusu `ok`; model je pozvan jednom, lookup nijednom. Trag pokazuje šta se dogodilo, a [kod](support-reliability-lab/src/app.ts), linija 57, objašnjava izbor: `find` proverava samo temu i uzima prvi dokument. Hipoteza je da uslov aktivnog stanja reši refund i omogući odbijanje legacy zahteva bez modela. Efekat još nije proveren korekcijom; modelska zamena samo prenosi tekst izabranog izvora, pa nema dokaza o halucinaciji živog LLM-a.
- Granica izmene i dodatna regresiona provera:
- Ime dodatnog testa, zašto je pao pre izmene i prošao posle; reference na `test-before.txt` / `test-after.txt`:

## Tumačenje, ne prepisivanje

- Koji konkretni slučaj se promenio i koji dokaz to pokazuje: još nema izmene aplikacije ni završenog poređenja pre/posle; trenutno je dokumentovan početni refund propust. Dopuniti nakon korekcije i završnih merenja.
- Šta kaže ceo regresioni skup; ima li pogoršanja ili neizvršene provere: početni regresioni skup potvrđuje oba policy propusta, uz prolaz ostalih policy provera, poznatih naloga i neispravnog zahteva. Oba početna skupa izvršena su u celosti. Još nema završnog merenja, pa ne tvrdimo poboljšanje niti odsustvo novih regresija. Nepoznat nalog nije obuhvaćen ovim javnim skupom.
- Sa kojom slabom/modelskom ocenom se slažemo ili ne slažemo i zašto: `weakCheck` tačno potvrđuje neprazan tekst, ali nije kriterijum prihvatljivosti izvora. Ocena 0.95 za tečan i konkretan refund odgovor ne opravdava prihvatanje: arhivirani izvor navodi 30 umesto važećih 14 dana, uz pogrešan citat prema ugovoru. `recordedJudge` je autorski sintetički primer (`authored-synthetic-example-not-a-real-model-run`), preuzet iz podataka, a ne stvaran poziv ocenjivaču. Ocena 0.92 za ispravan tekst takođe je ilustracija; razlika ne dokazuje pristrasnost stvarnog modela. Ugovor proveravamo aktivnim dokumentom i konkretnim palim proverama, ne visinom ove ocene.
- Šta Codex-ov kod/test/objašnjenje nije mogao nezavisno da potvrdi i kako smo proverili pretpostavku: Codex-ovo objašnjenje samo po sebi ne potvrđuje uzrok ili budući uspeh popravke. Dosadašnja analiza povezuje stvarno sačuvan rezultat i trag sa dokumentom po ID-ju/reviziji, kodom izbora izvora i implementacijom kontrolisane modelske funkcije i ocena. Provereno je svih 11 otisaka fajlova iz početnog izveštaja prema sadašnjim fajlovima i podudaranje konfiguracije; to potvrđuje identitet sadržaja, ne njegovu ispravnost. Budući efekat korekcije još zahteva pad/prolaz dodatnog testa i ponavljanje neizmenjenih javnih skupova. Lični pregled članova para ne zamenjujemo Codex-ovim zaključkom.

## Preporuka i ograničenja

- Definisana simulirana upotreba; izdati / ograničiti / ne izdati, sa razlogom:
- Najvažniji preostali rizik i šta ne možemo zaključiti iz kontrolisane modelske zamene/malog skupa:
- Jedan signal za praćenje, uslov za reakciju i sledeća provera:

## AI pomoć i pojedinačni doprinos

Radimo naizmenično prema dostupnosti. Na kraju doprinos unosimo na osnovu sadržaja commitova i usmenog dogovora, uključujući analizu, pregled i lično proverene rezultate.

- Za šta smo koristili Codex, šta prihvatili/izmenili/odbacili i kako proverili: do sada za plan, dokumentaciju, pripremu okruženja, osnovne testove, četiri CLI primera, oba početna merenja i istragu u koraku 4. Codex je povezao refund trag sa izvorom i kodom, proverio poreklo ocena i otiske fajlova i zapisao tumačenje sa referencama. Korak 4 koristi sačuvana merenja; nije novo izvršavanje evaluacije. Nema prihvaćene korekcije aplikacije. Lične provere članova i konačan doprinos dopuniti prema commitovima i usmenom dogovoru.
- Član 1: konkretan doprinos i lično proveren rezultat:
- Član 2: konkretan doprinos i lično proveren rezultat:

## Dopuna u sredu

- Referenca na tutorov nezavisni rezultat i eventualno obrazloženo neslaganje:
- Šta incident pokazuje o dostupnosti i kontrolama; koja operativna reakcija je opravdana:
- Da li menjamo preporuku i zašto; bez obaveze novog kodiranja:
