class HubSpotFormStyler {
    constructor() {
        this.styledFormsCount = 0;
        this.maxForms = 5; // Increased from 2 to handle more forms
        this.options = window.hfsOptions || {
            buttonColor: '#007ddf',
            fontFamily: 'Eurostile, Inter, arial, helvetica, sans-serif',
            textSize: '12px'
        };
        
        this.init();
    }

    init() {
        if (this.hasHubSpotForm()) {
            this.setupEventListeners();
            this.addGlobalStyles();
        }
    }

    hasHubSpotForm() {
        return !!document.querySelector('.hbspt-form, [class*="hs-form"]');
    }

    setupEventListeners() {
        window.addEventListener('load', () => this.customizeHubSpotForm());
        window.addEventListener('message', (event) => {
            if (event.data?.type === 'hsFormCallback') {
                this.customizeHubSpotForm();
            }
        });
    }

    addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .hs-form__virality-link { 
                display: none !important; 
            }
        `;
        document.head.appendChild(style);
    }

    customizeHubSpotForm() {
        if (this.styledFormsCount >= this.maxForms) return;
        
        if (!this.findAndStyleForm()) {
            const checkInterval = setInterval(() => {
                if (this.findAndStyleForm() || this.styledFormsCount >= this.maxForms) {
                    clearInterval(checkInterval);
                }
            }, 1000);

            setTimeout(() => clearInterval(checkInterval), 10000);
        }
    }

    findAndStyleForm() {
        const iframes = Array.from(document.getElementsByTagName('iframe'));
        
        for (const iframe of iframes) {
            try {
                if (this.isValidIframe(iframe)) {
                    const iframeDoc = iframe.contentWindow.document;
                    if (this.styleFormElements(iframeDoc, iframe)) {
                        return true;
                    }
                }
            } catch (e) {
                console.warn('Error styling HubSpot form:', e);
            }
        }
        return false;
    }

    isValidIframe(iframe) {
        return iframe.contentWindow && 
               iframe.contentWindow.document && 
               !iframe.hasAttribute('data-styled');
    }

    styleFormElements(iframeDoc, iframe) {
        const submitButton = iframeDoc.querySelector('.hs-button');
        if (!submitButton) return false;

        // Style submit button
        this.styleButton(submitButton);
        
        // Style rich text elements
        this.styleRichText(iframeDoc);
        
        // Style all text elements
        this.styleTextElements(iframeDoc);
        
        // Add custom font
        this.addCustomFont(iframeDoc);
        
        // Hide virality link
        this.hideViralityLink(iframeDoc);

        iframe.setAttribute('data-styled', 'true');
        this.styledFormsCount++;
        
        return this.styledFormsCount >= this.maxForms;
    }

    styleButton(button) {
        button.style.setProperty('background-color', this.options.buttonColor, 'important');
        button.style.setProperty('color', 'white', 'important');
        button.style.setProperty('border', 'none', 'important');
    }

    styleRichText(doc) {
        const richTextElements = doc.querySelectorAll('.hs-richtext');
        richTextElements.forEach(element => {
            element.style.setProperty('font-size', this.options.textSize, 'important');
            element.style.setProperty('line-height', '1.4', 'important');
            
            const links = element.querySelectorAll('a');
            links.forEach(link => {
                link.style.setProperty('color', this.options.buttonColor, 'important');
            });
        });
    }

    styleTextElements(doc) {
        const allTextElements = doc.querySelectorAll('body, input, textarea, label, legend, button, p, div');
        allTextElements.forEach(element => {
            element.style.setProperty('font-family', this.options.fontFamily, 'important');
        });
    }

    addCustomFont(doc) {
        if (!doc.querySelector('link[href*="Inter"]')) {
            const fontLink = doc.createElement('link');
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
            fontLink.rel = 'stylesheet';
            doc.head.appendChild(fontLink);
        }
    }

    hideViralityLink(doc) {
        const viralityLink = doc.querySelector('.hs-form__virality-link');
        if (viralityLink) {
            viralityLink.style.setProperty('display', 'none', 'important');
        }
    }
}

// Initialize the styler
document.addEventListener('DOMContentLoaded', () => {
    new HubSpotFormStyler();
});