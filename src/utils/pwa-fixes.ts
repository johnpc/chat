// PWA-specific fixes for iOS input handling

// Extend Navigator interface to include iOS-specific standalone property
interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

// Extend CSSStyleDeclaration to include webkit-specific properties
interface WebkitCSSStyleDeclaration extends CSSStyleDeclaration {
  webkitUserSelect: string;
  webkitTouchCallout: string;
}

export const initPWAFixes = () => {
  // Check if we're in PWA mode
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                (window.navigator as IOSNavigator).standalone === true;
  
  // Check if we're on iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isPWA && isIOS) {
    // Fix for iOS PWA input focus issues
    const fixIOSInputFocus = () => {
      const textareas = document.querySelectorAll('textarea');
      const inputs = document.querySelectorAll('input[type="text"]');
      
      [...textareas, ...inputs].forEach(element => {
        element.addEventListener('touchstart', (e) => {
          // Prevent event bubbling that might interfere with focus
          e.stopPropagation();
        });
        
        element.addEventListener('focus', (e) => {
          // Ensure the element is focusable
          const target = e.target as HTMLElement;
          const style = target.style as WebkitCSSStyleDeclaration;
          style.webkitUserSelect = 'text';
          style.webkitTouchCallout = 'default';
          
          // Scroll element into view if needed
          setTimeout(() => {
            target.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }, 100);
        });
        
        element.addEventListener('blur', (e) => {
          // Reset styles on blur
          const target = e.target as HTMLElement;
          const style = target.style as WebkitCSSStyleDeclaration;
          style.webkitUserSelect = '';
          style.webkitTouchCallout = '';
        });
      });
    };
    
    // Apply fixes when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fixIOSInputFocus);
    } else {
      fixIOSInputFocus();
    }
    
    // Reapply fixes when new elements are added (for dynamic content)
    const observer = new MutationObserver(() => {
      fixIOSInputFocus();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};

// Fix for iOS PWA viewport issues
export const fixIOSViewport = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                (window.navigator as IOSNavigator).standalone === true;
  
  if (isIOS && isPWA) {
    // Fix viewport height issues in iOS PWA
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
      setTimeout(setViewportHeight, 100);
    });
  }
};
