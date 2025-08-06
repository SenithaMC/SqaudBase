const SERVER_IP = "squadbase.game4free.net";
const serverIpEl = document.getElementById("server-ip");
const tooltip = document.getElementById("tooltip");
const mcStatusDiv = document.getElementById("mc-status");

// Set IP safely, preserve tooltip span
serverIpEl.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) node.textContent = '';
});
serverIpEl.insertBefore(document.createTextNode(SERVER_IP), tooltip);

// Copy to clipboard + tooltip without text highlight
serverIpEl.addEventListener("click", () => {
    navigator.clipboard.writeText(SERVER_IP).then(() => {
    tooltip.classList.add("show");
    setTimeout(() => tooltip.classList.remove("show"), 1500);
    });
});

// Keyboard accessibility (Enter/Space)
serverIpEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    serverIpEl.click();
    }
});

// Fetch server status and update every 30 seconds
async function fetchStatus() {
    mcStatusDiv.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Loading server status...`;

    try {
    const res = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
    const data = await res.json();

    if(data.online) {
        mcStatusDiv.innerHTML = `
        <i class="fa-solid fa-circle" style="color:#00ff55; text-shadow:0 0 10px #00ff55;"></i>
        Server Online — ${data.players.online.toLocaleString()} / ${data.players.max.toLocaleString()} players
        `;

        // Add copy event for the new button
    } else {
        mcStatusDiv.innerHTML = `
        <i class="fa-solid fa-circle" style="color:#ff4444; text-shadow:0 0 10px #ff4444;"></i>
        Server Offline
        `;
    }
    } catch (error) {
    mcStatusDiv.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation" style="color:#ff4444; text-shadow:0 0 10px #ff4444;"></i>
        Failed to fetch server status
    `;
    console.error("Error fetching server status:", error);
    }
}

fetchStatus();
setInterval(fetchStatus, 30000); // Update every 30 seconds