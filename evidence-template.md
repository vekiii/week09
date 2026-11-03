**Kratka beleška para: Nedelja 9**

# Tumačenje dokaza i preporuka izdanja

Priložite automatske `report.json`, `summary.md` i direktorijume tragova. Ne prepisujte metapodatke, hash-eve ili rezultate po slučaju. Popunite samo naredne odeljke kratkim odgovorima. Dokaz i kratko objašnjenje dopunjuju se, ne dupliraju.

## Promena i hipoteza

**Korak 5 — specifikacija pre implementacije (3. novembar 2026).** Aplikacioni kod i testovi još nisu menjani.

- Članovi para i ko ove nedelje vodi prikaz:
- Polazni/završni commit i putanje generisanih početnih/završnih izveštaja: starter `4fde52c33237ff800510fc57bbd0ee14d5ddd46f` (`project init`); početna merenja izvršena na commitu `138d162118906c7516e2bc27f6bdef0a5b40daa4` (`Step 2`), uz čisto Git stanje i isti aplikacioni sadržaj. Sačuvani su [početna evaluacija](support-reliability-lab/runs/evaluate-661dd773-f065-4c0e-b998-2e7b39a2614d/report.json) i [početna regresija](support-reliability-lab/runs/regression-18f208fa-086a-4bcc-b02f-5cd089fd3469/report.json), sa sažecima i tragovima u istim direktorijumima. Završni commit korekcije i završna merenja još ne postoje. Detalji pripreme i početnih merenja su u README-u.
- Koji problem smo opazili, koji trag ga podržava i zašto smo očekivali da ova izmena pomogne: za policy temu refund odgovor navodi 30 dana i citira `refund-old`; [početni refund trag](support-reliability-lab/runs/evaluate-661dd773-f065-4c0e-b998-2e7b39a2614d/traces/refund.json) potvrđuje izvor i reviziju 1. Stanje povezujemo preko ID-ja i revizije sa [javnim podacima](support-reliability-lab/data/lab.json): izvor je arhiviran, a aktivni `refund-current`, revizija 2, zahteva 14 dana. Izveštaj zato odbacuje tekst i citat uprkos statusu `ok`; model je pozvan jednom, lookup nijednom. [Početni legacy trag](support-reliability-lab/runs/evaluate-661dd773-f065-4c0e-b998-2e7b39a2614d/traces/legacy.json) pokazuje i odgovor `ok` uz modelski poziv kada postoji samo arhivirani izvor. Tragovi pokazuju šta se dogodilo, a [kod](support-reliability-lab/src/app.ts), linija 57, objašnjava izbor: `find` proverava samo temu i uzima prvi dokument. Hipoteza je da ograničavanje izbora na dokument iste teme sa `state: "active"`, pre poziva modelu, rešava oba propusta za bilo koju temu. Postojeća grana za nedostajući izvor tada bi odbila i zahtev sa samo arhiviranim izvorima. Efekat još nije proveren korekcijom; modelska zamena samo prenosi tekst izabranog izvora, pa nema dokaza o halucinaciji živog LLM-a.
- Granica izmene i dodatna regresiona provera: u koraku 6 planirana je minimalna korekcija izbora izvora u policy grani funkcije `answer` u `support-reliability-lab/src/app.ts` i novi `support-reliability-lab/tests/source-eligibility.test.mjs`. Ne menjati javni `data/lab.json`, redosled njegovih dokumenata, postojeće testove, konfiguraciju, evaluator, skripte ili account putanju; ne uređivati generisani `dist/`. Bez posebne grane za refund, fiksnog odgovora od 14 dana, novih servisa ili modela. Poznati propust nepoznatog naloga ostaje van ove korekcije.
- Kriterijum prihvatanja — aktivan izvor: za svaku ispravnu policy temu, ako postoji aktivan dokument iste teme, bira se takav dokument, čak i kada arhivirani prethodi u nizu. Pri uspešnom pozivu kontrolisane modelske funkcije rezultat je `ok`, tekst je `Policy: ` praćen tekstom izabranog dokumenta, a jedini citat njegov ID; retrieval trag navodi isti ID i reviziju.
- Kriterijum prihvatanja — nema prihvatljivog izvora: ako postoje samo arhivirani dokumenti ili nema dokumenta iste teme, rezultat je `refused`, bez citata i sa `modelCalls: 0`, bez modelskog događaja u tragu. Aktivan dokument druge teme ne čini izvor prihvatljivim.
- Kriterijum prihvatanja — očuvano ponašanje: `shipping`, `unsupported` (tema `unknown`), `active-account`, `suspended-account` i `invalid`, kao i tri postojeća testa, zadržavaju očekivane rezultate. Kasnija javna merenja treba da potvrde 4/4 i 7/7 pod istim uslovima; to su očekivanja, ne ostvareni rezultati.
- Plan dodatne provere: tema `returns-window`, različita od refund, sa sopstvenim sintetičkim dokumentima u novom testu — arhivirani prvi, aktivni drugi, sa različitim ID-jevima i tekstovima. Proveriti stvarni `answer` iz `../dist/app.js` i unapred zadate status, tekst i tačan citat aktivnog izvora; očekivanje ne izvoditi kopiranjem algoritma izbora. Poseban primer sa samo arhiviranim izvorom proverava `refused`, prazan citat i brojač modelskih poziva jednak nuli.
- Ime dodatnog testa, zašto je pao pre izmene i prošao posle; reference na `test-before.txt` / `test-after.txt`: planiran je `tests/source-eligibility.test.mjs`, ali još nije dodat ni pokrenut. `test-before.txt` i `test-after.txt` još ne postoje; stvarni pad pre korekcije i prolaz posle nje tek treba dokazati u koraku 6. Ovim je završen samo opis promene u koraku 5.

