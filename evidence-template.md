**Kratka beleška para: Nedelja 9**

# Tumačenje dokaza i preporuka izdanja

Priložite automatske `report.json`, `summary.md` i direktorijume tragova. Ne prepisujte metapodatke, hash-eve ili rezultate po slučaju. Popunite samo naredne odeljke kratkim odgovorima. Dokaz i kratko objašnjenje dopunjuju se, ne dupliraju.

## Promena i hipoteza

**Korak 5 — specifikacija pre implementacije (3. novembar 2026).** Sačuvana je u commitu `0e6b1a7` (`Step 5`), pre dodavanja testa i izmene aplikacije.

**Korak 6 — dodatni test i korekcija završeni 3. novembra 2026.** Dokazani su pad/prolaz istog dodatnog testa, uspešan typecheck i svih 5 testova. Završna javna merenja ostaju za korak 7.

- Članovi para i ko ove nedelje vodi prikaz:
- Polazni/završni commit i putanje generisanih početnih/završnih izveštaja: starter `4fde52c33237ff800510fc57bbd0ee14d5ddd46f` (`project init`); početna merenja izvršena na commitu `138d162118906c7516e2bc27f6bdef0a5b40daa4` (`Step 2`), uz čisto Git stanje i isti aplikacioni sadržaj. Sačuvani su [početna evaluacija](support-reliability-lab/runs/evaluate-661dd773-f065-4c0e-b998-2e7b39a2614d/report.json) i [početna regresija](support-reliability-lab/runs/regression-18f208fa-086a-4bcc-b02f-5cd089fd3469/report.json), sa sažecima i tragovima u istim direktorijumima. Implementacija je nastavljena od čistog commita `0e6b1a7` (`Step 5`). Završni commit korekcije još nije napravljen; završna javna merenja nisu izvršena. Detalji pripreme i početnih merenja su u README-u.
- Koji problem smo opazili, koji trag ga podržava i zašto smo očekivali da ova izmena pomogne: za policy temu refund početni odgovor navodi 30 dana i citira `refund-old`; [početni refund trag](support-reliability-lab/runs/evaluate-661dd773-f065-4c0e-b998-2e7b39a2614d/traces/refund.json) potvrđuje izvor i reviziju 1. Stanje povezujemo preko ID-ja i revizije sa [javnim podacima](support-reliability-lab/data/lab.json): izvor je arhiviran, a aktivni `refund-current`, revizija 2, zahteva 14 dana. Izveštaj zato odbacuje tekst i citat uprkos statusu `ok`; model je pozvan jednom, lookup nijednom. [Početni legacy trag](support-reliability-lab/runs/evaluate-661dd773-f065-4c0e-b998-2e7b39a2614d/traces/legacy.json) pokazuje i odgovor `ok` uz modelski poziv kada postoji samo arhivirani izvor. U polaznom [kodu](support-reliability-lab/src/app.ts) (`0e6b1a7`, linija 57) `find` je proveravao samo temu i uzimao prvi dokument. Hipoteza je da ograničavanje izbora na aktivan dokument iste teme, pre poziva modelu, rešava oba propusta za bilo koju temu; postojeća grana za nedostajući izvor tada odbija i samo arhivirane izvore. Ciljane provere u koraku 6 sada podržavaju to pravilo na sopstvenim podacima, dok refund i legacy tek treba ponovo izmeriti. Modelska zamena samo prenosi tekst izvora; nema dokaza o halucinaciji živog LLM-a.
- Granica izmene i dodatna regresiona provera: u koraku 6 u policy grani funkcije `answer` dodat je samo uslov `document.state === "active"` uz proveru teme u `support-reliability-lab/src/app.ts`, kao i novi `support-reliability-lab/tests/source-eligibility.test.mjs`. Javni `data/lab.json`, redosled njegovih dokumenata, postojeći testovi, konfiguracija, evaluator, skripte i account putanja nisu menjani; `dist/` je generisan build-om. Nema posebne grane za refund, fiksnog odgovora od 14 dana, novih servisa ili modela. Poznati propust nepoznatog naloga ostaje van ove korekcije.
- Kriterijum prihvatanja — aktivan izvor: za svaku ispravnu policy temu, ako postoji aktivan dokument iste teme, bira se takav dokument, čak i kada arhivirani prethodi u nizu. Pri uspešnom pozivu kontrolisane modelske funkcije rezultat je `ok`, tekst je `Policy: ` praćen tekstom izabranog dokumenta, a jedini citat njegov ID; retrieval trag navodi isti ID i reviziju.
- Kriterijum prihvatanja — nema prihvatljivog izvora: ako postoje samo arhivirani dokumenti ili nema dokumenta iste teme, rezultat je `refused`, bez citata i sa `modelCalls: 0`, bez modelskog događaja u tragu. Aktivan dokument druge teme ne čini izvor prihvatljivim.
- Kriterijum prihvatanja — očuvano ponašanje: `shipping`, `unsupported` (tema `unknown`), `active-account`, `suspended-account` i `invalid`, kao i tri postojeća testa, zadržavaju očekivane rezultate. Kasnija javna merenja treba da potvrde 4/4 i 7/7 pod istim uslovima; to su očekivanja, ne ostvareni rezultati.
- Dodatna provera: [source-eligibility.test.mjs](support-reliability-lab/tests/source-eligibility.test.mjs) ima dva slučaja za temu `returns-window`, različitu od refund. Prvi koristi arhivirani dokument pre aktivnog, sa različitim ID-jevima i tekstovima, i proverava stvarni `answer`, status, unapred zadat tekst, tačan citat, ID/reviziju u tragu i jedan modelski poziv. Drugi proverava `refused`, prazan citat i nula modelskih poziva kada tražena tema ima samo arhiviran izvor, iako postoji aktivan izvor druge teme. Očekivanja potiču iz ugovora; algoritam izbora nije kopiran u test.
- Ime dodatnog testa, zašto je pao pre izmene i prošao posle; reference na `test-before.txt` / `test-after.txt`: `tests/source-eligibility.test.mjs` je posle uspešnog build-a starog izvora imao 0/2 prolaza, izlazni kod 1 i dva `ERR_ASSERTION`: 60 umesto 21 dana i jedan modelski poziv umesto nule ([test-before.txt](support-reliability-lab/test-before.txt)). Posle korekcije isti test ima 2/2 prolaza i kod 0 ([test-after.txt](support-reliability-lab/test-after.txt)); otisak testa ostao je isti. Typecheck i `npm.cmd test` prošli su, sa ukupno 5/5 testova (3 postojeća i 2 nova).

