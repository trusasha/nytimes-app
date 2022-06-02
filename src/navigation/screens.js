const toString = (value) => (value !== undefined ? `${value}` : undefined);
const toNumber = (value) => (value !== undefined ? +value : undefined);
const toBoolean = (value) => (value && value !== 'false' ? true : false);

/** @type {<T extends import('@react-navigation/native').PathConfigMap<any>>(value: T) => T} */
const getScreens = (value) => value;

export const screens = getScreens({
  HomeTabs: {
    screens: {
      Home: {
        path: '',
        parse: {},
      },
      Profile: {
        path: 'profile',
        parse: {},
      },
    },
    parse: {},
  },

  Login: {
    path: 'login',
    parse: {},
  },
});

export default screens;
