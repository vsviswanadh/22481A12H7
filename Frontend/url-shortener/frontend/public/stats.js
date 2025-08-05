class URLStatsManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000'; // Backend API URL
        this.initializeStats();
        this.loadUrlStatistics();
    }

    async initializeStats() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/urls`);
            const result = await response.json();

            if (result.success) {
                this.updateOverviewStats(result.data);
                this.populateUrlsTable(result.data.urls);
            } else {
                console.error('Error loading statistics:', result.error);
                this.showErrorMessage('Failed to load statistics');
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
            this.showErrorMessage('Network error while loading statistics');
        }
    }

    updateOverviewStats(data) {
        document.getElementById('totalUrls').textContent = data.urls.length;
        document.getElementById('activeUrls').textContent = data.activeUrls;
        document.getElementById('totalClicks').textContent = data.totalClicks;
    }

    populateUrlsTable(urls) {
        const tableBody = document.getElementById('urlsTableBody');
        
        if (!urls || urls.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">No URLs found. <a href="/">Create your first short URL</a></td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = urls.map(url => this.createTableRow(url)).join('');
    }

    createTableRow(url) {
        const isActive = url.isActive && (!url.expiresAt || new Date() < new Date(url.expiresAt));
        const statusClass = isActive ? 'status-active' : 'status-expired';
        const statusText = isActive ? 'Active' : 'Expired';
        const baseUrl = this.apiBaseUrl; // Use API base URL for redirects
        const shortUrl = `${baseUrl}/${url.shortCode}`;

        return `
            <tr>
                <td>
                    <a href="${shortUrl}" target="_blank">${shortUrl}</a>
                    <button class="copy-btn" onclick="copyToClipboard('${shortUrl}')" style="margin-left: 10px;">Copy</button>
                </td>
                <td>
                    <a href="${url.originalUrl}" target="_blank" title="${url.originalUrl}">
                        ${url.originalUrl.length > 50 ? url.originalUrl.substring(0, 50) + '...' : url.originalUrl}
                    </a>
                </td>
                <td>${new Date(url.createdAt).toLocaleString()}</td>
                <td>${url.expiresAt ? new Date(url.expiresAt).toLocaleString() : 'Never'}</td>
                <td>${url.clickCount}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="copy-btn" onclick="viewUrlDetails('${url.shortCode}')">View Details</button>
                </td>
            </tr>
        `;
    }

    async loadUrlStatistics() {
        // This method can be extended to load more detailed statistics
        // For now, it's handled by initializeStats
    }

    showErrorMessage(message) {
        const tableBody = document.getElementById('urlsTableBody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state" style="color: #e53e3e;">${message}</td>
            </tr>
        `;
    }
}

// Global function for viewing URL details
async function viewUrlDetails(shortCode) {
    try {
        const response = await fetch(`http://localhost:3000/api/urls/${shortCode}/stats`);
        const result = await response.json();

        if (result.success) {
            displayUrlDetails(result.data);
        } else {
            alert('Failed to load URL details: ' + result.error);
        }
    } catch (error) {
        console.error('Error loading URL details:', error);
        alert('Network error while loading URL details');
    }
}

