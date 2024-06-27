"use strict";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import accountRoutes from "../src/accounts/account.routes.js";
import authRoutes from "../src/auth/auth.routes.js";
import { errorHandler } from "../src/common/middlewares/error-handler.js";
import apiLimiter from "../src/common/middlewares/request-limiter.js";
import customerRoutes from "../src/customers/customer.routes.js";
import favoriteRoutes from "../src/favorites/favorite.routes.js";
import productRoutes from "../src/products-services/product-service.routes.js";
import transactionRoutes from "../src/transactions/transaction.routes.js";
import initializeData from "./initializeData.js";
import { dbConnection } from "./mongo.js";

class Server {
  constructor() {
    this.app = express();
    this.configHelmet();
    this.port = process.env.PORT;
    this.middlewares();
    this.connectDB();
    this.routes();
  }

  configHelmet() {
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://trusted.cdn.com"],
            styleSrc: ["'self'", "https://trusted.cdn.com"],
            imgSrc: ["'self'", "data:", "https://trusted.images.com"],
            connectSrc: ["'self'", "https://api.misitio.com"],
          },
        },
        frameguard: { action: "deny" },
        dnsPrefetchControl: { allow: false },
        expectCt: { enforce: true, maxAge: 86400 },
        referrerPolicy: { policy: "no-referrer" },
      })
    );
  }

  async connectDB() {
    await dbConnection().then(() => {
      initializeData();
    });
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
    this.app.use(apiLimiter);
  }

  routes() {
    this.app.use("/vanguard/v1/auth", authRoutes);
    this.app.use("/vanguard/v1/accounts", accountRoutes);
    this.app.use("/vanguard/v1/customers", customerRoutes);
    this.app.use("/vanguard/v1/favorites", favoriteRoutes);
    this.app.use("/vanguard/v1/products", productRoutes);
    this.app.use("/vanguard/v1/transactions", transactionRoutes);
    this.app.use(errorHandler);
  }
 
  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port ", this.port);
    });
  }
}

export default Server;
