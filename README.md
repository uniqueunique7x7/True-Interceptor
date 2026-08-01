# True Interceptor

A Chrome extension for real-time interception and modification of HTTP requests and responses.

## Features

- **URL Modification** — rewrite request URLs on the fly
- **POST Body Modification** — alter form data, JSON payloads, and query strings
- **Response Body Modification** — transform server responses before the page sees them
- **Header Modification** — add, remove, or rename request/response headers
- **JSON Field Modification** — target specific JSON paths for surgical edits
- **Request Blocking** — block requests matching URL patterns
- **Regex Support** — use regular expressions for find-and-replace operations
- **Randomization** — use `$rand{min,max}` to randomize numeric values

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the extension folder
5. The extension icon appears in your toolbar — click it to configure rules

## Usage

1. Click the extension icon to open the popup
2. Click **+ Add** to create a custom rule
3. Configure find/replace pairs, target type, and URL matching
4. Toggle rules on/off individually or disable the entire extension

## Supported Platforms

- Google Chrome (Manifest V3)
- Chromium-based browsers (Edge, Brave, Opera, Arc)

## License

MIT
