import { SQSEvent } from 'aws-lambda';

const MOCK_EVENT = {
  Records: [
    {
      receiptHandle:
        'AQEBIWh5Csd4EonvgGEA4erEYW/QGNCtHnSI5UiujMMO/XLjKP/TrOvUppZZv21k6HkkiS9IBG3wRT0y6zmQBPloZs+y2znX1HdbIUqqm0WU5zfHAXTi7LV64rT/MRmCKLvRnL1JE9UsSap1OqRFNif9Eulf3wVKbGDYj75oFC0YEtzbjzunt2hrsR4IGFm+F4+VUX1/PgvGFpFzMSlahmfpBvYz5SDT+0ybbOAJPMJEUZkAqmOVhZ5L33Nu+aKSp5SqSUxqGHOMAcksn/zkFUOxVLbE+YzGjbXfuvkeIrnVK2YZHRox7WhAgcSDaFQfOcGqXSgj4RbJcIh7O4eJwyhBB6UIhlSPvfWkDyeZzzDV+3gQI+beHy0EBDbqeI1cxqOoAKTdCvyAnR8eepz9h/iKRw==',
      body: '{"category":"property-to-rent","location":"london","query":"2 bed flat","emails":["rory.kenyon01@gmail.com","abby.grattan@hotmail.co.uk"]}',
    },
  ],
} as SQSEvent;

const MOCK_GUMTREE_HTML =
  '<!DOCTYPE html><head></head><body><div class="css-i20ug5"><div id="premiumNative1" style="display:none" class="css-lnt3ql"></div><div class="css-in27v8"><article data-q="search-result" class="css-yp998y e25keea17"><a data-q="search-result-anchor" href="/p/synthesizers/digitone-synth-/1471407444" class="css-220ynt e25keea16"><div class="css-1r4pvhe e25keea15"><figure class="listing-tile-thumbnail-image css-sn8ht0 e18bxo8t0"><img alt="digitone synth " src="https://imagedelivery.net/ePR8PyKf84wPHx7_RYmEag/c5092879-22b2-4e87-e6c3-95130d2fba00/86"></figure><div class="css-1kfxarq"><div data-q="tile-image-counter-label" class="css-lw3eyv"><span class="icon icon--camera css-0 eom5h670" aria-hidden="true"></span>1</div></div></div><div class="css-1u9dcvg"><div class="css-iqq11e"><div data-q="tile-title" class="css-1de61eh e25keea13">digitone synth </div><button class="button button--only-icon favourite css-1puk8sn" rel="noopener noreferrer" data-q="favourite-button" aria-label="favourite"><span class="icon icon--color-pink icon--empty-heart favourite-icon css-0 eom5h670" aria-hidden="true" data-testid="empty-heart"></span></button></div><div data-q="tile-description"><p class="css-uwhbhf e25keea12">swap for octatrack please ask  , or sale , working order . fully updated . and fully loaded with every pack from elektron and paid packs . A To H \nloads spent . \n\nfm synth with midi sequencer , elektron  \n\nnice reverb also for external devices.  </p></div><div data-q="tile-location" class="css-30gart">Waltham Abbey, Essex</div><div class="css-69i1ev"><div data-testid="price" data-q="tile-price" class="css-1ygzid9">£575</div><div data-q="tile-datePosted" class="css-ntw5lf">16 days ago</div></div></div></a></article></div><div class="css-in27v8"><article data-q="search-result" class="css-yp998y e25keea17"><a data-q="search-result-anchor" href="/p/synthesizers/elektron-digitone-keys-with-desksaver-/1452386420" class="css-220ynt e25keea16"><div class="css-1r4pvhe e25keea15"><figure class="listing-tile-thumbnail-image css-sn8ht0 e18bxo8t0"><img alt="Elektron Digitone Keys with Desksaver " src="https://imagedelivery.net/ePR8PyKf84wPHx7_RYmEag/ee5cdcd6-0165-4696-5602-f1dea8173c00/86"></figure><div class="css-1kfxarq"><div data-q="tile-image-counter-label" class="css-lw3eyv"><span class="icon icon--camera css-0 eom5h670" aria-hidden="true"></span>6</div></div></div><div class="css-1u9dcvg"><div class="css-iqq11e"><div data-q="tile-title" class="css-1de61eh e25keea13">Elektron Digitone Keys with Desksaver </div><button class="button button--only-icon favourite css-1puk8sn" rel="noopener noreferrer" data-q="favourite-button" aria-label="favourite"><span class="icon icon--color-pink icon--empty-heart favourite-icon css-0 eom5h670" aria-hidden="true" data-testid="empty-heart"></span></button></div><div data-q="tile-description"><p class="css-uwhbhf e25keea12">Elektron Digitone Keys for sale. Comes with box, Desksaver, power plug and USB.\n\nThe unit itself is in really good condition. No noticeable knocks or scratches and really is in “as new” condition.\n\nComes with additional sound banks and the unit still</p></div><div data-q="tile-location" class="css-30gart">Ripon, North Yorkshire</div><div class="css-69i1ev"><div data-testid="price" data-q="tile-price" class="css-1ygzid9">£800</div><div data-q="tile-datePosted" class="css-ntw5lf">26 days ago</div></div></div></a></article></div></div></body>';

const MOCK_GUMTREE_PARSED_DATA = [
  {
    title: 'digitone synth',
    price: '£575',
    location: 'Waltham Abbey, Essex',
    link: 'https://www.gumtree.com/p/synthesizers/digitone-synth-/1471407444',
    id: '6dbdc8ae46a552f04d651a93437b650e',
  },
  {
    title: 'Elektron Digitone Keys with Desksaver',
    price: '£800',
    location: 'Ripon, North Yorkshire',
    link: 'https://www.gumtree.com/p/synthesizers/elektron-digitone-keys-with-desksaver-/1452386420',
    id: '83d1a5efad124a59cdbf017d4b7d7ba9',
  },
];

export { MOCK_EVENT, MOCK_GUMTREE_HTML, MOCK_GUMTREE_PARSED_DATA };
