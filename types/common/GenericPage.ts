export default interface GenericPage<T> {
  page: number;
  size: number;
  numberOfPages: number;
  total: number;
  results: T[];
}
