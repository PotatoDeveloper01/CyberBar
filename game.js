// ==========================================================================
// CYBERBAR SIMULATOR v5.0 - game.js
// ==========================================================================

(function() { // IIFE to encapsulate game logic
    'use strict'; // Enforce stricter parsing

    // ==================================
    // BLOCK 1: CONFIG, ASSETS, STATE, DOM
    // ==================================

    // --- CONFIGURATION CONSTANTS ---
    const STARTING_MONEY = 50;
    const BASE_ORDER_TIME_LIMIT = 30; // Base time in seconds per order
    const MAX_REVIEWS_DISPLAYED = 5;
    const BAR_OPEN_HOUR = 8; // 8 AM (24-hour format)
    const BAR_CLOSE_HOUR = 22; // 10 PM (22:00)
    const MINUTE_INCREMENT = 1; // <<< CHANGED: 1 minute passes per game tick (per second)
    const VIP_CHANCE = 0.10; // 10% chance for a VIP customer
    const VIP_MONEY_MULTIPLIER = 2.0;
    const VIP_TIMEOUT_PENALTY = 25;
    const BASE_CUSTOMER_SPAWN_RATE = 0.55;
    const MAX_INGREDIENTS_IN_MIXER = 8;
    const GAME_TICK_INTERVAL = 1000; // Milliseconds for game clock tick (1 second)
    const CUSTOMER_CLEAR_DELAY = 1500; // ms delay before clearing customer visuals
    const SPAWN_CHECK_DELAY = 1500; // ms delay for initial spawn check
    const POST_EVENT_SPAWN_DELAY = 2000; // ms delay before checking spawn after event
    const END_DAY_TRANSITION_DELAY = 2000; // ms delay before showing SETUP
    const SHAKE_ANIMATION_BASE_TIME = 550; // ms for shake animation
    const MIN_SHAKE_TIME = 200; // ms minimum shake time after skill reduction

    // --- ASSETS & STATIC DATA ---
    // (Make sure your actual URLs are here)
    const HAPPY_EMOTION_URL = 'https://media-hosting.imagekit.io/4498ab57bfb74d5f/image-removebg-preview%20(7).png?Expires=1841099985&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=bTqaNDxxLRwOwqMuH8KP5e0Gx8UhQEyLQ-M-OutT96l4DAU23UPSFuWddafKhcKHpFeDG-aZMASnSxnNagtMZF2Ue-XzR8NtvOxTVyxgevFqIlgLXLlP4iRQXc8REblUN4OaTuysN4pdjgGV8YdcgmIak32QvukOWj90bPytacqdDgUpFD~dPCP6FtUuv8rzMORh~BVgKku5ctRBmNQf1ju~yzzNGdcJYp6cOg1bayO090bzRFdWRr-rhN9nI-ynxnILXVZv7bijC47LlyLar2WvF-Vug9jwnhgwRh7AiyXX8RlytEMNgB8rY57J6x0CKOpsvIYfWqJ-CocsjyFRIw__';
    const ANGRY_EMOTION_URL = 'https://media-hosting.imagekit.io/4a748e86543b41ad/image-removebg-preview%20(6).png?Expires=1841099985&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=TLFHQkck~GiOJmrYznAJkbBvsxBHPN63q8PmGcDSiXWnax~EpJpp5M7CN~fnm7xXHVeG9kpDtOU7epcCQuEnMqpXZGeBY3Vv8ok8YVIjBUh~AxsKwQDrpAaVu8kYofCG3ffgIJJEaFglbb1MJ2w8TECVf55PGBiTE4mQ2as-jocjrIkkdIWWVUmQ6RCSrWd8w6WkcwD4xaokPC4UGoZK5YWHPplZwWYnPnP2XlJ6R9rkWAbw5n~IJVzaTb7d2CwzxWsWaANVb198kjP4Ux0284bED5PZdIRGQfpcQ2O4l-wDFrd9d1AnGbIGD6V1rs-E6ZcLzrzYZlVfj8dducMUng__';

    // Customer Details
    const customerIconUrls = [ /* Keep your full list of URLs */
        'https://media-hosting.imagekit.io/c814d196d4864800/download%20(25).png?Expires=1841099600&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=twWkb2ozrAIHraIYN5CrRMNFcPWc3qh3EKKYlp-NjBStXYEtGFrAQkRGBT6bUmWz8Ds2dkp119Az2Xionw49BfA39azZVnqUzUH3w3Og4CQAjvG6n-L~0-FcPIs8Y4EQ96BYd0w5WSqX44-rh3noRzLRtZ~Xl~c5a2vhBsOEMUC31pr-rXaDjPlL-fOj97h9G5zRJakL2HjyVPeuwX55COm5v6-umvJJNr~oiIfWPoodrSeQ6uZnRIzCqQjQfFbRLCxvDS36iPz4Ps1uAo9aYpraCc6B0e6fQyALMUqs~GkJKmzfnpWMFsFRNJhdo~x09AYyiaiAI8WYVn~2RN-nwQ__',
        'https://media-hosting.imagekit.io/7b401d876987460b/download%20(28).png?Expires=1841099600&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=u630OnSWYNbXLIPOoVdKdIoGqHcKVLPM3gCEOxKXAOwiPiOTO~zyucSpxzwme37fAgOHT75-akutTThHm713~uEHmrI9cPLixjmaLWSth0xKHKfJ~J1lkXD-gLAcALnKgUerg0dUWiGl~zym0ni6lNMiufjDlk-HEwE6SLcYbsRQbAv0vO-P02L4twh5mokszZvns604lyMVtn0YTG34ZIvqpIXYqvelahCt72B3cuqx~~ha70xlDrmze6437elgHCslQcwisN~JhNNIhMgpTFoI7VxKL9mUpvnbpgibDGp4krSSDMdFej9rDCeUjVRPgSYbRpIgSSdlMU9aPXamfw__',
        'https://media-hosting.imagekit.io/22a458e7ec1043e4/download%20(27).png?Expires=1841099600&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=oLm2MIKhmoiF63VtSBsV9alVq6NxsiUUODIjXp2q0R8HezWQvPoFnzSLoOGS08~9zzaRDRMZl~bvzyEeljIjuhyB7BMIi-KajwXjW0EKoEPcz-f4PiBcCAHt~4eD~ONTLZXI8m~xiDIb2~cUnM-JHocjy~TLYKoVP496IdkXhXFx9Up2cQb3v~~M~67AoE-hcr~U0aIjvJD7skNvyOLH31GeUs87~O7-Nqg4N0RJusLHhPOKiVMHuLOrU-TCsEN-OswlXY~48woeYmgllhjSH3PNq1k6y7~Rp6X7jKkBbtH905djFzy4ajR0aFIr7KZfhBSZQQGmYgUOSyG6nSgBRQ__',
        'https://media-hosting.imagekit.io/ffcc13a60c7e4e93/download%20(26).png?Expires=1841099600&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=eR74zdzU2R5zOj8Xd0zjEMXyjHYID97Y6EQKqaxQrzPUlZKmOflUZs1-0FdtneA8hmiyufwAytAc9MiJU1t0jrm8JmZMHN4kKicIEO-IZVgoPuAkMYDX0GwnlvtVs-RfVPRS4GYYbPzDcUMb6VxHUWZPqMYQ6UzzQ5cUKg5ZxgY2SqZQmp98RZzTxyhWxMfUlBkzXKAPnxcoaX5D~UlgC-W-PTSup1dOs8KZwvB2qSWxlBwyF-SycfqPrDUs8LLiwr5zg59P-1Cj7gqAhpB9WfNyosna6eTbcr0h2Dp6a6IV3o3YzfPuecBWx6TeNsDqV8zL6CY~i8XL3GMZ-W5UqQ__',
        'https://media-hosting.imagekit.io/1e0c9ff67c6942c2/download%20(24).png?Expires=1841099600&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=cJLrUQ9ah9HTXtSNzHo45jZT57-lefaRK5KVez~Eah6ORaHpmOxQDNa2vlocNlysHnm8MFbJZn12hZZlopwWrL4MbrPOCTo5Khoqw386FqH2a~323mkRxckWDekJUO~B1toKJF5naQ3PF9d-D86DViL0CUC6pDSBU2JVSfj0aA19XRJc4qzi8LVu2x8wuDl3rMxmxYWA8l0wVUKSGMXv-xz9bBT6S0uFjXIzm5PJOubo0wkUy5aUPql1Vq2PoRGStZpbvcqusu96B1RnagNKWXW2Z8hqZzXXGYTM~t5UVi7cJwhHEhbqK30LJe6X2sH5~r6QxG~lkeaFxJ7RvB26TA__',
        'https://media-hosting.imagekit.io/1926f7bfbfd044a6/download%20(22).png?Expires=1841099600&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=uXhTad~JYnyboBKNwNtNC2jmrLcIssOdDDzEg4~eP1K68AgljRyGz5a9cTW4azqg8nS4mjomPjzvbTOJqAbm1ahg8yE2CyvMaFS7Z4ftE4Fx1PFuNmRtDjvl8mB~-dezFMVVJ-lwkFVS1NzD5gRqY40T9wjtuytY1rN7iwoHQbgydZ7TMJFWRDZxKvXtADwteSuqddOfs4Sz43Cq2Pjp0bssRoBd0FhnMCjnQRjGmFh6Z~cLBWEwB4XJXhjp1KUaRubCWP8wNZ59w4OhWeSpwksfRxy4bD9s8fd0riHCQKgB6ysrCXQKmwfgwSJaA3B32FEu-xtQ6bectTSfMC8eGQ__',
        'https://media-hosting.imagekit.io/98ee41e1fbcd4ca6/download%20(21).png?Expires=1841099600&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=t-caRYyGvSE1fUg~abiW2FydXmITapvxCV05g0aWIYQ7MEN1Vnto5a32wD62otEPzaiVFs1Qx5tg5yooMswpZKjDOKOzJxlOfvfsIebUTTz3c51ALOHiwgSHq8FPaH9G4fjhOqQCjAlk02ValqWYpV61KtJ3VkGewjeMWn3j-KjGK2u2moOBQNHj9xFy2sMdbKAAEimgOjDjPw7t0b5ZsEfj1LgY6yD7A8PUpjytQkctpcUp6~9JpHDF~1WS3Fu91dEIuyIU~egy-t~UE~UOhX~yv3yxKkmnSVneYt-YLNkeWx3WPfenebPQyhykPZ1YobIv~Ghqi2AOL4Kgke2FpA__',
        // ... include all your other customer icon URLs here ...
    ];

    const customerNames = [
        "Aeris Virel", "Kael Stryx", "Nova Halen", "Tarin Vex", "Silas Morrow",
        "Rei Marlowe", "Zara Nyx", "Juno Kade", "Dante Rix", "Arden Vale",
        "Cassian Rho", "Vera Cael", "Nyra Talin", "Lena Void", "Riven Korr",
        "Orin Vask", "Elara Quinn", "Lex Maren", "Corin Hallex", "Tess Dray",
        "Jax Kaine", "Mira Solen", "Alix Thorne", "Nico Strade", "Tyra Vorn",
        "Dorian Skell", "Rowen Vey", "Sera Myne", "Keira Axil", "Talon Vire",
        "Cyra Dax", "Holden Rook", "Lyra Flint", "Ezra Nyven", "Korrin Vail",
        "Ash Vek", "Vian Tresk", "Mae Voss", "Drake Halden", "Kaela Rhys",
        "Nara Venth", "Calyx Vorn", "Eira Kass", "Thorne Rael", "Lazro Quinn",
        "Cade Vey", "Noa Kess", "Zarek Blayde", "Vyn Strade", "Iris Vale",
        "Kaiya Morn", "Ryker Silex", "Vexa Trenn", "Milo Drae", "Juno Ryel",
        "Raze Corven", "Selene Vahn", "Axton Rhyl", "Nira Vale", "Kalen Drex",
        "Veyra Sol", "Torin Voss", "Mira Thane", "Riven Skarn", "Nova Korr",
        "Ziven Hale", "Elric Vane", "Cass Vire", "Isen Marik", "Alen Stray",
        "Nyx Ralor", "Ione Veras", "Thal Voss", "Seren Drae", "Zarek Wynn",
        "Kaida Vren", "Ciran Vox", "Aylen Kael", "Leir Vaxon", "Yana Mire",
        "Tarek Vol", "Zaya Korrin", "Finn Orias", "Tessa Vire", "Daxen Korr",
        "Lira Solen", "Kell Draven", "Elex Rae", "Sil Voss", "Mara Styr",
        "Ziven Quell", "Laz Vorn", "Renya Syx", "Aris Vale", "Kira Thorne",
        "Vorn Larek", "Senya Mave", "Orren Dex", "Tyra Vale", "Cael Ryn",
        "Reza Sol", "Kalen Vox", "Dray Riven", "Soren Vale", "Zira Kass",
        "Elan Myre", "Tallis Vorn", "Veya Kass", "Korin Drae", "Isla Vey",
        "Raye Solan", "Vash Korrin", "Darien Voss", "Selka Vren", "Halix Dorne",
        "Rian Xell", "Yura Korr", "Kess Alar", "Noir Vael", "Liora Trell"
    ];


    // --- DATA STRUCTURE INITIALIZATION ---
    // Populated in Block 2
    let allIngredients = [];
    let allDrinks = [];
    let barUpgrades = {};
    let bartenderSkills = {};
    let reviewPool = {};

    // --- GAME STATE VARIABLES ---
    let score = 0;
    let money = STARTING_MONEY;
    let currentDay = 1;
    let gameHour = BAR_OPEN_HOUR;
    let gameMinute = 0;
    let isBarOpen = false;
    let isSetupPhase = true;
    let gameActive = false;
    let currentCustomer = null; // Holds the active customer object
    let orderTimerInterval = null; // Interval ID for the order countdown
    let gameClockInterval = null; // Interval ID for the main game clock
    let customerSpawnTimeout = null; // Timeout ID for scheduling next spawn check
    let remainingOrderTime = 0; // Seconds left for the current order
    let currentOrderTimeLimit = 0; // Max seconds allowed for current order
    let selectedIngredients = []; // Ingredients currently in the mixer: { id: string, count: number }
    let isShaken = false; // Has the current mix been shaken?
    let displayedReviews = []; // Array of strings for the reviews tab
    let currentlyDragging = null; // Info about the ingredient being dragged: { element: HTMLElement, id: string }
    let isQueueVisible = false; // State of the customer queue display
    let customerQueue = []; // Array of customer objects waiting: { name, iconUrl, bio?, preferences? }

    // --- DOM ELEMENT REFERENCES ---
    // Ensure all IDs match your final HTML file (index_v5.html)
    const gameTimeDisplay = document.getElementById('game-time');
    const gameDayDisplay = document.getElementById('game-day');
    const openCloseSign = document.getElementById('open-close-sign');
    const ingredientsContainer = document.getElementById('ingredients'); // Container for draggable ingredients
    const mixingStation = document.getElementById('mixing-station'); // Outer container, drop zone
    const mixerImageVisual = document.getElementById('mixer-image-visual'); // <<< NEW REF: The element with the mixer PNG background that shakes
    const mixedIngredientsDisplay = document.getElementById('mixed-ingredients-display'); // <<< NEW REF: The area where ingredient spans appear inside the mixer UI
    const customerIcon = document.getElementById('customer-icon');
    const emotionPopup = document.getElementById('emotion-popup');
    const chatBubble = document.getElementById('chat-bubble');
    const messageBox = document.getElementById('message-box'); // For feedback messages
    const scoreDiv = document.getElementById('score');
    const moneyDiv = document.getElementById('money');
    const timerDisplay = document.getElementById('timer-display');
    const skillLevelDisplay = document.getElementById('skill-level-display');
    const upgradeLevelDisplay = document.getElementById('upgrade-level-display');
    const tabButtons = document.querySelectorAll('.tab-btn'); // Collection of tab buttons
    const tabContents = document.querySelectorAll('.tab-content'); // Collection of tab content panels
    const recipePamphletDiv = document.getElementById('recipes-content'); // Content div for recipes tab (ID updated to match HTML)
    const unlocksListDiv = document.getElementById('unlocks-content');       // Content div for unlocks tab (ID updated)
    const upgradesListDiv = document.getElementById('upgrades-content');     // Content div for upgrades tab (ID updated)
    const skillsListDiv = document.getElementById('skills-content');         // Content div for skills tab (ID updated)
    const reviewsListDiv = document.getElementById('reviews-content');       // Content div for reviews tab (ID updated)
    const clearBtn = document.getElementById('clear-btn');
    const serveBtn = document.getElementById('serve-btn');
    const shakeBtn = document.getElementById('shake-btn');
    const tutorialModal = document.getElementById('tutorial-modal');
    const startGameBtn = document.getElementById('start-game-btn');
    const queueToggleBtn = document.getElementById('queue-toggle-btn');
    const queueSection = document.getElementById('queue-section');
    const queueList = document.getElementById('queue-list'); // Container for queue customer items

    // --- End of Block 1 ---
    // ==================================
    // BLOCK 2: DATA DEFINITIONS
    // ==================================

    // --- Ingredients ---
    // Defines all possible ingredients in the game
    allIngredients = [
        { id: 'ice', name: 'Ice', cost: 0, unlocked: true, color: 'var(--color-ice)' },
        { id: 'synth_gin', name: 'Synth Gin', cost: 50, unlocked: true, color: 'var(--color-synth_gin)' },
        { id: 'pixel_vodka', name: 'Pixel Vodka', cost: 50, unlocked: true, color: 'var(--color-pixel_vodka)' },
        { id: 'laser_lime', name: 'Laser Lime', cost: 30, unlocked: true, color: 'var(--color-laser_lime)' },
        { id: 'cosmic_cranberry', name: 'Cosmic Cranberry', cost: 40, unlocked: true, color: 'var(--color-cosmic_cranberry)' },
        { id: 'glitter_tonic', name: 'Glitter Tonic', cost: 25, unlocked: true, color: 'var(--color-glitter_tonic)' },
        { id: 'plasma_orange', name: 'Plasma Orange', cost: 40, unlocked: true, color: 'var(--color-plasma_orange)' },
        { id: 'nebula_nectar', name: 'Nebula Nectar', cost: 60, unlocked: true, color: 'var(--color-nebula_nectar)' },
        { id: 'turbo_rum', name: 'Turbo Rum', cost: 55, unlocked: true, color: 'var(--color-turbo_rum)' },
        { id: 'quantum_cola', name: 'Quantum Cola', cost: 35, unlocked: true, color: 'var(--color-quantum_cola)' },
        { id: 'holo_mint', name: 'Holo-Mint', cost: 45, unlocked: false, color: 'var(--color-holo_mint)' },
        { id: 'star_syrup', name: 'Star Syrup', cost: 70, unlocked: false, color: 'var(--color-star_syrup)' },
        { id: 'cryo_cherry', name: 'Cryo-Cherry', cost: 65, unlocked: false, color: 'var(--color-cryo_cherry)' },
        { id: 'bit_lemon', name: 'Bit-Lemon', cost: 30, unlocked: false, color: 'var(--color-bit_lemon)' },
        { id: 'void_essence', name: 'Void Essence', cost: 150, unlocked: false, color: 'var(--color-void_essence)' },
        { id: 'flux_foam', name: 'Flux Foam', cost: 120, unlocked: false, color: 'var(--color-flux_foam)' },
        { id: 'chrono_cordial', name: 'Chrono Cordial', cost: 200, unlocked: false, color: 'var(--color-chrono_cordial)' },
        { id: 'plasma_berry', name: 'Plasma Berry', cost: 90, unlocked: false, color: 'var(--color-plasma_berry)' },
        { id: 'static_sugar', name: 'Static Sugar', cost: 110, unlocked: false, color: 'var(--color-static_sugar)' },
        { id: 'gravity_gin', name: 'Gravity Gin', cost: 250, unlocked: false, color: 'var(--color-gravity_gin)' },
    ];

    // --- Drinks ---
    // Defines all possible drinks, their recipes, and properties
    // Note: includes 'needsAging: true' for relevant drinks
allDrinks = [
        // --- Starter Unlocked (10) ---
        { name: 'Synthwave Soda', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'glitter_tonic', count: 1}, {id: 'laser_lime', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 6, unlocked: true, iconUrl: 'https://media-hosting.imagekit.io/fa9c3e70c9e74cc1/download%20(2).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ugLlDscC5AApPI6t2ghvqQs-S5prpEf4tTTjA1hFh0cRukkf3LqwUBzzg3FyxLAPV8d2uDkz9QrmDXCIvL9q6dcgkS45sha5nfbBZ3-7CWQmRB1Ha7LJk2VFl2cNM-mLCtlEibWJrMQUfhINdytipG1mp2Jq8BqTVALQp981x99-BAId5UPEfgeKGftIGQV01D3OjLuWUqDdFZUeOIBaNhrJUUImKrEreFeP2cUPTrrVjieJ~bwaTd6nAJZZsnDd43jtSNU4z0aB~bDMTjuKZ6jGR3TvJK8mw5DypCvYW9dFkQNnr9ezBWfugL2zx28UyUn4jso1E-w4igDAuWpjBg__' }, // #1
        { name: 'Laser Lime Fizz', recipe: [{id: 'synth_gin', count: 1}, {id: 'laser_lime', count: 1}, {id: 'glitter_tonic', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 6, unlocked: true, iconUrl: 'https://media-hosting.imagekit.io/d13a87dafd994c47/download%20(3).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=pWKE691S-8KcISvHleDw~2S4sOP9LeF4YvTYWzcMECH7D3BWfdHTE4UyW~P8IB7gFOteJu31kCVm0U6H5MirM7B8P2LlfqE73oxTV25k3IVNkgNRvh5dznpT2ZFepO8fSCpwHj6txkAr4fv6GR2wpxf9zupCp~-RsHMRJg6yWPhmr1SAQy7pr0djgHI~~mGkSza4dO4F2e5T-R9Gj7ZYAjcNHxHOiW7T9VmxXPhqngeSU18Hq5nHVfGEo8in6acs6sN7Wy5gEQ2~IRMpnKMrQwbC81VlzcKxZpj07gQ1d1JnfO2WjTWf6T1JZmG9kdBy1qlycjN0Ajf7-IxPWtwKEA__' }, // #2
        { name: 'Gin Nebula', recipe: [{id: 'synth_gin', count: 1}, {id: 'nebula_nectar', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 5, unlocked: true, iconUrl: 'https://media-hosting.imagekit.io/3c5d79f4464248b7/download%20(4).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=R4Rh1fWIj~z2gn-AHOwwop6ATyiDyOWYMTwzCMOX7NSGdIby5-aJ21pUmCM6sMjIGoNQSWE1PNEkB~peznBXlOyRA7nNKFEKBsWihQpYCFAcR7pV6bYVtoxZj9FJOJF0X~eIQYznQDPz3FB44TI5Fnb1cI7C8ZtF7RQ6F2D-O53qkz9lA4cFBbZkkLS3TTJPYr6agKdkFkey8neyCNyZztzn1GhtVm97rZNwKErsSJwBXf4cNH5d-J~AYDbaP6eCLGhhMJIsT-t6uSe9KNHLlBBULli9njyEAzLNDUJiKs-NTBnnwb~~tQz17Asvojyss~d7a97-Z5F6Ff2~nBeFqQ__' }, // #3
        { name: 'Quantum Runner', recipe: [{id: 'turbo_rum', count: 1}, {id: 'quantum_cola', count: 1}, {id: 'laser_lime', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 7, unlocked: true, iconUrl: 'https://media-hosting.imagekit.io/f7f778b27b6c4755/download%20(5).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=fAqUO6hteWotxIfYI~NJ~Ij3IBdbRNnYJe50ZlD2MLc5nBo5bSMK103w8rSUrw378IOt8oDaJxA6wGWFfgA7LxXRYK9lHMU4dm0MSxq2F~yYzdIyzrKKjBd32Si59s0Eq6lQF8DaGjpCt6GW5tB1m9GGTBw1qFZSYeoA6bokU4Kry-7zPxiXkb1m2vIYMhCwAWW3FywH4uTX17BwqsgojGd5ZibR73fRvkHbgyOrRNH1eq5XsLqspC~QnxsX3OlwIFpkQ1g3S6ZloGZ8-L9sckkvUaxett-XYTTyycwE9sjboAQRHC~Q4XamSkb0NJSdkeZxWQADJSTNkUvx0LPC~Q__' }, // #4
        { name: 'Simple Tonic Splash', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'glitter_tonic', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 4, unlocked: true, iconUrl: 'https://media-hosting.imagekit.io/4822e62d857a456f/download%20(6).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=PvkN45JLow5Fj-0TrlH9fyLekIC6E5b01PAAMwN52f~Vu1zsbCWwHKRv8zl~8gZ8SpKBjqoOmkFNCoTJ1o5oBnxegqkGOoaxIn~NiZXuQZ2Y4ZPnlEfzA3vLfaJ6YHkhfyfn-Cs0eyQB4hV3XxfPmvlfvPaALAUshRH5DN73Z06VJyj6vX64TaErOqLEaX158ugUUQDlosEvY1XtWNSIeT7weTE2kGGFXGLyWA94Var7QvXTQa5rKMnGoa3OoYQh2ifF3qUWxAJF5UzZQSbitK2cDL4F-GWqzhX~y6pkyYjg4ku1yEOD9z4A16gkCnme8vwWpMeB40OFF1ZJEml-WQ__' }, // #5
        { name: 'Neon Cosmo', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'cosmic_cranberry', count: 1}, {id: 'laser_lime', count: 1}, {id: 'ice', count: 1}], requiresShake: true, needsAging: false, price: 8, unlocked: true, iconUrl: 'https://media-hosting.imagekit.io/ae6ea30f8af64221/download%20(7).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=emlQJ1HfGsel0EnvZrsa5s9KLo5jjKhv2AUFUYweX8NRm0PWy10RTosdwWe~MP7nXjyQGFsu1xP7jkOvoCOmPogiTWC2j7MAlSbyiQ3wRc~SZeXtSWg8APfK6YtUQ295L6eLdKVeUAEvC0piBylb6IqxNWxkce1WyXUrEE6PYggAKn4Me2GOHnhEUWG-yGQVux1DnpHCdWldxAaq6oNXZ58BelZSxDhJTJ9UT3I~rKKTZRDt5gOCdTly~5IzoiJ4B1cQY71BOhl7jaGDM5c6kvFcUsaqNdO~41QtSjgwCut4TguDUru0PaYN~awCvKXBtVmUVhBH~ULtdXO3mujAxQ__' }, // #6
        { name: 'Pixel Punch', recipe: [{id: 'synth_gin', count: 1}, {id: 'plasma_orange', count: 1}, {id: 'nebula_nectar', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 7, unlocked: true, iconUrl: 'https://media-hosting.imagekit.io/e54150656c184dd0/download%20(8).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=c25bWUFx7UEXaxaZDignaqLvmJUiNKOZfFz4tQlbMYy1AFkE-5lTyEbwOAfzL6hEePUxmOb6lYW-R0Gkg151ORruHxc9ol7hg5wPlONEIr-ifugOKzruGBmFgeyrrp1OWlQItfvVPVgymHNM0R4rZ-eGPhxur6DTI0nu1r9rCVDmHoqdp7J0cSinHOyTPT2AGxKCdne4HWCYwSWaesEc-LEHiFyYqj1bCfM-jjYz1NihICD~FdgZPYaof2zfziFM67eg193p2U67gb8XtfKbo9wIp4oeOEOC1ZPvPEHGfvol7poS9x6MIOh9evQshQgEm7BhDPxdgMQskUMe26oNpQ__' }, // #7
        { name: 'Cosmic Cooler', recipe: [{id: 'cosmic_cranberry', count: 1}, {id: 'plasma_orange', count: 1}, {id: 'nebula_nectar', count: 1}], requiresShake: true, needsAging: false, price: 7, unlocked: true, iconUrl: 'https://media-hosting.imagekit.io/a8a2eefad30f456e/download%20(9).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=SAhTFqDJz4OOOchfzczA7BX8D7rMiXxKDpDHjQdsp~guTGowsJc6v2J6p8AoUIFczZ-uLtqylxICdK42o22PZwXbeDvYJ0iKMOs5EjFtmST5YRhRTPNb1nSfi3OIE-9DdyccRdiJGkuCxiT7SuAdlVWTQWlgymWZ3s5vtQIY~ExKmkOthWonBJ0nOlhYESKlzmm4LiynGR4D6SaHKFjvr14ZR7-wOpHnmNfSZT8X5D3hswM8xXZAe4PQ1mxNL63Yl~VLKYMlRBnsFG32nxxfTvZSgNB~AMGdjKm~54KGOIKeXADjuo4EEghFPJUm0589Htx6duSbWA57fo0-IDpxHw__' }, // #8
        { name: 'Rum Cola', recipe: [{id: 'turbo_rum', count: 1}, {id: 'quantum_cola', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 6, unlocked: true, iconUrl: 'https://media-hosting.imagekit.io/7cd0a2979aea4cd4/download%20(10).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=hNhHXzxKkREHESDBtrSV4~vTAAf6KEN5JWOwKNTxVkwPMZHQ1i0LN7sF4OAuzGi67vXDgfvJo3Q9D9K2VeB98ZcgNdahiPPnsCJHENXDIqIrwYtLRZ-CIY42LRiTLRGdHHoaxryKWSP9wNgza8B6SMEwhA3z-VYnnaAmKhC-s6-NWO6t35Ok-kcZ72V79YVsagymexkSANgxmlvaZ6G~jbGxC~Tqr~aMx2J0N1LVdvgrAssOeN78TULQK1j-DtalQpywMR1LtTHbgYAb8eeiLkjM3-6ahAELJMZWe7Bb-L5PtsaLkfsN3WAKTm7tBjLZGp5oWHub4GG-E4S3E9LYhA__' }, // #9
        { name: 'Gin Lime Soda', recipe: [{id: 'synth_gin', count: 1}, {id: 'laser_lime', count: 1}, {id: 'quantum_cola', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 7, unlocked: true, iconUrl: 'https://media-hosting.imagekit.io/67bdbe0bb0bb4d0e/download%20(11).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=OXHm8Tj5ZR1AVYO5LNus0LprHK9w1iv8Wm6gj~6ISbtkMQ8bGNNZncp1qDJEWpBMrS3d7pQXWTxO0-NSSSrluJPuWTPUBw1EWzXq8edu8cjWJnqwd6JHXwYmf606D6pIzg0ZXs5d4YmWP5izhxk5LyCxTmnnLLewNR7WDN6R2-t7hHSZyTbelKHgbTB8s1FGSC8nL~JU9lkPDsN3RacDIgDWwXY8dnUPuxIj4cIol7KM6Mm4E6spAl-5c6moROSEOqzKUy8Fbieda5jjmQNTxT5T0ZK2Cm4tdqXEVVcow3I5FZq4AhUwreLmuD14wdAPKe-5Kuwe22WVCDJECeZbVg__' }, // #10

         // --- Locked Drinks ---
         // Tier 1 Locked
        { name: 'Double Gin Tonic', recipe: [{id: 'synth_gin', count: 2}, {id: 'glitter_tonic', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 8, unlocked: false, cost: 50, iconUrl: 'https://media-hosting.imagekit.io/f9f56e69e2c24e9c/download%20(12).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=lKfI9PnKehoU-EGEIBqgwzBuqYrjFtLvu~3a0GVLles6xqw4lcYDyr3zemfRpo00v71Q1bR1rOXmOwx-oJe0O88uNyIAOGei2eGCow3DfVvv~SNBrrNYssz3Zi4Xo-bwJYXvO7~pFEmW1A5Kn6WD79p0onKpj-GYxMy4LChzqZsUozf1QayNMOxr0Kdt66UMiHdSly8hipM6WgTmszbNZxmmjF1wkxtf4xIHt9oSSSXAQr-iRKUCnBBu494qsRB4VSZjYcFAEO6O3sf03qT6lnms69J2agdwb3PIVrsNA2~VNl3UEFMu8twf3sDX0-uwiWfmGAmPNx1BWZ6P4zHERA__' }, // #11
        { name: 'Orange Burst', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'plasma_orange', count: 2}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 7, unlocked: false, cost: 40, iconUrl: 'https://media-hosting.imagekit.io/5a6c5f9176854050/download%20(13).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=OiRbbb4VDUjz0C8RG~ipBxdgWnzH1iSBkfLoqYVkL71XtV6cqRBd~fCakzCahUO7xr~eygTLgHgZ2DTLQcEsnO9dYYTEUqXWXh2hapYy5UTbnNuS1ahewIviwq3KTe12GQQ8terciiZWDIUZHOeX1RAOZqhNBZjQ0EfgMDPNli5Q0N6Ya7MMeYakriuhteLo-3zXMvKkhln7SpxT14Y02ye9POwkmqMWG1Gv0WnxAmzoQOjdF38nWeVrvBrsvFi0sPKAtNqRr6i7yduIfPyE8HYrJhybrm3iWL418gquZ5PB4rpDZLURRVqnvlXRQHINrnBrP4l62TyweTKIYWv4SQ__' }, // #12
        { name: 'Limeade Splash', recipe: [{id: 'laser_lime', count: 2}, {id: 'glitter_tonic', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 5, unlocked: false, cost: 30, iconUrl: 'https://media-hosting.imagekit.io/ffc08a9b0600489d/download%20(14).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=UpIrDuymbKEZklcmiYJhKDqopcFb83O~gb-93GdDaSWXQVzwQb1enPce53Eu6KzdfDOTe3cMYcJQ0sWksNpSErE4L-giRnlzU16Whje92EKxJ12VRZ7jlTL5vO0AKk15XW06QGh1RXaHt2fSP9wu4NtqlSyxrCqvl06kd9c3CRXvfBi1ysoVVC--BbXfD-Y4n1sz2v0MPdXkTj5ZMfcx3ac3k3LTGV1kNDXUNoNGGeXAH3t-K~~Gxnqs1~WsrhBkfYAuj4dl5OrXLBv6ikCneuiAxDbztpdrQjJy9ShvdpHM4CGaWN5BwuyGXnJ2vb6zmuFRdhvWGYQgPwNV3-0mcA__' }, // #13
        { name: 'Cranberry Zing', recipe: [{id: 'synth_gin', count: 1}, {id: 'cosmic_cranberry', count: 1}, {id: 'laser_lime', count: 1}], requiresShake: true, needsAging: false, price: 7, unlocked: false, cost: 45, iconUrl: 'https://media-hosting.imagekit.io/c4587fa0ad0942de/download%20(14).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=GR0oO4inru9gz7QPbrrM-lXcBIhB6ELOz3T0GOctmBJyisuBYvs895Z13d9YwURc~M1S1dpzyeK3a9EiswG5RI-AQbB2hk2iyccQ0cUJCVi4Am9CeQycVN2fEP3zUlFdd7dFXXUlojEN5c7aS5Vb4p5O1W2LASIcBpmHAa7Ms~k28n8bn5cbFuqHxeUBxxwoZeFam0P7JSgvjcV1DPbZNpUsrwo-b4EHSJz5PSRQwWMWfKfPpNWjdpxbk6HjUURdEkYC5WyBAUdnrvQB6b9SzNPChDfB58I302Mnv6tNG6YGnhUIUYWNfd7i1jauJRVVI9VDk4zcgvY2iLAQD5e12A__' }, // #14
        { name: 'Turbo Tonic', recipe: [{id: 'turbo_rum', count: 1}, {id: 'glitter_tonic', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 7, unlocked: false, cost: 50, iconUrl: 'https://media-hosting.imagekit.io/ec04e7fb2cd84e19/download%20(16).png?Expires=1841094862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=VjupyxedSDcnAie3zQfMqL1ZCJ-JhU1LW1N8c3ffGp4y-cNoOnDGV-GxmLDxWhWEERzCcc8Oj6vX0nYFKhKPWVuT2dQT0sXV0Mc8KNLbJA2Fi22aja9I-dX1up2xC3pzRfWzEQxJbklpV4bOrA6YZl3lT9QU4x03Wr4HNr3w4ssez~Oj~-pdHpzAkyQRYkKrQjcZsu1xlawfY4snszwZjy4fGo5zVBdKgSjMtSSyvHdhg2am-zFyFT-Q6XQWSk9FxBDL9gr8r~mV38PCjzSlqE6mGQXZ~Cv5iFKYCLE-6N~dEHFUpsYlSbs3QYoZsuT9pSr5WRwRG78XHIrs9ZmQFA__' }, // #15
        { name: 'Minty Gin', recipe: [{id: 'synth_gin', count: 1}, {id: 'holo_mint', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 8, unlocked: false, cost: 60, requires: ['holo_mint'], iconUrl: 'https://media-hosting.imagekit.io/613e0a4db48341a0/download%20(16).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=KC5t1TU5Px0gdawwzStxtqipBKHnvgCAFodmMwMWDQpLbYUyXXWuuett6t8KkSAuj0BV5w71Jk~Js10h4zRNpTxiQxM8r-Ua4HtRDH70BqGMNs9mn~gHyWZPGJvg0Ea38LEfo1PB4z~0XVXlU-H2X2y~BxScuYTP6mbUGFPaoT7-6td~HoH4g~SYchfFeU6~hPP3~K53vdnftQkxCHkYGnMi1RJbBcOqobVO9WQw6gUmUw6o7Bn-22uEzeFA~WPvu-cOiNstFef8~32c324y4aTKfaVTB7PUsQ-JUx1keDAup2BnUmrmWoXbFIgYsx6kU-JdCMgs3O1aG8p5gnExvA__' }, // #16
        { name: 'Lemon Drop Bit', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'bit_lemon', count: 2}, {id: 'star_syrup', count: 1}], requiresShake: true, needsAging: false, price: 9, unlocked: false, cost: 70, requires: ['bit_lemon', 'star_syrup'], iconUrl: 'https://media-hosting.imagekit.io/5e5c957dab3a41c0/download%20(17).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=U3FjtvxbPUA6g9ZbmXnSejoB3r~KbZS0qhcjuenJVsFCc70kON6LkHfk7gW1oYIxxc-RwVgIZasEw-WOheLLQZh8j27qsVXscOTy87mgSmo5DVIrHYw7h2nCgw5JzQ0BWYJCNoNcGUeJuA-N2BivCtxuGUE4pJJJLmYuR~m0MNMdBYCmLaN2524m1YF1i18FlvzCGQfRv6U1BXUkFKnJSHV0gpta6H1sYytkv6LTOUWXMD~V99Qkko77k6SUNBzLmtnyy0t959ORMRFAq-rLwu9wrSMljTwcyKgu3Z96SAUvCqm0Hmetruj8~pPc8Nxaummp3HWhcdHy7SNhAi1-Lw__' }, // #17
        { name: 'Cryo Cherry Cola', recipe: [{id: 'quantum_cola', count: 1}, {id: 'cryo_cherry', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 8, unlocked: false, cost: 65, requires: ['cryo_cherry'], iconUrl: 'https://media-hosting.imagekit.io/da5f703593e6498a/download%20(18).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=oSKNV6GgRnT2Yc07pqfBITki1CE8zkEbIlLU52GItir9EocsM6uJhQpF3EdnD4E6JMTsrqRTbFvIC5gxk9QnZvmWKY8RMyIYkYnrnGkq-5IMC0N82tE-sKL-CPFv3RqwcLEuP7KsrK720fMI1HiwUiKdqB4aZCdG0tXcAABBD56stCj4azo4BFUVYm0I1XfJP0NQ1TaRuKyw3dwoRAca8kFz0vT27EYWSl41PzkB6oRBW7~Evsuk056EWq2TnRFO7ssH92e8sWh2rMOZB5UfYImE3-eVI4-Oyr8iznFUri8MCH6M8i-LaUKg~WCgpKz7vp9fsRhect1kf2x4U3qbFw__' }, // #18
        { name: 'Nectar Twist', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'nebula_nectar', count: 1}, {id: 'laser_lime', count: 1}, {id: 'ice', count: 1}], requiresShake: true, needsAging: false, price: 9, unlocked: false, cost: 75, iconUrl: 'https://media-hosting.imagekit.io/8d568f7b5e6a4c49/download%20(19).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=3LvCOzzWQrKt6J1HuCAj4t2JBZb0DZcIeobYh6XZzxgTMi~IpeuYjEBhs1CvGuHozbf7RFbSuwYJFwpGHTADCTXd6Yh4w6JNZB60WZlqDt1ZLhCs6dbMdoMhL0ldeQCMUSYG9G0mEyxZfgT8jAJscAe8eJTYN4wNz3j5cf6ALTjnm3sjjHKcspmZlVYYK9VIlFiNuidiLTchxb6v0R8u~L6afpFHPEnkK9fIVa4jsif7aJMvdOXN4HCmvtwNwsNqOR3VNiGgT637csBfz-P99Ukrhb5taU7da~p8L12T-t2zWc1p1rsH9Mo0tpdk77Xc-fsKpCV9cUImg35KFZsmsw__' }, // #19
        { name: 'Plasma Rum Punch', recipe: [{id: 'turbo_rum', count: 1}, {id: 'plasma_orange', count: 1}, {id: 'cosmic_cranberry', count: 1}, {id: 'ice', count: 1}], requiresShake: true, needsAging: false, price: 10, unlocked: false, cost: 80, iconUrl: 'https://media-hosting.imagekit.io/d33538c389184f6b/download%20(20).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=w8HA-U148gLuHEDLuE8CXzMBIVR58ANQ9nabMXIfnJncYxSuSRe8kBqpN1TpMkb4F~z4jMnnHrDCgfHrDLstt4bcO323OYUBO42lixOO7udrgH5mEJuqmyW6gqUaCvij0ENfKOruYvOsm-JMlceRtOW2YTgedZrF862mBPbWuMbOthobwjUkaG0DgmYjNSTluKKRF51XhWB07UdBqN26-iVJrWYUcJy-YONiZQ~YNpGp8FXT1FFSotcFi8~xG1SXb2KeSwSVDOTFooUm5V9pJGWAX1J9ldci-nnGvl6eJjI66dd0k2y3~V1pQ9BNxOlCH8~AUzIGRNyrK7yUDlyw0w__' }, // #20
        { name: 'Berry Blast', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'plasma_berry', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 11, unlocked: false, cost: 90, requires: ['plasma_berry'], iconUrl: 'https://media-hosting.imagekit.io/d90d4b548c2843a4/download%20(21).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ioSJwnqlKR8cITWsQG7PgVKpsbBT-WN5sX32YEATxp1Lamj8nCxqgOPT9KZHgk44i-BmIsvIVxG-H3YGtOf6xwtbnYWDpIASW~Ft4y3WpG9GRgLq5yU7V6gF-mSJF4byJQIwZ6ghBsJMpD6xAgDPt51w~dL4ka82WM83SmYOzJi87QdVqpQ4C7O~ko4~RlncZoFxUtzXk4Cfg2IgAcJyCyPbEktGbSlu0n-MGYDKCP8M8q3zJMj-~qZ3tx4jaEvxQta7mjNXgK3J1ZsAxCg5TnucndwRD0xmN4dTdbQvfyOgVvqADV~WxChsosmn~NkrYvQDsSv3Y2VrVbHv9Ak07Q__' }, // #21
        { name: 'Static Shock', recipe: [{id: 'synth_gin', count: 1}, {id: 'static_sugar', count: 1}, {id: 'laser_lime', count: 1}], requiresShake: true, needsAging: false, price: 12, unlocked: false, cost: 100, requires: ['static_sugar'], iconUrl: 'https://media-hosting.imagekit.io/2d435256bd6c4ca6/download%20(22).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ewmXrzknipibHJ9AlnngWRpi3iHkawMsbQ8o3xKPpPa8BUpMOGWa7YLxyjO710AuUgzErBh1Zhns4-5~3Xt6oqfPm5nTiJBLVdhUJT23jKog8D~3kKnA3sE4foadJJTEObwDSGY1~Utdt23wllk59nome2vwqnGTc1EVV7QLlNJuTSJLrgsKmX6cXHLloM2Thxr0gvTlZ8Nb3ZFQoIdWukquBB31H1DGLfUYNs3lauNyHCyvqFhYFBtBjpP5EaUVIrqL~5GHxmYglZXmMcYVs5tj0RiBRaAuiw2dhn2jO5nD9nlLmB~96crqqounj0TCqQafctpzgMwC6vK9BMLyQg__' }, // #22
        { name: 'Sweet Tonic', recipe: [{id: 'glitter_tonic', count: 1}, {id: 'star_syrup', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 6, unlocked: false, cost: 40, requires: ['star_syrup'], iconUrl: 'https://media-hosting.imagekit.io/a8e67a93dd2c4422/download%20(24).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Oi90i~-Zxb9WFdOU8L6GUJcFYGANvN77iXbQXh~34iQJFHEbIrxCE9mZgSn7N8vxwXdBkoKF58M6w2ZWBQ7obGNTcdxzQV8rZ1-zUBX8mPfKpBcKtdS2zXrm9Jua~bCptMZxScGC2ee0vE4j0HO35RpfSvfrce3bs2R-zTRjxAdFo2f1DCF~nP6BjO79LWMuAQO8zL7eqi-HqQsUT32kjyDi8UlAXc7CR0fkX5S7lA~nkBR87c9U-BIlw3~Iivbv0Vfzur8P4fXTKirMIy9eCITATbsJmOauu6Tsnmp-6ETk0GIQIiQ5HCOEvHW2WkcRu2KSBu1mQHwRRTepwUwOcw__' }, // #23 (URL 24 used for #23)
        { name: 'Double Vodka Cola', recipe: [{id: 'pixel_vodka', count: 2}, {id: 'quantum_cola', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 9, unlocked: false, cost: 60, iconUrl: 'https://media-hosting.imagekit.io/df36c167b1b94f24/download%20(25).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Pnbjgm~hVzVkqI0pz2hTOsCN-sncqsoR95MNPdwtABrnjSrqMiSMOWJwGgtFG2IIBPdrZ8~4~ZWOhupVile0bqr0SlCDQZ8829j2ku60VgnMySOh7YaDWgOpY1dUWflwkd4IJ4Q4ZqmjQrpLYDV8gaJRxDUip3LUT6GEWCEwX9xMYXwagjytI-7wfvy~Mx2D9sRXIf2nKPhJ7MUepi9SrXRCBO7~Al7BAb64vUkIonjdl2pmPlNJCLz~R8Sze9bS4wJ42XLRlW9pTCFLwO7bdVE9xPNB7A3HfHuWSXcT7NqvRLGxsL7e9-R8AtqjLy40lCF0M7y62L5Nb6fKdgB9Kg__' }, // #24 (URL 25 used for #24)
        { name: 'Mint Condition', recipe: [{id: 'turbo_rum', count: 1}, {id: 'holo_mint', count: 1}, {id: 'bit_lemon', count: 1}, {id: 'ice', count: 1}], requiresShake: true, needsAging: false, price: 11, unlocked: false, cost: 85, requires: ['holo_mint', 'bit_lemon'], iconUrl: 'https://media-hosting.imagekit.io/336a86a79f8d49bd/download%20(26).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=er~LSXbglxDJodlIbENjKuNzPf7~lOpzUBaM1NcCPeUvkl5ZQBaoi5aFsWP29MX-d7RbnmCTEkUUk5MxfCLDa7X7SZ1ACRKObQkNc6Gn5DlmMdVpM0yAsc-rDi~3Vk3RL8ZYqpIIOVVfJoVkykAdozM6k82p9wGQ0Ntlqco1q4kmqOnHDGbl~CqywhLxDrUPGu-nu36vliuFM3j~zg96-0ExI803IU3jPUbdKFZs7BkgX2wT6kdng-IF8Ed0rGUZmrhxkL2fkdZGlHf5V54m8QQUg0IL28pXa--k8iyHoMpUYLy62df8QhcFbzZvLqT9ilmrpFKMMpRQ4QPo5ON5Lw__' }, // #25 (URL 26 used for #25)
        { name: 'Quantum Fizz (Original)', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'quantum_cola', count: 1}, {id: 'bit_lemon', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 6, unlocked: false, cost: 35, requires: ['bit_lemon'], iconUrl: 'https://media-hosting.imagekit.io/391035725f094c17/download%20(27).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=JhwstNxiw59mFNxTIUUZP8dJzb4GIpEdH4BTEAguvxD8Pcf0BZu8Q6l5RlLXgxqBQ3RBepB9i6HK3Ov3yJBR56H~pw0ZxkdASiYT0-XpxY0NhafUcQX3JSO1~uIjE-bhmwhUN4lv1kSUDzo9XnjvqMMJr1L-d8E5-s9f5dM9v1cKC4vtqHsOcL6pcUPUgkaKhqL0q8ZIt146yKS2VpORsiYFxWgjF1amLj1Sp2P0JHj~HionKWqk-aTYFI5YrwSLgwrV0CCM9D6biLZNasPn8EJvFQoLTbqkp1tCZxA2UjrqYUKoGVzDaMqWO6OLMMHb0LNjxaZd~IFAy9S3JhFpwA__' }, // #26 (URL 27 used for #26)
        { name: 'Simple Syrup Splash (Original)', recipe: [{id: 'star_syrup', count: 1}, {id: 'glitter_tonic', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 4, unlocked: false, cost: 45, requires: ['star_syrup'], iconUrl: 'https://media-hosting.imagekit.io/4084abc4b35a48b2/download%20(28).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=1QvFa94kclgIjN5zF6~GiyDrIwg5egCYtT8jfED0uxxKicq2eEQOphACWfu59SpBGvl5auG-yemeIoYhNkycqdf8R7evWD-XT58vzTgIS7s8QeMUjy8g7py09ITSiTfMsN6ym8eY6VFEjdBXPONkxpLaqbuXm9pmsBhW0mzQJjcYL~6JnWmQKZbb4s6NYgQg58pwQ0Qff8ZS-ISzSqSA4lj7S8mtUOtbhnlieUOawJCKKdnQ97qS-68ETwrTXJ9Q-9EHpYF1d-vm1ZK6Sc1VaqpcuGQljOtN~rc7GspPL4Dir2x1~SYiaUm-MYN4jD5S8Mx1QBDk5cnhCvgX7XdGcg__' }, // #27 (URL 28 used for #27)
        { name: 'Rum Runner 3000 (Original)', recipe: [{id: 'turbo_rum', count: 1}, {id: 'laser_lime', count: 1}, {id: 'star_syrup', count: 1}, {id: 'ice', count: 1}], requiresShake: true, needsAging: false, price: 9, unlocked: false, cost: 80, requires: ['star_syrup'], iconUrl: 'https://media-hosting.imagekit.io/8a53b179e6ce4827/download%20(29).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=dzglav5sxdHIwZKJKjGrGcc53VOU~vSalzg8S0H0~X1tLXtdLJLH2QDm3pdHaJDdy8A0-HQpYnPJE8dOIWu42zNNHjCvn-W3tWVmgTPDbpb3DmRLWQaYMHLi2fkA4meRVBdcdORiLI4L88dOHzHlhHwVtcXLvuUThScBw4z~afY~aWIEs3zoq9fdXgBu6qtDb6kyHJ1qL6HRhJ5AxlBGxrgQmc87pEmEQjXvngPkL~k7fA98dlcDEf8gKmoyUp8OAm1lE-jwSrh3TlhVBlfZXImSDbXrw5n3dHZ6bRr0PaBnw4Kpu-nt1N3pan4HnzecpLy5L86klJ-3eDIxunsH5A__' }, // #28 (URL 29 used for #28)
        { name: 'Holo-Mojito (Original)', recipe: [{id: 'turbo_rum', count: 1}, {id: 'laser_lime', count: 1}, {id: 'holo_mint', count: 1}, {id: 'glitter_tonic', count: 1}, {id: 'ice', count: 1}], requiresShake: true, needsAging: false, price: 10, unlocked: false, cost: 90, requires: ['holo_mint'], iconUrl: 'https://media-hosting.imagekit.io/9576aa71c69a4220/download%20(30).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=i-rQFeuJhCJEQY3dbKDfqsfWP0Hh~0nx88EVIBPEZDC2otk4QbnwYH9~eddW0sE6MZ3vL0oil1rW8Ve~RXX0TO7ZeZpjvw0V3bEbA9X3satplJLX0lVvNgJ1r3jXomB8tcg2vuvqKvi9KKfEOc5Hk1eVge-eD0qPPpjChHjpPJ7lYaJjBgT9FlTIsUtsQ0Kc-f1NMR3DMpbcOAhg8SifnIjy50j9QuxO3hH4naJQ4JEQ3-773c-FSB2p~Jsjl4CReGZhfE~MYY51n1U74CVva~mh0R571MUU7uPYZCBZkvBuMmFqftq~DUb4b0~Biuhrcebfc4sr0kKEWCr9Ej1-3g__' }, // #29 (URL 30 used for #29)

        // Tier 2 Locked
        { name: 'Galactic Guardian', recipe: [{id: 'synth_gin', count: 2}, {id: 'nebula_nectar', count: 1}, {id: 'bit_lemon', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 11, unlocked: false, cost: 100, requires: ['bit_lemon'], iconUrl: 'https://media-hosting.imagekit.io/76f2df7e732048ab/download%20(31).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kpcvSC4-5adRtIKrAothtjeEaZQ-OXSCcivxfzKW5cG95jxKZY3lfNT539jdVXetzbi3gMK2yhNAu7SXPhM224KroCB08R25S8tcCFAxY78BmB31QSAKtIuVdNrlVNgNPdMQzkP6dibJeNxBV6oPBRdZJBHifeKJl2qha5NNlznABn~602PM0ZUgPJgn0XJgb8FOndRcppt6i2go2eXGewV9yAXk-F2rLBE2lUWD8KM39gMwYMWS3Y5n0bGoeZH-81jXxpB2t6jbaikkz~p8BhitaowYMuZlIGdEkSwpecvHCa92U18KhpFe~D~sk4-FRrFo0RerFzNPt0n9aeIKiQ__' }, // #30 (URL 31 used for #30)
        { name: 'Void Berry Fizz', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'cosmic_cranberry', count: 1}, {id: 'void_essence', count: 1}, {id: 'glitter_tonic', count: 1}], requiresShake: false, needsAging: false, price: 15, unlocked: false, cost: 150, requires: ['void_essence'], iconUrl: 'https://media-hosting.imagekit.io/f63956f42d14411a/download%20(32).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=mW9b8LWfpC9-sygT7YcuUBxfGbD0c3GOrzln9V50AFSNML3J6KFm7qkDF0YXkue4cuSC~is3LPCxGfUNxRTDjlFskiCM9tNTZSpWtNnQDcvZ-bvz1wgl-qBmZQhmBUK5uJKCbBQaoArqQb5DhuyEAsLW7-NNR3suaWvcYXfVStpKrm91IoHoZ7Lgy4-~buO~Em9XHFr45KAA3M9S0OKrRaeaqTMa6-93Dgz65An3fNdxxWreFSiuxlRsjFg37McE28DtsyigMNR~NrSMTgVQRhmebKkP-t7azCXv-6S5viYhAJszzK8EGOtS9DM4bwoM2c-PwuFdclZgLadTl-LEkA__' }, // #31 (URL 32 used for #31)
        { name: 'Flux Foam Latte', recipe: [{id: 'turbo_rum', count: 1}, {id: 'star_syrup', count: 1}, {id: 'flux_foam', count: 1}], requiresShake: true, needsAging: false, price: 16, unlocked: false, cost: 160, requires: ['star_syrup', 'flux_foam'], iconUrl: 'https://media-hosting.imagekit.io/4729c9f6c24249ed/download%20(33).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Z1uUpkre3O94-bBcUzd1eGzg90s4NBwxY55KRO9pFeI1Dqp7tMcVC~VyZV10f~Tvf5lO4L18FnJoKMZIVvqh6X0QsxUh8sSn0a83IkMaSmGxjvQfIb~2bY5in~Ybz6L~SWr-eWk78~A8i2p5D-x1VJ7NWiVu8b1KDxa6SzPlU~esTknHBZZ~LDf0caI-uCOYG4wYNJBvK20Dm-eJH5XnLW6SsHZqRyhUJm07nUh2ROMbJyKe2wcVLmH6h853iIw2BOa0Iz7DD~iZeHT8ewsGBwcKkqDsJzptw9pr5M3Pzcgi-emtX6tKsfobCvi-~~e9nsZoG9maYpjQaP2ex~46DA__' }, // #32 (URL 33 used for #32)
        { name: 'Double Mint Cooler', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'holo_mint', count: 2}, {id: 'glitter_tonic', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 12, unlocked: false, cost: 110, requires: ['holo_mint'], iconUrl: 'https://media-hosting.imagekit.io/a18dabd2c1544cc3/download%20(34).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=j74TK9P-ZD6sTdBtfcFwYeQLisaQYJ-RPfTGfe0wewUntf1h0VhKaZe-4J4mQjFHS2faCik4RGCqsPzotE~KIQsgXlT3i~yXMpRUUphQIRuwHdU8Pauvds38aMR-gwo8nsn-YL7awHROPIEBeuFc1Qs-RZf2vethdtz7V1tx5ZhUMKL~9pam4AMA-yldxX2qPg-gORSDHQSLhGPqGWIrwVVnnjbdGvLSXj3uxier50LpSzCy3tFgiYeUnFwT5DUmjnRPSUNC4wddrnvijEoLrVrbNpiZVz2cdIYpBCGU4N2sCVCspfnJR8xyMWIFImplvjbh26NcwsmtFhe9EqnlkA__' }, // #33 (URL 34 used for #33)
        { name: 'Chrono Cherry Sour', recipe: [{id: 'synth_gin', count: 1}, {id: 'cryo_cherry', count: 1}, {id: 'bit_lemon', count: 1}, {id: 'chrono_cordial', count: 1}], requiresShake: true, needsAging: false, price: 18, unlocked: false, cost: 200, requires: ['cryo_cherry', 'bit_lemon', 'chrono_cordial'], iconUrl: 'https://media-hosting.imagekit.io/d7584bcb1b434ae5/download%20(35).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=AurHoRvyKLc1K4GhO-yH5azpQNmvREQx0kE8WoPOzZrqSu4ocV3b9sINwqdJNSQ-8Jy8n0SyqarLibq7j0wJSuhTwfpiqoUCkrWGLCleFWcPPELUy-ze5g6gjDafcx2P7ROGXU~wy9cutTQMG8eNSoaArpKrnr5oesd7jWo9iXgwMN81T1F1QBF~QzTXdJoohXOz0am5pmVOMrb3AWmqhpIuS0NbnSwDBFdvdefafbSb9ld83HEBCT0k09bjYR5u~ljsdSJ1U0fLK8uk5aDDfJOWf3o1FGC5ODMTXp7KUnTh5arc~5zuiibHDkHK5TspGzaH9RZ21BhmFRaW~A~rmA__' }, // #34 (URL 35 used for #34)
        { name: 'Orange Nebula Shake', recipe: [{id: 'turbo_rum', count: 1}, {id: 'plasma_orange', count: 1}, {id: 'nebula_nectar', count: 1}, {id: 'flux_foam', count: 1}], requiresShake: true, needsAging: false, price: 17, unlocked: false, cost: 180, requires: ['flux_foam'], iconUrl: 'https://media-hosting.imagekit.io/aaa887476d8f4fda/download%20(36).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=cmEIK~tjDfQw0AqWZiwYUxB-q0BE6kdo5oEc8ccLB~blIK8iNkWVIUfmyD5ShJyJOVNNLC5627dBeM18pbaamKnENV4OW0zQuDBpVesjPyVLHABZWsZ2lkhEEAGEtHUv~SJ2HcLjkKixC7SLA3jSfxLwZGjKR-otl~4P6t93jFqak9B~aE8Ez5tTyZF5aVb2hUzUZDmBa6ctMTnfe8Udx6RxXBSiZqg7AgztjYIFaq6fcCi9u2o7KJz5O~zCJheJ8efP0xIhu77jAuxaG3fEw2WgGzMhPH1c-vOA5nGuit7PKlwQg-wlRzvNWU7Fguoc1oF-lXniTA8zvJhzKO0DxA__' }, // #35 (URL 36 used for #35)
        { name: 'Star Syrup Supreme', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'star_syrup', count: 2}, {id: 'laser_lime', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 14, unlocked: false, cost: 140, requires: ['star_syrup'], iconUrl: 'https://media-hosting.imagekit.io/1c68962bea314de2/download%20(37).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=qc~T6si7GuX8dCq0nXsuoITMJjogOuwGurybks~Kuq~2ZXhKfxK3WUic4zEC7At8Qn6BNXz4PGmpsWB0IMryE4mUn~lwqzH8M8VgC6dG9XAAO43LvOwyZuTCDZwynHn475mnD~Cq820GDm1HjIT302GeIM1swZu9aoaKa3QX~aYNLkwetpQpTfrYlkPwJ3v6-eKXpR~h~Avbp21qHuMcQ77fwTZxOuVwhc5~GGjSDNwIo5ETZLQ-cyi67ZsEKqGLMAXt-CrunHKY7-H6g0zMZ69pLV2r14e6owLfObWh8s8uhWKUVyLsB3WqwhX8-bIWUUmgh6gPPMOEh6BWabbiQw__' }, // #36 (URL 37 used for #36)
        { name: 'Quantum Leap', recipe: [{id: 'synth_gin', count: 1}, {id: 'quantum_cola', count: 1}, {id: 'void_essence', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 16, unlocked: false, cost: 170, requires: ['void_essence'], iconUrl: 'https://media-hosting.imagekit.io/fece7c81956c4860/download%20(38).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=V6OqJJlMWxGVFY-DnYMi-EibKWObZiKaEzow-g0z5oAivNBKyi7IM3sFBiphNKHP4HTGgEo5OA3Y737apTvcbafSVpPDoxnDMcLxzmr8-hVglAq6M6tTXFdRPD9eKiqOKQv51QXpE-UZBDmUfHTXCxWBTSCOpT-Cqbgbv9NoiWrpoL8qqAmqvzPufIryFhDPR~g-BhVGQY1vTiqcbPkbL8DsxV-CIuVPRzyPUNMbeVZdZL9ssBUlKdO5yIyM~mJV5QkP67toS1Y3vThBP6DJMGxBk73K5S6Pfwxz8yxIKX3cosqK3ypNTeIkTNhvp58hudgrp7QXP0NEDPGNvyOKuQ__' }, // #37 (URL 38 used for #37)
        { name: 'Frozen Time', recipe: [{id: 'pixel_vodka', count: 2}, {id: 'chrono_cordial', count: 1}, {id: 'ice', count: 1}], requiresShake: true, needsAging: false, price: 19, unlocked: false, cost: 220, requires: ['chrono_cordial'], iconUrl: 'https://media-hosting.imagekit.io/ff391dab6c3b4ad5/download%20(39).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=v1xM8FU0j1Ou6vZX~pOLjO5A7~2VswPX0xlHLp~BE0CDIs77Wfv0ooyUkO0nobwBLf5sH3tHzGKH3JqsR5Ntj4AhTNhMCERj7-U3mL0fto~CT4xBsWb1EFHaOjW3SM7YA4jgCCnNfAQboGP0RLE9m~GTpXdj4zqksd31FhQFv4rlFgP1iZg4JX43DguN14v6ZnRUdBJ2-8aWsRsvcklgX95XDdS0vy1~LTNRwI21MQ7TTuwUGr70qM1Guow2wNPdde64xpgC2qpfeLNXqeUnvWQbSpFf7EuQMr4FRUOQ~4P~lNnSTQltZInJVT1VEDVt7rfoTi2KaZDt1dnQAAbhbA__' }, // #38 (URL 39 used for #38)
        { name: 'Essence of Mint', recipe: [{id: 'turbo_rum', count: 1}, {id: 'holo_mint', count: 1}, {id: 'void_essence', count: 1}, {id: 'ice', count: 1}], requiresShake: true, needsAging: false, price: 18, unlocked: false, cost: 190, requires: ['holo_mint', 'void_essence'], iconUrl: 'https://media-hosting.imagekit.io/78019c080bda4757/download%20(40).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=aPmcln61L-dEKxHhFNUGHLlZaNdTKnMr6z~ZQ92npOfWcGMe-Oa8OxA-lTpGYl3ihuKgkpSLhQxHuohkLllU6yRJCQoTDwj6HIwjNaZyims-Hh-MCsp-jJNKomqzsrAwbUHo1vUajnWz0sop7GP6s9l1uyvCBffWeZION4USLbGmvgBzpcM4lP69nPB-d2pa88Mq-vVkK~VXs2ctLE1-sBJDRcJZ2J6O6GsMG1VTlBh0XQcud-J6uJpOE76DWqywvqPAyBueHz997RPYx-NYI~n~CUtepY6jXQ7yRCIzKvAqkdX3NPo7w~AW7wNGECZ2vg66y2nAJsZzlmxQmZeGMg__' }, // #39 (URL 40 used for #39)
        { name: 'Plasma Berry Twist', recipe: [{id: 'synth_gin', count: 1}, {id: 'plasma_berry', count: 1}, {id: 'laser_lime', count: 1}, {id: 'ice', count: 1}], requiresShake: true, needsAging: false, price: 13, unlocked: false, cost: 120, requires: ['plasma_berry'], iconUrl: 'https://media-hosting.imagekit.io/66ac42e7c0b743c6/download%20(41).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=JaNWXtuaJurOtAEjSyu7r1OlQUxjqlYLc6b5byNbWSxZCcwdLyZjQWA9dwjp3ym6GCcyKhdHrQeQzac7~FF2rDBUANmOyw5V4r0z5XefGmh3IjchrFHHsQ3wDJqv6F5KEXu4QWH27ar0BkATG2WgGhWdxXPR4wy5ZDU3~r4UfEm2ndNjiMVZ3L60M3Yir28qsWJsmI~4nI84h1NuLbS~l8LrvSCICFnyTvwiud1fZmrc2ikz0VoDYWCoCEnbolzHFJJi9GHTwBaq7UNg0nlE17qQdZV3zSM~7lheyWtsEYE~mZS40UT5~g9MKgu9z8sW5Vu63cYxDe2hxMP989hWDw__' }, // #40 (URL 41 used for #40)
        { name: 'Static Berry Fizz', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'plasma_berry', count: 1}, {id: 'static_sugar', count: 1}, {id: 'glitter_tonic', count: 1}], requiresShake: false, needsAging: false, price: 15, unlocked: false, cost: 160, requires: ['plasma_berry', 'static_sugar'], iconUrl: 'https://media-hosting.imagekit.io/e0795d5b6cb04d63/download%20(42).png?Expires=1841077162&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ykjTRLUCKSkn0tkKi97o4Dr0RAXSgLVeSOlNXBFJaGdyhLzZpV6OIB4Pc8CkDY97IhTICy7sG2hTkkGWO15KVqUulne5qrfQHf1cja9~-frOrbHyEWdk1Kp9Faow2Z2H8GyG5rb4rLxgxtLmk-eV9dyb7c~fQiBkoHxk6EcRrp6rAjUXr3797dcCF4wpKVgZ8sELP7SQuL4e4HcyhALROvJEkWNLeFqqWJGj53nWC6prsUAB7ZlfJnp6WKqs96kmiD2ZAcjSVnJMCTTgeTmQFpKYLtt57Ha8w8hdtv8w-GM~3lJ57xs3v3HpLNfQI67391qyJvc8l8xsrdQlNjdzcA__' }, // #41 (URL 42 used for #41)
        // --- Drinks past this point will not have unique icons currently ---
        
        { name: 'Gravity Well', recipe: [{id: 'gravity_gin', count: 1}, {id: 'nebula_nectar', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 22, unlocked: false, cost: 280, requires: ['gravity_gin'], iconUrl: null }, // #42
        { name: 'Sugar Rush', recipe: [{id: 'turbo_rum', count: 1}, {id: 'static_sugar', count: 2}, {id: 'quantum_cola', count: 1}], requiresShake: false, needsAging: false, price: 14, unlocked: false, cost: 150, requires: ['static_sugar'], iconUrl: null }, // #43
        { name: 'Chrono Cola', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'quantum_cola', count: 1}, {id: 'chrono_cordial', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 20, unlocked: false, cost: 240, requires: ['chrono_cordial'], iconUrl: null }, // #44
        { name: 'The Void Walker', recipe: [{id: 'synth_gin', count: 2}, {id: 'void_essence', count: 1}, {id: 'chrono_cordial', count: 1}], requiresShake: true, needsAging: true, price: 25, unlocked: false, cost: 300, requires: ['void_essence', 'chrono_cordial'], iconUrl: null }, // #45 Needs Aging!
        { name: 'Flux Capacitor', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'flux_foam', count: 1}, {id: 'chrono_cordial', count: 1}, {id: 'star_syrup', count: 1}], requiresShake: true, needsAging: false, price: 28, unlocked: false, cost: 350, requires: ['flux_foam', 'chrono_cordial', 'star_syrup'], iconUrl: null }, // #46
        { name: 'Nebula Overload', recipe: [{id: 'turbo_rum', count: 2}, {id: 'nebula_nectar', count: 2}, {id: 'void_essence', count: 1}, {id: 'ice', count: 1}], requiresShake: false, needsAging: false, price: 26, unlocked: false, cost: 320, requires: ['void_essence'], iconUrl: null }, // #47
        { name: 'Cryo Chrono Blast', recipe: [{id: 'synth_gin', count: 1}, {id: 'cryo_cherry', count: 2}, {id: 'chrono_cordial', count: 1}, {id: 'ice', count: 1}], requiresShake: true, needsAging: false, price: 24, unlocked: false, cost: 280, requires: ['cryo_cherry', 'chrono_cordial'], iconUrl: null }, // #48
        { name: 'Ultimate Cosmo', recipe: [{id: 'pixel_vodka', count: 2}, {id: 'cosmic_cranberry', count: 1}, {id: 'laser_lime', count: 1}, {id: 'void_essence', count: 1}, {id: 'ice', count: 1}], requiresShake: true, needsAging: false, price: 27, unlocked: false, cost: 330, requires: ['void_essence'], iconUrl: null }, // #49
        { name: 'Zero-G', recipe: [{id: 'gravity_gin', count: 1}, {id: 'flux_foam', count: 1}, {id: 'ice', count: 1}], requiresShake: true, needsAging: true, price: 30, unlocked: false, cost: 400, requires: ['gravity_gin', 'flux_foam'], iconUrl: null }, // #50 Needs Aging!
        { name: 'Static Void', recipe: [{id: 'pixel_vodka', count: 1}, {id: 'void_essence', count: 1}, {id: 'static_sugar', count: 1}], requiresShake: false, needsAging: false, price: 23, unlocked: false, cost: 290, requires: ['void_essence', 'static_sugar'], iconUrl: null }, // #51
        { name: 'Berry Singularity', recipe: [{id: 'gravity_gin', count: 1}, {id: 'plasma_berry', count: 2}, {id: 'void_essence', count: 1}], requiresShake: true, needsAging: true, price: 32, unlocked: false, cost: 450, requires: ['gravity_gin', 'plasma_berry', 'void_essence'], iconUrl: null }, // #52 Needs Aging!
        { name: 'Chrono Flux', recipe: [{id: 'turbo_rum', count: 1}, {id: 'chrono_cordial', count: 1}, {id: 'flux_foam', count: 1}, {id: 'laser_lime', count: 1}], requiresShake: true, needsAging: false, price: 29, unlocked: false, cost: 380, requires: ['chrono_cordial', 'flux_foam'], iconUrl: null }, // #53
        { name: 'The CYBERBAR Special', recipe: [{id: 'gravity_gin', count: 1}, {id: 'void_essence', count: 1}, {id: 'chrono_cordial', count: 1}, {id: 'static_sugar', count: 1}, {id: 'flux_foam', count: 1}], requiresShake: true, needsAging: true, price: 50, unlocked: false, cost: 750, requires: ['gravity_gin', 'void_essence', 'chrono_cordial', 'static_sugar', 'flux_foam'], iconUrl: null }, // #54 Needs Aging!
    ];

    // --- Bar Upgrades ---
    // <<< AGING FEATURE: Includes the 'aging_rack' upgrade definition >>>
    barUpgrades = {
        entertainment: { name: "Holo-Jukebox", description: "Keeps customers distracted longer.", levels: [{ cost: 100, timeBonus: 5 }, { cost: 250, timeBonus: 10 }, { cost: 500, timeBonus: 15 }], currentLevel: 0 },
        seating: { name: "Expanded Seating", description: "More seats attract slightly higher tips.", levels: [{ cost: 150, tipBonus: 1 }, { cost: 400, tipBonus: 2 }, { cost: 800, tipBonus: 3 }], currentLevel: 0 },
        aging_rack: { name: "Chrono-Aging Rack", description: "Allows serving drinks that require aging.", levels: [{ cost: 500, enabled: true }], currentLevel: 0 } // Enables aging logic
    };

    // --- Bartender Skills ---
    bartenderSkills = {
        efficiency: { name: "Smooth Service", description: "Earn more cash per drink.", levels: [{ cost: 80, moneyMultiplier: 1.1 }, { cost: 200, moneyMultiplier: 1.2 }, { cost: 450, moneyMultiplier: 1.3 }], currentLevel: 0 },
        shaking: { name: "Speed Shaking", description: "Reduces time needed to shake drinks.", levels: [{ cost: 120, shakeTimeReduction: 100 }, { cost: 300, shakeTimeReduction: 200 }, { cost: 600, shakeTimeReduction: 300 }], currentLevel: 0 }
    };

    // --- Customer Reviews Pool ---
    reviewPool = {
        goodServe: ["Perfect drink! Just what I needed.", "This place rocks! Great service.", "Wow, nailed the recipe!", "CYBERBAR is the best!", "Exactly right, and fast too!", "Delicious! 5 Stars!", "My circuits feel refreshed.", "Worth the wait!", "Tastes like pure data joy."],
        badServe: ["Ugh, this isn't what I ordered.", "Did you even listen? Wrong drink!", "Tastes... synthetic. And wrong.", "My disappointment is immeasurable.", "Close, but no data-cigar.", "Needs more [random ingredient].", "Error 404: Drink not found.", "This wasn't shaken right!", "Did you forget to age this?", "Too many ingredients!", "Missing something...", "This is just synth-sludge!"],
        timeout: ["Took too long! I'm out.", "Service is slower than a dial-up modem.", "I haven't got all cycle! Bye.", "Is the bartender AFK?", "My patience has expired.", "This waiting is illogical.", "I'll take my credits elsewhere."],
        miscGood: ["Cool atmosphere here.", "Love the neon vibes!", "The music is bumping!", "Finally, a decent bar in this sector.", "That jukebox is playing my jam!", "Glad they added more seats."],
        miscBad: ["Bit cramped in here.", "Could use more seating.", "The jukebox needs new tracks.", "This place needs an upgrade.", "The wait times can be long."]
    };

    // --- End of Block 2 ---
    // ==================================
    // BLOCK 3: CORE UTILITY FUNCTIONS
    // ==================================

    /**
     * Displays a message to the player in the message box.
     * @param {string} msg - The message text.
     * @param {string} [color='var(--text-color)'] - Optional CSS color for the message.
     */
    function showMessage(msg, color = 'var(--text-color)') {
        // (This function remains unchanged from your original logic)
        if (messageBox) {
            messageBox.textContent = msg;
            messageBox.style.color = color;
            // Determine glow based on specific colors or use a default
            if (color === 'var(--neon-green)') {
                messageBox.style.textShadow = 'var(--text-glow-green)';
            } else if (color === 'var(--neon-pink)') {
                messageBox.style.textShadow = 'var(--text-glow-pink)';
            } else if (color === 'var(--neon-orange)') {
                messageBox.style.textShadow = 'var(--text-glow-orange)';
            } else if (color === 'var(--neon-blue)') {
                messageBox.style.textShadow = 'var(--text-glow-cyan)'; // Cyan glow for blue text
            } else {
                messageBox.style.textShadow = 'none'; // No glow for default text color
            }
        } else {
            console.warn("Message box element not found!");
        }
    }

    /**
     * Formats hour and minute into HH:MM format (24-hour).
     * @param {number} hour - The hour (0-23).
     * @param {number} minute - The minute (0-59).
     * @returns {string} Formatted time string.
     */
    function formatTime(hour, minute) {
         // (This function remains unchanged)
        const paddedHour = String(hour).padStart(2, '0');
        const paddedMinute = String(minute).padStart(2, '0');
        return `${paddedHour}:${paddedMinute}`;
    }

    /** Updates the game clock and day display in the header. */
    function updateClockDisplay() {
         // (This function remains unchanged)
        if (gameTimeDisplay) {
            gameTimeDisplay.textContent = `Time: ${formatTime(gameHour, gameMinute)}`;
        }
        if (gameDayDisplay) {
            gameDayDisplay.textContent = `Day: ${currentDay}`;
        }
    }

    /** Updates static UI displays (Score, Money, Skill/Upgrade Levels summary). */
    function updateStaticUIDisplays() {
         // (This function remains unchanged, includes aging rack display logic)
        if (scoreDiv) scoreDiv.textContent = `Score: ${score}`;
        if (moneyDiv) moneyDiv.textContent = `Cash: $${money}`;

        // Update skill/upgrade level summary displays
        if (skillLevelDisplay && bartenderSkills.efficiency && bartenderSkills.shaking) {
             skillLevelDisplay.textContent = `Skills: Service L${bartenderSkills.efficiency.currentLevel}, Shaking L${bartenderSkills.shaking.currentLevel}`;
        }
        if (upgradeLevelDisplay && barUpgrades.entertainment && barUpgrades.seating && barUpgrades.aging_rack) {
            let upgradeText = `Upgrades: Jukebox L${barUpgrades.entertainment.currentLevel}, Seating L${barUpgrades.seating.currentLevel}`;
            if (barUpgrades.aging_rack.currentLevel > 0) { // Check if aging rack is purchased
                upgradeText += `, Aging Rack`; // <<< AGING FEATURE: Reflects aging rack upgrade in UI
            }
            upgradeLevelDisplay.textContent = upgradeText;
        }
    }

    /** Updates the visual representation of the mixing station ingredients and related buttons. */
    function updateMixingArea() {
        // <<< MODIFIED: Targets mixedIngredientsDisplay for ingredient spans >>>
        if (!mixedIngredientsDisplay) {
             console.error("Mixing ingredients display element not found!");
             return;
        }

        mixedIngredientsDisplay.innerHTML = ''; // Clear previous items from the display area
        if (selectedIngredients.length === 0) {
            // Optional: Placeholder text when empty (can be handled by CSS :empty pseudo-class too)
        } else {
            selectedIngredients.forEach(item => {
                const ingredientData = allIngredients.find(i => i.id === item.id);
                if (ingredientData) {
                    const span = document.createElement('span');
                    span.classList.add('mixed-ingredient');
                    // Apply ingredient-specific color via CSS custom property
                    span.style.setProperty('--ingredient-color', ingredientData.color || 'var(--neon-green)');
                    span.textContent = ingredientData.name + (item.count > 1 ? ` x${item.count}` : '');
                    mixedIngredientsDisplay.appendChild(span); // <<< Append to the correct display div
                }
            });
        }

        // Update button states based on mix content and bar state
        const hasIngredients = selectedIngredients.length > 0;
        if (clearBtn) clearBtn.disabled = !hasIngredients || !isBarOpen;
        if (shakeBtn) shakeBtn.disabled = !hasIngredients || !isBarOpen || isShaken; // Cannot shake if empty, closed, or already shaken
        // Serve button state depends on customer presence and bar state
        if (serveBtn) serveBtn.disabled = !currentCustomer || !isBarOpen;
    }

    /** Clears the current selection of ingredients and resets mix state. */
    function clearMix() {
        // <<< MODIFIED: Clears new display div, removes animation from image visual >>>
        selectedIngredients = [];
        isShaken = false;

        if (mixedIngredientsDisplay) {
            mixedIngredientsDisplay.innerHTML = ''; // Clear the visual ingredient display
        }

        if (mixerImageVisual) {
            // Remove any active mixing animations from the image element
            mixerImageVisual.classList.remove('mixing-gentle', 'mixing-shake');
        } else {
             console.warn("Mixer image visual element not found to remove animations.");
        }

        updateMixingArea(); // Update display and button states
        if (isBarOpen) { // Only show "Mix cleared" message if the bar is actually open
             showMessage("Mix cleared.", "var(--neon-blue)");
        }
    }

     /**
      * Triggers a customer emotion animation and popup.
      * @param {'happy' | 'angry'} emotion - The emotion to display.
      * @param {boolean} [temporary=true] - If true, the emotion fades after a short delay.
      */
     function triggerCustomerEmotion(emotion, temporary = true) {
         // (This function remains unchanged)
         if (!emotionPopup || !customerIcon) return;

         const popupClass = emotion;
         const iconAnimationClass = emotion;
         // Ensure duration matches CSS animation (check your final CSS value)
         const animationDuration = 650; // Example duration based on CSS tweaks

         // Clear previous states
         emotionPopup.classList.remove('visible', 'happy', 'angry');
         customerIcon.classList.remove('happy', 'angry');
         customerIcon.style.animation = 'none'; // Explicitly stop animation

         // Force reflow before re-adding classes/animation
         void customerIcon.offsetWidth;

         // Use a minimal timeout to allow the browser to process class removal
         setTimeout(() => {
             emotionPopup.classList.add(popupClass, 'visible');
             customerIcon.classList.add(iconAnimationClass); // This class triggers animation via CSS

             // Set timeout to remove states after animation/display time
             setTimeout(() => {
                 // Check if the current class is still the one we added before removing
                 if (customerIcon.classList.contains(iconAnimationClass)) {
                      customerIcon.classList.remove(iconAnimationClass);
                 }
                 if (temporary && emotionPopup.classList.contains(popupClass)) {
                     emotionPopup.classList.remove('visible', popupClass);
                 }
             }, animationDuration);
         }, 10); // Short delay for reflow
     }

    /** Clears the customer display area (icon, bubble, emotion) to default. */
    function clearCustomerDisplay() {
        // (This function remains unchanged)
        if (customerIcon) {
            const placeholderSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // Transparent pixel
            customerIcon.src = placeholderSrc;
            customerIcon.alt = "Customer Area";
            customerIcon.className = ''; // Remove .vip, .happy, .angry
            customerIcon.style.animation = 'none'; // Stop any ongoing animation explicitly
        }
        if (chatBubble) {
            chatBubble.textContent = '...';
            // Reset chat bubble styles
            const defaultColor = 'var(--neon-green)';
            chatBubble.style.borderColor = defaultColor;
            chatBubble.style.color = defaultColor;
            chatBubble.style.textShadow = 'var(--text-glow-green)';
            chatBubble.style.setProperty('--chat-bubble-border-color', defaultColor); // Reset pointer color variable
        }
        if (emotionPopup) {
            emotionPopup.classList.remove('visible', 'happy', 'angry');
        }
        // Reset order timer display as well
        if (timerDisplay) {
             timerDisplay.textContent = `Order Time: --`;
             timerDisplay.style.color = 'var(--neon-orange)';
             timerDisplay.style.textShadow = 'var(--text-glow-orange)';
        }
    }

    // --- End of Block 3 ---
// ==================================
    // BLOCK 4: TAB UPDATE FUNCTIONS
    // ==================================

    /** Safely remove any loading message placeholder from a container */
    function removeLoadingMessage(container) {
        const loadingMsg = container?.querySelector('.loading-message');
        if (loadingMsg) {
            loadingMsg.remove();
        }
    }

    /** Updates the Recipe Pamphlet tab with known/unlocked drinks. */
    function updateRecipePamphlet() {
        if (!recipePamphletDiv) return;
        removeLoadingMessage(recipePamphletDiv); // Remove loading message
        recipePamphletDiv.innerHTML = ''; // Clear previous content

        const knownDrinks = allDrinks.filter(drink => drink.unlocked);

        if (knownDrinks.length === 0) {
            recipePamphletDiv.innerHTML = '<p>No recipes learned yet. Explore and unlock more drinks!</p>';
            return;
        }

        knownDrinks.forEach(drink => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('list-item');

            let ingredientsHTML = '<ul>';
            drink.recipe.forEach(ingDetail => {
                const ingredient = allIngredients.find(i => i.id === ingDetail.id);
                // <<< MODIFIED: Show count BEFORE ingredient name (e.g., "1x Synth Gin") >>>
                ingredientsHTML += `<li>${ingDetail.count}x ${ingredient ? ingredient.name : ingDetail.id}</li>`;
            });
            ingredientsHTML += '</ul>';

            let indicators = '';
            if (drink.requiresShake) {
                indicators += '<span class="shake-indicator">Shake Well!</span>';
            }
            if (drink.needsAging) { // AGING FEATURE: Display indicator if needed
                indicators += '<span class="age-indicator">Needs Aging!</span>';
            }

            const iconSrc = drink.iconUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

            itemDiv.innerHTML = `
                <h4>
                    <img src="${iconSrc}" alt="${drink.name}" class="drink-icon">
                    <span class="drink-name">${drink.name}</span>
                    <span class="cost">$${drink.price}</span>
                </h4>
                <p><strong>Recipe:</strong></p>
                ${ingredientsHTML}
                ${indicators}
            `;
            recipePamphletDiv.appendChild(itemDiv);
        });
    }

    /** Updates the Unlocks tab with purchasable ingredients and drinks. */
    function updateUnlocksTab() {
        if (!unlocksListDiv) return;
        removeLoadingMessage(unlocksListDiv); // Remove loading message
        unlocksListDiv.innerHTML = ''; // Clear previous content

        let itemsAvailableToUnlock = 0;

        // Ingredients to unlock
        allIngredients.forEach(ingredient => {
            if (!ingredient.unlocked && ingredient.cost > 0) {
                itemsAvailableToUnlock++;
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('list-item');
                itemDiv.innerHTML = `
                    <h4>
                        <span class="drink-name">${ingredient.name} (Ingredient)</span>
                        <span class="cost">$${ingredient.cost}</span>
                    </h4>
                    <p>Unlocks a new ingredient for mixing.</p>
                    <button class="buy-btn" data-type="ingredient" data-id="${ingredient.id}" ${money < ingredient.cost ? 'disabled' : ''}>
                        Unlock Ingredient
                    </button>
                `;
                unlocksListDiv.appendChild(itemDiv);
            }
        });

        // Drinks to unlock
        allDrinks.forEach(drink => {
            if (!drink.unlocked && drink.cost > 0) {
                let canCraft = true; // Check if requirements met
                canCraft = drink.recipe.every(recIng => allIngredients.find(i => i.id === recIng.id)?.unlocked);
                 if (canCraft && drink.requires && drink.requires.length > 0) {
                     canCraft = drink.requires.every(reqId => allIngredients.find(i => i.id === reqId)?.unlocked);
                 }

                itemsAvailableToUnlock++;
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('list-item');

                let ingredientsHTML = '<ul>';
                drink.recipe.forEach(ingDetail => {
                    const ingredient = allIngredients.find(i => i.id === ingDetail.id);
                     // <<< MODIFIED: Show count BEFORE ingredient name here too >>>
                    ingredientsHTML += `<li>${ingDetail.count}x ${ingredient ? ingredient.name : ingDetail.id}</li>`;
                });
                ingredientsHTML += '</ul>';

                let requirementText = '';
                 if (!canCraft) { // Generate requirement text if needed
                     const missingReqs = [];
                     drink.recipe.forEach(recIng => {
                         const ing = allIngredients.find(i => i.id === recIng.id);
                         if (!ing || !ing.unlocked) missingReqs.push(ing?.name || recIng.id);
                     });
                     if (drink.requires && drink.requires.length > 0) {
                         drink.requires.forEach(reqId => {
                             const reqIng = allIngredients.find(ing => ing.id === reqId);
                             if (reqIng && !reqIng.unlocked && !missingReqs.includes(reqIng.name)) missingReqs.push(reqIng.name);
                         });
                     }
                     const uniqueMissing = [...new Set(missingReqs)];
                     if (uniqueMissing.length > 0) {
                         requirementText = `<p><em style="color: var(--neon-pink);">Requires: ${uniqueMissing.join(', ')}</em></p>`;
                     }
                 }

                 const iconSrc = drink.iconUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

                itemDiv.innerHTML = `
                    <h4>
                        <img src="${iconSrc}" alt="${drink.name}" class="drink-icon">
                        <span class="drink-name">${drink.name} (Recipe)</span>
                        <span class="cost">$${drink.cost}</span>
                    </h4>
                    <p><strong>Recipe:</strong></p>
                    ${ingredientsHTML}
                    ${requirementText}
                    <button class="buy-btn" data-type="drink" data-id="${drink.name}" ${money < drink.cost || !canCraft ? 'disabled' : ''} title="${!canCraft ? 'Unlock required ingredients first!' : 'Click to unlock this recipe'}">
                        Unlock Recipe
                    </button>
                `;
                unlocksListDiv.appendChild(itemDiv);
            }
        });

        if (itemsAvailableToUnlock === 0) {
            unlocksListDiv.innerHTML = '<p>All available items unlocked for now!</p>';
        }
    }

    /** Updates the Upgrades tab with available bar upgrades. */
    function updateUpgradesTab() {
        if (!upgradesListDiv) return;
        removeLoadingMessage(upgradesListDiv); // Remove loading message
        upgradesListDiv.innerHTML = '';

        Object.keys(barUpgrades).forEach(key => {
            const upgrade = barUpgrades[key];
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('list-item');
            let levelInfo = '';
            let buyButtonHTML = '';
            const currentLevel = upgrade.currentLevel;
            const maxLevel = upgrade.levels.length;

            if (currentLevel < maxLevel) {
                const nextLevelData = upgrade.levels[currentLevel];
                const cost = nextLevelData.cost;
                let effectDescription = '';
                if (nextLevelData.timeBonus !== undefined) effectDescription = `Next Lvl: +${nextLevelData.timeBonus}s order time.`;
                if (nextLevelData.tipBonus !== undefined) effectDescription = `Next Lvl: +$${nextLevelData.tipBonus} tip potential.`;
                if (nextLevelData.enabled !== undefined) effectDescription = `Unlocks ability.`; // For aging rack

                levelInfo = `<p>Current Level: ${currentLevel} / ${maxLevel}</p><p>${effectDescription}</p>`;
                buyButtonHTML = `<button class="buy-btn" data-type="upgrade" data-id="${key}" ${money < cost ? 'disabled' : ''}>Upgrade ($${cost})</button>`;
            } else {
                levelInfo = `<p>Current Level: ${currentLevel} / ${maxLevel} (Maxed)</p>`;
                buyButtonHTML = `<button class="buy-btn maxed" disabled>Max Level</button>`;
            }

            itemDiv.innerHTML = `
                <h4>${upgrade.name}</h4>
                <p>${upgrade.description}</p>
                ${levelInfo}
                ${buyButtonHTML}
            `;
            upgradesListDiv.appendChild(itemDiv);
        });
    }

    /** Updates the Skills tab with available bartender skills. */
    function updateSkillsTab() {
        if (!skillsListDiv) return;
        removeLoadingMessage(skillsListDiv); // Remove loading message
        skillsListDiv.innerHTML = '';

        Object.keys(bartenderSkills).forEach(key => {
            const skill = bartenderSkills[key];
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('list-item');
            let levelInfo = '';
            let buyButtonHTML = '';
            const currentLevel = skill.currentLevel;
            const maxLevel = skill.levels.length;

            if (currentLevel < maxLevel) {
                const nextLevelData = skill.levels[currentLevel];
                const cost = nextLevelData.cost;
                let effectDescription = '';
                if (nextLevelData.moneyMultiplier !== undefined) effectDescription = `Next Lvl: Drink price x${nextLevelData.moneyMultiplier}.`;
                if (nextLevelData.shakeTimeReduction !== undefined) effectDescription = `Next Lvl: Shake time -${nextLevelData.shakeTimeReduction / 1000}s.`;

                levelInfo = `<p>Current Level: ${currentLevel} / ${maxLevel}</p><p>${effectDescription}</p>`;
                buyButtonHTML = `<button class="buy-btn" data-type="skill" data-id="${key}" ${money < cost ? 'disabled' : ''}>Upgrade ($${cost})</button>`;
            } else {
                levelInfo = `<p>Current Level: ${currentLevel} / ${maxLevel} (Maxed)</p>`;
                buyButtonHTML = `<button class="buy-btn maxed" disabled>Max Level</button>`;
            }

            itemDiv.innerHTML = `
                <h4>${skill.name}</h4>
                <p>${skill.description}</p>
                ${levelInfo}
                ${buyButtonHTML}
            `;
            skillsListDiv.appendChild(itemDiv);
        });
    }

    /** Updates the Reviews tab with the latest customer reviews. */
    function updateReviewsTab() {
        if (!reviewsListDiv) return;
        removeLoadingMessage(reviewsListDiv); // Remove loading message
        reviewsListDiv.innerHTML = '';

        if (displayedReviews.length === 0) {
            reviewsListDiv.innerHTML = '<p>No customer reviews yet. Serve some drinks!</p>';
            return;
        }

        // Display in reverse chronological order (newest first)
        displayedReviews.slice().reverse().forEach(reviewText => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('list-item');
            itemDiv.innerHTML = `<p>${reviewText}</p>`; // CSS handles quote style now
            reviewsListDiv.appendChild(itemDiv);
        });
    }

    /**
     * A helper function to call all individual tab update functions.
     * Useful for a full UI refresh or after purchases/day changes.
     */
    function updateAllDynamicTabs() {
        updateRecipePamphlet();
        updateUnlocksTab();
        updateUpgradesTab();
        updateSkillsTab();
        updateReviewsTab();
        // updateCustomerQueueDisplay(); // Still needs implementation later
    }

    // --- End of Block 4 ---
    // ==================================================
    // BLOCK 5: INGREDIENT HANDLING & DRAG-AND-DROP
    // ==================================================

    /**
     * Updates the ingredient buttons/draggables in the middle panel.
     * Only shows unlocked ingredients and makes them draggable.
     */
    function updateIngredientButtons() {
        if (!ingredientsContainer) return;
        removeLoadingMessage(ingredientsContainer); // <<< Remove loading message
        ingredientsContainer.innerHTML = ''; // Clear existing buttons

        allIngredients.forEach(ingredient => {
            if (ingredient.unlocked) {
                const ingredientDiv = document.createElement('div');
                ingredientDiv.classList.add('ingredient-drag');
                ingredientDiv.textContent = ingredient.name; // Text inside the rectangle
                ingredientDiv.title = ingredient.name; // Tooltip

                // Set the CSS variable for dynamic color styling (used by border)
                ingredientDiv.style.setProperty('--ingredient-color', ingredient.color || 'var(--neon-cyan)');

                // Make it draggable
                ingredientDiv.draggable = true;
                ingredientDiv.dataset.ingredientId = ingredient.id; // Store ID for drag data

                // Attach drag event listeners
                ingredientDiv.addEventListener('dragstart', (event) => handleDragStart(event, ingredient.id));
                // Use a shared dragend handler for cleanup
                ingredientDiv.addEventListener('dragend', handleDragEnd);

                ingredientsContainer.appendChild(ingredientDiv);
            }
        });
    }

    /**
     * Handles the start of dragging an ingredient.
     * Sets data transfer and visual feedback.
     * @param {DragEvent} event - The drag event.
     * @param {string} ingredientId - The ID of the ingredient being dragged.
     */
    function handleDragStart(event, ingredientId) {
        // Can only drag ingredients when the bar is open and game is active
        if (!isBarOpen || !gameActive) {
            event.preventDefault(); // Prevent drag from starting
            return;
        }

        // --- Pre-drag check: Mixer Capacity ---
        // Check if adding this ingredient would exceed the max limit in the mixer
        const currentTotalIngredients = selectedIngredients.reduce((sum, item) => sum + item.count, 0);
        const existingItem = selectedIngredients.find(item => item.id === ingredientId);

        // Special case for non-stackable 'ice'
        if (ingredientId === 'ice' && existingItem) {
             showMessage("Ice already added.", "var(--neon-blue)");
             event.preventDefault(); // Prevent dragging another ice if one exists
             return;
        }
        // General capacity check
        if (currentTotalIngredients >= MAX_INGREDIENTS_IN_MIXER) {
            showMessage("Mixing station is full!", "var(--neon-pink)");
            event.preventDefault(); // Prevent dragging if mixer is full
            return;
        }
        // --- End Pre-drag check ---


        event.dataTransfer.setData("text/plain", ingredientId);
        event.dataTransfer.effectAllowed = "copy";

        currentlyDragging = { element: event.target, id: ingredientId }; // Store dragging info

        // Add visual feedback (slight transparency/scale) to the source element immediately
        // Using setTimeout helps ensure the style applies before the browser screenshot for the drag ghost
        setTimeout(() => {
            // Check if we are still dragging this specific element when the timeout fires
            if(currentlyDragging && event.target === currentlyDragging.element){
                event.target.style.opacity = '0.5';
                event.target.style.transform = 'scale(1.1)';
            }
        }, 0);
    }

    /** Handles the end of dragging an ingredient (whether dropped successfully or not). Cleans up styles. */
    function handleDragEnd(event) {
        // Restore visual feedback on the source element IF it's the one we were tracking
        if (currentlyDragging && event.target === currentlyDragging.element) {
            currentlyDragging.element.style.opacity = '1';
            currentlyDragging.element.style.transform = 'scale(1)';
        }

        // Clear dragging state info regardless of source element match
        currentlyDragging = null;

        // Always remove highlight from potential drop zones (the mixing station)
        if (mixingStation) {
            mixingStation.classList.remove('drag-over');
        }
    }

    /** Prevents default handling to allow dropping over the mixing station and adds highlight. */
    function handleDragOver(event) {
        // Allow drop only if an ingredient is being dragged and bar is open/active
        if (currentlyDragging && isBarOpen && gameActive) {
            event.preventDefault(); // Necessary to allow dropping
            event.dataTransfer.dropEffect = "copy"; // Visual cue

            // Add highlight effect to mixing station (the drop zone) if not already present
            if (mixingStation && !mixingStation.classList.contains('drag-over')) {
                mixingStation.classList.add('drag-over');
            }
        } else {
            // If conditions aren't met, explicitly deny the drop effect
            event.dataTransfer.dropEffect = "none";
        }
    }

    /** Removes highlight effect when dragging leaves the drop zone. */
    function handleDragLeave(event) {
        // Remove highlight effect from mixing station if the mouse leaves its boundaries
        // Check relatedTarget to prevent flickering when moving over child elements
         if (mixingStation && (!event.relatedTarget || !mixingStation.contains(event.relatedTarget))) {
             mixingStation.classList.remove('drag-over');
         }
    }

    /** Handles dropping an ingredient onto the mixing station. */
    function handleDrop(event) {
        // <<< MODIFIED: Appends ingredient span to mixedIngredientsDisplay >>>
        event.preventDefault(); // Prevent default browser drop behavior (like opening file)
        if (mixingStation) mixingStation.classList.remove('drag-over'); // Remove highlight on drop

        // Re-check conditions required for a valid drop
        if (!isBarOpen || !gameActive || !currentlyDragging) {
            return; // Exit if bar isn't open, game inactive, or not dragging anything
        }

        const ingredientId = event.dataTransfer.getData("text/plain");
        if (!ingredientId) {
            console.warn("Drop event occurred without ingredient ID.");
            return; // Exit if no valid data transferred
        }

        // Check if mixer is full BEFORE adding the dropped ingredient
        const currentTotalIngredients = selectedIngredients.reduce((sum, item) => sum + item.count, 0);
        if (currentTotalIngredients >= MAX_INGREDIENTS_IN_MIXER) {
            showMessage("Mixing station is full!", "var(--neon-pink)");
            // DragEnd handler will reset the source element style
            return; // Exit, cannot add more
        }

        // Add ingredient to the selected list state
        const existingItem = selectedIngredients.find(item => item.id === ingredientId);

        if (ingredientId === 'ice') {
            if (!existingItem) { // Ice doesn't stack count, just presence
                selectedIngredients.push({ id: ingredientId, count: 1 });
            } else {
                showMessage("Ice already added.", "var(--neon-blue)"); // Inform user, don't add again
                return; // Exit early as no state changed
            }
        } else {
            if (existingItem) {
                existingItem.count++; // Increment count if ingredient exists
            } else {
                selectedIngredients.push({ id: ingredientId, count: 1 }); // Add new ingredient
            }
        }

        // Update UI and state after successfully adding ingredient
        isShaken = false; // Adding ingredient always resets shaken status
        if (mixerImageVisual) {
             mixerImageVisual.classList.remove('mixing-gentle', 'mixing-shake'); // Stop mixing animations on the image
        }
        updateMixingArea(); // Update the display (mixedIngredientsDisplay) and button states
    }

    /**
     * Sets up the main drop zone event listeners (called once during initialization).
     */
    function setupDragAndDropListeners() {
         // Listener is on the PARENT mixing station div, which acts as the drop zone boundary
        if (mixingStation) {
            mixingStation.addEventListener('dragover', handleDragOver);
            mixingStation.addEventListener('dragleave', handleDragLeave);
            mixingStation.addEventListener('drop', handleDrop);
        } else {
            console.error("Mixing station element not found for D&D setup!");
        }
        // Note: Draggable item listeners ('dragstart', 'dragend') are added dynamically in updateIngredientButtons()
    }

    // --- End of Block 5 ---
    // =========================================
    // BLOCK 6: GAME CLOCK AND TIMING FUNCTIONS
    // =========================================

    /** Advances the game time by MINUTE_INCREMENT and checks for closing time. */
    function advanceTime() {
        if (!gameActive || !isBarOpen) return; // Only advance time if game is active and bar is open

        gameMinute += MINUTE_INCREMENT; // MINUTE_INCREMENT is now 1 (from Block 1)
        if (gameMinute >= 60) {
            gameMinute = 0;
            gameHour++;
            // Day rollover check happens implicitly via BAR_CLOSE_HOUR check
        }

        // Check if bar should close based on time
        if (gameHour >= BAR_CLOSE_HOUR) {
            endDay(); // Trigger end-of-day sequence
            return; // Stop further processing for this tick if day ended
        }

        updateClockDisplay(); // Update visual clock
    }

    /** Starts the main game clock interval. */
    function startGameClock() {
        if (gameClockInterval) return; // Prevent multiple intervals

        console.log("Starting game clock.");
        gameActive = true; // Ensure game logic loop is active

        gameClockInterval = setInterval(() => {
            if (!gameActive) return; // Double check in case game becomes inactive during interval

            advanceTime();

            // Customer spawning logic check is initiated here if needed,
            // subsequent checks are handled by the spawning logic itself (Block 7).
            if (isBarOpen && !currentCustomer && !customerSpawnTimeout) {
                 // Start the spawn check loop if conditions are right
                 scheduleNextSpawnAttempt(SPAWN_CHECK_DELAY); // Defined in Block 7
            }

        }, GAME_TICK_INTERVAL); // Ticks every second
    }

    /** Stops the main game clock interval. */
    function stopGameClock() {
        if (gameClockInterval) {
            console.log("Stopping game clock.");
            clearInterval(gameClockInterval);
            gameClockInterval = null;
        }
        // Also stop trying to spawn customers (defined in Block 7)
        stopCustomerSpawning(); // Ensure no more attempts are scheduled
        // Note: Does not change gameActive state directly, that's handled by endDay or other logic.
    }

    /** Starts the timer for the current customer order. */
    function startOrderTimer() {
        stopOrderTimer(); // Clear any existing timer first
        if (!currentCustomer) return;

        // Calculate time limit based on base time + entertainment upgrade bonus
        let timeBonus = 0;
        if (barUpgrades.entertainment && barUpgrades.entertainment.currentLevel > 0) {
            // Ensure level index is valid
            const levelIndex = barUpgrades.entertainment.currentLevel - 1;
            if (levelIndex < barUpgrades.entertainment.levels.length) {
                 timeBonus = barUpgrades.entertainment.levels[levelIndex].timeBonus;
            }
        }
        currentOrderTimeLimit = BASE_ORDER_TIME_LIMIT + timeBonus;
        remainingOrderTime = currentOrderTimeLimit;

        // Initial display
        if (timerDisplay) {
             timerDisplay.textContent = `Order Time: ${remainingOrderTime}s`;
             timerDisplay.style.color = 'var(--neon-orange)'; // Reset color
             timerDisplay.style.textShadow = 'var(--text-glow-orange)';
        }

        orderTimerInterval = setInterval(() => {
            remainingOrderTime--;

            if (timerDisplay) {
                timerDisplay.textContent = `Order Time: ${remainingOrderTime}s`;

                // Visual feedback for low time (e.g., last 5 seconds)
                if (remainingOrderTime <= 5 && remainingOrderTime > 0) {
                    timerDisplay.style.color = 'red'; // Use a distinct danger color
                    timerDisplay.style.textShadow = '0 0 5px red';
                } else if (remainingOrderTime > 5) {
                     timerDisplay.style.color = 'var(--neon-orange)'; // Back to normal orange
                     timerDisplay.style.textShadow = 'var(--text-glow-orange)';
                } else {
                     // Handle timer reaching 0 (handled by the <= 0 check below)
                     // Optional: Style for 0 seconds if needed before timeout logic runs
                }
            }

            if (remainingOrderTime <= 0) {
                handleTimeout(); // Handle timeout when timer hits 0
            }
        }, 1000); // Decrement every second
    }

    /** Stops the current order timer and resets its display. */
    function stopOrderTimer() {
        if (orderTimerInterval) {
            clearInterval(orderTimerInterval);
            orderTimerInterval = null;
        }
        // Reset display immediately (don't wait for clearCustomerDisplay)
        if (timerDisplay) {
            timerDisplay.textContent = `Order Time: --`;
            timerDisplay.style.color = 'var(--neon-orange)';
            timerDisplay.style.textShadow = 'var(--text-glow-orange)';
        }
    }

    /** Handles the customer leaving due to timeout. */
    function handleTimeout() {
        if (!currentCustomer) return; // Safety check

        stopOrderTimer(); // Ensure timer is stopped
        const customerName = currentCustomer.name;
        const wasVip = currentCustomer.isVip;
        const leavingCustomer = currentCustomer; // Store temporarily for review

        currentCustomer = null; // Clear current customer immediately

        showMessage(`${customerName} got impatient and left!`, "var(--neon-pink)");
        triggerCustomerEmotion('angry', true); // Show temporary angry emotion
        addReview('timeout', leavingCustomer); // Add review (addReview is defined in Block 8)

        if (wasVip) {
            money -= VIP_TIMEOUT_PENALTY;
            // Combine messages for brevity if desired, or keep separate
            // showMessage(`VIP timed out! Lost $${VIP_TIMEOUT_PENALTY}!`, "var(--neon-pink)");
             console.log(`VIP penalty applied: -$${VIP_TIMEOUT_PENALTY}`);
            updateStaticUIDisplays(); // Update money display immediately
        }

        // Clear visual representation after a delay
        setTimeout(clearCustomerDisplay, CUSTOMER_CLEAR_DELAY);

        // If bar is still open, schedule next spawn attempt after a delay
        if (isBarOpen && gameActive) {
            scheduleNextSpawnAttempt(POST_EVENT_SPAWN_DELAY); // Defined in Block 7
        }
    }

    /** Handles the end of the day sequence. */
    function endDay() {
        if (!isBarOpen && !isSetupPhase) return; // Prevent running if already closing/closed

        console.log("Bar Closing!");
        isBarOpen = false;
        gameActive = false; // Stop main game logic loop

        stopGameClock(); // Stops clock and further spawn attempts
        stopOrderTimer(); // Stops current order timer

        // Clear any current customer immediately if they haven't been served/timed out
        if (currentCustomer) {
            showMessage(`Closing time! ${currentCustomer.name} heads home.`, "var(--neon-blue)");
            // Optionally add a neutral "closing time" review?
            // addReview('closing', currentCustomer); // Requires reviewPool entry
            currentCustomer = null; // Clear customer data
            clearCustomerDisplay(); // Clear visuals immediately on close
        } else {
            showMessage("Bar closed for the day!", "var(--neon-blue)");
            clearCustomerDisplay(); // Ensure display is clear
        }

        // Update sign immediately to show closed status
        if (openCloseSign) {
             openCloseSign.textContent = "CLOSED";
             openCloseSign.classList.remove("open");
             openCloseSign.classList.add("closed");
             openCloseSign.disabled = true; // Disable until setup phase next day
        }

        // Disable interaction buttons and clear mix
        if(clearBtn) clearBtn.disabled = true;
        if(shakeBtn) shakeBtn.disabled = true;
        if(serveBtn) serveBtn.disabled = true;
        clearMix(); // Clear any leftover mix (also stops mixer animation)


        // Transition to setup phase for the next day after a delay
        setTimeout(() => {
            isSetupPhase = true;
            currentDay++;
            gameHour = BAR_OPEN_HOUR; // Reset time for next day start
            gameMinute = 0;
            updateClockDisplay(); // Show next day's start time

            showMessage(`End of Day ${currentDay-1}. Press SETUP to begin Day ${currentDay}.`, "var(--neon-cyan)");

            if (openCloseSign) {
                 openCloseSign.textContent = "SETUP";
                 openCloseSign.disabled = false; // Enable setup button
                 // Ensure correct style for setup phase
                 openCloseSign.classList.remove("open");
                 openCloseSign.classList.add("closed"); // Use 'closed' style for setup phase
            }
            // Action buttons remain disabled until bar opens again via toggleBarOpen
        }, END_DAY_TRANSITION_DELAY);
    }

    // --- End of Block 6 ---
    // ==================================
    // BLOCK 7: CUSTOMER SPAWNING LOGIC
    // ==================================

    /**
     * Schedules the next attempt to spawn a customer after a specified delay.
     * Clears any existing spawn timeout before setting a new one.
     * @param {number} [delay=GAME_TICK_INTERVAL] - Delay in milliseconds before the next attempt.
     * Default is one game tick.
     */
    function scheduleNextSpawnAttempt(delay = GAME_TICK_INTERVAL) {
        // Clear existing timeout if any, to prevent multiple spawn loops
        if (customerSpawnTimeout) {
            clearTimeout(customerSpawnTimeout);
        }

        // Only schedule if the bar is open, game is active, and no customer is currently being served
        if (!isBarOpen || currentCustomer || !gameActive) {
            customerSpawnTimeout = null; // Ensure timeout ID is cleared if not scheduling
            return;
        }

        // Set a new timeout to attempt spawning
        customerSpawnTimeout = setTimeout(() => {
            attemptCustomerSpawn(); // Run the spawn attempt function
            // attemptCustomerSpawn will typically reschedule itself if no customer spawns,
            // or stop scheduling if a customer does spawn.
        }, delay);
    }

    /** Stops any pending customer spawn attempts by clearing the timeout. */
    function stopCustomerSpawning() {
        if (customerSpawnTimeout) {
            clearTimeout(customerSpawnTimeout);
            customerSpawnTimeout = null;
        }
    }

    /**
     * Attempts to spawn a new customer based on spawn rate.
     * Called periodically when conditions are right (via scheduleNextSpawnAttempt).
     */
    function attemptCustomerSpawn() {
        // Re-check conditions at the moment the attempt actually runs
        if (!isBarOpen || currentCustomer || !gameActive) {
            customerSpawnTimeout = null; // Ensure timeout is cleared if conditions changed
            return;
        }

        // Calculate spawn chance (can be modified by upgrades/day later if desired)
        const spawnChance = BASE_CUSTOMER_SPAWN_RATE; // Example: 0.55 means 55% chance per attempt

        if (Math.random() < spawnChance) {
            spawnNewCustomer();
            // If spawnNewCustomer is successful, it will set currentCustomer,
            // which will prevent scheduleNextSpawnAttempt from re-scheduling in its own check.
            // spawnNewCustomer also calls stopCustomerSpawning directly.
        } else {
            // If no customer spawned this attempt, schedule the next check
            scheduleNextSpawnAttempt(); // Uses default delay (GAME_TICK_INTERVAL)
        }
    }

    /** Creates and displays a new customer with an order. */
    function spawnNewCustomer() {
        if (currentCustomer) return; // Safety check: Don't spawn if one already exists

        // Filter drinks the player can currently make based on unlocked recipes,
        // unlocked ingredients for that recipe, and bar upgrades (like aging rack).
        const availableDrinks = allDrinks.filter(drink => {
            // 1. Must be a known recipe (unlocked by player)
            if (!drink.unlocked) return false;

            // 2. <<< AGING FEATURE: Check Aging Requirement vs. Bar Upgrade >>>
            // If the drink needs aging, player must have the aging rack upgrade.
            if (drink.needsAging && (!barUpgrades.aging_rack || barUpgrades.aging_rack.currentLevel === 0)) {
                return false;
            }

            // 3. Check if ALL ingredients in the recipe are unlocked by the player
            const recipeIngredientsMet = drink.recipe.every(recipeIngredient => {
                const ingredientData = allIngredients.find(ing => ing.id === recipeIngredient.id);
                return ingredientData && ingredientData.unlocked;
            });
            if (!recipeIngredientsMet) return false;

            // 4. Check additional explicit ingredient requirements if any
            // (e.g., needing 'void_essence' ingredient unlocked even if not directly in THIS recipe,
            // but is a conceptual requirement for a drink category)
            if (drink.requires && drink.requires.length > 0) {
                const explicitRequirementsMet = drink.requires.every(reqId => {
                    const reqIngredient = allIngredients.find(ing => ing.id === reqId);
                    return reqIngredient && reqIngredient.unlocked;
                });
                if (!explicitRequirementsMet) return false;
            }

            // If all checks pass, the drink is available for a customer to order
            return true;
        });

        if (availableDrinks.length === 0) {
            console.warn("Attempted to spawn customer, but no makeable drinks available based on current player unlocks/upgrades.");
            // Don't spawn if nothing can be ordered. Schedule another attempt with a slightly longer delay.
            scheduleNextSpawnAttempt(GAME_TICK_INTERVAL * 2); // Try again in 2 ticks (adjust as needed)
            return;
        }

        // Select customer details randomly
        const nameIndex = Math.floor(Math.random() * customerNames.length);
        const iconIndex = Math.floor(Math.random() * customerIconUrls.length);
        const customerName = customerNames[nameIndex];
        const customerSpriteUrl = customerIconUrls[iconIndex];
        const isVip = Math.random() < VIP_CHANCE;
        const order = availableDrinks[Math.floor(Math.random() * availableDrinks.length)]; // Random drink from makeable list

        // Create the customer object
        currentCustomer = {
            name: customerName + (isVip ? " (VIP)" : ""),
            order: order, // The actual drink object
            isVip: isVip,
            iconUrl: customerSpriteUrl
            // TODO: Consider adding customer bio & preferences for more depth later
        };

        // Update UI for the new customer
        if (customerIcon) {
            customerIcon.src = currentCustomer.iconUrl;
            customerIcon.alt = currentCustomer.name;
            customerIcon.classList.toggle('vip', isVip); // Add/remove vip class based on isVip status
            customerIcon.classList.remove('happy', 'angry'); // Clear previous emotion animations
            customerIcon.style.animation = 'none'; // Ensure any previous direct animation is cleared
        }
        if (emotionPopup) { // Clear any lingering emotion popup
            emotionPopup.classList.remove('visible', 'happy', 'angry');
        }
        if (chatBubble) {
            chatBubble.textContent = `"${order.name}, please!"`;
            // Style chat bubble based on VIP status using CSS variable for pointer and direct styles for text/border
            const chatBubbleColor = isVip ? 'var(--vip-color)' : 'var(--neon-green)';
            const chatBubbleGlow = isVip ? 'var(--vip-glow)' : 'var(--text-glow-green)';
            chatBubble.style.borderColor = chatBubbleColor;
            chatBubble.style.color = chatBubbleColor;
            chatBubble.style.textShadow = chatBubbleGlow;
            chatBubble.style.setProperty('--chat-bubble-border-color', chatBubbleColor); // Update variable for pointer color
        }

        // Display message and start order timer
        showMessage(`${currentCustomer.name} arrives. Order: ${order.name}${order.needsAging ? ' (Needs Aging!)' : ''}`, "var(--neon-cyan)");
        startOrderTimer(); // Defined in Block 6
        clearMix();        // Clear previous mix from station (Defined in Block 3)

        // Enable/Disable Action Buttons for the new order
        if (serveBtn) serveBtn.disabled = false; // Can attempt to serve now
        updateMixingArea(); // Update clear/shake button states (Block 3)

        // Stop trying to spawn new customers while one is present
        stopCustomerSpawning();
    }

    // --- End of Block 7 ---
    // ==================================
    // BLOCK 8: DRINK MAKING FUNCTIONS
    // ==================================

    /**
     * Compares the player's current mix with the customer's order recipe.
     * Accounts for ingredient types and exact counts. Ignores order.
     * Assumes 'currentCustomer' is valid when called.
     * @returns {boolean} True if the mix matches the recipe exactly, false otherwise.
     */
    function compareRecipe() {
        // This check is now done within serveDrink before calling compareRecipe
        // if (!currentCustomer || !currentCustomer.order || !currentCustomer.order.recipe) {
        //     console.error("CompareRecipe called without valid customer/order context.");
        //     return false;
        // }
        const recipe = currentCustomer.order.recipe;
        const playerMix = selectedIngredients; // Array of {id, count}

        // Quick check: Different number of unique ingredient types?
        const recipeUniqueIds = new Set(recipe.map(item => item.id));
        const playerMixUniqueIds = new Set(playerMix.map(item => item.id));
        if (recipeUniqueIds.size !== playerMixUniqueIds.size) {
             // console.log("Recipe Mismatch: Different number of unique ingredients."); // Debug
             return false;
        }

        // Detailed check: Compare counts for each ingredient
        const recipeMap = recipe.reduce((map, item) => { map[item.id] = item.count; return map; }, {});
        const playerMixMap = playerMix.reduce((map, item) => { map[item.id] = item.count; return map; }, {});

        // Check if every required ingredient exists in the player mix with the correct count
        for (const id in recipeMap) {
            if (playerMixMap[id] !== recipeMap[id]) {
                 // console.log(`Recipe Mismatch: Ingredient ${id} count. Expected ${recipeMap[id]}, got ${playerMixMap[id] || 0}`); // Debug
                 return false; // Count mismatch or ingredient missing in player mix
            }
        }

        // Check if player mix contains extra ingredients not in recipe (already covered by size check)
        // If all checks passed, the recipe matches.
        return true;
    }

    /**
     * Adds a review to the displayed list and updates the tab.
     * @param {string} type - The category of review (e.g., 'goodServe', 'badServe', 'timeout').
     * @param {object | null} customerForReview - The customer object associated with the review (used for name).
     */
    function addReview(type, customerForReview) {
        // (This function remains largely unchanged)
        const pool = reviewPool[type] || [];
        if (pool.length === 0) {
             console.warn(`No review pool found for type: ${type}`);
             return;
        }

        let reviewText = pool[Math.floor(Math.random() * pool.length)];

        // Substitute placeholders in bad reviews if necessary
        if (type === 'badServe' && reviewText.includes('[random ingredient]')) {
            const unlockedIngredientNames = allIngredients
                .filter(i => i.unlocked && i.id !== 'ice') // Exclude ice and locked items
                .map(i => i.name);
            const randomIngredient = unlockedIngredientNames.length > 0
                ? unlockedIngredientNames[Math.floor(Math.random() * unlockedIngredientNames.length)]
                : "something"; // Fallback
            reviewText = reviewText.replace('[random ingredient]', randomIngredient);
        }

        // Safely get the reviewer's name
        const reviewerName = customerForReview?.name || 'A Mysterious Patron';
        const finalReview = `${reviewerName}: ${reviewText}`; // Format the review string

        // Add to the beginning of the displayed reviews array
        displayedReviews.unshift(finalReview);

        // Limit the number of reviews displayed
        if (displayedReviews.length > MAX_REVIEWS_DISPLAYED) {
            displayedReviews.pop(); // Remove the oldest review from the end
        }

        updateReviewsTab(); // Refresh the display (Function defined in Block 4)
    }


    /** Handles serving the drink to the customer. Checks recipe, shaking, and aging. */
    function serveDrink() {
        if (!isBarOpen || !currentCustomer || !currentCustomer.order) return; // Must have customer and order

        stopOrderTimer(); // Stop timer immediately on serve attempt
        const order = currentCustomer.order;
        const customerLeaving = currentCustomer; // Store reference before nullifying

        let serveSuccess = true;
        let feedbackMessage = "";
        let feedbackColor = "var(--neon-green)"; // Default to success color
        let reviewType = 'goodServe';            // Default to good review
        let emotionType = 'happy';               // Default to happy emotion

        // --- Validation Checks ---
        // Perform checks sequentially. If one fails, set serveSuccess = false and define failure feedback.

        // 1. <<< AGING FEATURE: Check Aging Requirement >>>
        if (order.needsAging && (!barUpgrades.aging_rack || barUpgrades.aging_rack.currentLevel === 0)) {
            serveSuccess = false;
            feedbackMessage = `This drink needs aging, but you don't have a Chrono-Aging Rack!`;
            feedbackColor = "var(--neon-pink)";
            reviewType = 'badServe'; // Could add a specific review pool entry for missing aging rack
            emotionType = 'angry';
        }

        // 2. Shaking Requirement Check (only if previous checks passed)
        if (serveSuccess) {
            if (order.requiresShake && !isShaken) {
                serveSuccess = false;
                feedbackMessage = `Needs shaking! ${customerLeaving.name} isn't happy.`;
                feedbackColor = "var(--neon-pink)";
                reviewType = 'badServe';
                emotionType = 'angry';
            } else if (!order.requiresShake && isShaken) {
                // Decide if unnecessary shaking is an error
                serveSuccess = false; // Currently treating as error
                feedbackMessage = `Didn't need shaking! ${customerLeaving.name} looks confused.`;
                feedbackColor = "var(--neon-pink)";
                reviewType = 'badServe';
                emotionType = 'angry';
            }
        }

        // 3. Ingredient Recipe Check (only if previous checks passed)
        if (serveSuccess) {
            const ingredientsCorrect = compareRecipe(); // Call compare function
            if (!ingredientsCorrect) {
                serveSuccess = false;
                feedbackMessage = `Whoops! That's not a ${order.name}! Check the ingredients/counts.`;
                feedbackColor = "var(--neon-pink)";
                reviewType = 'badServe';
                emotionType = 'angry';
            }
        }

        // --- Determine Outcome & Give Feedback ---
        if (serveSuccess) {
            // --- Success Case ---
            score++;

            // Calculate earnings
            let basePrice = order.price;
            let tipBonus = (barUpgrades.seating && barUpgrades.seating.currentLevel > 0) ? barUpgrades.seating.levels[barUpgrades.seating.currentLevel - 1].tipBonus : 0;
            let efficiencyMultiplier = (bartenderSkills.efficiency && bartenderSkills.efficiency.currentLevel > 0) ? bartenderSkills.efficiency.levels[bartenderSkills.efficiency.currentLevel - 1].moneyMultiplier : 1.0;
            let vipMultiplier = customerLeaving.isVip ? VIP_MONEY_MULTIPLIER : 1.0;
            let earned = Math.ceil((basePrice + tipBonus) * efficiencyMultiplier * vipMultiplier);

            money += earned;
            feedbackMessage = `Perfect! ${order.name} served! +$${earned}`;
            // feedbackColor, reviewType, emotionType remain at default success values

            updateStaticUIDisplays(); // Update score, money displays immediately

        }
        // --- else: Failure Case ---
        // Failure feedback variables (feedbackMessage, color, reviewType, emotionType)
        // were already set by the first check that failed.

        // --- Post-Check Actions ---
        currentCustomer = null; // Nullify customer state AFTER checks, before feedback display
        showMessage(feedbackMessage, feedbackColor);
        triggerCustomerEmotion(emotionType, !serveSuccess); // Persistent happy if success, temporary angry if fail
        addReview(reviewType, customerLeaving);

        // Schedule next customer check & clear visuals
        if (isBarOpen && gameActive) {
            scheduleNextSpawnAttempt(POST_EVENT_SPAWN_DELAY);
        }
        setTimeout(clearCustomerDisplay, CUSTOMER_CLEAR_DELAY); // Clear visuals after a short delay

        clearMix(); // Always clear the mix after serving (success or fail)
        if(serveBtn) serveBtn.disabled = true; // Disable serve button until next customer appears
    }


    /** Handles the shake button click. Applies animation to mixer image. */
    function shakeDrink() {
        // <<< MODIFIED: Applies animation to mixerImageVisual >>>
        if (!isBarOpen || !gameActive || selectedIngredients.length === 0 || isShaken) {
            if(isShaken) showMessage("Already shaken!", "var(--neon-blue)");
            return;
        }

        // Check if the current order *requires* shaking to determine animation type
        // Allow shaking even if not required, but maybe use a different animation?
        const requiresShakeForOrder = currentCustomer?.order?.requiresShake; // Use optional chaining
        const animationClass = requiresShakeForOrder ? 'mixing-shake' : 'mixing-gentle';

        // Check if the mixer image element exists before trying to animate it
        if (!mixerImageVisual) {
             console.error("Mixer image visual element not found for shaking!");
             return;
        }

        isShaken = true; // Set state: mix is now considered shaken
        showMessage("Shaking...", "var(--neon-orange)");

        // Apply animation class to the image visual element
        mixerImageVisual.classList.remove('mixing-gentle', 'mixing-shake'); // Clear previous anim
        void mixerImageVisual.offsetWidth; // Force reflow to help ensure animation restarts
        mixerImageVisual.classList.add(animationClass);

        // Calculate shake time based on skill
        let shakeTimeReduction = (bartenderSkills.shaking && bartenderSkills.shaking.currentLevel > 0)
            ? bartenderSkills.shaking.levels[bartenderSkills.shaking.currentLevel - 1].shakeTimeReduction
            : 0;
        const finalShakeTime = Math.max(MIN_SHAKE_TIME, SHAKE_ANIMATION_BASE_TIME - shakeTimeReduction);

        // Disable buttons during animation to prevent conflicts
        if (shakeBtn) shakeBtn.disabled = true; // Disable shake while shaking
        if (clearBtn) clearBtn.disabled = true; // Prevent clearing while shaking
        if (serveBtn) serveBtn.disabled = true; // Prevent serving while shaking

        // After animation duration, remove class and re-evaluate button states
        setTimeout(() => {
            if (mixerImageVisual) {
                mixerImageVisual.classList.remove(animationClass); // Remove animation class from image
            }
            // Re-enable buttons based on current game state *after* shaking finishes
            // updateMixingArea handles button states based on isShaken, hasIngredients, isBarOpen etc.
            updateMixingArea(); // This will correctly set shakeBtn disabled (isShaken=true), clearBtn enabled, serveBtn enabled (if customer)

        }, finalShakeTime);
    }

    // --- End of Block 8 ---
    // ==================================================
    // BLOCK 9: PURCHASE HANDLING & TAB SWITCHING
    // ==================================================

    /**
     * Handles clicks on "Buy/Unlock/Upgrade" buttons within the tabs (event delegation target).
     * @param {Event} event - The click event object.
     */
    function handlePurchase(event) {
        // Button is the event target, get type and id from its data attributes
        const btn = event.target.closest('.buy-btn'); // Ensure we target the button itself
        if (!btn) return; // Exit if the click wasn't on a buy button

        const type = btn.dataset.type; // 'drink', 'ingredient', 'upgrade', 'skill'
        const id = btn.dataset.id;     // Name or key of the item

        if (!type || !id) {
            console.error("Purchase button missing data type or id:", btn);
            return;
        }

        let cost = 0;
        let purchased = false;
        let purchaseTarget = null; // Reference to the item being purchased/upgraded
        let successMessage = "";   // Message to show on successful purchase

        try { // Wrap purchase logic in try...catch for robustness
            switch (type) {
                case 'drink':
                    purchaseTarget = allDrinks.find(d => d.name === id);
                    if (purchaseTarget && !purchaseTarget.unlocked && purchaseTarget.cost > 0) {
                        cost = purchaseTarget.cost;
                        // Verify requirements again just before purchase
                        let canUnlock = true;
                        // Check recipe ingredients
                        canUnlock = purchaseTarget.recipe.every(recIng => allIngredients.find(i => i.id === recIng.id)?.unlocked);
                        // Check explicit 'requires' array
                        if (canUnlock && purchaseTarget.requires && purchaseTarget.requires.length > 0) {
                            canUnlock = purchaseTarget.requires.every(reqId => allIngredients.find(i => i.id === reqId)?.unlocked);
                        }

                        if (!canUnlock) {
                            showMessage("Cannot unlock: Required ingredients are locked!", 'var(--neon-pink)');
                            return; // Stop purchase
                        }

                        if (money >= cost) {
                            purchaseTarget.unlocked = true;
                            purchased = true;
                            successMessage = `Unlocked Recipe: ${purchaseTarget.name}!`;
                        } else {
                            showMessage(`Not enough cash! Need $${cost}`, 'var(--neon-pink)');
                            return; // Stop purchase
                        }
                    }
                    break;

                case 'ingredient':
                    purchaseTarget = allIngredients.find(i => i.id === id);
                    if (purchaseTarget && !purchaseTarget.unlocked && purchaseTarget.cost > 0) {
                        cost = purchaseTarget.cost;
                        if (money >= cost) {
                            purchaseTarget.unlocked = true;
                            purchased = true;
                            successMessage = `Unlocked Ingredient: ${purchaseTarget.name}!`;
                        } else {
                            showMessage(`Not enough cash! Need $${cost}`, 'var(--neon-pink)');
                            return; // Stop purchase
                        }
                    }
                    break;

                case 'upgrade':
                    purchaseTarget = barUpgrades[id];
                    if (purchaseTarget && purchaseTarget.currentLevel < purchaseTarget.levels.length) {
                        cost = purchaseTarget.levels[purchaseTarget.currentLevel].cost;
                        if (money >= cost) {
                            purchaseTarget.currentLevel++;
                            purchased = true;
                            successMessage = `Upgraded ${purchaseTarget.name} to Level ${purchaseTarget.currentLevel}!`;
                            // Special handling for aging rack purchase message
                            if (id === 'aging_rack') {
                                successMessage = `Purchased ${purchaseTarget.name}! You can now serve aged drinks.`;
                            }
                        } else {
                            showMessage(`Not enough cash! Need $${cost}`, 'var(--neon-pink)');
                            return; // Stop purchase
                        }
                    }
                    break;

                case 'skill':
                    purchaseTarget = bartenderSkills[id];
                    if (purchaseTarget && purchaseTarget.currentLevel < purchaseTarget.levels.length) {
                        cost = purchaseTarget.levels[purchaseTarget.currentLevel].cost;
                        if (money >= cost) {
                            purchaseTarget.currentLevel++;
                            purchased = true;
                            successMessage = `Improved ${purchaseTarget.name} to Level ${purchaseTarget.currentLevel}!`;
                        } else {
                            showMessage(`Not enough cash! Need $${cost}`, 'var(--neon-pink)');
                            return; // Stop purchase
                        }
                    }
                    break;

                default:
                    console.warn(`Unknown purchase type encountered: ${type}`);
                    return;
            }

            // --- Process successful purchase ---
            if (purchased) {
                money -= cost;
                showMessage(successMessage, 'var(--neon-green)');

                // Refresh relevant UI elements immediately after purchase
                updateStaticUIDisplays(); // Update money display & potentially skill/upgrade level summary
                updateAllDynamicTabs();   // Refresh all tabs to show new state, costs, disable buttons etc.
                updateIngredientButtons(); // Refresh ingredient list if an ingredient was unlocked

                // Potentially trigger other updates if needed (e.g., if an upgrade affects something immediately visible)

            } else {
                // Handle cases where the button might have been clicked despite being disabled,
                // or item was already unlocked/maxed (should ideally be prevented by disabling button).
                // Avoid showing an error if the purchase simply wasn't possible (e.g., already maxed)
                 if(purchaseTarget && (type === 'upgrade' || type === 'skill') && purchaseTarget.currentLevel >= purchaseTarget.levels.length) {
                    // If it's already max level, maybe show a neutral message or do nothing silently
                    showMessage("Item already at max level.", "var(--neon-blue)");
                 } else if (purchaseTarget && (type === 'drink' || type === 'ingredient') && purchaseTarget.unlocked) {
                     showMessage("Item already unlocked.", "var(--neon-blue)");
                 } else if (cost > 0 && money < cost) {
                     // Insufficient funds message already shown above
                 } else {
                     console.warn(`Purchase attempted but failed (already owned/maxed, insufficient funds, or requirements unmet): ${type} - ${id}`);
                 }
            }

        } catch (error) {
            console.error("Error during purchase processing:", error);
            showMessage("An error occurred during purchase.", 'red'); // Use generic red for errors
        }
    }

    /**
     * Sets the active tab in the right panel by toggling CSS classes.
     * @param {string} tabId - The data-tab value of the tab to activate (e.g., 'recipes').
     */
    function setActiveTab(tabId) {
        if (!tabButtons || !tabContents) {
             console.error("Tab buttons or content areas not found!");
             return;
        }

        // Update button states - add 'active' class to the clicked button, remove from others
        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });

        // Update content visibility - add 'active' class to the corresponding content, remove from others
        tabContents.forEach(content => {
            // Content ID is expected to match the pattern `${tabId}-content`
            const expectedContentId = `${tabId}-content`;
            content.classList.toggle('active', content.id === expectedContentId);
        });

        // Scroll the newly active content area to the top for better UX
        const activeContent = document.getElementById(`${tabId}-content`);
        if (activeContent) {
            activeContent.scrollTop = 0;
        }

        // Optional: If tab content needs refreshing *every* time it's switched (not just on purchase),
        // you could uncomment and use the specific update function calls here.
        /*
        switch(tabId) {
             case 'recipes': updateRecipePamphlet(); break;
             case 'unlocks': updateUnlocksTab(); break;
             case 'upgrades': updateUpgradesTab(); break;
             case 'skills': updateSkillsTab(); break;
             case 'reviews': updateReviewsTab(); break;
        }
        */
    }

    // --- End of Block 9 ---
    // =======================================================
    // BLOCK 10: INITIALIZATION & CORE EVENT LISTENERS
    // =======================================================

    /** Toggles the visibility of the customer queue section. */
    function toggleQueueDisplay() {
        // (This function remains unchanged)
        if (!queueSection || !queueToggleBtn) return;

        isQueueVisible = !isQueueVisible; // Toggle the state variable

        if (isQueueVisible) {
            queueSection.style.display = 'block'; // Show the section
            // Optional: Refresh queue display content when shown
            // updateCustomerQueueDisplay(); // (Call this if/when implemented)
            queueToggleBtn.textContent = 'Queue <'; // Change arrow/text
            queueToggleBtn.title = 'Hide Customer Queue';
        } else {
            queueSection.style.display = 'none'; // Hide the section
            queueToggleBtn.textContent = 'Queue >'; // Change arrow/text back
            queueToggleBtn.title = 'Show Customer Queue';
        }
    }

    /**
     * Handles clicks within the tab button container using event delegation.
     * Calls setActiveTab for the clicked tab button.
     * @param {Event} event The click event.
     */
    function handleTabButtonClick(event) {
        // (This function remains unchanged)
        const clickedButton = event.target.closest('.tab-btn');
        if (clickedButton && clickedButton.dataset.tab) {
            setActiveTab(clickedButton.dataset.tab); // setActiveTab defined in Block 9
        }
    }

    /**
     * Handles clicks within the dynamic list containers (tabs, queue) using event delegation.
     * Routes clicks on '.buy-btn' to handlePurchase.
     * Includes TODOs for queue-specific buttons.
     * @param {Event} event The click event.
     */
    function handleListButtonClick(event) {
        // (This function remains unchanged, includes TODOs for queue actions)
        const buyButton = event.target.closest('.buy-btn');
        const bioButton = event.target.closest('.queue-bio-btn');
        const askButton = event.target.closest('.queue-ask-btn');

        if (buyButton && !buyButton.disabled) {
             handlePurchase(event); // handlePurchase defined in Block 9
        } else if (bioButton){
             // TODO: Implement logic to show Bio for the specific customer in the queue
             const customerItem = bioButton.closest('.queue-customer-item');
             const customerId = customerItem?.dataset.customerId; // Assuming dataset ID is added when queue item is created
             console.log("Bio button clicked for queue customer:", customerId || 'Unknown');
             showMessage("Bio feature not yet implemented.", "var(--neon-blue)");
        } else if (askButton) {
             // TODO: Implement logic to ask/reveal order for the specific customer in the queue
             const customerItem = askButton.closest('.queue-customer-item');
             const customerId = customerItem?.dataset.customerId;
             console.log("Ask Order button clicked for queue customer:", customerId || 'Unknown');
             showMessage("Asking order feature not yet implemented.", "var(--neon-blue)");
        }
    }


    /** Toggles the bar open/closed state and manages game flow transitions (SETUP -> OPEN -> CLOSED). */
    function toggleBarOpen() {
        // (This function remains largely unchanged)
        if (!openCloseSign) return;

        if (isSetupPhase) { // --- Starting the Day (From SETUP state) ---
            isSetupPhase = false;
            isBarOpen = true;
            gameActive = true; // Start game logic loop

            openCloseSign.textContent = "CLOSE BAR"; // Button action is now to close
            openCloseSign.classList.remove("closed"); // Style as open
            openCloseSign.classList.add("open");
            openCloseSign.disabled = false; // Allow closing early

            showMessage("Bar is now OPEN! Good luck!", "var(--neon-green)");
            updateClockDisplay(); // Ensure clock is correct at start of day
            startGameClock(); // Starts game timer and initiates spawn checks (Block 6)

            // Ensure action buttons are correctly enabled/disabled at start of day
            updateMixingArea(); // Should disable clear/shake initially, enable based on state
            if(serveBtn) serveBtn.disabled = true; // No customer yet, disable serve

            // Refresh dynamic elements that might have changed during setup (if purchases were allowed)
            updateAllDynamicTabs();
            updateIngredientButtons();

        } else if (isBarOpen) { // --- Closing the Bar Early (From OPEN state) ---
            showMessage("Closing the bar early...", "var(--neon-orange)");
            // Disable sign immediately to prevent double clicks during transition
            openCloseSign.disabled = true;
            endDay(); // Trigger the full end-of-day sequence (stops clocks, clears customers, etc. - Block 6)

        } else { // --- Trying to click when CLOSED (Should only happen if button wasn't disabled properly) ---
            console.warn("Open/Close sign clicked while bar is already closed and not in setup phase.");
            showMessage("The bar is closed. Wait for the SETUP phase.", "var(--neon-pink)");
        }
    }

    /** Initializes the game state, UI, and attaches all core event listeners. */
    function initializeGame() {
        console.log("Initializing CYBERBAR Sim v5.0...");

        // 1. Initial UI Updates
        updateClockDisplay();       // Set initial time/day display
        updateStaticUIDisplays();   // Set initial score/money/level displays
        updateAllDynamicTabs();     // Populate tabs (removes loading messages)
        updateIngredientButtons();  // Display starting ingredients (removes loading message)
        setupDragAndDropListeners(); // Attach D&D listeners to mixing station (Block 5)
        setActiveTab('recipes');    // Set the initial active tab (Block 9)
        clearMix();                 // Ensure mixer starts visually empty (Block 3)
        clearCustomerDisplay();     // Ensure customer area starts clear (Block 3)

        // 2. Attach Core Event Listeners
        // Header Button
        if (openCloseSign) openCloseSign.addEventListener('click', toggleBarOpen);
        // Mixing Station Buttons
        if (clearBtn) clearBtn.addEventListener('click', clearMix);
        if (serveBtn) serveBtn.addEventListener('click', serveDrink);
        if (shakeBtn) shakeBtn.addEventListener('click', shakeDrink);
        // Left Panel Queue Button
        if (queueToggleBtn) queueToggleBtn.addEventListener('click', toggleQueueDisplay);
        // Tutorial Button listener added below in tutorial logic

        // 3. Event Delegation Setup
        // Tab Buttons Container
        const tabButtonContainer = document.getElementById('tab-buttons');
        if (tabButtonContainer) {
            tabButtonContainer.addEventListener('click', handleTabButtonClick);
        } else { console.error("Tab button container not found!"); }

        // List Item Buttons (delegated from parent lists in tabs and queue)
        if (unlocksListDiv) unlocksListDiv.addEventListener('click', handleListButtonClick);
        if (upgradesListDiv) upgradesListDiv.addEventListener('click', handleListButtonClick);
        if (skillsListDiv) skillsListDiv.addEventListener('click', handleListButtonClick);
        if (reviewsListDiv) { /* No interactive buttons expected here currently */ }
        if (queueList) queueList.addEventListener('click', handleListButtonClick); // For potential queue item buttons

        // 4. Tutorial Modal Logic
        if (tutorialModal && startGameBtn && openCloseSign) {
            // Show tutorial modal initially using the .visible class (CSS handles display)
            tutorialModal.classList.add('visible');

            // Disable setup button while tutorial is visible
            openCloseSign.disabled = true;
            openCloseSign.textContent = "SETUP";
            openCloseSign.classList.add("closed"); // Use closed style

            // Add listener to the "Start Game" button within the tutorial
            startGameBtn.addEventListener('click', () => {
                tutorialModal.classList.remove('visible'); // Hide modal via CSS class
                // Enable the setup button ONLY after tutorial is closed
                openCloseSign.disabled = false;
                showMessage("Tutorial closed. Press SETUP to begin Day 1.", "var(--neon-cyan)");
            }, { once: true }); // Use {once: true} so listener is automatically removed after first click

        } else {
            // If no tutorial modal elements found, enable setup button directly
            if(openCloseSign) {
                 openCloseSign.disabled = false;
                 openCloseSign.textContent = "SETUP";
                 openCloseSign.classList.add("closed");
                 showMessage("Welcome to CYBERBAR! Press SETUP to begin Day 1.", "var(--neon-cyan)");
            } else {
                 console.error("Open/Close sign not found for initial setup enable.");
            }
        }

        // 5. Set Initial Interaction Button States (most should be disabled initially)
        if(clearBtn) clearBtn.disabled = true;
        if(shakeBtn) shakeBtn.disabled = true;
        if(serveBtn) serveBtn.disabled = true;
        // openCloseSign state handled by tutorial logic above

        console.log("Game Initialized. Waiting for player action (Close Tutorial or Press SETUP).");
    }

    // --- GAME START ---
    // Run initialization function when the script loads (DOM should be ready due to 'defer')
    initializeGame();

// --- End of Block 10 / End of IIFE ---
})(); // Immediately Invoked Function Expression closes