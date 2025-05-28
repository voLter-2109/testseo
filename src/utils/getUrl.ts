const isMobilePath = (pathname: string) => pathname.startsWith('/m');
const getUrl = (mobileL: boolean, pathname: string) => {
  if (!mobileL && pathname === '/m/settings') return '/';
  if (mobileL && !isMobilePath(pathname)) {
    return `/m${pathname}`;
  }
  if (!mobileL && isMobilePath(pathname)) {
    return pathname.substring(2);
  }
  return pathname;
};

export default getUrl;
