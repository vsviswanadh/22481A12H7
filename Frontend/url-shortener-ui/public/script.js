class URLShortener {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000'; // Backend API URL
        this.form = document.getElementById('urlForm');
        this.resultDiv = document.getElementById('result');
        this.urlList = document.getElementById('urlList');
        this.submitBtn = document.getElementById('submitBtn');
        this.btnText = document.querySelector('.btn-text');
        this.btnSpinner = document.querySelector('.btn-spinner');
        
        this.initializeEventListeners();
        this.loadRecentUrls();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Real-time validation
        document.getElementById('originalUrl').addEventListener('input', this.validateUrl.bind(this));
        document.getElementById('customShortCode').addEventListener('input', this.validateShortCode.bind(this));
        document.getElementById('validityPeriod').addEventListener('input', this.validateValidityPeriod.bind(this));
    }

    validateUrl() {
        const urlInput = document.getElementById('originalUrl');
        const errorElement = document.getElementById('urlError');
        const url = urlInput.value.trim();

        if (!url) {
            this.clearError(errorElement);
            return true;
        }

        try {
            const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            if (!urlPattern.test(url)) {
                this.showError(errorElement, 'Please enter a valid URL starting with http:// or https://');
                return false;
            }
            this.clearError(errorElement);
            return true;
        } catch {
            this.showError(errorElement, 'Invalid URL format');
            return false;
        }
    }

    validateShortCode() {
        const shortCodeInput = document.getElementById('customShortCode');
        const errorElement = document.getElementById('shortCodeError');
        const shortCode = shortCodeInput.value.trim();

        if (!shortCode) {
            this.clearError(errorElement);
            return true;
        }

        const shortCodePattern = /^[A-Za-z0-9]{3,10}$/;
        if (!shortCodePattern.test(shortCode)) {
            this.showError(errorElement, 'Short code must be 3-10 characters long and contain only letters and numbers');
            return false;
        }

        this.clearError(errorElement);
        return true;
    }

    validateValidityPeriod() {
        const validityInput = document.getElementById('validityPeriod');
        const errorElement = document.getElementById('validityError');
        const validity = validityInput.value;

        if (!validity) {
            this.clearError(errorElement);
            return true;
        }

        const validityNum = parseInt(validity);
        if (isNaN(validityNum) || validityNum < 1 || validityNum > 525600) {
            this.showError(errorElement, 'Validity period must be between 1 minute and 1 year (525600 minutes)');
            return false;
        }

        this.clearError(errorElement);
        return true;
    }

    showError(element, message) {
        element.textContent = message;
        element.style.color = '#e53e3e';
    }

    clearError(element) {
        element.textContent = '';
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const isUrlValid = this.validateUrl();
        const isShortCodeValid = this.validateShortCode();
        const isValidityValid = this.validateValidityPeriod();

        if (!isUrlValid || !isShortCodeValid || !isValidityValid) {
            return;
        }

        const formData = new FormData(this.form);
        const requestData = {
            originalUrl: formData.get('originalUrl').trim(),
            customShortCode: formData.get('customShortCode')?.trim() || undefined,
            validityPeriod: formData.get('validityPeriod') ? parseInt(formData.get('validityPeriod')) : undefined
        };

        this.setLoading(true);

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/urls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess(result);
                this.form.reset();
                this.clearAllErrors();
                this.loadRecentUrls(); // Refresh the list
            } else {
                this.showError(document.getElementById('urlError'), result.error || result.message);
            }
        } catch (error) {
            console.error('Error creating short URL:', error);
            this.showError(document.getElementById('urlError'), 'Network error. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        this.submitBtn.disabled = loading;
        if (loading) {
            this.btnText.style.display = 'none';
            this.btnSpinner.style.display = 'inline';
        } else {
            this.btnText.style.display = 'inline';
            this.btnSpinner.style.display = 'none';
        }
    }

    clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => this.clearError(element));
    }

    showSuccess(result) {
        const { data } = result;
        this.resultDiv.className = 'result fade-in';
        this.resultDiv.innerHTML = `
            <h3>✅ Short URL Created Successfully!</h3>
            <div class="result-item">
                <div>
                    <strong>Short URL:</strong> 
                    <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
                </div>
                <button class="copy-btn" onclick="copyToClipboard('${data.shortUrl}')">Copy</button>
            </div>
            <div class="result-item">
                <div><strong>Original URL:</strong> ${data.originalUrl}</div>
            </div>
            <div class="result-item">
                <div><strong>Created:</strong> ${new Date(data.createdAt).toLocaleString()}</div>
            </div>
            ${data.expiresAt ? `
                <div class="result-item">
                    <div><strong>Expires:</strong> ${new Date(data.expiresAt).toLocaleString()}</div>
                </div>
            ` : ''}
        `;
        this.resultDiv.style.display = 'block';

        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.resultDiv.style.display = 'none';
        }, 10000);
    }

    async loadRecentUrls() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/urls`);
            const result = await response.json();

            if (result.success) {
                this.displayUrls(result.data.urls);
            } else {
                console.error('Error loading URLs:', result.error);
            }
        } catch (error) {
            console.error('Error loading URLs:', error);
        }
    }

    displayUrls(urls) {
        if (!urls || urls.length === 0) {
            this.urlList.innerHTML = '<p class="empty-state">No URLs created yet. Create your first short URL above!</p>';
            return;
        }

        this.urlList.innerHTML = urls.map(url => this.createUrlItemHTML(url)).join('');
    }

    createUrlItemHTML(url) {
        const isActive = url.isActive && (!url.expiresAt || new Date() < new Date(url.expiresAt));
        const statusClass = isActive ? 'status-active' : 'status-expired';
        const statusText = isActive ? 'Active' : 'Expired';
        const baseUrl = this.apiBaseUrl; // Use API base URL for redirects

        return `
            <div class="url-item fade-in">
                <div class="url-item-header">
                    <div class="url-item-title">
                        ${url.customShortCode ? 'Custom' : 'Generated'} Short URL
                    </div>
                    <div class="url-item-meta">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <span>Clicks: ${url.clickCount}</span>
                        <span>Created: ${new Date(url.createdAt).toLocaleDateString()}</span>
                        ${url.expiresAt ? `<span>Expires: ${new Date(url.expiresAt).toLocaleDateString()}</span>` : '<span>No expiry</span>'}
                    </div>
                </div>
                <div class="url-item-urls">
                    <div>
                        <strong>Short:</strong>
                        <a href="${baseUrl}/${url.shortCode}" target="_blank">${baseUrl}/${url.shortCode}</a>
                        <button class="copy-btn" onclick="copyToClipboard('${baseUrl}/${url.shortCode}')">Copy</button>
                    </div>
                    <div>
                        <strong>Original:</strong>
                        <a href="${url.originalUrl}" target="_blank">${url.originalUrl}</a>
                    </div>
                </div>
            </div>
        `;
    }
}

// Global function for copying to clipboard
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new URLShortener();
});
