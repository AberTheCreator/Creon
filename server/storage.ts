import { 
  users, nfts, grants, grantApplications, tips, tokenGatedContent, userStats,
  type User, type InsertUser, type NFT, type InsertNFT, type Grant, type InsertGrant,
  type GrantApplication, type InsertGrantApplication, type Tip, type InsertTip,
  type TokenGatedContent, type InsertTokenGatedContent, type UserStats, type InsertUserStats
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // NFTs
  getNFTsByUserId(userId: number): Promise<NFT[]>;
  createNFT(nft: InsertNFT): Promise<NFT>;

  // Grants
  getAllGrants(): Promise<Grant[]>;
  getGrant(id: number): Promise<Grant | undefined>;
  createGrant(grant: InsertGrant): Promise<Grant>;

  // Grant Applications
  getGrantApplicationsByUserId(userId: number): Promise<GrantApplication[]>;
  createGrantApplication(application: InsertGrantApplication): Promise<GrantApplication>;

  // Tips
  getTipsByUserId(userId: number): Promise<Tip[]>;
  createTip(tip: InsertTip): Promise<Tip>;

  // Token Gated Content
  getAllTokenGatedContent(): Promise<TokenGatedContent[]>;
  getTokenGatedContentById(id: number): Promise<TokenGatedContent | undefined>;

  // User Stats
  getUserStats(userId: number): Promise<UserStats | undefined>;
  updateUserStats(userId: number, updates: Partial<InsertUserStats>): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private nfts: Map<number, NFT>;
  private grants: Map<number, Grant>;
  private grantApplications: Map<number, GrantApplication>;
  private tips: Map<number, Tip>;
  private tokenGatedContent: Map<number, TokenGatedContent>;
  private userStats: Map<number, UserStats>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.nfts = new Map();
    this.grants = new Map();
    this.grantApplications = new Map();
    this.tips = new Map();
    this.tokenGatedContent = new Map();
    this.userStats = new Map();
    this.currentId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create sample user
    const user: User = {
      id: this.currentId++,
      username: "alexrivera",
      email: "alex@creon.example",
      name: "Alex Rivera",
      title: "Digital Artist & Creator",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      walletType: "metamask",
      isVerified: true,
      avatar: null,
      bio: "Passionate digital creator building the future of Web3 art",
      createdAt: new Date(),
    };
    this.users.set(user.id, user);

    // Create sample user stats
    const stats: UserStats = {
      id: this.currentId++,
      userId: user.id,
      creationCount: 127,
      totalEarnings: "2340.00",
      tipCount: 89,
      followerCount: 1250,
      updatedAt: new Date(),
    };
    this.userStats.set(stats.id, stats);

    // Create sample NFTs
    const sampleNFTs = [
      {
        id: this.currentId++,
        userId: user.id,
        tokenId: "1",
        contractAddress: "0xabcd1234",
        name: "Abstract Digital Art #1",
        description: "Colorful abstract digital artwork",
        imageUrl: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=200&h=200",
        metadata: {},
        blockchain: "ethereum",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        userId: user.id,
        tokenId: "2",
        contractAddress: "0xabcd1234",
        name: "Geometric Pattern #1",
        description: "Geometric pattern NFT artwork",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200",
        metadata: {},
        blockchain: "ethereum",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        userId: user.id,
        tokenId: "3",
        contractAddress: "0xabcd1234",
        name: "Digital Landscape #1",
        description: "Digital landscape NFT",
        imageUrl: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=200&h=200",
        metadata: {},
        blockchain: "ethereum",
        createdAt: new Date(),
      }
    ];

    sampleNFTs.forEach(nft => this.nfts.set(nft.id, nft as NFT));

    // Create sample grants
    const sampleGrants = [
      {
        id: this.currentId++,
        title: "Superteam Creator Fund",
        description: "Up to $5,000 for innovative Web3 creators building on Solana",
        amount: "5000.00",
        currency: "USD",
        organization: "Superteam",
        logoUrl: null,
        deadline: new Date("2024-12-31"),
        status: "open",
        requirements: "Must be building on Solana ecosystem",
        applicationCount: 127,
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Base Creator Grant",
        description: "$2,500 for creators building tools and content on Base",
        amount: "2500.00",
        currency: "USD",
        organization: "Base",
        logoUrl: null,
        deadline: new Date("2024-01-15"),
        status: "featured",
        requirements: "Must be building on Base network",
        applicationCount: 89,
        createdAt: new Date(),
      }
    ];

    sampleGrants.forEach(grant => this.grants.set(grant.id, grant as Grant));

    // Create sample token-gated content
    const sampleContent = [
      {
        id: this.currentId++,
        title: "Pro Designer Pack",
        description: "50+ premium templates",
        imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=100&h=100",
        requiredTokenType: "token",
        requiredTokenAmount: 5,
        requiredContractAddress: "0xtoken123",
        requiredTokenSymbol: "CREATOR",
        contentType: "template",
        contentUrl: null,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Elite Collection",
        description: "Exclusive designs",
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100",
        requiredTokenType: "nft",
        requiredTokenAmount: 1,
        requiredContractAddress: "0xvip123",
        requiredTokenSymbol: "VIP",
        contentType: "template",
        contentUrl: null,
        isActive: true,
        createdAt: new Date(),
      }
    ];

    sampleContent.forEach(content => this.tokenGatedContent.set(content.id, content as TokenGatedContent));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.walletAddress === walletAddress
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    
    // Create initial user stats
    const statsId = this.currentId++;
    const stats: UserStats = {
      id: statsId,
      userId: id,
      creationCount: 0,
      totalEarnings: "0.00",
      tipCount: 0,
      followerCount: 0,
      updatedAt: new Date(),
    };
    this.userStats.set(statsId, stats);
    
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getNFTsByUserId(userId: number): Promise<NFT[]> {
    return Array.from(this.nfts.values()).filter(nft => nft.userId === userId);
  }

  async createNFT(insertNFT: InsertNFT): Promise<NFT> {
    const id = this.currentId++;
    const nft: NFT = { 
      ...insertNFT, 
      id, 
      createdAt: new Date() 
    };
    this.nfts.set(id, nft);
    return nft;
  }

  async getAllGrants(): Promise<Grant[]> {
    return Array.from(this.grants.values());
  }

  async getGrant(id: number): Promise<Grant | undefined> {
    return this.grants.get(id);
  }

  async createGrant(insertGrant: InsertGrant): Promise<Grant> {
    const id = this.currentId++;
    const grant: Grant = { 
      ...insertGrant, 
      id, 
      applicationCount: 0,
      createdAt: new Date() 
    };
    this.grants.set(id, grant);
    return grant;
  }

  async getGrantApplicationsByUserId(userId: number): Promise<GrantApplication[]> {
    return Array.from(this.grantApplications.values()).filter(
      app => app.userId === userId
    );
  }

  async createGrantApplication(insertApplication: InsertGrantApplication): Promise<GrantApplication> {
    const id = this.currentId++;
    const application: GrantApplication = { 
      ...insertApplication, 
      id, 
      status: "pending",
      submittedAt: new Date() 
    };
    this.grantApplications.set(id, application);
    
    // Update grant application count
    const grant = this.grants.get(insertApplication.grantId);
    if (grant) {
      grant.applicationCount = (grant.applicationCount || 0) + 1;
      this.grants.set(grant.id, grant);
    }
    
    return application;
  }

  async getTipsByUserId(userId: number): Promise<Tip[]> {
    return Array.from(this.tips.values()).filter(
      tip => tip.fromUserId === userId || tip.toUserId === userId
    );
  }

  async createTip(insertTip: InsertTip): Promise<Tip> {
    const id = this.currentId++;
    const tip: Tip = { 
      ...insertTip, 
      id, 
      status: "pending",
      transactionHash: `0x${Math.random().toString(16).slice(2)}`,
      createdAt: new Date() 
    };
    this.tips.set(id, tip);
    
    // Update recipient's stats
    const recipientStats = Array.from(this.userStats.values()).find(
      stats => stats.userId === insertTip.toUserId
    );
    if (recipientStats) {
      recipientStats.tipCount += 1;
      recipientStats.totalEarnings = (parseFloat(recipientStats.totalEarnings) + parseFloat(insertTip.amount.toString())).toFixed(2);
      recipientStats.updatedAt = new Date();
      this.userStats.set(recipientStats.id, recipientStats);
    }
    
    return tip;
  }

  async getAllTokenGatedContent(): Promise<TokenGatedContent[]> {
    return Array.from(this.tokenGatedContent.values()).filter(content => content.isActive);
  }

  async getTokenGatedContentById(id: number): Promise<TokenGatedContent | undefined> {
    return this.tokenGatedContent.get(id);
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    return Array.from(this.userStats.values()).find(stats => stats.userId === userId);
  }

  async updateUserStats(userId: number, updates: Partial<InsertUserStats>): Promise<UserStats> {
    const stats = Array.from(this.userStats.values()).find(s => s.userId === userId);
    if (!stats) {
      // Create new stats if none exist
      const id = this.currentId++;
      const newStats: UserStats = {
        id,
        userId,
        creationCount: 0,
        totalEarnings: "0.00",
        tipCount: 0,
        followerCount: 0,
        updatedAt: new Date(),
        ...updates,
      };
      this.userStats.set(id, newStats);
      return newStats;
    }
    
    const updatedStats = { 
      ...stats, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.userStats.set(stats.id, updatedStats);
    return updatedStats;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    
    // Create initial user stats
    await db.insert(userStats).values({
      userId: user.id,
      creationCount: 0,
      totalEarnings: "0.00",
      tipCount: 0,
      followerCount: 0,
    });
    
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getNFTsByUserId(userId: number): Promise<NFT[]> {
    return await db.select().from(nfts).where(eq(nfts.userId, userId));
  }

  async createNFT(insertNFT: InsertNFT): Promise<NFT> {
    const [nft] = await db
      .insert(nfts)
      .values(insertNFT)
      .returning();
    return nft;
  }

  async getAllGrants(): Promise<Grant[]> {
    return await db.select().from(grants);
  }

  async getGrant(id: number): Promise<Grant | undefined> {
    const [grant] = await db.select().from(grants).where(eq(grants.id, id));
    return grant || undefined;
  }

  async createGrant(insertGrant: InsertGrant): Promise<Grant> {
    const [grant] = await db
      .insert(grants)
      .values(insertGrant)
      .returning();
    return grant;
  }

  async getGrantApplicationsByUserId(userId: number): Promise<GrantApplication[]> {
    return await db.select().from(grantApplications).where(eq(grantApplications.userId, userId));
  }

  async createGrantApplication(insertApplication: InsertGrantApplication): Promise<GrantApplication> {
    const [application] = await db
      .insert(grantApplications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async getTipsByUserId(userId: number): Promise<Tip[]> {
    return await db.select().from(tips).where(eq(tips.toUserId, userId));
  }

  async createTip(insertTip: InsertTip): Promise<Tip> {
    const [tip] = await db
      .insert(tips)
      .values(insertTip)
      .returning();
    return tip;
  }

  async getAllTokenGatedContent(): Promise<TokenGatedContent[]> {
    return await db.select().from(tokenGatedContent);
  }

  async getTokenGatedContentById(id: number): Promise<TokenGatedContent | undefined> {
    const [content] = await db.select().from(tokenGatedContent).where(eq(tokenGatedContent.id, id));
    return content || undefined;
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats || undefined;
  }

  async updateUserStats(userId: number, updates: Partial<InsertUserStats>): Promise<UserStats> {
    const [stats] = await db
      .update(userStats)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userStats.userId, userId))
      .returning();
    
    if (!stats) {
      // Create new stats if none exist
      const [newStats] = await db
        .insert(userStats)
        .values({
          userId,
          creationCount: 0,
          totalEarnings: "0.00",
          tipCount: 0,
          followerCount: 0,
          ...updates,
        })
        .returning();
      return newStats;
    }
    
    return stats;
  }
}

export const storage = new DatabaseStorage();
