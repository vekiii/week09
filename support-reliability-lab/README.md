# Support Reliability Lab

Sintetički asistent za podršku za Nedelju 9. Koristi lokalne izvore, jedan read-only lookup i deterministički zamenski model. Ne zahteva API ključ niti plaćeni model.

## Pokretanje

Potreban je Node.js 24 ili noviji i npm. Iz direktorijuma aplikacije:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run typecheck
npm test
npm start -- shipping
npm run evaluate
npm run regression
```

`npm ci` prvi put preuzima zaključani TypeScript paket; kada je paket već u npm kešu, dodajte `--offline`. Izvođenje aplikacije ne koristi mrežu. Ako instalacija nije dostupna, obratite se kursnoj zajednici za pripremljeni paket/zavisnost; ne preskačite typecheck niti izmišljajte rezultate.

U početnom starteru `evaluate` je namerno završavao kodom 1 sa 2/4 prolaza, `regression` je imao 5/7, a `npm test` tri osnovne provere. Posle korekcije izbora aktivnog policy izvora potvrđeni su 4/4 i 7/7, uz pet testova (tri postojeća i dva nova). Testovi nisu zamena za evaluaciju. Stvarni sačuvani dokazi i postupak opisani su u [projektnom README-u](../README.md).

Preporuka za ceo servis, uključujući account zahteve, ostaje **ne izdati** zbog poznatog propusta nepoznatog naloga koji javnih 7/7 ne obuhvata. Obrazloženje, granice simulacije i predlog signala za praćenje nalaze se u [belešci para](../evidence-template.md#preporuka-i-ograničenja).

## Dokazi bez prepisivanja

Svaka evaluacija ispisuje novi direktorijum `runs/` sa `report.json`, `summary.md` i referencama na tragove. Sačuvajte putanju početnog i završnog izvršavanja. Uporedite dva izveštaja istog skupa:

```sh
npm run compare -- runs/IME-POCETNOG/report.json runs/IME-ZAVRSNOG/report.json
```

U komandi zamenite oba naziva stvarnim putanjama iz konzole. Konfiguracija, podaci i harness moraju ostati isti; izmena poređenja nije dokaz poboljšanja. Ne prepisujte tabele, metapodatke ili hash-eve u izveštaj.

Menja se TypeScript u `src/`; `dist/` je generisan. `data/lab.json` i kriterijumi su polazni ugovor, ne način da se rezultat ulepša. Kopija kursnog arhiva je rezervno početno stanje; sačuvajte svoj rad pre ponovnog raspakivanja u drugi direktorijum.

Codex može pomoći u istrazi, izmeni i testovima, ali njegovo slaganje nije nezavisna potvrda. Ne unosite tajne ili privatne podatke. Nedeljni zadatak radi se u paru između petka i srede, ne tokom predavanja u petak.
