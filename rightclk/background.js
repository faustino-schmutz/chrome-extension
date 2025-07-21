// Background script for Right Click Unlocker Pro
// Handles keyboard shortcuts and commands

chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0]) {
      const tabId = tabs[0].id;
      
      switch (command) {
        case 'toggle-extension':
          chrome.tabs.sendMessage(tabId, { action: 'toggle' });
          break;
          
        case 'quick-select-all':
          // Check if user has premium
          chrome.storage.sync.get(['isPremium'], function(result) {
            if (result.isPremium) {
              chrome.tabs.sendMessage(tabId, { action: 'selectAll' });
            } else {
              // Show upgrade notification
              chrome.action.setBadgeText({ text: 'PRO', tabId: tabId });
              chrome.action.setBadgeBackgroundColor({ color: '#FF6B35', tabId: tabId });
              setTimeout(() => {
                chrome.action.setBadgeText({ text: '', tabId: tabId });
              }, 3000);
            }
          });
          break;
          
        case 'copy-all-text':
          chrome.storage.sync.get(['isPremium'], function(result) {
            if (result.isPremium) {
              chrome.tabs.sendMessage(tabId, { action: 'copyAllText' });
            } else {
              chrome.action.setBadgeText({ text: 'PRO', tabId: tabId });
              chrome.action.setBadgeBackgroundColor({ color: '#FF6B35', tabId: tabId });
              setTimeout(() => {
                chrome.action.setBadgeText({ text: '', tabId: tabId });
              }, 3000);
            }
          });
          break;
      }
    }
  });
});

// Update badge based on extension state
chrome.tabs.onActivated.addListener(function(activeInfo) {
  updateBadge(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    updateBadge(tabId);
  }
});

function updateBadge(tabId) {
  chrome.storage.sync.get(['enabled', 'isPremium'], function(result) {
    const isEnabled = result.enabled !== false;
    const isPremium = result.isPremium || false;
    
    if (isEnabled) {
      if (isPremium) {
        chrome.action.setBadgeText({ text: 'PRO', tabId: tabId });
        chrome.action.setBadgeBackgroundColor({ color: '#4CAF50', tabId: tabId });
      } else {
        chrome.action.setBadgeText({ text: 'ON', tabId: tabId });
        chrome.action.setBadgeBackgroundColor({ color: '#2196F3', tabId: tabId });
      }
    } else {
      chrome.action.setBadgeText({ text: 'OFF', tabId: tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#757575', tabId: tabId });
    }
  });
}