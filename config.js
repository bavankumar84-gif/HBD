// Digital Birthday Surprise Configuration — Bakkiya
// Customizable recipient info, letter text, photo captions, and audio settings

const BIRTHDAY_CONFIG = {
    // Recipient Information
    name: "BAKKIYA",
    title: "Happy Birthday Bakkiya",
    subtitle: "A digital surprise made with love",

    // Audio File Configuration
    // Drop your personal audio file as 'music.mp3' in the project directory
    audio: {
        src: "music.mp3",
        fadeInDuration: 1500, // milliseconds
        defaultVolume: 1.0 // Increased to maximum volume
    },

    // Uploaded Photos Configuration (3 Photos)
    photos: [
        {
            id: 1,
            src: "images/photo1.jpg",
            title: "Playful Sparkle ✨",
            caption: "Bringing endless laughter, silly moments, and genuine warmth wherever you go!",
            tag: "Cute & Playful",
            layout: "full-width" // Hero card layout
        },
        {
            id: 2,
            src: "images/photo2.jpg",
            title: "Style & Confidence 💙",
            caption: "Striking a pose with effortless charm and that bright, infectious smile.",
            tag: "Pure Grace",
            layout: "side-by-side" // Asymmetric side layout
        },
        {
            id: 3,
            src: "images/photo3.jpg",
            title: "Sunlit Adventures 🌿",
            caption: "Golden sunshine, peaceful outdoor days, and memories that last a lifetime.",
            tag: "Cherished Moment",
            layout: "polaroid" // Floating polaroid layout
        }
    ],

    // Personal Letter Content
    letter: {
        heading: "A little message for you...",
        message: `Dear Bakkiya,\n\nHappy Birthday!\n\nYou are one of the most special people in my life. Thank you for all the memories, laughs, silly fights and beautiful moments we've shared.\n\nI hope this year brings you happiness, success and everything you've been wishing for.\n\nKeep smiling, keep being yourself, and never forget how special you are.\n\nHappy Birthday, Sis! ❤️`
    },

    // Final Wishes & Footer
    finalWish: "May your year be filled with beautiful moments, big smiles and unforgettable memories.",
    footerText: "Made with love by your brother."
};

// Export to window scope
if (typeof window !== 'undefined') {
    window.BIRTHDAY_CONFIG = BIRTHDAY_CONFIG;
}
