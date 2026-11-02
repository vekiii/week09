**Kratka beleška para: Nedelja 9**

# Tumačenje dokaza i preporuka izdanja

Priložite automatske `report.json`, `summary.md` i direktorijume tragova. Ne prepisujte metapodatke, hash-eve ili rezultate po slučaju. Popunite samo naredne odeljke kratkim odgovorima. Dokaz i kratko objašnjenje dopunjuju se, ne dupliraju.

## Promena i hipoteza

- Članovi para i ko ove nedelje vodi prikaz:
- Polazni/završni commit i putanje generisanih početnih/završnih izveštaja: starter `4fde52c33237ff800510fc57bbd0ee14d5ddd46f` (`project init`); početna merenja izvršena na commitu `138d162118906c7516e2bc27f6bdef0a5b40daa4` (`Step 2`), uz čisto Git stanje i isti aplikacioni sadržaj. Sačuvani su [početna evaluacija](support-reliability-lab/runs/evaluate-661dd773-f065-4c0e-b998-2e7b39a2614d/report.json) i [početna regresija](support-reliability-lab/runs/regression-18f208fa-086a-4bcc-b02f-5cd089fd3469/report.json), sa sažecima i tragovima u istim direktorijumima. Završni commit korekcije i završna merenja još ne postoje. Detalji pripreme i početnih merenja su u README-u.
- Koji problem smo opazili, koji trag ga podržava i zašto smo očekivali da ova izmena pomogne: u koraku 2 CLI je za refund vratio 30 dana i citat `refund-old`; isti izbor potvrđuje [početni refund trag](support-reliability-lab/runs/evaluate-661dd773-f065-4c0e-b998-2e7b39a2614d/traces/refund.json), sa revizijom 1 i uspešnim pozivom modelu. `data/lab.json` potvrđuje da je izvor arhiviran, dok aktivni `refund-current`, revizija 2, navodi 14 dana. Legacy takođe koristi arhivirani izvor umesto da odbije zahtev. Hipoteza iz pregleda koda je da provera aktivnog stanja pri izboru izvora rešava oba propusta; korekcija još nije sprovedena niti potvrđena završnom evaluacijom.
- Granica izmene i dodatna regresiona provera:
- Ime dodatnog testa, zašto je pao pre izmene i prošao posle; reference na `test-before.txt` / `test-after.txt`:

## Tumačenje, ne prepisivanje

- Koji konkretni slučaj se promenio i koji dokaz to pokazuje:
- Šta kaže ceo regresioni skup; ima li pogoršanja ili neizvršene provere: početni regresioni skup potvrđuje oba policy propusta, uz prolaz ostalih policy provera, poznatih naloga i neispravnog zahteva. Oba početna skupa izvršena su u celosti. Još nema završnog merenja, pa ne tvrdimo poboljšanje niti odsustvo novih regresija. Nepoznat nalog nije obuhvaćen ovim javnim skupom.
- Sa kojom slabom/modelskom ocenom se slažemo ili ne slažemo i zašto:
- Šta Codex-ov kod/test/objašnjenje nije mogao nezavisno da potvrdi i kako smo proverili pretpostavku:

## Preporuka i ograničenja

- Definisana simulirana upotreba; izdati / ograničiti / ne izdati, sa razlogom:
- Najvažniji preostali rizik i šta ne možemo zaključiti iz kontrolisane modelske zamene/malog skupa:
- Jedan signal za praćenje, uslov za reakciju i sledeća provera:

## AI pomoć i pojedinačni doprinos

Radimo naizmenično prema dostupnosti. Na kraju doprinos unosimo na osnovu sadržaja commitova i usmenog dogovora, uključujući analizu, pregled i lično proverene rezultate.

- Za šta smo koristili Codex, šta prihvatili/izmenili/odbacili i kako proverili: do sada za plan, dokumentaciju, pripremu okruženja, osnovne testove, četiri CLI primera i oba početna merenja. Codex je proverio rezultate prema javnim kriterijumima, postojanje izveštaja i svih tragova, kao i podudaranje metapodataka uslova merenja. Evaluacione komande stvarno su izvršene; njihov kod 1 prati konkretne propuste u izveštajima. Nema prihvaćene korekcije aplikacije. Lične provere članova i konačan doprinos dopuniti prema commitovima i usmenom dogovoru.
- Član 1: konkretan doprinos i lično proveren rezultat:
- Član 2: konkretan doprinos i lično proveren rezultat:

## Dopuna u sredu

- Referenca na tutorov nezavisni rezultat i eventualno obrazloženo neslaganje:
- Šta incident pokazuje o dostupnosti i kontrolama; koja operativna reakcija je opravdana:
- Da li menjamo preporuku i zašto; bez obaveze novog kodiranja:
