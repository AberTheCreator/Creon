import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertNftSchema, insertGrantApplicationSchema, insertTipSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.get("/api/users/:id", async (req, res) => {
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

  app.get("/api/users/wallet/:address", async (req, res) => {
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

  app.post("/api/users", async (req, res) => {
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

  app.patch("/api/users/:id", async (req, res) => {
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

  // NFTs
  app.get("/api/users/:id/nfts", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const nfts = await storage.getNFTsByUserId(userId);
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get NFTs" });
    }
  });

  app.post("/api/nfts", async (req, res) => {
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

  // Grants
  app.get("/api/grants", async (req, res) => {
    try {
      const grants = await storage.getAllGrants();
      res.json(grants);
    } catch (error) {
      res.status(500).json({ message: "Failed to get grants" });
    }
  });

  app.get("/api/grants/:id", async (req, res) => {
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

  // Grant Applications
  app.get("/api/users/:id/grant-applications", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const applications = await storage.getGrantApplicationsByUserId(userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to get grant applications" });
    }
  });

  app.post("/api/grant-applications", async (req, res) => {
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

  // Tips
  app.get("/api/users/:id/tips", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const tips = await storage.getTipsByUserId(userId);
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to get tips" });
    }
  });

  app.post("/api/tips", async (req, res) => {
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

  // Token Gated Content
  app.get("/api/token-gated-content", async (req, res) => {
    try {
      const content = await storage.getAllTokenGatedContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to get token gated content" });
    }
  });

  // User Stats
  app.get("/api/users/:id/stats", async (req, res) => {
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

  // Wallet connection simulation
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { walletAddress, walletType } = req.body;
      
      // Check if user exists with this wallet
      let user = await storage.getUserByWallet(walletAddress);
      
      if (!user) {
        // Create new user for this wallet
        user = await storage.createUser({
          username: `user_${walletAddress.slice(-6)}`,
          email: `${walletAddress.slice(-6)}@creon.example`,
          name: "New Creator",
          walletAddress,
          walletType,
          isVerified: false,
        });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to connect wallet" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
