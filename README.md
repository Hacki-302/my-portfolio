# Borif Gido | Personal Portfolio

<p align="center">
  <strong>Software Engineering Student · Aspiring Full-Stack Developer</strong>
</p>

<p align="center">
  A personal portfolio website showcasing my skills, projects, technical interests, and professional journey.
</p>

<p align="center">
  <a href="https://github.com/Hacki-302">GitHub</a> ·
  <a href="https://t.me/MaadiiB9">Telegram</a> ·
  <a href="mailto:borifhacki302@gmail.com">Email</a>
</p>

---

## About the Project

Welcome to my personal portfolio! I'm **Borif Gido**, a Software Engineering student at Bule Hora University, passionate about programming, building useful software applications, and exploring modern web technologies.

This portfolio is designed to present my background, technical skills, projects, and contact information in one place.

The project combines a responsive frontend built with HTML, CSS, and JavaScript with a Node.js and Express backend that processes contact form submissions and delivers messages through email.

## Features

- **Personal Introduction** — Learn about me, my background, and my interests.
- **Responsive Design** — A website designed to work across desktop, tablet, and mobile screens.
- **Projects Showcase** — A place to explore my software development projects.
- **Technical Skills** — An overview of my programming and web development skills.
- **Contact Form** — Submit messages through a backend API with email delivery.
- **Form Validation** — Validates submitted contact information on the frontend and backend.
- **Email Integration** — Uses Nodemailer to deliver contact messages through Gmail.
- **API Health Check** — An endpoint for verifying backend availability.
- **Security Measures** — Includes environment-based secrets, CORS configuration, security headers, request-size limits, and rate limiting.

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Website structure and semantic content |
| CSS3 | Styling, layouts, and responsive design |
| JavaScript | Interactivity and contact form submission |
| Fetch API | Communication with the backend |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend server and REST API |
| Nodemailer | Email delivery |
| dotenv | Environment variable configuration |
| CORS | Cross-origin request configuration |
| Helmet | HTTP security headers |
| express-rate-limit | Request rate limiting |

### Development Tools

- Visual Studio Code
- Git and GitHub
- npm
- Nodemon
- VS Code Live Server

## Project Structure

```text
borif-portfolio/
├── assets/
│   ├── images/
│   │   └── profile.jpg
│   ├── logo.png
│   └── borif-gido-cv.pdf
├── css/
│   └── style.css
├── js/
│   └── script.js
├── contact-backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env                 # Local only; never commit
├── .gitignore
├── index.html
└── README.md
```

The `node_modules/` directory is generated locally when backend dependencies are installed and should not be committed to Git.

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- A browser such as Chrome, Firefox, or Edge

### 1. Clone the Repository

```bash
git clone https://github.com/Hacki-302/borif-portfolio.git
cd borif-portfolio
```

### 2. Start the Frontend

Open the project in Visual Studio Code.

Install the Live Server extension if you haven't already. Right-click `index.html` and choose **Open with Live Server**.

The frontend will typically be available at:

```text
http://127.0.0.1:5500
```

Use the actual origin displayed by Live Server if it uses a different port.

### 3. Install Backend Dependencies

Open a terminal in the project directory and run:

```bash
cd contact-backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside `contact-backend/`.

Add the following configuration and replace the example values with your own:

```env
PORT=3000
NODE_ENV=development
FRONTEND_ORIGIN=http://127.0.0.1:5500

EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password
CONTACT_RECEIVER=your-email@gmail.com
```

**Security:** Never commit your `.env` file, expose your Gmail App Password, or place email credentials in frontend JavaScript.

For Gmail, configure an App Password through your Google Account when the feature is available and your account meets Google's requirements. Do not use your normal Gmail password.

### 5. Run the Backend

From the `contact-backend/` directory, run:

```bash
npm run dev
```

For a normal start without Nodemon, use:

```bash
npm start
```

The API should run at:

```text
http://localhost:3000
```

### 6. Verify the Backend

Check the health endpoint in your browser:

```text
http://localhost:3000/api/health
```

A successful response should look like:

```json
{
  "success": true,
  "message": "Portfolio Contact API is running."
}
```

The contact form sends submissions to:

```text
POST /api/contact
```

Email delivery requires valid backend email configuration.

## Contact Form Workflow

The contact form uses the following workflow:

1. A visitor fills in the contact form.
2. Frontend JavaScript validates the submitted fields.
3. The browser sends a JSON request to the backend.
4. Express validates the submitted data and applies rate limiting.
5. Nodemailer sends the message to the configured recipient.
6. The frontend displays the result returned by the API.

The backend's email credentials remain on the server rather than being exposed in the browser.

## Deployment

The frontend and backend can be hosted separately while working together as one application.

### Frontend

The static website can be deployed using [GitHub Pages](https://pages.github.com/) or another static hosting provider.

### Backend

The Node.js API can be deployed using a Node.js-compatible hosting service such as [Render](https://render.com/).

For production deployment:

1. Deploy the backend and obtain its public HTTPS URL.
2. Configure the required environment variables in the hosting dashboard.
3. Set `FRONTEND_ORIGIN` to the exact origin of the deployed portfolio.
4. Update the frontend API URL in `js/script.js` to use the deployed backend's `/api/contact` endpoint.
5. Publish the updated frontend.
6. Test the contact form and verify email delivery.

Keep all secrets out of the public repository. Check your hosting provider's current pricing, resource limits, and availability before deployment.

## Security Considerations

This project includes several basic protections, but production deployment requires careful configuration.

- Keep credentials in backend environment variables.
- Never commit `.env` files.
- Configure CORS to allow only trusted frontend origins.
- Validate all input on the server.
- Apply rate limiting to contact submissions.
- Use HTTPS in production.
- Monitor email delivery errors and abuse.
- Consider additional anti-spam measures, including server-side honeypot validation or CAPTCHA.
- Review dependencies and keep them updated.
- Ensure the public CV and other assets contain only information you intend to share.

## Future Improvements

Planned opportunities to improve the portfolio include:

- Custom domain and production deployment.
- Additional project demonstrations and live previews.
- Improved accessibility and search engine optimization.
- Stronger contact form anti-spam protection.
- Website analytics.
- More projects demonstrating full-stack development skills.
- Continued improvements to responsive design and user experience.

## Author

**Borif Gido**

Software Engineering Student at Bule Hora University.

Interested in software development, full-stack web technologies, problem-solving, and building useful applications.

- **GitHub:** [@Hacki-302](https://github.com/Hacki-302)
- **Portfolio repository:** [borif-portfolio](https://github.com/Hacki-302/borif-portfolio)
- **Telegram:** [@MaadiiB9](https://t.me/MaadiiB9)
- **Email:** [borifhacki302@gmail.com](mailto:borifhacki302@gmail.com)

## License

No license has been specified yet. Unless you choose and add a license, others do not automatically receive permission to reuse or redistribute your code. Consider adding an appropriate license if you want to permit reuse.

---

<p align="center">
  Built with curiosity, consistency, and a passion for software engineering.
</p>
