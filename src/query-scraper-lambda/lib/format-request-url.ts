import R from 'ramda';
import { GUMTREE_URL } from '/opt/nodejs/constants';
import { QueryItem } from '/opt/nodejs/types';

const formatRequestUrl = R.pipe(
  JSON.parse,
  ({ query, location, category }: QueryItem) =>
    `${GUMTREE_URL}/search?search_category=${
      encodeURIComponent(category) || 'all'
    }&q=${encodeURIComponent(query)}&search_location=${
      encodeURIComponent(location) || ''
    }`
);

export default formatRequestUrl;