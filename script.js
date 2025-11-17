document.addEventListener('DOMContentLoaded', () => {
    const homeSection = document.getElementById('home-section');
    const searchSection = document.getElementById('card-search-section');
    const navHome = document.getElementById('nav-home');
    const navSearch = document.getElementById('nav-search');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileNavHome = document.getElementById('mobile-nav-home');
    const mobileNavSearch = document.getElementById('mobile-nav-search');
    const cardContainer = document.getElementById('card-container');
    const searchInput = document.getElementById('search-input');

    // --- Theme Toggle Elements ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeToggleMobileButton = document.getElementById('theme-toggle-mobile');
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');
    const lightIconMobile = document.getElementById('theme-icon-light-mobile');
    const darkIconMobile = document.getElementById('theme-icon-dark-mobile');
    
    // --- New Filter Modal Elements ---
    const filterButton = document.getElementById('filter-button');
    const filterIndicator = document.getElementById('filter-indicator');
    const filterModal = document.getElementById('filter-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const modalSortSelect = document.getElementById('modal-sort-select');
    const minPriceInput = document.getElementById('min-price-input');
    const maxPriceInput = document.getElementById('max-price-input');
    const styleSelect = document.getElementById('style-select');
    const cardTypeInput = document.getElementById('card-type-input');
    const applyFiltersButton = document.getElementById('apply-filters-button');
    const clearFiltersButton = document.getElementById('clear-filters-button');

    // --- Pagination Elements ---
    const paginationControls = document.getElementById('pagination-controls');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const pageInfo = document.getElementById('page-info');

    // --- Scroll to Top Button ---
    const scrollToTopButton = document.getElementById('scroll-to-top');

    // --- State Management ---
    let allCards = [];
    let cardsLoaded = false;
    let currentPage = 1;
    const cardsPerPage = 20;

    // --- Utility Functions ---
    function debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // --- Theme Toggling Logic ---
    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
            lightIconMobile.classList.remove('hidden');
            darkIconMobile.classList.add('hidden');
        } else {
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
            lightIconMobile.classList.add('hidden');
            darkIconMobile.classList.remove('hidden');
        }
    }

    function toggleTheme() {
        const isDarkMode = document.documentElement.classList.toggle('dark');
        const theme = isDarkMode ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        updateThemeIcons(theme);
    }

    // Apply theme on initial load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        updateThemeIcons('dark');
    } else {
        updateThemeIcons('light');
    }

    themeToggleButton.addEventListener('click', toggleTheme);
    themeToggleMobileButton.addEventListener('click', toggleTheme);

    // --- Navigation Logic ---
    function navigate() {
        const hash = window.location.hash || '#home'; // Default to home

        if (hash === '#search') {
            homeSection.classList.add('hidden');
            searchSection.classList.remove('hidden');
            document.body.classList.remove('pattern-dots');
            document.body.classList.add('pattern-lines');
            // Fetch cards only if they haven't been loaded yet
            if (!cardsLoaded) {
                fetchAndDisplayCards();
            }
        } else { // #home or no hash
            homeSection.classList.remove('hidden');
            searchSection.classList.add('hidden');
            document.body.classList.remove('pattern-lines');
            document.body.classList.add('pattern-dots');
        }

        // Close mobile menu on navigation
        mobileMenu.classList.add('hidden');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }

    // Handle navigation on page load and hash changes
    window.addEventListener('hashchange', navigate);
    navigate(); // Initial navigation check on page load

    // --- Mobile Menu Toggle ---
    mobileMenuButton.addEventListener('click', () => {
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
        hamburgerIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Add event listeners to mobile nav links to ensure menu closes
    mobileNavHome.addEventListener('click', () => {
        if (window.location.hash === '#home' || window.location.hash === '') {
            navigate(); // Just close the menu if already on the page
        }
    });
    mobileNavSearch.addEventListener('click', () => {
        if (window.location.hash === '#search') {
            navigate(); // Just close the menu if already on the page
        }
    });

    // --- Event Listeners for Filter Modal ---
    const debouncedRender = debounce(() => {
        currentPage = 1; // Reset to first page on new search
        renderCards();
    }, 300); // Wait 300ms after user stops typing

    searchInput.addEventListener('input', debouncedRender);
    filterButton.addEventListener('click', () => {
        filterModal.classList.remove('hidden');
        document.body.classList.add('modal-open');
    });
    closeModalButton.addEventListener('click', () => {
        filterModal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    });
    applyFiltersButton.addEventListener('click', () => {
        currentPage = 1; // Reset to first page when applying filters
        renderCards();
        filterModal.classList.add('hidden'); // Close modal after applying filters
        document.body.classList.remove('modal-open');
        updateFilterIndicator();
    });
    clearFiltersButton.addEventListener('click', clearFilters);

    // --- Event Listeners for Pagination ---
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderCards();
        }
    });
    nextButton.addEventListener('click', () => {
        currentPage++;
        renderCards();
    });

    // --- Event Listener for Page Scroll ---
    window.addEventListener('scroll', () => {
        // Show button if user has scrolled down 300px, otherwise hide it
        if (window.scrollY > 300) {
            scrollToTopButton.classList.remove('hidden');
        } else {
            scrollToTopButton.classList.add('hidden');
        }
    });

    // --- Event Listener for Scroll to Top Button Click ---
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });



    // --- API Fetching and Rendering Logic ---
    async function fetchAndDisplayCards() {
        cardContainer.innerHTML = `<div class="loader-container"><div class="spinner"></div></div>`;

        try {
            // Make API call to the Spring Boot backend
            const response = await fetch('http://localhost:8080/api/cards');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allCards = await response.json();

            cardsLoaded = true; // Mark as loaded
            
            renderCards(); // Initial render

        } catch (error) {
            console.error("Failed to fetch cards:", error);
            cardContainer.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 class="mt-2 text-lg font-medium text-brand-text-primary dark:text-white">Oops! Something went wrong.</h3>
                    <p class="mt-1 text-sm text-brand-text-secondary dark:text-dark-brand-text-secondary">We couldn't load the player data. Please try again.</p>
                    <div class="mt-6">
                        <button id="retry-fetch-button" class="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:opacity-90 transition duration-300">
                            Try Again
                        </button>
                    </div>
                </div>
            `;
            document.getElementById('retry-fetch-button').addEventListener('click', fetchAndDisplayCards);
        }
    }

    // --- Filtering, Sorting, and Displaying Orchestration ---
    function getFilteredCards() {
        let filteredCards = [...allCards];

        // Filter by player name
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredCards = filteredCards.filter(card => 
                card.playerName.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by price range
        const minPrice = parseFloat(minPriceInput.value);
        const maxPrice = parseFloat(maxPriceInput.value);
        if (!isNaN(minPrice)) {
            filteredCards = filteredCards.filter(card => card.value >= minPrice);
        }
        if (!isNaN(maxPrice)) {
            filteredCards = filteredCards.filter(card => card.value <= maxPrice);
        }

        // Filter by style
        const selectedStyle = styleSelect.value;
        if (selectedStyle) {
            filteredCards = filteredCards.filter(card => card.style === selectedStyle);
        }

        // Filter by card type
        const cardTypeSearchTerm = cardTypeInput.value.toLowerCase();
        if (cardTypeSearchTerm) {
            filteredCards = filteredCards.filter(card =>
                card.cardType.toLowerCase().includes(cardTypeSearchTerm)
            );
        }
        
        return filteredCards;
    }

    function sortCards(cards) {
        // Create a new array to avoid modifying the original
        const sortedCards = [...cards];
        const sortValue = modalSortSelect.value;

        switch (sortValue) {
            case 'name-asc':
                sortedCards.sort((a, b) => a.playerName.localeCompare(b.playerName));
                break;
            case 'ovr-asc':
                sortedCards.sort((a, b) => a.ovr - b.ovr);
                break;
            case 'pow-desc':
                sortedCards.sort((a, b) => b.pow - a.pow);
                break;
            case 'tgh-desc':
                sortedCards.sort((a, b) => b.tgh - a.tgh);
                break;
            case 'spd-desc':
                sortedCards.sort((a, b) => b.spd - a.spd);
                break;
            case 'cha-desc':
                sortedCards.sort((a, b) => b.cha - a.cha);
                break;
            case 'price-desc':
                sortedCards.sort((a, b) => b.value - a.value);
                break;
            case 'price-asc':
                sortedCards.sort((a, b) => a.value - b.value);
                break;
            case 'ovr-desc':
            default:
                sortedCards.sort((a, b) => b.ovr - a.ovr);
                break;
        }
        return sortedCards;
    }

    function paginateCards(cards) {
        const totalPages = Math.ceil(cards.length / cardsPerPage);
        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        
        // Update pagination controls before returning the slice
        updatePaginationControls(cards.length, totalPages);

        return cards.slice(startIndex, endIndex);
    }

    function renderCards() {
        // 1. Get filtered cards
        const filteredCards = getFilteredCards();

        // 2. Sort the filtered cards
        const sortedCards = sortCards(filteredCards);

        // 3. Paginate the sorted list
        const paginatedCards = paginateCards(sortedCards);

        // 4. Display the final list of cards
        displayCards(paginatedCards);
    }

    function displayCards(cards) {
        // Clear loading state
        cardContainer.innerHTML = '';

        if (cards.length === 0) {
            cardContainer.innerHTML = `<p class="text-center text-brand-text-secondary dark:text-dark-brand-text-secondary col-span-full">No players match your criteria.</p>`;
            return;
        }

        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            // Start with opacity-0 and translate-y-5 for the entrance effect
            cardElement.className = 'bg-brand-surface dark:bg-dark-brand-surface rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 card-item opacity-0 translate-y-5';
            cardElement.classList.add('card-enter-animation');
            cardElement.style.animationDelay = `${index * 50}ms`; // Staggered delay

            // Create image element and handle error
            const img = document.createElement('img');
            img.src = card.cardImageUrl;
            img.alt = card.playerName;
            img.className = 'w-full object-cover';

            img.onerror = function() {
                // Create a placeholder div
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.innerHTML = `
                    <svg class="image-placeholder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    <span class="font-semibold">${card.playerName}</span>
                `;

                // Replace the broken image with the placeholder
                this.parentNode.replaceChild(placeholder, this);
            };

            // After a short delay, remove the initial transform to trigger the slide-up transition
            setTimeout(() => {
                cardElement.classList.remove('translate-y-5');
            }, 50); // Small delay to ensure transition is triggered

            // Create the rest of the card content
            const cardContent = document.createElement('div');
            cardContent.className = 'p-4 flex flex-col flex-grow';
            cardContent.innerHTML = `
                <div class="p-4 flex flex-col flex-grow">
                    <div class="flex justify-between items-baseline">
                        <h3 class="text-xl font-bold text-brand-text-primary dark:text-white" style="font-family: 'Bebas Neue'; letter-spacing: .5px;">${card.playerName}</h3>
                        <span class="font-bold text-xl text-green-300" style="font-family: 'Bebas Neue';">${new Intl.NumberFormat().format(card.value)}</span>
                    </div>
                    <div class="flex justify-between items-baseline text-sm text-brand-text-secondary dark:text-dark-brand-text-secondary mt-1">
                        <p>OVR: <span class="font-bold text-brand-text-primary dark:text-white">${card.ovr}</span></p>
                        <p>Type: <span class="font-bold text-brand-text-primary dark:text-white">${card.cardType}</span></p>
                    </div>
                    <p class="text-sm text-brand-accent">${card.style}</p>
                    
                    <!-- Improved Stat Display -->
                    <div class="mt-4 pt-4 border-t border-brand-border dark:border-dark-brand-border space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="font-semibold text-brand-text-secondary dark:text-dark-brand-text-secondary">Power (POW)</span><span class="font-bold text-brand-text-primary dark:text-white">${card.pow}</span></div>
                        <div class="flex justify-between">
                            <span class="font-semibold text-brand-text-secondary dark:text-dark-brand-text-secondary">Toughness (TGH)</span><span class="font-bold text-brand-text-primary dark:text-white">${card.tgh}</span></div>
                        <div class="flex justify-between">
                            <span class="font-semibold text-brand-text-secondary dark:text-dark-brand-text-secondary">Speed (SPD)</span><span class="font-bold text-brand-text-primary dark:text-white">${card.spd}</span></div>
                        <div class="flex justify-between">
                            <span class="font-semibold text-brand-text-secondary dark:text-dark-brand-text-secondary">Charisma (CHA)</span><span class="font-bold text-brand-text-primary dark:text-white">${card.cha}</span></div>
                    </div>
                </div>
            `;

            // Assemble the card
            cardElement.appendChild(img);
            cardElement.appendChild(cardContent);
            cardContainer.appendChild(cardElement);
        });
    }

    function clearFilters() {
        currentPage = 1; // Reset to first page
        searchInput.value = '';
        modalSortSelect.value = 'ovr-desc'; // Default sort
        minPriceInput.value = '';
        maxPriceInput.value = '';
        styleSelect.value = ''; // Default to 'All Styles'
        cardTypeInput.value = '';
        renderCards();
        updateFilterIndicator();
    }

    function updatePaginationControls(totalCards, totalPages) {
        if (totalCards <= cardsPerPage) {
            paginationControls.classList.add('hidden');
            return;
        }

        paginationControls.classList.remove('hidden');

        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        if (currentPage === 1) {
            prevButton.disabled = true;
        } else {
            prevButton.disabled = false;
        }

        if (currentPage === totalPages) {
            nextButton.disabled = true;
        } else {
            nextButton.disabled = false;
        }
    }

    function updateFilterIndicator() {
        const isSortActive = modalSortSelect.value !== 'ovr-desc';
        const isMinPriceActive = minPriceInput.value !== '';
        const isMaxPriceActive = maxPriceInput.value !== '';
        const isStyleActive = styleSelect.value !== '';
        const isCardTypeActive = cardTypeInput.value !== '';

        if (isSortActive || isMinPriceActive || isMaxPriceActive || isStyleActive || isCardTypeActive) {
            filterIndicator.classList.remove('hidden');
        } else {
            filterIndicator.classList.add('hidden');
        }
    }
});