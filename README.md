# Curug Hunter Jabar 🥶🥶🥶

This project is a final assignment for a *full-stack developer* program JDA. It is a full-stack web application built from scratch to solve a real-world problem, focusing on the tourism sector in West Java, Indonesia.

## Project Description

**Curug Hunter Jabar** is a community-based web platform designed to be the most comprehensive guide for tourists and nature lovers looking to explore waterfalls (known as "curug") in the West Java region.

This application aims to solve the problem of information fragmentation, where data regarding locations, ticket prices, road access conditions, and facilities of waterfalls are often inaccurate, incomplete, or scattered across various sources. By focusing on community-generated content, "Curug Hunter Jabar" becomes a reliable platform to find and share reviews, photos, and travel tips.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Library**: [HeroUI](https://www.heroui.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted by [Neon](https://neon.tech/))
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Google & Email/Password Credentials Providers)

## Getting Started

To run this project locally, follow these steps:

### 1. Prerequisites

Ensure you have Node.js (version 18.x or newer) and npm installed on your machine.

### 2. Installation

First, clone this repository to your local machine:

```bash
git clone [YOUR_REPO_URL]
cd curug-hunter-jabar
```

Next, install all the required dependencies:

```bash
npm install
```

### 3. Environment Variables Configuration

This application requires several secret keys to run.

Create a new file in the project's root directory named `.env.local` and copy the content below into it.

```env
# Database Connection URL from Neon
DATABASE_URL="postgres://user:password@host/dbname?sslmode=require"

# Secret Keys for NextAuth.js
# Run `openssl rand -base64 32` in your terminal to generate one
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Credentials from Google Cloud Console
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

Fill in each variable with the corresponding values from their respective services.

### 4. Database Schema Synchronization

After filling in the `DATABASE_URL`, run this command to apply the database schema to your Neon service:

```bash
npm run db:push
```

*(If you haven't created the `db:push` script, use: `dotenv -e .env.local -- prisma db push`)*

### 5. Run the Development Server

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
