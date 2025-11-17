# Slam Guru - Website Frontend

This is the official landing page for "Slam Guru - The Ultimate WWE Discord Bot". The website provides a feature overview, directs users to add the bot to their Discord server, and includes a dynamic interface to search and filter through all available player cards.

The project is built with a focus on a clean UI, responsiveness, and a modern technology stack using HTML, Tailwind CSS, and vanilla JavaScript.

## ✨ Features

*   **🎨 Dual-Theme Interface**: Seamlessly switch between a light and dark mode, with the user's preference saved in local storage.
*   **📱 Fully Responsive Design**: The layout is optimized for all screen sizes, from mobile phones to desktops, ensuring a great user experience on any device.
*   **📄 Single-Page Application Feel**: JavaScript is used to show/hide the "Home" and "Card Search" sections, providing a smooth, app-like navigation experience without page reloads.
*   **🔍 Advanced Player Card Search**:
    *   **Live Text Search**: Instantly filter cards by player name as you type.
    *   **Advanced Filtering**: A comprehensive modal allows users to apply multiple filters, including:
        *   Sorting by OVR, Price, Name, and individual stats.
        *   Filtering by Price Range.
        *   Filtering by player Style (e.g., Technician, Brawler).
        *   Filtering by Card Type (e.g., Legendary).
    *   **Pagination**: Efficiently browse through a large collection of cards with easy-to-use "Next" and "Previous" buttons.
*   **🚀 Modern UI/UX**:
    *   Built with **Tailwind CSS** for a utility-first, modern design.
    *   Custom fonts (`Bebas Neue` and `Inter`) for stylish typography.
    *   A "Scroll to Top" button for improved navigation on long pages.
    *   A blurred, sticky navigation bar for a professional look.

## 🛠️ Technologies Used

*   **HTML5**: For the core structure and content.
*   **Tailwind CSS**: For all styling and layout. The configuration is embedded directly in the HTML for simplicity.
*   **JavaScript (ES6+)**: For all interactivity, including theme switching, navigation, search, filtering, and dynamic content rendering.
*   **Google Fonts**: For custom web fonts.

## 📂 Project Structure

```
SlamGuruWebsiteFrontEnd/
├── 📂 Images/
│   ├── NewIcon.png       # Main logo
│   ├── I1.png            # Feature image
│   ├── I3.png            # Feature image
│   └── I11.png           # Feature image
├── index.html            # The main and only HTML file
├── script.js             # Contains all JavaScript logic
├── style.css             # For any minor custom CSS not covered by Tailwind
└── README.md             # You are here!
```

## 🚀 Getting Started

No complex build steps or dependencies are required to run this project.

1.  **Clone the repository (or download the files):**
    ```bash
    git clone <your-repository-url>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd SlamGuruWebsiteFrontEnd
    ```

3.  **Open `index.html` in your web browser.**
    *   You can simply double-click the file, or use a tool like Live Server in VS Code for a better development experience with hot-reloading.

## 🎨 Customization

The website is designed to be easily customizable.

### Colors and Theme

All theme colors are defined within a `<script>` tag in the `<head>` of `index.html`. You can modify the hex codes in the `tailwind.config` object to change the color palette for both the light and dark themes.

```html
<script>
    tailwind.config = {
        darkMode: 'class',
        theme: {
            extend: {
                colors: {
                    // Light Theme
                    'brand-bg': '#f0f2f5',
                    'brand-surface': '#ffffff',
                    // ...and so on

                    // Dark Theme
                    'dark-brand-bg': '#16182d',
                    'dark-brand-surface': '#1f223e',
                    // ...and so on
                }
            }
        }
    }
</script>
```

### Fonts

The project uses Google Fonts. To change them, update the `<link>` tag in the `<head>` of `index.html` and adjust the font family classes in your CSS or directly in the HTML where needed.

### Content

All text, images, and links can be modified directly in the `index.html` file. The feature descriptions, hero text, and Discord invite link are all clearly laid out in the HTML structure.

---

&copy; 2025 Slam Guru. All Rights Reserved.