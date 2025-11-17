# VirtueVerse: Community Good Deeds Tracker

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/asiakay/virtueverse-community-good-deeds-tracker)

VirtueVerse is a beautifully designed, whimsical web application that encourages and tracks acts of kindness within a community. It provides a platform for users to document good deeds, get them verified, and celebrate their positive impact on a shared leaderboard.

The application features a distinct 'Illustrative' visual style, characterized by charming illustrations, playful typography, and a warm, inviting color palette, making the experience of doing good feel delightful and engaging.

## ✨ Key Features

-   **Deed Catalog & Submission:** Browse a catalog of pre-defined 'good deeds' and submit your own for verification.
-   **Virtue Points System:** Earn 'Virtue Points' for every verified deed.
-   **Community Leaderboard:** See how you rank against others in the community and foster friendly, positive engagement.
-   **User Dashboard:** Track your total points and the status of your submitted deeds (pending, verified).
-   **Admin Verification Panel:** A secure area for administrators to review and approve pending submissions.
-   **Whimsical UI:** A unique, illustrative design that makes contributing a joyful experience.

## 🚀 Technology Stack

-   **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [React Router](https://reactrouter.com/), [Zustand](https://zustand-demo.pmnd.rs/)
-   **Backend:** [Cloudflare Workers](https://workers.cloudflare.com/), [Hono](https://hono.dev/)
-   **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (abstracted via a single Durable Object)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en) (v18 or higher)
-   [Bun](https://bun.sh/)
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/virtueverse.git
    cd virtueverse
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Authenticate with Cloudflare:**
    Log in to your Cloudflare account to be able to run the project locally with Wrangler.
    ```bash
    bunx wrangler login
    ```

## 🛠️ Development

To start the local development server, which includes the Vite frontend and the Cloudflare Worker backend, run:

```bash
bun run dev
```

This will start the application, typically available at `http://localhost:3000`. The frontend will automatically reload on changes, and the worker will restart as needed.

## ☁️ Deployment

This project is configured for seamless deployment to Cloudflare Pages.

1.  **Build the application:**
    This command bundles the React frontend and the Worker code for production.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Run the deploy script to publish your application.
    ```bash
    bun run deploy
    ```

Alternatively, deploy directly with one click:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/asiakay/virtueverse-community-good-deeds-tracker)

## 📂 Project Structure

The project is organized into three main directories:

-   `src/`: Contains the entire React frontend application, including pages, components, hooks, and styles.
-   `worker/`: Contains the Hono-based Cloudflare Worker backend, including API routes and entity definitions for the Durable Object.
-   `shared/`: Contains TypeScript types that are shared between the frontend and backend to ensure type safety.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.