function displayUrlDetails(data) {
    const { url, clicks } = data;
    const detailsDiv = document.getElementById('urlDetails');
    const detailsContent = document.getElementById('urlDetailsContent');
    
    const baseUrl = 'http://localhost:3000'; // Backend API URL for redirects
    const shortUrl = `${baseUrl}/${url.shortCode}`;

    let clicksHtml = '';
    if (clicks && clicks.length > 0) {
        clicksHtml = `
            <h4>Recent Clicks (${clicks.length})</h4>
            <div class="clicks-list">
                ${clicks.slice(0, 10).map(click => `
                    <div class="click-item">
                        <div><strong>Time:</strong> ${new Date(click.timestamp).toLocaleString()}</div>
                        <div><strong>Location:</strong> ${click.city}, ${click.country}</div>
                        <div><strong>Source:</strong> ${click.source}</div>
                        <div><strong>User Agent:</strong> ${click.userAgent.substring(0, 80)}...</div>
                    </div>
                `).join('')}
                ${clicks.length > 10 ? `<p><em>... and ${clicks.length - 10} more clicks</em></p>` : ''}
            </div>
        `;
    } else {
        clicksHtml = '<p><em>No clicks recorded yet.</em></p>';
    }

    detailsContent.innerHTML = `
        <div class="url-detail-card">
            <h4>URL Information</h4>
            <div class="detail-item">
                <strong>Short URL:</strong> 
                <a href="${shortUrl}" target="_blank">${shortUrl}</a>
                <button class="copy-btn" onclick="copyToClipboard('${shortUrl}')">Copy</button>
            </div>
            <div class="detail-item">
                <strong>Original URL:</strong> 
                <a href="${url.originalUrl}" target="_blank">${url.originalUrl}</a>
            </div>
            <div class="detail-item">
                <strong>Created:</strong> ${new Date(url.createdAt).toLocaleString()}
            </div>
            <div class="detail-item">
                <strong>Expires:</strong> ${url.expiresAt ? new Date(url.expiresAt).toLocaleString() : 'Never'}
            </div>
            <div class="detail-item">
                <strong>Total Clicks:</strong> ${url.clickCount}
            </div>
            <div class="detail-item">
                <strong>Status:</strong> 
                <span class="status-badge ${url.isActive ? 'status-active' : 'status-expired'}">
                    ${url.isActive ? 'Active' : 'Expired'}
                </span>
            </div>
            <div class="detail-item">
                <strong>Short Code Type:</strong> ${url.customShortCode ? 'Custom' : 'Generated'}
            </div>
        </div>
        <div class="clicks-section">
            ${clicksHtml}
        </div>
        <button class="copy-btn" onclick="hideUrlDetails()" style="background: #718096; margin-top: 20px;">Close Details</button>
    `;

    detailsDiv.style.display = 'block';
    detailsDiv.scrollIntoView({ behavior: 'smooth' });
}

function hideUrlDetails() {
    document.getElementById('urlDetails').style.display = 'none';
}

// Global function for copying to clipboard (shared with main page)
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#38a169';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#48bb78';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    });
}

// Initialize the stats manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new URLStatsManager();
});

// Add CSS for the new elements
const additionalStyles = `
    .url-detail-card {
        background: #f7fafc;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
    }

    .url-detail-card h4 {
        color: #4a5568;
        margin-bottom: 15px;
        font-size: 1.3rem;
    }

    .detail-item {
        margin-bottom: 12px;
        padding: 8px 0;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .detail-item:last-child {
        border-bottom: none;
    }

    .detail-item strong {
        color: #4a5568;
        min-width: 120px;
    }

    .detail-item a {
        color: #667eea;
        text-decoration: none;
        word-break: break-all;
    }

    .detail-item a:hover {
        text-decoration: underline;
    }

    .clicks-section {
        background: #f7fafc;
        border-radius: 10px;
        padding: 20px;
        margin-top: 20px;
    }

    .clicks-section h4 {
        color: #4a5568;
        margin-bottom: 15px;
        font-size: 1.3rem;
    }

    .clicks-list {
        display: grid;
        gap: 15px;
    }

    .click-item {
        background: white;
        border-radius: 8px;
        padding: 15px;
        border-left: 4px solid #667eea;
        font-size: 0.9rem;
    }

    .click-item div {
        margin-bottom: 5px;
        color: #4a5568;
    }

    .click-item div:last-child {
        margin-bottom: 0;
    }

    .click-item strong {
        color: #2d3748;
    }

    @media (max-width: 768px) {
        .detail-item {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .detail-item strong {
            min-width: unset;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
