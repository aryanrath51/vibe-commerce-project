# Full Stack E-Com Cart

This is a full-stack e-commerce application featuring a responsive React frontend and a Node.js/Express backend. It includes essential e-commerce functionalities like dynamic product searching, multi-criteria sorting, accessible pagination, and a persistent shopping cart. The application was built to demonstrate a modern, feature-rich web platform.

## Features

-   **Product Listing**: Fetches and displays a paginated list of products from the backend.
-   **Search**: Filter products by name.
-   **Sorting**: Sort products by price (low to high, high to low) and name (A-Z, Z-A).
-   **Pagination**: Navigate through product pages with an accessible, smart pagination component.
-   **Shopping Cart**: Add, remove, and update item quantities in the cart.
-   **Dynamic Totals**: Cart total is calculated and updated automatically.
-   **State Persistence**: Cart contents and customer information are saved to `localStorage`.
-   **Mock Checkout**: A simple checkout form that generates a mock receipt.
-   **Responsive Design**: The UI is built to be usable on different screen sizes.

## Tech Stack

-   **Frontend**: React, Axios for API calls, `react-toastify` for notifications.
-   **Backend**: Node.js, Express.js for the REST API.
-   **Database**: In-memory (simple JavaScript array) for product data.

---

## Project Setup and Installation

### Prerequisites

-   Node.js (v14 or later recommended)
-   npm (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the backend server (runs on http://localhost:5001)
npm start
```

### 3. Frontend Setup

Open a new terminal window for this step.

```bash
# Navigate to the frontend directory from the root folder
cd frontend

# Install dependencies
npm install

# Start the React development server (runs on http://localhost:3000)
npm start
```

Once both servers are running, you can view the application by opening **http://localhost:3000** in your browser.

I've added the main endpoints for products and checkout, including the query parameters for filtering and sorting the product list. This should give a clear overview of how your frontend communicates with your backend.

<!--
[PROMPT_SUGGESTION]How can I add API documentation that's automatically generated from my code?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Can you add the `GET /api/products/:id` route to my backend?[/PROMPT_SUGGESTION]
-->
