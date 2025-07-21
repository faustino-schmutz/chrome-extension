// Right Click Unlocker Pro - Content Script
// Advanced right-click restoration with premium features

(function() {
  'use strict';
  
  let isEnabled = true;
  let isPremium = false;
  let whitelist = [];
  let blacklist = [];
  let currentDomain = window.location.hostname;
  
  // Load user preferences
  chrome.storage.sync.get(['enabled', 'isPremium', 'whitelist', 'blacklist'], function(result) {
    isEnabled = result.enabled !== false;
    isPremium = result.isPremium || false;
    whitelist = result.whitelist || [];
    blacklist = result.blacklist || [];
    
    if (shouldRunOnSite()) {
      enableRightClick();
    }
  });
  
  // Listen for storage changes
  chrome.storage.onChanged.addListener(function(changes) {
    if (changes.enabled) {
      isEnabled = changes.enabled.newValue;
    }
    if (changes.isPremium) {
      isPremium = changes.isPremium.newValue;
    }
    if (changes.whitelist) {
      whitelist = changes.whitelist.newValue || [];
    }
    if (changes.blacklist) {
      blacklist = changes.blacklist.newValue || [];
    }
    
    if (shouldRunOnSite()) {
      enableRightClick();
    } else {
      disableRightClick();
    }
  });
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'toggle') {
      isEnabled = !isEnabled;
      chrome.storage.sync.set({ enabled: isEnabled });
      if (isEnabled && shouldRunOnSite()) {
        enableRightClick();
      } else {
        disableRightClick();
      }
    } else if (request.action === 'selectAll' && isPremium) {
      selectAllText();
    } else if (request.action === 'copyAllText' && isPremium) {
      copyAllVisibleText();
    }
    sendResponse({ success: true });
  });
  
  function shouldRunOnSite() {
    if (!isEnabled) return false;
    
    // If not premium, run on all sites
    if (!isPremium) return true;
    
    // Premium users can use whitelist/blacklist
    const isWhitelisted = whitelist.some(domain => currentDomain.includes(domain));
    const isBlacklisted = blacklist.some(domain => currentDomain.includes(domain));
    
    if (whitelist.length > 0) {
      return isWhitelisted;
    }
    
    return !isBlacklisted;
  }
  
  function enableRightClick() {
    // Remove existing event listeners that block right-click
    removeBlockingListeners();
    
    // Override common right-click blocking methods
    overrideBlockingMethods();
    
    // Re-enable text selection
    enableTextSelection();
    
    // Remove CSS that disables selection
    removeCSSRestrictions();
  }
  
  function removeBlockingListeners() {
    // Remove contextmenu event listeners
    document.addEventListener('contextmenu', function(e) {
      e.stopImmediatePropagation();
      return true;
    }, true);
    
    // Remove mousedown/mouseup listeners that might block right-click
    ['mousedown', 'mouseup', 'selectstart', 'dragstart'].forEach(eventType => {
      document.addEventListener(eventType, function(e) {
        if (e.button === 2 || eventType === 'selectstart' || eventType === 'dragstart') {
          e.stopImmediatePropagation();
        }
      }, true);
    });
  }
  
  function overrideBlockingMethods() {
    // Override document.oncontextmenu
    try {
      document.oncontextmenu = null;
      document.onselectstart = null;
      document.ondragstart = null;
    } catch (e) {
      // Ignore errors
    }
    
    // Override window methods
    if (window.oncontextmenu) window.oncontextmenu = null;
    if (window.onselectstart) window.onselectstart = null;
    if (window.ondragstart) window.ondragstart = null;
  }
  
  function enableTextSelection() {
    // Remove unselectable attributes
    const elements = document.querySelectorAll('[unselectable="on"]');
    elements.forEach(el => el.removeAttribute('unselectable'));
    
    // Remove onselectstart attributes
    const noSelectElements = document.querySelectorAll('[onselectstart]');
    noSelectElements.forEach(el => el.removeAttribute('onselectstart'));
  }
  
  function removeCSSRestrictions() {
    // Create and inject CSS to override selection restrictions
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        -webkit-touch-callout: default !important;
      }
      
      body {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    style.id = 'right-click-unlocker-style';
    
    // Remove existing style if present
    const existingStyle = document.getElementById('right-click-unlocker-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
  }
  
  function disableRightClick() {
    // Remove our CSS overrides
    const style = document.getElementById('right-click-unlocker-style');
    if (style) {
      style.remove();
    }
  }
  
  // Premium feature: Select all text on page
  function selectAllText() {
    if (!isPremium) return;
    
    try {
      const range = document.createRange();
      range.selectNodeContents(document.body);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Show notification
      showNotification('All text selected!');
    } catch (e) {
      console.log('Could not select all text:', e);
    }
  }
  
  // Premium feature: Copy all visible text
  function copyAllVisibleText() {
    if (!isPremium) return;
    
    try {
      // Get all visible text content
      const textContent = document.body.innerText || document.body.textContent || '';
      
      // Copy to clipboard using modern API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textContent).then(() => {
          showNotification('All text copied to clipboard!');
        }).catch(() => {
          fallbackCopyText(textContent);
        });
      } else {
        fallbackCopyText(textContent);
      }
    } catch (e) {
      console.log('Could not copy text:', e);
    }
  }
  
  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      showNotification('All text copied to clipboard!');
    } catch (e) {
      showNotification('Could not copy text');
    }
    
    document.body.removeChild(textarea);
  }
  
  // Premium feature: Advanced bypass techniques
  function advancedBypass() {
    if (!isPremium) return;
    
    // Remove more sophisticated blocking methods
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
      const content = script.textContent || script.innerHTML;
      if (content.includes('contextmenu') || content.includes('selectstart') || 
          content.includes('user-select') || content.includes('oncontextmenu')) {
        script.remove();
      }
    });
    
    // Override more methods
    const methodsToOverride = [
      'addEventListener', 'attachEvent', 'oncontextmenu', 'onselectstart',
      'ondragstart', 'onmousedown', 'onmouseup'
    ];
    
    methodsToOverride.forEach(method => {
      if (window[method]) {
        const original = window[method];
        window[method] = function(...args) {
          if (args[0] && (args[0].includes('contextmenu') || args[0].includes('selectstart'))) {
            return; // Block the blocking
          }
          return original.apply(this, args);
        };
      }
    });
  }
  
  function showNotification(message) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }
  
  // Run immediately and also when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (shouldRunOnSite()) {
        enableRightClick();
        if (isPremium) {
          advancedBypass();
        }
      }
    });
  } else {
    if (shouldRunOnSite()) {
      enableRightClick();
      if (isPremium) {
        advancedBypass();
      }
    }
  }
  
  // Also run when new content is added dynamically
  const observer = new MutationObserver(function(mutations) {
    if (isEnabled && shouldRunOnSite()) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          enableTextSelection();
          if (isPremium) {
            advancedBypass();
          }
        }
      });
    }
  });
  
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
})();