// // Check if HubSpot form exists on page
// function hasHubSpotForm() {
//     return !!document.querySelector('.hbspt-form, [class*="hs-form"]');
// }

// // Only run if HubSpot form exists
// if (hasHubSpotForm()) {
//     // Global flag to track if styling has been completed
//     let stylingCompleted = false;

//     // Function to style HubSpot form
//     function customizeHubSpotForm() {
//         if (stylingCompleted) return;
        
//         function findAndStyleForm() {
//             const iframes = Array.from(document.getElementsByTagName('iframe'));
            
//             for (let i = 0; i < iframes.length; i++) {
//                 try {
//                     if (iframes[i].contentWindow && iframes[i].contentWindow.document) {
//                         const iframeDoc = iframes[i].contentWindow.document;
                        
//                         // Style submit button
//                         const submitButton = iframeDoc.querySelector('.hs-button');
//                         if (submitButton) {
//                             // Style the button
//                             submitButton.style.setProperty('background-color', '#007ddf', 'important');
//                             submitButton.style.setProperty('color', 'white', 'important');
//                             submitButton.style.setProperty('border', 'none', 'important');
                            
//                             // Style rich text areas
//                             const richTextElements = iframeDoc.querySelectorAll('.hs-richtext');
//                             richTextElements.forEach(element => {
//                                 element.style.setProperty('font-size', '12px', 'important');
//                                 element.style.setProperty('line-height', '1.4', 'important');
                                
//                                 // Style links within rich text
//                                 const links = element.querySelectorAll('a');
//                                 links.forEach(link => {
//                                     link.style.setProperty('color', '#007ddf', 'important');
//                                 });
//                             });

//                             // Change font family for all text elements
//                             const allTextElements = iframeDoc.querySelectorAll('body, input, textarea, label, legend, button, p, div');
//                             allTextElements.forEach(element => {
//                                 element.style.setProperty('font-family', 'Eurostile, Inter, arial, helvetica, sans-serif', 'important');
//                             });

//                             // Add Inter font if not already present
//                             const fontLink = iframeDoc.createElement('link');
//                             fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
//                             fontLink.rel = 'stylesheet';
//                             iframeDoc.head.appendChild(fontLink);

//                             // Hide virality link
//                             const viralityLink = iframeDoc.querySelector('.hs-form__virality-link');
//                             if (viralityLink) {
//                                 viralityLink.style.setProperty('display', 'none', 'important');
//                             }

//                             stylingCompleted = true;
//                             return true;
//                         }
//                     }
//                 } catch (e) {}
//             }
//             return false;
//         }

//         // Try to find and style the form immediately
//         if (!findAndStyleForm() && !stylingCompleted) {
//             const checkInterval = setInterval(() => {
//                 if (findAndStyleForm() || stylingCompleted) {
//                     clearInterval(checkInterval);
//                 }
//             }, 1000);

//             // Clear interval after 10 seconds if form is not found
//             setTimeout(() => {
//                 clearInterval(checkInterval);
//             }, 10000);
//         }
//     }

//     // Event Listeners - only add if form exists
//     window.addEventListener('load', customizeHubSpotForm);

//     // Listen for HubSpot's form load event
//     window.addEventListener('message', (event) => {
//         if (event.data && event.data.type === 'hsFormCallback' && !stylingCompleted) {
//             customizeHubSpotForm();
//         }
//     });

//     // Add CSS rule for virality link
//     const style = document.createElement('style');
//     style.textContent = `
//         .hs-form__virality-link {
//             display: none !important;
//         }
//     `;
//     document.head.appendChild(style);
// }
function hasHubSpotForm() {
    return !!document.querySelector('.hbspt-form, [class*="hs-form"]');
}

if (hasHubSpotForm()) {
    let styledFormsCount = 0;

    function customizeHubSpotForm() {
        if (styledFormsCount >= 2) return;
        
        function findAndStyleForm() {
            const iframes = Array.from(document.getElementsByTagName('iframe'));
            
            for (let i = 0; i < iframes.length; i++) {
                try {
                    if (iframes[i].contentWindow && iframes[i].contentWindow.document && !iframes[i].hasAttribute('data-styled')) {
                        const iframeDoc = iframes[i].contentWindow.document;
                        const submitButton = iframeDoc.querySelector('.hs-button');
                        
                        if (submitButton) {
                            submitButton.style.setProperty('background-color', '#007ddf', 'important');
                            submitButton.style.setProperty('color', 'white', 'important');
                            submitButton.style.setProperty('border', 'none', 'important');
                            
                            const richTextElements = iframeDoc.querySelectorAll('.hs-richtext');
                            richTextElements.forEach(element => {
                                element.style.setProperty('font-size', '12px', 'important');
                                element.style.setProperty('line-height', '1.4', 'important');
                                
                                const links = element.querySelectorAll('a');
                                links.forEach(link => {
                                    link.style.setProperty('color', '#007ddf', 'important');
                                });
                            });

                            const allTextElements = iframeDoc.querySelectorAll('body, input, textarea, label, legend, button, p, div');
                            allTextElements.forEach(element => {
                                element.style.setProperty('font-family', 'Eurostile, Inter, arial, helvetica, sans-serif', 'important');
                            });

                            const fontLink = iframeDoc.createElement('link');
                            fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
                            fontLink.rel = 'stylesheet';
                            iframeDoc.head.appendChild(fontLink);

                            const viralityLink = iframeDoc.querySelector('.hs-form__virality-link');
                            if (viralityLink) {
                                viralityLink.style.setProperty('display', 'none', 'important');
                            }

                            iframes[i].setAttribute('data-styled', 'true');
                            styledFormsCount++;
                            
                            if (styledFormsCount >= 2) return true;
                        }
                    }
                } catch (e) {}
            }
            return false;
        }

        if (!findAndStyleForm()) {
            const checkInterval = setInterval(() => {
                if (findAndStyleForm() || styledFormsCount >= 2) {
                    clearInterval(checkInterval);
                }
            }, 1000);

            setTimeout(() => clearInterval(checkInterval), 10000);
        }
    }

    window.addEventListener('load', customizeHubSpotForm);
    window.addEventListener('message', (event) => {
        if (event.data?.type === 'hsFormCallback') {
            customizeHubSpotForm();
        }
    });

    const style = document.createElement('style');
    style.textContent = '.hs-form__virality-link { display: none !important; }';
    document.head.appendChild(style);
}