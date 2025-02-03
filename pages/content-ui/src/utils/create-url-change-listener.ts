export const createUrlChangeListener = (callback: (data: { pathname: string }) => void) => {
  // return initial pathname
  callback({
    pathname: location.pathname,
  });

  // Essential event subscriptions
  // @ts-expect-error works only on chrome
  navigation.addEventListener('navigate', e => {
    const url = new URL(e.destination.url);
    callback({ pathname: url.pathname });
  });
};
