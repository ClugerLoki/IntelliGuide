# Chrome Setup for Voice Input on Localhost

## Method 1: Enable Chrome Flags

1. **Open Chrome** and go to `chrome://flags/`
2. **Search for** "Insecure origins treated as secure"
3. **Find the flag** "Insecure origins treated as secure"
4. **Add** `http://localhost:5000` to the list
5. **Restart Chrome**

## Method 2: Use Chrome Command Line

Run Chrome with these flags:

```bash
# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --unsafely-treat-insecure-origin-as-secure="http://localhost:5000" --user-data-dir="C:\temp\chrome_dev"

# Or create a shortcut with these flags
```

## Method 3: Use Firefox (Recommended)

Firefox often allows microphone access on localhost without special configuration:

1. **Download Firefox** from https://www.mozilla.org/firefox/
2. **Open** `http://localhost:5000` in Firefox
3. **Allow microphone access** when prompted
4. **Test voice recording**

## Method 4: Use Edge

Microsoft Edge sometimes allows microphone access on localhost:

1. **Open Edge**
2. **Go to** `http://localhost:5000`
3. **Allow microphone access** when prompted

## Method 5: Alternative Voice Input

If microphone access still doesn't work, you can:

1. **Use your phone's voice-to-text** and copy the text
2. **Use Windows Speech Recognition** and copy the text
3. **Use a browser extension** for voice input

## Testing Voice Input

Once you have microphone access working:

1. **Open** `http://localhost:5000` in your browser
2. **Navigate to a chat category** (like Fashion)
3. **Click the microphone button**
4. **Speak clearly** into your microphone
5. **Check the browser console** (F12) for debug messages

The voice input should now work properly! 