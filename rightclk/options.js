// Options page script for Right Click Unlocker Pro
document.addEventListener('DOMContentLoaded', function() {
  loadSettings();
  loadStats();
});

function loadSettings() {
  chrome.storage.sync.get(['whitelist', 'blacklist'], function(result) {
    const whitelist = result.whitelist || [];
    const blacklist = result.blacklist || [];
    
    displayDomainList('whitelistDomains', whitelist, 'whitelist');
    displayDomainList('blacklistDomains', blacklist, 'blacklist');
  });
}

function displayDomainList(containerId, domains, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  if (domains.length === 0) {
    container.innerHTML = '<div style="color: #999; font-style: italic; padding: 10px;">No domains added</div>';
    return;
  }
  
  domains.forEach(domain => {
    const domainItem = document.createElement('div');
    domainItem.className = 'domain-item';
    domainItem.innerHTML = `
      <span>${domain}</span>
      <button class="remove-btn" onclick="removeDomain('${domain}', '${type}')">Remove</button>
    `;
    container.appendChild(domainItem);
  });
}

function addToWhitelist() {
  const input = document.getElementById('whitelistInput');
  const domain = input.value.trim().toLowerCase();
  
  if (!domain) {
    alert('Please enter a domain name');
    return;
  }
  
  // Clean domain (remove protocol, www, etc.)
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  
  chrome.storage.sync.get(['whitelist'], function(result) {
    const whitelist = result.whitelist || [];
    
    if (whitelist.includes(cleanDomain)) {
      alert('Domain already in whitelist');
      return;
    }
    
    whitelist.push(cleanDomain);
    chrome.storage.sync.set({ whitelist: whitelist }, function() {
      input.value = '';
      displayDomainList('whitelistDomains', whitelist, 'whitelist');
    });
  });
}

function addToBlacklist() {
  const input = document.getElementById('blacklistInput');
  const domain = input.value.trim().toLowerCase();
  
  if (!domain) {
    alert('Please enter a domain name');
    return;
  }
  
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  
  chrome.storage.sync.get(['blacklist'], function(result) {
    const blacklist = result.blacklist || [];
    
    if (blacklist.includes(cleanDomain)) {
      alert('Domain already in blacklist');
      return;
    }
    
    blacklist.push(cleanDomain);
    chrome.storage.sync.set({ blacklist: blacklist }, function() {
      input.value = '';
      displayDomainList('blacklistDomains', blacklist, 'blacklist');
    });
  });
}

function removeDomain(domain, type) {
  if (!confirm(`Remove ${domain} from ${type}?`)) {
    return;
  }
  
  chrome.storage.sync.get([type], function(result) {
    const list = result[type] || [];
    const updatedList = list.filter(d => d !== domain);
    
    chrome.storage.sync.set({ [type]: updatedList }, function() {
      displayDomainList(type + 'Domains', updatedList, type);
    });
  });
}

function exportSettings() {
  chrome.storage.sync.get(['whitelist', 'blacklist', 'enabled', 'isPremium'], function(result) {
    const settings = {
      whitelist: result.whitelist || [],
      blacklist: result.blacklist || [],
      enabled: result.enabled !== false,
      isPremium: result.isPremium || false,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'right-click-unlocker-settings.json';
    link.click();
    
    URL.revokeObjectURL(link.href);
  });
}

function importSettings(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const settings = JSON.parse(e.target.result);
      
      // Validate settings structure
      if (!settings.hasOwnProperty('whitelist') || !settings.hasOwnProperty('blacklist')) {
        throw new Error('Invalid settings file format');
      }
      
      if (confirm('Import settings? This will overwrite your current whitelist and blacklist.')) {
        chrome.storage.sync.set({
          whitelist: settings.whitelist || [],
          blacklist: settings.blacklist || [],
          enabled: settings.enabled !== false
        }, function() {
          alert('Settings imported successfully!');
          loadSettings();
        });
      }
    } catch (error) {
      alert('Error importing settings: ' + error.message);
    }
  };
  
  reader.readAsText(file);
  event.target.value = ''; // Reset file input
}

function loadStats() {
  chrome.storage.local.get(['usageCount'], function(result) {
    chrome.storage.sync.get(['whitelist', 'blacklist'], function(syncResult) {
      const usageCount = result.usageCount || 0;
      const whitelistCount = (syncResult.whitelist || []).length;
      const blacklistCount = (syncResult.blacklist || []).length;
      
      document.getElementById('stats').innerHTML = `
        Extension used ${usageCount} times • 
        ${whitelistCount} whitelisted sites • 
        ${blacklistCount} blacklisted sites
      `;
    });
  });
}

// Add enter key support for inputs
document.getElementById('whitelistInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addToWhitelist();
  }
});

document.getElementById('blacklistInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addToBlacklist();
  }
});