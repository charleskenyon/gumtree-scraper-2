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
  '<!DOCTYPE html><head></head><body>    <ul class="clearfix list-listing-maxi " data-q="naturalresults">        <li class="natural">        <article class="listing-maxi" data-q="ad-1424135931">        <a class="listing-link " href="/p/property-to-rent/2-bedroom-flat-in-market-parade-norwood-se25-2-bed-1012662-/1424135931">        <div class="listing-side">        <div class="listing-thumbnail">        <img src="https://i.ebayimg.com/00/s/NTYzWDEwMDM=/z/Zg4AAOSwqldh6pEv/$_99.JPG" data-src="https://i.ebayimg.com/00/s/NTYzWDEwMDM=/z/Zg4AAOSwqldh6pEv/$_99.JPG" class="data-lazy hide-fully-no-js main-image loaded" alt="2 bedroom flat in Market Parade, Norwood , SE25 (2 bed) (#1012662)" data-was-processed="true">        <noscript><img src="https://i.ebayimg.com/00/s/NTYzWDEwMDM=/z/Zg4AAOSwqldh6pEv/$_99.JPG" alt="2 bedroom flat in Market Parade, Norwood , SE25 (2 bed) (#1012662)" /></noscript>        <div class="listing-meta txt-sub">        <ul class="inline-list txt-center">        <li>        <span class="icn-camera iconu-xs" aria-hidden="true"></span> 16<span class="hide-visually"> images</span>        </li>        </ul>        </div>        </div>        </div>        <div class="listing-content">        <h2 class="listing-title">        2 bedroom flat in Market Parade, Norwood , SE25 (2 bed) (#1012662)        </h2>        <div class="listing-location">        <span class="truncate-line">        Croydon, London        </span>        </div>        <p class="listing-description txt-sub txt-tertiary truncate-paragraph hide-fully-to-m" data-toggler="channel:toggleDescription0,selfBroadcast:false">        No Agent Fees        Property Reference Number: 1012662        ******* RENOVATED&nbsp; SUPER&nbsp; LARGE 2 BEDROOM MASIONETTE *******        *****0SUITABLE FOR&nbsp; COUPLE &amp; CHILD or COUPLE WITH FRIEND OR ADULT FAMILY*****        We are delighted to offer a large, bright and spacious        </p>        <ul class="listing-attributes inline-list hide-fully-to-m">        <li>        <span class="hide-visually">Seller type</span><span>Agency</span>        </li>        <li>        <span class="hide-visually">Date available</span><span>Date available: 24 Jan 2022</span>        </li>        <li>        <span class="hide-visually">Property type</span><span>Flat</span>        </li>        <li>        <span class="hide-visually">Number of bedrooms</span><span>2 Beds</span>        </li>        </ul>        <div class="listing-price-posted-container ">        <span class="listing-price">        <strong class="h3-responsive">£1,300pm</strong>        <span class="txt-tertiary txt-micro vat"></span>        </span>        <div class="listing-posted-date txt-sub">        <span class="truncate-line txt-tertiary" data-q="listing-adAge">        <span class="hide-visually">Ad posted </span>        Just now        </span>        </div>        </div>        </div>        </a>        <button class=" listing-save-ad" data-savead="channel:savead-1424135931" data-token="Mg3T7yaQgXd8dc1KRKjBg2ggwbIud5NNQwumf6737A9tMosH8uD59xBy4bvXDzsr2f5Dul2SCcfgwI6d%2BFlZB7LUzUfkLQY7QbE6yJdIMjPdReJwx3wnUsulsG3XzTKbc2dAp0GhU%2FTf0cSKZXhzvM4l%2F1tycMfxzGfaehM0R8mV1Fw8dKtFH0JdKPYgt0sPGecUMN8oJ376qygAzFulLnjHYDDIDo9b1HCCBBKEwITCHTfz0AEF3%2Bc6IVbxkqxgmefjEqc2uBTNcepLi0%2F8Ymn3T4E%2Bx%2FVs3Lks4%2BBuFGw%3D" data-analytics="gaEvent:WatchlistAddAttempt">        <span class="hide-visually">        Save this ad        </span>        <span class="icn-empty-heart-berry" aria-hidden="true"></span>        </button>        </article>        </li>        </ul></body>';

const MOCK_GUMTREE_PARSED_DATA = [
  {
    title: '2 bedroom flat in Market Parade, Norwood , SE25 (2 bed) (#1012662)',
    price: '£1,300pm',
    location: 'Croydon, London',
    id: 1424135931,
    link: 'https://www.gumtree.com/p/property-to-rent/2-bedroom-flat-in-market-parade-norwood-se25-2-bed-1012662-/1424135931',
  },
];

export { MOCK_EVENT, MOCK_GUMTREE_HTML, MOCK_GUMTREE_PARSED_DATA };
