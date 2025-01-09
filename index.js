"use strict";
import express from "express";
import passport from "passport";
import OAuth2Strategy from "passport-oauth2";
import morgan from "morgan";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import logger from "./Config/logger.js";
import session from "express-session";
import jwt from "jsonwebtoken";
import { OAuthConfig } from "./Config/OAuthConfig.js";

dotenv.config();

const app = express();
app.use(morgan(":method :url :status - :response-time ms"));

/* ---------- SSL SETUP ---------- */
const privateKey = fs.readFileSync(
  "Certificates/SSL_certificate/private.key",
  "utf8"
);
const certificate = fs.readFileSync(
  "Certificates/SSL_certificate/certificate.crt",
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };

app.use(
  session({
    name: "OAuthSession",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true,
    },
  })
);

// Configure passport to use OAuth2 strategy
passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: OAuthConfig?.authorizationURL,
      tokenURL: OAuthConfig?.tokenURL,
      clientID: OAuthConfig?.clientID,
      clientSecret: OAuthConfig?.clientSecret,
      callbackURL: OAuthConfig?.callbackURL,
      scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      logger.success(`OAuth Response: ${JSON.stringify(accessToken)}`);

      if (accessToken) {
        const decodeData = jwt.decode(accessToken);
        profile.email = decodeData?.upn;
        profile.name = decodeData?.unique_name;
      }
      // Ensure user object is properly structured
      if (!accessToken) {
        return done(new Error("No access token received"));
      }

      const user = { accessToken, profile };
      return done(null, user);
    }
  )
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((accessToken, done) => {
  const user = { accessToken }; // Reconstruct user object
  done(null, user);
});

// Define routes for OAuth login and callback
app.get("/", passport.authenticate("oauth2"));

app.get(
  "/OAuth/callback",
  passport.authenticate("oauth2", {
    failureRedirect: "/",
    successRedirect: "/dashboard",
  })
);

// Secure route example: Dashboard
app.get("/dashboard", (req, res) => {
  if (!req.user || !req.user.accessToken) {
    return res.redirect("/");
  }
  console.log("User:", req.user);
  const name = req.user?.accessToken?.profile?.name;
  const email = req.user?.accessToken?.profile?.email;
  res.send(
    `Welcome to your dashboard!
    <br/>Username: ${name} <br/> Email: ${email}
    <br/><a href="/logout">Logout</a></div>`
  );
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(OAuthConfig?.logoutURL);
  });
});

/* ------------ SERVER START ------------ */
const PORT = process.env.PORT;
const HOST = "0.0.0.0";
// Use HTTPS to create the server
https.createServer(credentials, app).listen(PORT, HOST, () => {
  logger.info(`Server started and listening on https://localhost:${PORT}`);
  logger.warn(
    `Server running with machine IP: ${process.env.APP_LOGIN_URL}:${PORT}`
  );
});
