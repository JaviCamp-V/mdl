import React from 'react';

interface AsyncState<T> {
  data: T[];
  loading: boolean;
}
const useAsync = <T>(
  asyncFunction: () => Promise<T[]>,
  defaultValue: T[],
  dependencies: React.DependencyList = []
): { data: T[]; loading: boolean } => {
  const [data, setData] = React.useState<T[]>(defaultValue);
  const [loading, setLoading] = React.useState<boolean>(true);

  const memoizedCallback = React.useCallback(() => {
    setLoading(true);
    asyncFunction()
      .then((result) => setData(result))
      .catch(() => setData(defaultValue))
      .finally(() => setLoading(false));
  }, dependencies);

  React.useEffect(() => {
    memoizedCallback();
  }, [memoizedCallback]);

  return { data, loading };
};

export default useAsync;
