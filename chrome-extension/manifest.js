import fs from 'node:fs';
import deepmerge from 'deepmerge';

const ALLOWED_HOSTS = ['https://*.plutio.com/*'];

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';

/**
 * If you want to disable the sidePanel, you can delete withSidePanel function and remove the sidePanel HoC on the manifest declaration.
 *
 * ```js
 * const manifest = { // remove `withSidePanel()`
 * ```
 */
function withSidePanel(manifest) {
  // INFO: Not implemented for now
  return manifest;

  // Firefox does not support sidePanel
  // eslint-disable-next-line no-unreachable
  if (isFirefox) {
    return manifest;
  }
  return deepmerge(manifest, {
    side_panel: {
      default_path: 'side-panel/index.html',
    },
    permissions: ['sidePanel'],
  });
}

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = withSidePanel({
  manifest_version: 3,
  default_locale: 'en',
  /**
   * if you want to support multiple languages, you can use the following reference
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
   */
  name: '__MSG_extensionName__',
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  host_permissions: ALLOWED_HOSTS,
  permissions: ['scripting', 'tabs'],
  // options_page: 'options/index.html',
  // background: {
  //   service_worker: 'background.iife.js',
  //   type: 'module',
  // },
  action: {
    default_popup: 'popup/index.html',
    default_icon: 'icon-34.png',
  },
  // chrome_url_overrides: {
  //   newtab: 'new-tab/index.html',
  // },
  icons: {
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ALLOWED_HOSTS,
      js: ['content/index.iife.js'],
    },
    {
      matches: ALLOWED_HOSTS,
      js: ['content-ui/index.iife.js'],
    },
    {
      matches: ALLOWED_HOSTS,
      css: ['content.css'], // public folder
    },
  ],
  devtools_page: 'devtools/index.html',
  web_accessible_resources: [
    {
      resources: ['*.js', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
      matches: ALLOWED_HOSTS,
    },
  ],
});

export default manifest;
