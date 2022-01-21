type QueryItem = {
  category: string;
  location: string;
  query: string;
  emails: string[];
};

type ListingItem = {
  id: number;
  title: string;
  price: string;
  location: string;
  link: string;
  emails: string[];
};

export { QueryItem, ListingItem };
