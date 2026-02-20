const http = require('http');
async function testLocalApi() {
    try {
        const response = await fetch("http://localhost:3000/api/mentor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [{ role: "user", text: "Hello there" }]
            }),
        });

        const text = await response.text();
        const fs = require('fs');
        fs.writeFileSync('error.html', text);
        console.log("Saved error.html, checking its contents for 'Error:' or 'Exception:'...");

        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('Error:') || lines[i].includes('Exception:') || lines[i].includes('Failed to')) {
                console.log(lines[i].trim().substring(0, 200));
            }
        }
    } catch (e) {
        console.error("Fetch error", e);
    }
}
testLocalApi();
