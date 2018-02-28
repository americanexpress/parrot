/*
 * Copyright (c) 2018 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

// This is necessary because the chrome.tab API is not exposed to the dev panel.
chrome.runtime.onMessage.addListener(({ tabId }, sender, sendResponse) => {
  chrome.tabs.get(tabId, ({ url }) => sendResponse({ url }));

  // returning true tells chrome to keep the message port open until
  // the async chrome.tabs above returns and sendResponse is called
  return true;
});
