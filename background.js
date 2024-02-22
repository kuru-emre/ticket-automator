console.log('background.js is running...');

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.data) {
        console.log('Message received from content.js in background: ', message);

        // Clear existing data in Chrome storage
        chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
                console.error('Error clearing storage:', chrome.runtime.lastError.message);
            } else {
                console.log('Chrome storage cleared');
            }

            // Set new data to Chrome storage
            chrome.storage.local.set({"data": message.data}, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error setting data:', chrome.runtime.lastError.message);
                } else {
                    console.log('Data saved to Chrome storage');
                }
            });
        });

        // Optionally, send a response back to the content script
        sendResponse({ received: true });

    } else {
        console.log('Message from content.js was not received in background');
        sendResponse({ received: false });
    }
});
