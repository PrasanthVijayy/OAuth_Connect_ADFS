# OAuth with ADFS using ExpressJS

This repository demonstrates how to integrate **OAuth 2.0** authentication with **Active Directory Federation Services (ADFS)** using **ExpressJS**. It allows your Express application to authenticate users via ADFS, retrieve user information from Active Directory, and work with OAuth tokens.

---

## Features

- **OAuth 2.0** Integration with ADFS.
- **User Authentication** and Authorization.
- **JWT** Token-based authentication.
- **Fetch User Data** from Active Directory using ADFS.
- **ExpressJS** backend for handling OAuth flow.

---

## Table of Contents

- [Requirements](#requirements)
- [How it Works](#how-it-works)
- [Endpoints](#endpoints)
- [Environment Variables](#environment-variables)

---

## Requirements

- Node.js (v16 or higher recommended)
- ADFS server or a valid ADFS setup
- ADF Client ID and Secret
- pnpm (Recommended for package management)

---

## How it Works

1. **OAuth Flow**:

   - The application uses the **OAuth 2.0** authorization code flow to authenticate users via ADFS.
   - Once the user authorizes access, ADFS issues an **authorization code** which the application exchanges for an **access token**.
   - The access token can be used to make authenticated requests to ADFS to retrieve user data.

2. **Fetching User Data**:

   - After successful authentication, the access token is used to fetch the user's data from Active Directory via ADFS's API endpoint.

3. **JWT Authentication**:
   - JWT tokens are issued for the authenticated users to manage their session.

---

## Endpoints

1. **/login**:

   - Initiates the OAuth flow and redirects the user to ADFS for authentication.

2. **/callback**:

   - Handles the callback from ADFS, exchanges the authorization code for an access token, and fetches user data from Active Directory.

3. **/profile**:
   - Protected route that requires authentication via JWT. It returns the user's profile information fetched from Active Directory.

---

## Environment Variables

Here is a list of environment variables used in the project:

| Variable         | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `CLIENT_ID`      | Your ADFS application client ID.                        |
| `CLIENT_SECRET`  | Your ADFS application client secret.                    |
| `ADFS_AUTH_URL`  | The authorization endpoint URL for ADFS.                |
| `ADFS_TOKEN_URL` | The token endpoint URL for ADFS.                        |
| `ADFS_API_URL`   | The API URL to fetch user data from ADFS.               |
| `CALLBACK_URL`   | The URL to redirect to after successful authentication. |

---
