// Popup script for Right Click Unlocker Pro
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('toggle');
  const status = document.getElementById('status');
  const premiumBtn = document.getElementById('premiumBtn');
  const shortcutsSection = document.getElementById('shortcutsSection');
  const siteManagement = document.getElementById('siteManagement');
  const premiumFeatures = document.getElementById('premiumFeatures');
  const premiumText = document.getElementById('premiumText');
  const siteDomain = document.getElementById('siteDomain');
  const addToWhitelist = document.getElementById('addToWhitelist');
  const addToBlacklist = document.getElementById('addToBlacklist');
  
  let currentDomain = '';
  
  // Get current tab domain
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0]) {
      const url = new URL(tabs[0].url);
      currentDomain = url.hostname;
      siteDomain.textContent = currentDomain;
    }
  });
  
  // Load current state
  chrome.storage.sync.get(['enabled', 'isPremium', 'whitelist', 'blacklist'], function(result) {
    const isEnabled = result.enabled !== false;
    const isPremium = result.isPremium || false;
    
    updateUI(isEnabled, isPremium);
  });
  
  // Toggle functionality
  toggle.addEventListener('click', function() {
    const isCurrentlyActive = toggle.classList.contains('active');
    const newState = !isCurrentlyActive;
    
    chrome.storage.sync.set({ enabled: newState }, function() {
      updateUI(newState);
      
      // Reload current tab to apply changes
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  });
  
  // Premium button
  premiumBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    chrome.storage.sync.get(['isPremium'], function(result) {
      if (result.isPremium) {
        // Already premium, show features
        showPremiumFeatures();
      } else {
        // Redirect to payment or show upgrade options
        handlePremiumUpgrade();
      }
    });
  });
  
  // Site management
  addToWhitelist.addEventListener('click', function() {
    chrome.storage.sync.get(['whitelist'], function(result) {
      const whitelist = result.whitelist || [];
      if (!whitelist.includes(currentDomain)) {
        whitelist.push(currentDomain);
        chrome.storage.sync.set({ whitelist: whitelist }, function() {
          addToWhitelist.textContent = 'Added ✓';
          setTimeout(() => {
            addToWhitelist.textContent = 'Add to Whitelist';
          }, 2000);
        });
      }
    });
  });
  
  addToBlacklist.addEventListener('click', function() {
    chrome.storage.sync.get(['blacklist'], function(result) {
      const blacklist = result.blacklist || [];
      if (!blacklist.includes(currentDomain)) {
        blacklist.push(currentDomain);
        chrome.storage.sync.set({ blacklist: blacklist }, function() {
          addToBlacklist.textContent = 'Added ✓';
          setTimeout(() => {
            addToBlacklist.textContent = 'Add to Blacklist';
          }, 2000);
        });
      }
    });
  });
  
  function updateUI(isEnabled, isPremium) {
    if (isEnabled) {
      toggle.classList.add('active');
      status.textContent = 'Extension is enabled';
      status.className = 'status enabled';
    } else {
      toggle.classList.remove('active');
      status.textContent = 'Extension is disabled';
      status.className = 'status disabled';
    }
    
    if (isPremium) {
      premiumBtn.textContent = 'Manage Premium Settings';
      premiumBtn.style.background = '#4CAF50';
      shortcutsSection.style.display = 'block';
      siteManagement.style.display = 'block';
      premiumFeatures.style.display = 'block';
      premiumText.textContent = 'Premium Features Active:';
    } else {
      shortcutsSection.style.display = 'none';
      siteManagement.style.display = 'none';
      premiumFeatures.style.display = 'none';
    }
  }
  
  function handlePremiumUpgrade() {
    // In a real implementation, this would integrate with:
    // 1. Chrome Web Store payments
    // 2. Stripe/PayPal
    // 3. Or other payment processors
    
    // For demo purposes, simulate upgrade
    if (confirm('Upgrade to Premium for advanced features?\n\n• Custom keyboard shortcuts (Ctrl+Shift+R, Ctrl+Shift+A, Ctrl+Shift+C)\n• Site whitelist/blacklist management\n• Bulk text selection and copying tools\n• Advanced bypass techniques for stubborn sites\n• Settings import/export functionality\n• Priority support\n\nPrice: $2.99 one-time')) {
      // Simulate successful payment
      chrome.storage.sync.set({ isPremium: true }, function() {
        updateUI(true, true);
        alert('Welcome to Premium! 🎉\n\nAll advanced features are now unlocked.\n\nKeyboard shortcuts:\n• Ctrl+Shift+R - Toggle extension\n• Ctrl+Shift+A - Select all text\n• Ctrl+Shift+C - Copy all text');
      });
    }
  }
  
  function showPremiumFeatures() {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  }
  
  // Track usage analytics (anonymized)
  chrome.storage.local.get(['usageCount'], function(result) {
    const count = (result.usageCount || 0) + 1;
    chrome.storage.local.set({ usageCount: count });
  });
});