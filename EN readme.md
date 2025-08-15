**AutoSurf Pro** is a browser extension for automatic site surfing
, a Chrome extension that allows you to automatically navigate through a list of URLs at specified intervals.
It is ideal for testing websites, simulating traffic, or just a background for browser activity.

additional dependency: *"https://github.com/Savvy08/Auto-Tab-Closer "*

<img width="400" height="600" alt="image" src="https://github.com/user-attachments/assets/3ecaa519-db4d-4185-a513-3bc3f498e6ae " />


**🔧 Functions**

    , Surfing on the specified sites or downloaded .to the txt file

    ⏱ Setting the transition interval (in minutes)

    🕒 Delay before transition (in seconds)

    , Blacklist of domains (separated by commas)

    Scroll type: slow, medium, fast

    🎛️ Control buttons: Start, Stop, Restart

    🎨 Stylish UI in dark colors without scrolling

**File Structure:**

*autosurf-pro/*
    
*├── popup.html # Extension interface*

*─── styles.css # Visual design*

*├── popup.js# Logic of operation*

*└── manifest.json # Chrome Extension Manifest*


📌 Notes

    The extension works in Chromium-based browsers.

    It is planned to support additional functions: saving settings, surfing reports

    All logic is performed locally, no requests to third-party servers.
------------------------------------------------------------------
***How to install the extension:***

*🔹 Step 1: Prepare the files*

Make sure you have the following files in the same folder:

popup.html — interface

styles.css styles

popup.js logic

manifest.json manifest

Step 2: Open Chrome and turn on Developer mode*

Go to the browser address: chrome://extensions/

Turn on the switch "Developer mode" (in the upper right corner)

*🔹 Step 3: Download the extension*

Click the "Download the unpacked extension" button

-------------------------------------
***How do I install CRX? Read below:***
1. Open chrome://extensions/
2. Turn on the "Developer Mode"
3. Drag and drop the "AutoSurf-Pro.crx" file to this page
4. In the window that appears, click "Leave extension"

Ready! The extension will appear in the list and will be available in the toolbar.