## Tumačenje, ne prepisivanje

- Koji konkretni slučaj se promenio i koji dokaz to pokazuje: dodatni primer `returns-window` sada koristi aktivni tekst od 21 dana i citat `returns-current`; kada nema aktivnog izvora iste teme, odbija bez modela. To potvrđuju isti test i sačuvani izlazi pre/posle. Za javne refund i legacy još nema završnog merenja ni `compare` rezultata; dopuniti u koraku 7.
- Šta kaže ceo regresioni skup; ima li pogoršanja ili neizvršene provere: početni javni regresioni skup potvrđuje oba policy propusta, uz prolaz ostalih policy provera, poznatih naloga i neispravnog zahteva. Oba početna skupa izvršena su u celosti. U koraku 6 ponovo su prošla tri postojeća testa uz dva nova, ali 5/5 testova ne zamenjuje javnu regresiju sa sedam slučajeva. Završni javni skupovi nisu pokrenuti, pa ne tvrdimo odsustvo novih regresija. Nepoznat nalog nije obuhvaćen javnim skupom.
- Sa kojom slabom/modelskom ocenom se slažemo ili ne slažemo i zašto: `weakCheck` tačno potvrđuje neprazan tekst, ali nije kriterijum prihvatljivosti izvora. Ocena 0.95 za tečan i konkretan refund odgovor ne opravdava prihvatanje: arhivirani izvor navodi 30 umesto važećih 14 dana, uz pogrešan citat prema ugovoru. `recordedJudge` je autorski sintetički primer (`authored-synthetic-example-not-a-real-model-run`), preuzet iz podataka, a ne stvaran poziv ocenjivaču. Ocena 0.92 za ispravan tekst takođe je ilustracija; razlika ne dokazuje pristrasnost stvarnog modela. Ugovor proveravamo aktivnim dokumentom i konkretnim palim proverama, ne visinom ove ocene.
- Šta Codex-ov kod/test/objašnjenje nije mogao nezavisno da potvrdi i kako smo proverili pretpostavku: objašnjenje nije dokaz uspeha popravke. U koraku 6 očekivanja su povezana sa ugovorom, pregledani su novi test i diff, a stvarni assertion pad pre korekcije i prolaz istog testa posle nje proveravaju ciljnu pretpostavku bez izmene javnog skupa. To ne potvrđuje celu aplikaciju ili ponašanje živog modela; ponavljanje neizmenjenih javnih skupova tek sledi. U koraku 5 otisci su provereni prema početnim: devet fajlova razlikovalo se samo po `CRLF`/`LF` završecima redova, uz podudaranje svih 11 nakon normalizacije isključivo u memoriji. Priprema za kasnije poređenje opisana je u [README-u](README.md#materijali-i-trenutno-stanje); javni podaci i skripte ni u koraku 6 nisu prepisivani. Lični pregled članova para ne zamenjujemo Codex-ovim zaključkom.

## Preporuka i ograničenja

- Definisana simulirana upotreba; izdati / ograničiti / ne izdati, sa razlogom:
- Najvažniji preostali rizik i šta ne možemo zaključiti iz kontrolisane modelske zamene/malog skupa:
- Jedan signal za praćenje, uslov za reakciju i sledeća provera:

## AI pomoć i pojedinačni doprinos

Radimo naizmenično prema dostupnosti. Na kraju doprinos unosimo na osnovu sadržaja commitova i usmenog dogovora, uključujući analizu, pregled i lično proverene rezultate.

- Za šta smo koristili Codex, šta prihvatili/izmenili/odbacili i kako proverili: do sada za plan, dokumentaciju, pripremu okruženja, osnovne testove, četiri CLI primera, oba početna merenja i istragu u koraku 4. U koraku 5 Codex je precizirao specifikaciju prema ugovoru, kodu i početnim dokazima, pregledao commitove i uskladio README. U koraku 6 dodao je dva ciljana slučaja, sačuvao stvarni pad na starom izvoru, dodao uslov aktivnog stanja i sačuvao prolaz istog testa. Prošli su typecheck i svih 5 testova; diff i test pregledani su prema granici iz specifikacije. Javni podaci i evaluator nisu prilagođavani rezultatu. Završna javna merenja nisu izvršena. Lične provere članova i konačan doprinos dopuniti prema commitovima i usmenom dogovoru.
- Član 1: konkretan doprinos i lično proveren rezultat:
- Član 2: konkretan doprinos i lično proveren rezultat:

## Dopuna u sredu

- Referenca na tutorov nezavisni rezultat i eventualno obrazloženo neslaganje:
- Šta incident pokazuje o dostupnosti i kontrolama; koja operativna reakcija je opravdana:
- Da li menjamo preporuku i zašto; bez obaveze novog kodiranja:
