import crypto from 'crypto';
import cheerio, { Element } from 'cheerio';
import { GUMTREE_URL } from '/opt/nodejs/constants';

const newLineRegex = /\r?\n|\r/g;

const extractListingData = (element: Element) => {
  const $ = cheerio.load(element);
  const data = {
    title: $('[data-q="tile-title"]').text().replace(newLineRegex, '').trim(),
    price: $('[data-q="tile-price"]').text().replace(newLineRegex, '').trim(),
    location: $('[data-q="tile-location"]')
      .text()
      .replace(newLineRegex, '')
      .trim(),
    link:
      GUMTREE_URL +
      $('[data-q="search-result-anchor"]')
        .attr('href')
        .replace(newLineRegex, ''),
  };
  const id = crypto
    .createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex');

  return { ...data, id };
};

const extractData = (html: string) => {
  const $ = cheerio.load(html);
  const listingElements = Array.from($('.css-in27v8'));
  const listingItems = listingElements.map(extractListingData);
  return listingItems.slice(0, 5); // take five most recent listings
};

export default extractData;
