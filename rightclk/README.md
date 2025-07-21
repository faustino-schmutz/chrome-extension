# Right Click Unlocker Pro

A powerful Chrome extension that restores right-click functionality on websites that disable it, with advanced premium features for power users.

## Features

### Free Features
- ✅ Restore right-click context menu on any website
- ✅ Re-enable text selection on protected sites
- ✅ Remove CSS restrictions that block selection
- ✅ Simple toggle on/off functionality
- ✅ Works on dynamically loaded content

### Premium Features ($2.99)
- 🚀 **Custom Keyboard Shortcuts**
  - `Ctrl+Shift+R` - Toggle extension
  - `Ctrl+Shift+A` - Select all text on page
  - `Ctrl+Shift+C` - Copy all visible text
- 🎯 **Site Management**
  - Whitelist: Only run on specific sites
  - Blacklist: Never run on specific sites
- 🔧 **Advanced Tools**
  - Bulk text selection
  - Copy all page text with one click
  - Advanced bypass techniques for stubborn sites
- 💾 **Settings Management**
  - Export/import your settings
  - Backup and restore configurations
- 📊 **Usage Statistics**
  - Track extension usage
  - Monitor managed sites

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your toolbar

## Usage

### Basic Usage
1. Click the extension icon in your toolbar
2. Toggle the extension on/off as needed
3. Right-click functionality will be restored on websites

### Premium Features
1. Upgrade to Premium through the popup
2. Use keyboard shortcuts for quick actions
3. Manage sites through the settings page
4. Export/import your configurations

## Technical Details

- **Permissions**: Only requires `activeTab` and `storage`
- **Performance**: Lightweight content script with minimal overhead
- **Security**: No external network requests, all data stored locally
- **Compatibility**: Works with Chrome Manifest V3

## File Structure

```
├── manifest.json          # Extension configuration
├── content.js            # Main functionality script
├── background.js         # Service worker for shortcuts
├── popup.html/js         # Extension popup interface
├── options.html/js       # Settings page
├── icons/               # Extension icons
└── README.md            # This file
```

## Development

To modify or extend the extension:

1. Edit the relevant files
2. Reload the extension in `chrome://extensions/`
3. Test on various websites

## Monetization

The extension uses a freemium model:
- Basic functionality is free
- Premium features require a one-time $2.99 payment
- Payment integration ready for Chrome Web Store or external processors

## Privacy

- No data collection in free version
- Premium version only stores user preferences locally
- No external network requests
- All data remains on user's device

## Support

For issues or feature requests, please create an issue in the repository.

## License

This project is for educational and commercial use. Please respect website terms of service when using this extension.