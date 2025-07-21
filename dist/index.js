var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  grantApplications: () => grantApplications,
  grantApplicationsRelations: () => grantApplicationsRelations,
  grants: () => grants,
  grantsRelations: () => grantsRelations,
  insertGrantApplicationSchema: () => insertGrantApplicationSchema,
  insertGrantSchema: () => insertGrantSchema,
  insertNftSchema: () => insertNftSchema,
  insertTipSchema: () => insertTipSchema,
  insertTokenGatedContentSchema: () => insertTokenGatedContentSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserStatsSchema: () => insertUserStatsSchema,
  nfts: () => nfts,
  nftsRelations: () => nftsRelations,
  tips: () => tips,
  tipsRelations: () => tipsRelations,
  tokenGatedContent: () => tokenGatedContent,
  userStats: () => userStats,
  userStatsRelations: () => userStatsRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  title: text("title"),
  walletAddress: text("wallet_address").unique(),
  walletType: text("wallet_type"),
  // 'metamask' | 'phantom'
  isVerified: boolean("is_verified").default(false),
  avatar: text("avatar"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow()
});
var nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tokenId: text("token_id").notNull(),
  contractAddress: text("contract_address").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  metadata: jsonb("metadata"),
  blockchain: text("blockchain").notNull(),
  // 'ethereum' | 'solana'
  createdAt: timestamp("created_at").defaultNow()
});
var grants = pgTable("grants", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  organization: text("organization").notNull(),
  logoUrl: text("logo_url"),
  deadline: timestamp("deadline").notNull(),
  status: text("status").notNull().default("open"),
  // 'open' | 'closed' | 'featured'
  requirements: text("requirements"),
  applicationCount: integer("application_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var grantApplications = pgTable("grant_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  grantId: integer("grant_id").references(() => grants.id).notNull(),
  projectTitle: text("project_title").notNull(),
  projectDescription: text("project_description").notNull(),
  requestedAmount: numeric("requested_amount", { precision: 10, scale: 2 }).notNull(),
  portfolio: text("portfolio"),
  status: text("status").notNull().default("pending"),
  // 'pending' | 'approved' | 'rejected'
  submittedAt: timestamp("submitted_at").defaultNow()
});
var tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").references(() => users.id).notNull(),
  toUserId: integer("to_user_id").references(() => users.id).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USDC"),
  message: text("message"),
  transactionHash: text("transaction_hash"),
  status: text("status").notNull().default("pending"),
  // 'pending' | 'confirmed' | 'failed'
  createdAt: timestamp("created_at").defaultNow()
});
var tokenGatedContent = pgTable("token_gated_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  requiredTokenType: text("required_token_type").notNull(),
  // 'nft' | 'token'
  requiredTokenAmount: integer("required_token_amount"),
  requiredContractAddress: text("required_contract_address"),
  requiredTokenSymbol: text("required_token_symbol"),
  contentType: text("content_type").notNull(),
  // 'template' | 'asset' | 'tool'
  contentUrl: text("content_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  creationCount: integer("creation_count").default(0),
  totalEarnings: numeric("total_earnings", { precision: 10, scale: 2 }).default("0"),
  tipCount: integer("tip_count").default(0),
  followerCount: integer("follower_count").default(0),
  updatedAt: timestamp("updated_at").defaultNow()
});
var usersRelations = relations(users, ({ many, one }) => ({
  nfts: many(nfts),
  grantApplications: many(grantApplications),
  sentTips: many(tips, { relationName: "sentTips" }),
  receivedTips: many(tips, { relationName: "receivedTips" }),
  stats: one(userStats)
}));
var nftsRelations = relations(nfts, ({ one }) => ({
  user: one(users, { fields: [nfts.userId], references: [users.id] })
}));
var grantsRelations = relations(grants, ({ many }) => ({
  applications: many(grantApplications)
}));
var grantApplicationsRelations = relations(grantApplications, ({ one }) => ({
  user: one(users, { fields: [grantApplications.userId], references: [users.id] }),
  grant: one(grants, { fields: [grantApplications.grantId], references: [grants.id] })
}));
var tipsRelations = relations(tips, ({ one }) => ({
  fromUser: one(users, { fields: [tips.fromUserId], references: [users.id], relationName: "sentTips" }),
  toUser: one(users, { fields: [tips.toUserId], references: [users.id], relationName: "receivedTips" })
}));
var userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, { fields: [userStats.userId], references: [users.id] })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertNftSchema = createInsertSchema(nfts).omit({
  id: true,
  createdAt: true
});
var insertGrantSchema = createInsertSchema(grants).omit({
  id: true,
  createdAt: true,
  applicationCount: true
});
var insertGrantApplicationSchema = createInsertSchema(grantApplications).omit({
  id: true,
  submittedAt: true,
  status: true
});
var insertTipSchema = createInsertSchema(tips).omit({
  id: true,
  createdAt: true,
  status: true,
  transactionHash: true
});
var insertTokenGatedContentSchema = createInsertSchema(tokenGatedContent).omit({
  id: true,
  createdAt: true
});
var insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  updatedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByWallet(walletAddress) {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    await db.insert(userStats).values({
      userId: user.id,
      creationCount: 0,
      totalEarnings: "0.00",
      tipCount: 0,
      followerCount: 0
    });
    return user;
  }
  async updateUser(id, updates) {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || void 0;
  }
  async getNFTsByUserId(userId) {
    return await db.select().from(nfts).where(eq(nfts.userId, userId));
  }
  async createNFT(insertNFT) {
    const [nft] = await db.insert(nfts).values(insertNFT).returning();
    return nft;
  }
  async getAllGrants() {
    return await db.select().from(grants);
  }
  async getGrant(id) {
    const [grant] = await db.select().from(grants).where(eq(grants.id, id));
    return grant || void 0;
  }
  async createGrant(insertGrant) {
    const [grant] = await db.insert(grants).values(insertGrant).returning();
    return grant;
  }
  async getGrantApplicationsByUserId(userId) {
    return await db.select().from(grantApplications).where(eq(grantApplications.userId, userId));
  }
  async createGrantApplication(insertApplication) {
    const [application] = await db.insert(grantApplications).values(insertApplication).returning();
    return application;
  }
  async getTipsByUserId(userId) {
    return await db.select().from(tips).where(eq(tips.toUserId, userId));
  }
  async createTip(insertTip) {
    const [tip] = await db.insert(tips).values(insertTip).returning();
    return tip;
  }
  async getAllTokenGatedContent() {
    return await db.select().from(tokenGatedContent);
  }
  async getTokenGatedContentById(id) {
    const [content] = await db.select().from(tokenGatedContent).where(eq(tokenGatedContent.id, id));
    return content || void 0;
  }
  async getUserStats(userId) {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats || void 0;
  }
  async updateUserStats(userId, updates) {
    const [stats] = await db.update(userStats).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(userStats.userId, userId)).returning();
    if (!stats) {
      const [newStats] = await db.insert(userStats).values({
        userId,
        creationCount: 0,
        totalEarnings: "0.00",
        tipCount: 0,
        followerCount: 0,
        ...updates
      }).returning();
      return newStats;
    }
    return stats;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });
  app2.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const user = await storage.getUserByWallet(req.params.address);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  app2.get("/api/users/:id/nfts", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const nfts2 = await storage.getNFTsByUserId(userId);
      res.json(nfts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get NFTs" });
    }
  });
  app2.post("/api/nfts", async (req, res) => {
    try {
      const nftData = insertNftSchema.parse(req.body);
      const nft = await storage.createNFT(nftData);
      res.status(201).json(nft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid NFT data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create NFT" });
    }
  });
  app2.get("/api/grants", async (req, res) => {
    try {
      const grants2 = await storage.getAllGrants();
      res.json(grants2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get grants" });
    }
  });
  app2.get("/api/grants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const grant = await storage.getGrant(id);
      if (!grant) {
        return res.status(404).json({ message: "Grant not found" });
      }
      res.json(grant);
    } catch (error) {
      res.status(500).json({ message: "Failed to get grant" });
    }
  });
  app2.get("/api/users/:id/grant-applications", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const applications = await storage.getGrantApplicationsByUserId(userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to get grant applications" });
    }
  });
  app2.post("/api/grant-applications", async (req, res) => {
    try {
      const applicationData = insertGrantApplicationSchema.parse(req.body);
      const application = await storage.createGrantApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create grant application" });
    }
  });
  app2.get("/api/users/:id/tips", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const tips2 = await storage.getTipsByUserId(userId);
      res.json(tips2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get tips" });
    }
  });
  app2.post("/api/tips", async (req, res) => {
    try {
      const tipData = insertTipSchema.parse(req.body);
      const tip = await storage.createTip(tipData);
      res.status(201).json(tip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tip" });
    }
  });
  app2.get("/api/token-gated-content", async (req, res) => {
    try {
      const content = await storage.getAllTokenGatedContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to get token gated content" });
    }
  });
  app2.get("/api/users/:id/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const stats = await storage.getUserStats(userId);
      if (!stats) {
        return res.status(404).json({ message: "User stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user stats" });
    }
  });
  app2.post("/api/wallet/connect", async (req, res) => {
    try {
      const { walletAddress, walletType } = req.body;
      let user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        user = await storage.createUser({
          username: `user_${walletAddress.slice(-6)}`,
          email: `${walletAddress.slice(-6)}@creon.example`,
          name: "New Creator",
          walletAddress,
          walletType,
          isVerified: false
        });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to connect wallet" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