## Tumačenje, ne prepisivanje

- Koji konkretni slučaj se promenio i koji dokaz to pokazuje: još nema izmene aplikacije ni završenog poređenja pre/posle; trenutno je dokumentovan početni refund propust. Dopuniti nakon korekcije i završnih merenja.
- Šta kaže ceo regresioni skup; ima li pogoršanja ili neizvršene provere: početni regresioni skup potvrđuje oba policy propusta, uz prolaz ostalih policy provera, poznatih naloga i neispravnog zahteva. Oba početna skupa izvršena su u celosti. Još nema završnog merenja, pa ne tvrdimo poboljšanje niti odsustvo novih regresija. Nepoznat nalog nije obuhvaćen ovim javnim skupom.
- Sa kojom slabom/modelskom ocenom se slažemo ili ne slažemo i zašto: `weakCheck` tačno potvrđuje neprazan tekst, ali nije kriterijum prihvatljivosti izvora. Ocena 0.95 za tečan i konkretan refund odgovor ne opravdava prihvatanje: arhivirani izvor navodi 30 umesto važećih 14 dana, uz pogrešan citat prema ugovoru. `recordedJudge` je autorski sintetički primer (`authored-synthetic-example-not-a-real-model-run`), preuzet iz podataka, a ne stvaran poziv ocenjivaču. Ocena 0.92 za ispravan tekst takođe je ilustracija; razlika ne dokazuje pristrasnost stvarnog modela. Ugovor proveravamo aktivnim dokumentom i konkretnim palim proverama, ne visinom ove ocene.
- Šta Codex-ov kod/test/objašnjenje nije mogao nezavisno da potvrdi i kako smo proverili pretpostavku: Codex-ovo objašnjenje samo po sebi ne potvrđuje uzrok ili budući uspeh popravke. Dosadašnja analiza povezuje stvarno sačuvan rezultat i trag sa dokumentom po ID-ju/reviziji, kodom izbora izvora i implementacijom kontrolisane modelske funkcije i ocena. U koraku 4 zabeležena je provera svih 11 otisaka prema tadašnjim fajlovima i podudaranje konfiguracije; to identifikuje sadržaj, ne dokazuje ispravnost. Ponovna provera u koraku 5 potvrdila je da sada devet fajlova ima razliku samo u `CRLF`/`LF` završecima redova; svi otisci odgovaraju početnim nakon normalizacije isključivo u memoriji. Potrebno usklađivanje pre kasnijeg poređenja opisano je u [README-u](README.md#materijali-i-trenutno-stanje); aplikacioni fajlovi nisu prepisivani. Budući efekat korekcije još zahteva pad/prolaz dodatnog testa i ponavljanje neizmenjenih javnih skupova. Lični pregled članova para ne zamenjujemo Codex-ovim zaključkom.

## Preporuka i ograničenja

- Definisana simulirana upotreba; izdati / ograničiti / ne izdati, sa razlogom:
- Najvažniji preostali rizik i šta ne možemo zaključiti iz kontrolisane modelske zamene/malog skupa:
- Jedan signal za praćenje, uslov za reakciju i sledeća provera:

## AI pomoć i pojedinačni doprinos

Radimo naizmenično prema dostupnosti. Na kraju doprinos unosimo na osnovu sadržaja commitova i usmenog dogovora, uključujući analizu, pregled i lično proverene rezultate.

- Za šta smo koristili Codex, šta prihvatili/izmenili/odbacili i kako proverili: do sada za plan, dokumentaciju, pripremu okruženja, osnovne testove, četiri CLI primera, oba početna merenja i istragu u koraku 4. Codex je povezao refund trag sa izvorom i kodom, proverio poreklo ocena i otiske fajlova i zapisao tumačenje sa referencama. Korak 4 koristi sačuvana merenja; nije novo izvršavanje evaluacije. U koraku 5 Codex je precizirao specifikaciju i plan dodatne provere prema javnom ugovoru, kodu i početnim dokazima, pregledao prethodne commitove i uskladio status u README-u. Kod i test još nisu menjani, a efekat predloga nije potvrđen izvršavanjem. Nema prihvaćene korekcije aplikacije. Lične provere članova i konačan doprinos dopuniti prema commitovima i usmenom dogovoru.
- Član 1: konkretan doprinos i lično proveren rezultat:
- Član 2: konkretan doprinos i lično proveren rezultat:

## Dopuna u sredu

- Referenca na tutorov nezavisni rezultat i eventualno obrazloženo neslaganje:
- Šta incident pokazuje o dostupnosti i kontrolama; koja operativna reakcija je opravdana:
- Da li menjamo preporuku i zašto; bez obaveze novog kodiranja:
