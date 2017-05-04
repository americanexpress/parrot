const defaultOpts = {
  headers: {
    Accept: 'application/json',
  },
};

export default async function fetchApi(baseUrl, pathname, fetchOpts = defaultOpts) {
  const apiUrl = `${baseUrl}${pathname}`;
  return await fetch(apiUrl, fetchOpts);
}
