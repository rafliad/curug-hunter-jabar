# Curug Hunter Jabar 🥶🥶🥶

This project is a final assignment for a full-stack developer program. It is a full-stack web application built from scratch to solve a real-world problem, focusing on the tourism sector in West Java, Indonesia.

**Live Demo:** https://curug-hunter-jabar.vercel.app/

## Project Description

**Curug Hunter Jabar** is a community-based web platform designed to be the most comprehensive guide for tourists and nature lovers looking to explore waterfalls (known as "curug") in the West Java region.

This application aims to solve the problem of information fragmentation, where data regarding locations, ticket prices, access conditions, and facilities are often inaccurate or scattered across various sources. By focusing on community-generated content, "Curug Hunter Jabar" becomes a reliable platform to find, share, and maintain up-to-date reviews, photos, and travel tips.

## Features

- **Dual Authentication:** Secure login and registration using both traditional email/password (with `bcrypt` hashing) and OAuth 2.0 (Google Provider) via NextAuth.js.
- **Role-Based Authorization:** Clear distinction between `USER` and `ADMIN` roles, with protected routes for the admin dashboard.
- **Full Admin CRUD:** A dedicated dashboard for administrators to Create, Read, Update, and Delete waterfall data.
- **User-Generated Reviews:** Authenticated users can submit, edit, and delete their own reviews for any waterfall.
- **Community-Driven Data:** A unique "Suggest a Change" system allowing users to submit corrections for data like ticket prices, opening hours, and difficulty levels, which admins can then approve or reject.
- **Real-time Search & Filter:** A dynamic homepage where users can search by name and filter by location in real-time, powered by Redux Toolkit for state management.
- **Email Verification Flow:** An asynchronous email verification system using Nodemailer and a custom Gmail account. New reviews from unverified users are held in a `PENDING` state until the user verifies their email via a unique link.
- **Image Uploads:** Seamless image uploads for waterfall pictures, handled by Vercel Blob storage. The system also intelligently deletes old images from storage when they are replaced.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Library**: [HeroUI](https://www.heroui.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted by [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Image Storage**: [Vercel Blob](https://vercel.com/storage/blob)
- **Email Service**: [Nodemailer](https://nodemailer.com/) with Gmail SMTP

## Getting Started

To run this project locally, follow these steps:

### 1. Prerequisites

Ensure you have Node.js (version 18.x or newer) and pnpm installed on your machine.

### 2. Installation

First, clone this repository to your local machine:

```bash
git clone https://github.com/rafliad/curug-hunter-jabar.git
cd curug-hunter-jabar
```

Next, install all the required dependencies:

```bash
pnpm install
```

### 3. Environment Variables Configuration

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

# Gmail Credentials for Nodemailer
GMAIL_EMAIL="your-app-email@gmail.com"
GMAIL_APP_PASSWORD="your-16-digit-app-password"

# Vercel Blob Read-Write Token
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxx"
```

Fill in each variable with the corresponding values from their respective services.

### 4. Database Schema Synchronization

After filling in the `DATABASE_URL`, run this command to apply the database schema:

```bash
pnpm run db:push
```

### 5. Run the Development Server

Finally, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new). Make sure to add all Environment Variables from your `.env.local` file to your project settings on Vercel.
