window.drabonMedContent = {
  brand: {
    name: 'Drabon Med Egészségügyi Szolgáltató Kft.',
    shortName: 'Drabon Med',
    tagline: 'Egészségügyi szolgáltatások rendezvényekhez, betegszállításhoz és oktatáshoz.'
  },
  contact: {
    serviceHours: 'Munkanapokon 8:00–20:00',
    phonePrimary: '+36 30 553 4160',
    phoneSecondary: '+36 30 649 7638',
    email: 'drabonmed@gmail.com',
    address: '3775 Kondó, Kossuth Lajos utca 12.'
  },
  hero: {
    eyebrow: 'Megbízható egészségügyi háttér',
    title: 'Átlátható, gyors és emberközpontú egészségügyi támogatás.',
    description: 'Rendezvénybiztosítás, betegszállítás, elsősegély oktatás és egészségügyi helyszínek kialakítása egy csapatban, modern szemlélettel.',
    primaryCta: 'Kapcsolatfelvétel',
    secondaryCta: 'Árkalkulátor megnyitása'
  },
  intro: [
    'Köszöntjük a Drabon Med Egészségügyi Szolgáltató Kft. oldalán.',
    'Célunk a megfelelő, pontos és precíz egészségügyi szolgáltatások nyújtása ügyfeleink számára.',
    'Segítünk eligazodni a rendezvények egészségügyi biztosításának szükségességében, a megfelelő szolgáltatási szint kiválasztásában, valamint az elsősegély oktatások és betegszállítás megszervezésében.'
  ],
  services: [
    {
      slug: 'event-medical-coverage',
      title: 'Rendezvénybiztosítás',
      summary: 'Gyalogőrség, mentőgépkocsis és esetkocsis biztosítás különböző rendezvénytípusokhoz.',
      points: [
        '1001 fő alatt gyalogőrség, nagyobb eseményeknél mozgóőrség biztosítható.',
        'A szükséges szintet a várható létszám, a helyszín és a rendezvény jellege alapján segítünk kiválasztani.',
        'Biztonságérzetet nyújt a vendégeknek és gyors reakciót tesz lehetővé sürgős helyzetben.'
      ]
    },
    {
      slug: 'patient-transport',
      title: 'Betegszállítás és őrzött betegszállítás',
      summary: 'Felszerelt járműparkkal és szakértő személyzettel támogatjuk a biztonságos szállítást.',
      points: [
        'Ön vagy hozzátartozója számára is megrendelhető szolgáltatás.',
        'A részletes szállítási módot és feltételeket a hatályos rendeletek szerint kezeljük.',
        'A megrendelés a megadott elérhetőségeken keresztül történik.'
      ]
    },
    {
      slug: 'first-aid-training',
      title: 'Elsősegély oktatás',
      summary: 'Gyakorlati, érthető oktatások óvodáknak, iskoláknak, munkahelyeknek és táboroknak.',
      points: [
        'Minimum 1x4 órás időintervallumban szervezhető.',
        'Témák: eszméletlen beteg ellátása, kötözések, műfogások, allergiás reakciók, újraélesztés.',
        'AMBU babán és oktató defibrillátoron végzett gyakorlattal.'
      ]
    },
    {
      slug: 'first-aid-stations',
      title: 'Elsősegélynyújtó helyek kialakítása',
      summary: 'Elsősegélyhelyiségek berendezése és üzemeltetése nagy forgalmú létesítményekben.',
      points: [
        'Plázákban, áruházakban, építkezéseken és egyéb komplexumokban is kialakítható.',
        'Biztonságérzetet és jobb közérzetet nyújt vendégeknek és alkalmazottaknak.',
        'A szükséges egészségügyi eszközök elhelyezését és működtetését is vállaljuk.'
      ]
    }
  ],
  pricing: {
    title: 'Árazás és együttműködés',
    description: 'Egyedi ajánlatot készítünk, hosszabb távú együttműködés esetén kedvezményt biztosítunk.',
    highlights: [
      'Rendezvénybiztosításnál a rendezvényt megelőző 3 naptári napon belüli megrendelés esetén +50% felárat számítunk fel.',
      'Aláírt megrendelőlap esetén a rendezvény előtti 5 naptári napon belül lemondott esemény 50%-a fizetendő.',
      'Az árváltoztatás jogát fenntartjuk.'
    ]
  },
  legal: {
    eventCoverage: [
      '5/2006. (II. 7.) EüM rendelet a mentésről',
      '54/2004. (III. 31.) Korm. rendelet a sportrendezvények biztonságáról'
    ],
    patientTransport: [
      '19/1998. (VI. 3.) NM rendelet a betegszállításról',
      'A szállítás részletes feltételeit és kategóriáit a hatályos szabályozás szerint kezeljük.'
    ]
  },
  metrics: [
    { value: '4', label: 'fő szolgáltatási terület' },
    { value: '8:00–20:00', label: 'ügyfélszolgálati elérhetőség' },
    { value: '1×4 óra', label: 'minimum oktatási blokk' }
  ],
  calculatorMock: {
    title: 'Távolság alapú árkalkulátor',
    description: 'A térképes integráció később érkezik. Most mintacímekkel és becsült kilométer alapú díjjal mutatjuk be a funkciót.',
    baseFee: 12000,
    pricePerKm: 450,
    sampleRoutes: [
      { from: 'Kondó', to: 'Miskolc', km: 22 },
      { from: 'Kazincbarcika', to: 'Miskolc', km: 28 },
      { from: 'Ózd', to: 'Eger', km: 74 },
      { from: 'Sajószentpéter', to: 'Debrecen', km: 118 }
    ]
  }
};
