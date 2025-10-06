# Professional Portfolio Website

A modern, responsive, and highly customizable portfolio website built with vanilla HTML, CSS, and JavaScript. Features clean design, smooth animations, and a working contact form with EmailJS integration.

## ✨ Features

- **Modern Design**: Clean, professional layout with appealing color gradients and animations
- **Fully Responsive**: Optimized for mobile, tablet, laptop, and desktop devices
- **Fast Loading**: Minimal dependencies, semantic HTML, and optimized assets
- **Working Contact Form**: Real email functionality using EmailJS service
- **SEO Optimized**: Proper meta tags, structured data, and accessibility features
- **Easy Customization**: CSS variables for colors, fonts, and spacing
- **Smooth Animations**: Subtle hover effects and scroll-based animations
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🚀 Getting Started

### 1. Download or Clone
```bash
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website
```

### 2. Customize Content
Edit the following in `index.html`:
- Replace "Your Name" with your actual name
- Update the about section with your information
- Add your projects, skills, and contact details
- Replace social media links with your profiles

### 3. Set Up Contact Form (Optional but Recommended)

The contact form uses EmailJS to send emails directly from the client-side. Follow these steps:

#### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account (100 emails/month free)

#### Step 2: Set Up Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Note your **Service ID**

#### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template structure:
```
Subject: New Portfolio Contact: {{subject}}

From: {{from_name}} ({{from_email}})
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from your portfolio contact form.
```
4. Note your **Template ID**

#### Step 4: Configure the Code
1. In `js/main.js`, find line 455 and replace:
```javascript
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS public key
```

2. On line 458, replace:
```javascript
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

3. Get your Public Key from EmailJS dashboard > Account > API Keys

### 4. Customize Styling

#### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
  --color-primary: #6366f1;      /* Main brand color */
  --color-secondary: #ec4899;    /* Secondary accent */
  --color-accent: #06b6d4;       /* Highlight color */
}
```

#### Fonts
Change the font family:
```css
--font-family-primary: 'Inter', sans-serif;
```

#### Spacing and Sizes
Adjust spacing scale:
```css
--space-lg: 1.5rem;    /* Section spacing */
--space-xl: 2rem;      /* Large spacing */
```

## 📁 Project Structure

```
portfolio-website/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Main stylesheet with CSS variables
│   └── responsive.css      # Responsive design and media queries
├── js/
│   └── main.js            # JavaScript for interactions and form handling
├── assets/
│   └── icons.svg          # SVG icon library
└── README.md              # This file
```

## 🎨 Customization Guide

### Adding New Sections
1. Add HTML section in `index.html`
2. Add navigation link in the header
3. Add corresponding CSS in `styles.css`
4. Update JavaScript navigation in `main.js`

### Adding Projects
Copy the project card structure in the projects section:
```html
<article class="project-card">
  <div class="project-image">
    <!-- Add your project image or placeholder -->
  </div>
  <div class="project-content">
    <h3 class="project-title">Your Project</h3>
    <p class="project-description">Description...</p>
    <div class="project-tech">
      <span class="tech-tag">Technology</span>
    </div>
    <div class="project-links">
      <a href="#" class="project-link">Live Demo</a>
      <a href="#" class="project-link">GitHub</a>
    </div>
  </div>
</article>
```

### Adding Skills
Add skills to the appropriate category:
```html
<div class="skill-item">
  <svg class="skill-icon" viewBox="0 0 24 24">
    <!-- Icon SVG -->
  </svg>
  <span class="skill-name">Skill Name</span>
</div>
```

## 🌐 Deployment

### Replit (Recommended)
1. Upload files to Replit
2. Run with Python HTTP server: `python -m http.server 5000`
3. Your site will be available at the Replit URL

### Netlify
1. Create account at Netlify.com
2. Drag and drop your project folder
3. Site will be live instantly with custom domain option

### GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Site will be available at `yourusername.github.io/repository-name`

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts for instant deployment

## 🛠️ Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚡ Performance Tips

- Images should be optimized (WebP format recommended)
- Keep total page size under 1MB for fast loading
- Use lazy loading for images below the fold
- Consider using a CDN for faster global delivery

## 🔧 Troubleshooting

### Contact Form Not Working
1. Check EmailJS configuration in `main.js`
2. Verify your Service ID and Template ID
3. Ensure your public key is correct
4. Check browser console for error messages

### Styling Issues
1. Clear browser cache
2. Check CSS file paths
3. Validate CSS syntax
4. Test in different browsers

## 📞 Support

If you need help customizing this portfolio or setting up EmailJS, feel free to:
- Open an issue on GitHub
- Check the documentation links provided
- Contact through the portfolio contact form (once set up!)

---

**Made with ❤️ for developers who want to showcase their work professionally**