const getURLSearchParams = (
  url: string,
  params: 'page' | 'page_size'
): number | undefined => {
  const newUrl = decodeURI(url.split('?')[1])
    .replace(/&/g, '","')
    .replace(/=/g, '":"');

  const options = JSON.parse(`{"${newUrl}"}`);

  return params ? options[params] : undefined;
};

export default getURLSearchParams;
