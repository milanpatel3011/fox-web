document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // Active Navigation Highlighting
    // ======================
    function setActiveNavLink() {
        // Get current page URL
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page link
        document.querySelectorAll('.nav-links a').forEach(link => {
            const linkPage = link.getAttribute('href');
            if (currentPage === linkPage) {
                link.classList.add('active');
            }
        });
    }

    // Run on page load and when navigating back/forward
    window.addEventListener('load', setActiveNavLink);
    window.addEventListener('popstate', setActiveNavLink);

    // ======================
    // Mobile Navigation
    // ======================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Toggle mobile menu
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            // Toggle menu visibility
            mainNav.classList.toggle('active');
            
            // Toggle hamburger/close icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
            
            // Toggle body scroll when menu is open
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && mainNav) {
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
                
                // Reset menu icon
                if (mobileMenuToggle) {
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && mainNav && mainNav.classList.contains('active')) {
            if (!e.target.closest('.main-nav') && !e.target.closest('.mobile-menu-toggle')) {
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
                
                if (mobileMenuToggle) {
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        }
    });

    // ======================
    // Smooth Scrolling
    // ======================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's a # link
            if (this.getAttribute('href') === '#') return;
            
            // Prevent default behavior
            e.preventDefault();
            
            // Get target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });
    
    // ======================
    // Documentation Highlighting
    // ======================
    const docMenuLinks = document.querySelectorAll('.doc-menu a');
    const docSections = document.querySelectorAll('.doc-content section');
    
    function highlightActiveSection() {
        // Get current scroll position with offset
        let fromTop = window.scrollY + 150;
        
        // Highlight current section in documentation
        docSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (fromTop >= sectionTop && fromTop < sectionTop + sectionHeight) {
                const id = section.getAttribute('id');
                
                docMenuLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Only run if on documentation page
    if (docMenuLinks.length > 0 && docSections.length > 0) {
        window.addEventListener('scroll', highlightActiveSection);
        highlightActiveSection(); // Run once on page load
    }
    
    // ======================
    // Code Block Copy Functionality
    // ======================
    document.querySelectorAll('.code-block').forEach(block => {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<i class="far fa-copy"></i> <span>Copy</span>';
        copyButton.classList.add('copy-button');
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        // Add click event
        copyButton.addEventListener('click', async function() {
            try {
                // Get code text (excluding the copy button text)
                const code = block.querySelector('code').innerText;
                
                // Copy to clipboard
                await navigator.clipboard.writeText(code);
                
                // Update button state
                copyButton.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
                copyButton.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="far fa-copy"></i> <span>Copy</span>';
                    copyButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                copyButton.innerHTML = '<i class="fas fa-times"></i> <span>Error</span>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="far fa-copy"></i> <span>Copy</span>';
                }, 2000);
            }
        });
        
        // Add button to code block
        block.appendChild(copyButton);
    });
    
    // ======================
    // Responsive Adjustments
    // ======================
    function handleResize() {
        // If screen grows larger than mobile breakpoint
        if (window.innerWidth > 768 && mainNav) {
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset menu icon
            if (mobileMenuToggle) {
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    }
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    // ======================
    // Performance Optimization
    // ======================
    // Throttle scroll events for documentation highlighting
    let isScrolling;
    window.addEventListener('scroll', function() {
        if (docMenuLinks.length > 0) {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(highlightActiveSection, 100);
        }
    }, false);
});