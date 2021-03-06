import Extension from '../extension';

/* Extension API documentation: https://docs.microsoft.com/en-us/microsoft-edge/extensions */

/*
 * Small cheat for using Chrome TypeScript typings (which Microsoft decides not to implement).
 * I asked a developers about it in comments on extension API documentation index.
 */
let edge;

if ('chrome' in window) {
  edge = chrome;
} else {
  edge = browser;
}

class EdgeExtension extends Extension {
  constructor() {
    super();

    const updateFocusHandler = async () => {
      await this.updateFocus();
      if (this.isBrowserFocused) {
        this.updateCurrentURL(true);
      }
    };

    const updateUrlHandler = () => {
      this.updateCurrentURL();
    };

    browser.windows.onFocusChanged.addListener(updateFocusHandler);
    browser.tabs.onActivated.addListener(updateUrlHandler);
    browser.tabs.onAttached.addListener(updateUrlHandler);
    browser.tabs.onCreated.addListener(updateUrlHandler);
    browser.tabs.onDetached.addListener(updateUrlHandler);
    browser.tabs.onRemoved.addListener(updateUrlHandler);
    browser.tabs.onReplaced.addListener(updateUrlHandler);
    browser.tabs.onUpdated.addListener(updateUrlHandler);

    // Unsupported tab events:
    // browser.tabs.onHighlighted.addListener(updateUrlHandler);
    // browser.tabs.onMoved.addListener(updateUrlHandler);
  }

  getCurrentURL(): Promise<string> {
    return new Promise((resolve) => {
      edge.tabs.query(
        {
          active: true,
          windowId: edge.windows.WINDOW_ID_CURRENT,
        },
        (tabs) => {
          let url;

          if (tabs[0] && tabs[0].url) {
            url = tabs[0].url;
          } else {
            url = null;
          }

          resolve(url);
        }
      );
    });
  }

  getFocused(): Promise<boolean> {
    return new Promise((resolve) => {
      edge.windows.getCurrent(null, (window) => {
        const focusedNow = window && window.focused;
        resolve(focusedNow);
      });
    });
  }
}

export default EdgeExtension;
