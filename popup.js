const siteEl = document.getElementById('site');
const statusEl = document.getElementById('status');
const buttonEls = {};

const ACTIONS = {
  'clear-files': {
    label: 'Clear files',
    data: {
      cache: true,
      cacheStorage: true,
      serviceWorkers: true
    },
    success: 'Cached site files cleared. The tab was reloaded.'
  },
  'reset-session': {
    label: 'Reset session',
    data: {
      cookies: true,
      localStorage: true,
      indexedDB: true,
      serviceWorkers: true
    },
    success: 'Site session reset. The tab was reloaded.'
  },
  'nuke-site': {
    label: 'Nuke this site',
    data: {
      cache: true,
      cacheStorage: true,
      cookies: true,
      localStorage: true,
      indexedDB: true,
      serviceWorkers: true
    },
    success: 'This site was fully cleared. The tab was reloaded.'
  }
};

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id || !tab.url) {
    throw new Error('No active browser tab was found.');
  }

  return tab;
}

function getOrigin(urlString) {
  const url = new URL(urlString);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('This extension only works on normal websites.');
  }

  return url.origin;
}

const statusTextEl = document.getElementById('status-text');

function setStatus(message, type = '') {
  statusTextEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function setButtonsDisabled(disabled) {
  for (const key of Object.keys(ACTIONS)) {
    buttonEls[key].disabled = disabled;
  }
}

async function runAction(actionKey) {
  const action = ACTIONS[actionKey];

  if (!action) {
    setStatus('Unknown action.', 'error');
    return;
  }

  try {
    setButtonsDisabled(true);
    const tab = await getActiveTab();
    const origin = getOrigin(tab.url);

    siteEl.textContent = origin;
    setStatus(`${action.label} in progress...`, 'loading');

    const response = await chrome.runtime.sendMessage({
      action: 'clear',
      origin,
      data: action.data,
      tabId: tab.id
    });

    if (!response?.ok) {
      throw new Error(response?.error || 'No response from the extension. Try reloading it.');
    }

    setStatus(action.success, 'success');
  } catch (error) {
    setStatus(error.message || 'Something went wrong.', 'error');
  } finally {
    setButtonsDisabled(false);
  }
}

async function init() {
  try {
    const tab = await getActiveTab();
    const origin = getOrigin(tab.url);
    siteEl.textContent = origin;
    setStatus('Ready.');
  } catch (error) {
    siteEl.textContent = 'Unavailable';
    setStatus(error.message || 'Unable to inspect the current tab.', 'error');
  }

  for (const key of Object.keys(ACTIONS)) {
    buttonEls[key] = document.getElementById(key);
    buttonEls[key].addEventListener('click', () => {
      if (key === 'nuke-site') {
        showNukeConfirm();
      } else {
        runAction(key);
      }
    });
  }
}

const nukeModal = document.getElementById('nuke-modal');
const nukeModalBody = document.getElementById('nuke-modal-body');
const nukeCancelBtn = document.getElementById('nuke-cancel');
const nukeConfirmBtn = document.getElementById('nuke-confirm');

function showNukeConfirm() {
  const site = siteEl.textContent;
  nukeModalBody.innerHTML =
    `You're about to nuke <strong>all</strong> local data for <strong>${site}</strong>. ` +
    `This clears cached files, cookies, and local storage. This cannot be undone.`;
  nukeModal.classList.add('open');
}

nukeCancelBtn.addEventListener('click', () => {
  nukeModal.classList.remove('open');
});

nukeConfirmBtn.addEventListener('click', () => {
  nukeModal.classList.remove('open');
  runAction('nuke-site');
});

nukeModal.addEventListener('click', (e) => {
  if (e.target === nukeModal) nukeModal.classList.remove('open');
});

init();
