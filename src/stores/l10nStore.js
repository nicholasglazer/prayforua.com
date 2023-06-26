import {derived, writable} from 'svelte/store';
import translations from '$lib/data/translations';
import {browser} from '$app/environment';

const initialState = 'en';

export const locales = [
  ['en', 'english', '🇺🇸'],
  ['ua', 'українська', '🇺🇦']
];

function translate(locale, key, vars) {
  // Let's throw some errors if we're trying to use keys/locales that don't exist.
  if (!key) throw new Error('no key provided to $t()');
  if (!locale) throw new Error(`no translation for key "${key}"`);

  // Grab the translation from the translations object.
  let text = translations[locale][key];

  if (!text) throw new Error(`no translation found for ${locale}.${key}`);

  // Replace any passed in variables in the translation string.
  Object.keys(vars).map((k) => {
    const regex = new RegExp(`{{${k}}}`, 'g');
    text = text.replace(regex, vars[k]);
  });

  return text;
}

function createLocalization(key) {
  const initialValue =
    browser && localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : initialState;

  const {set, subscribe} = writable(initialValue);

  return {
    subscribe,
    set,
    useLocalStorage: () => {
      subscribe((current) => {
        if (browser) {
          localStorage.setItem(key, JSON.stringify(current));
        }
      });
    }
  };
}

export const locale = createLocalization('app-localization');

export const t = derived(
  locale,
  ($locale) =>
    (key, vars = {}) =>
      translate($locale, key, vars)
);
