import { type User, type InsertUser, type BlogPost, type InsertBlogPost, type LearningResource, type InsertLearningResource } from "@shared/schema";
import { randomUUID } from "crypto";
import { db, users, blogPosts, learningResources } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // 블로그 글 관리
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  
  // 학습 자료 관리
  getLearningResources(): Promise<LearningResource[]>;
  getLearningResource(id: string): Promise<LearningResource | undefined>;
  createLearningResource(resource: InsertLearningResource): Promise<LearningResource>;
  updateLearningResource(id: string, resource: Partial<InsertLearningResource>): Promise<LearningResource | undefined>;
  deleteLearningResource(id: string): Promise<boolean>;
  incrementDownloadCount(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private blogPosts: Map<string, BlogPost>;
  private learningResources: Map<string, LearningResource>;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.learningResources = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // 블로그 글 관리
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date();
    const blogPost: BlogPost = {
      ...insertPost,
      id,
      summary: insertPost.summary || null,
      category: insertPost.category || "교육경험",
      tags: insertPost.tags || null,
      isPublished: insertPost.isPublished ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;
    
    const updated: BlogPost = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // 학습 자료 관리
  async getLearningResources(): Promise<LearningResource[]> {
    return Array.from(this.learningResources.values()).filter(r => r.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getLearningResource(id: string): Promise<LearningResource | undefined> {
    const resource = this.learningResources.get(id);
    return resource?.isActive ? resource : undefined;
  }

  async createLearningResource(insertResource: InsertLearningResource): Promise<LearningResource> {
    const id = randomUUID();
    const now = new Date();
    const resource: LearningResource = {
      ...insertResource,
      id,
      downloadCount: 0,
      isActive: insertResource.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.learningResources.set(id, resource);
    return resource;
  }

  async updateLearningResource(id: string, updateData: Partial<InsertLearningResource>): Promise<LearningResource | undefined> {
    const existing = this.learningResources.get(id);
    if (!existing || !existing.isActive) return undefined;
    
    const updated: LearningResource = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.learningResources.set(id, updated);
    return updated;
  }

  async deleteLearningResource(id: string): Promise<boolean> {
    const existing = this.learningResources.get(id);
    if (!existing) return false;
    
    // soft delete
    const updated = { ...existing, isActive: false, updatedAt: new Date() };
    this.learningResources.set(id, updated);
    return true;
  }

  async incrementDownloadCount(id: string): Promise<void> {
    const existing = this.learningResources.get(id);
    if (existing && existing.isActive) {
      const updated = {
        ...existing,
        downloadCount: existing.downloadCount + 1,
        updatedAt: new Date()
      };
      this.learningResources.set(id, updated);
    }
  }
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // 블로그 글 관리
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values({
      ...insertPost,
      summary: insertPost.summary || null,
      category: insertPost.category || "교육경험",
      tags: insertPost.tags || null,
      isPublished: insertPost.isPublished ?? true,
    }).returning();
    return result[0];
  }

  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await db.update(blogPosts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return result[0];
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result.length > 0;
  }

  // 학습 자료 관리
  async getLearningResources(): Promise<LearningResource[]> {
    return await db.select().from(learningResources)
      .where(eq(learningResources.isActive, true))
      .orderBy(desc(learningResources.createdAt));
  }

  async getLearningResource(id: string): Promise<LearningResource | undefined> {
    const result = await db.select().from(learningResources)
      .where(eq(learningResources.id, id))
      .limit(1);
    const resource = result[0];
    return resource?.isActive ? resource : undefined;
  }

  async createLearningResource(insertResource: InsertLearningResource): Promise<LearningResource> {
    const result = await db.insert(learningResources).values({
      ...insertResource,
      downloadCount: 0,
      isActive: insertResource.isActive ?? true,
    }).returning();
    return result[0];
  }

  async updateLearningResource(id: string, updateData: Partial<InsertLearningResource>): Promise<LearningResource | undefined> {
    const result = await db.update(learningResources)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(learningResources.id, id))
      .returning();
    return result[0];
  }

  async deleteLearningResource(id: string): Promise<boolean> {
    // soft delete
    const result = await db.update(learningResources)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(learningResources.id, id))
      .returning();
    return result.length > 0;
  }

  async incrementDownloadCount(id: string): Promise<void> {
    // First get the current resource to increment the count
    const current = await this.getLearningResource(id);
    if (current && current.isActive) {
      await db.update(learningResources)
        .set({ 
          downloadCount: current.downloadCount + 1,
          updatedAt: new Date() 
        })
        .where(eq(learningResources.id, id));
    }
  }
}

// Use database storage instead of memory storage
export const storage = new DbStorage();

// Keep MemStorage for testing or fallback
export const memStorage = new MemStorage();
