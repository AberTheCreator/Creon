import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  title: text("title"),
  walletAddress: text("wallet_address").unique(),
  walletType: text("wallet_type"), // 'metamask' | 'phantom'
  isVerified: boolean("is_verified").default(false),
  avatar: text("avatar"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tokenId: text("token_id").notNull(),
  contractAddress: text("contract_address").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  metadata: jsonb("metadata"),
  blockchain: text("blockchain").notNull(), // 'ethereum' | 'solana'
  createdAt: timestamp("created_at").defaultNow(),
});

export const grants = pgTable("grants", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  organization: text("organization").notNull(),
  logoUrl: text("logo_url"),
  deadline: timestamp("deadline").notNull(),
  status: text("status").notNull().default("open"), // 'open' | 'closed' | 'featured'
  requirements: text("requirements"),
  applicationCount: integer("application_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const grantApplications = pgTable("grant_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  grantId: integer("grant_id").references(() => grants.id).notNull(),
  projectTitle: text("project_title").notNull(),
  projectDescription: text("project_description").notNull(),
  requestedAmount: numeric("requested_amount", { precision: 10, scale: 2 }).notNull(),
  portfolio: text("portfolio"),
  status: text("status").notNull().default("pending"), // 'pending' | 'approved' | 'rejected'
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").references(() => users.id).notNull(),
  toUserId: integer("to_user_id").references(() => users.id).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USDC"),
  message: text("message"),
  transactionHash: text("transaction_hash"),
  status: text("status").notNull().default("pending"), // 'pending' | 'confirmed' | 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const tokenGatedContent = pgTable("token_gated_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  requiredTokenType: text("required_token_type").notNull(), // 'nft' | 'token'
  requiredTokenAmount: integer("required_token_amount"),
  requiredContractAddress: text("required_contract_address"),
  requiredTokenSymbol: text("required_token_symbol"),
  contentType: text("content_type").notNull(), // 'template' | 'asset' | 'tool'
  contentUrl: text("content_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  creationCount: integer("creation_count").default(0),
  totalEarnings: numeric("total_earnings", { precision: 10, scale: 2 }).default("0"),
  tipCount: integer("tip_count").default(0),
  followerCount: integer("follower_count").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  nfts: many(nfts),
  grantApplications: many(grantApplications),
  sentTips: many(tips, { relationName: "sentTips" }),
  receivedTips: many(tips, { relationName: "receivedTips" }),
  stats: one(userStats),
}));

export const nftsRelations = relations(nfts, ({ one }) => ({
  user: one(users, { fields: [nfts.userId], references: [users.id] }),
}));

export const grantsRelations = relations(grants, ({ many }) => ({
  applications: many(grantApplications),
}));

export const grantApplicationsRelations = relations(grantApplications, ({ one }) => ({
  user: one(users, { fields: [grantApplications.userId], references: [users.id] }),
  grant: one(grants, { fields: [grantApplications.grantId], references: [grants.id] }),
}));

export const tipsRelations = relations(tips, ({ one }) => ({
  fromUser: one(users, { fields: [tips.fromUserId], references: [users.id], relationName: "sentTips" }),
  toUser: one(users, { fields: [tips.toUserId], references: [users.id], relationName: "receivedTips" }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, { fields: [userStats.userId], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertNftSchema = createInsertSchema(nfts).omit({
  id: true,
  createdAt: true,
});

export const insertGrantSchema = createInsertSchema(grants).omit({
  id: true,
  createdAt: true,
  applicationCount: true,
});

export const insertGrantApplicationSchema = createInsertSchema(grantApplications).omit({
  id: true,
  submittedAt: true,
  status: true,
});

export const insertTipSchema = createInsertSchema(tips).omit({
  id: true,
  createdAt: true,
  status: true,
  transactionHash: true,
});

export const insertTokenGatedContentSchema = createInsertSchema(tokenGatedContent).omit({
  id: true,
  createdAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type NFT = typeof nfts.$inferSelect;
export type InsertNFT = z.infer<typeof insertNftSchema>;
export type Grant = typeof grants.$inferSelect;
export type InsertGrant = z.infer<typeof insertGrantSchema>;
export type GrantApplication = typeof grantApplications.$inferSelect;
export type InsertGrantApplication = z.infer<typeof insertGrantApplicationSchema>;
export type Tip = typeof tips.$inferSelect;
export type InsertTip = z.infer<typeof insertTipSchema>;
export type TokenGatedContent = typeof tokenGatedContent.$inferSelect;
export type InsertTokenGatedContent = z.infer<typeof insertTokenGatedContentSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
