import cheerio, { Element } from 'cheerio';
import { GUMTREE_URL } from '/opt/nodejs/constants';

const newLineRegex = /\r?\n|\r/g;

const extractListingData = (element: Element) => {
  const $ = cheerio.load(element);
  return {
    title: $('.listing-title').text().replace(newLineRegex, '').trim(),
    price: $('.listing-price').text().replace(newLineRegex, '').trim(),
    location: $('.listing-location .truncate-line')
      .text()
      .replace(newLineRegex, '')
      .trim(),
    id: Number(
      $('article').attr('data-q').split('-')[1].replace(newLineRegex, '')
    ),
    link:
      GUMTREE_URL + $('.listing-link').attr('href').replace(newLineRegex, ''),
  };
};

const extractData = (html: string) => {
  const $ = cheerio.load(html);
  const listingElements = Array.from($('.list-listing-maxi .natural'));
  const listingItems = listingElements.map(extractListingData);
  return listingItems.slice(0, 5); // take five most recent listings
};

export default extractData;
