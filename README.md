# OpenAI Assistant - React & TypeScript Starter Pack

## 📖 Project Overview

The **OpenAI Assistant** is a React-based web application that leverages the OpenAI API to deliver an interactive product assistant experience. This assistant helps users find products, view detailed information, filter by price, and engage in real-time conversations to get personalized recommendations.

The project is built using **React, TypeScript, Express**, and other modern web technologies to ensure a responsive, dynamic, and user-friendly experience.

---

## 🌐 Live Demo

You can preview the app (if deployed) here:  
[Live Demo](https://vk-workshop.github.io/react-device-catalog/)

---

## 🚀 Key Features

- 🛒 **Product Recommendations**  
  Suggests products based on categories, preferences, or keywords provided by the user.

- 🔎 **Product Search**  
  Quickly finds products by name and provides direct links to product pages.

- 📊 **Product Details**  
  Displays comprehensive product information including price, specifications, and availability.

- 💰 **Price Filtering**  
  Lists products that match a specific price range set by the user.

- 💬 **Interactive AI Chat**  
  Users can chat directly with the assistant to ask product-related questions, filter results, or get personalized suggestions.

---

## 🛠️ Technologies Used

### Frontend
- **React**: For building the user interface.
- **React Router**: For managing navigation between different pages.
- **Context API**: For state management across components.
- **Sass (SCSS)**: For styling and responsive design.
- **BEM Methodology**: For structuring CSS classes in a modular and maintainable way.
- **Mobile First**: For designing and developing with a focus on mobile devices first, then scaling up for larger screens.

### Backend
- **Express.js** - Simple API server to handle OpenAI requests
- **OpenAI API** - Core AI functionality for recommendations and chat
- **CORS & Dotenv** - Environment configuration and security

### Tooling
- **ESLint & Prettier** - Code quality and formatting
- **Concurrently** - Run frontend and backend together
- **Nodemon** - Hot reload for backend development

---

## ⚙️ Scripts

- `npm run dev` - Starts both frontend and backend in parallel
- `npm run server` - Starts backend only (Express)
- `npm start` - Starts frontend only (React)

---

## 📦 Installation & Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/openai-assistant.git
    cd openai-assistant
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create `.env` file in `/server` folder with your OpenAI API key:
    ```
    OPENAI_API_KEY=your-api-key-here
    ```

4. Run the project:
    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## ✨ Credits

Developed by **Volodymyr Kolisnichenko**  
