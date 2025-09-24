import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertLearningResourceSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

// Multer configuration for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
      // Generate unique filename with timestamp and original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, `${basename}-${uniqueSuffix}${ext}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types for educational resources
    const allowedTypes = /\.(pdf|doc|docx|ppt|pptx|txt|jpg|jpeg|png|gif|mp4|avi|mov|mp3|wav)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed. Please upload PDF, Office documents, images, videos, or audio files.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Blog Posts API
  
  // Get all blog posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });
  
  // Get single blog post
  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });
  
  // Create blog post
  app.post("/api/blog-posts", async (req, res) => {
    try {
      // Make some fields optional for client convenience
      const relaxedSchema = insertBlogPostSchema.extend({
        category: z.string().optional(),
        isPublished: z.boolean().optional(),
        summary: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
      });
      
      const validatedData = relaxedSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });
  
  // Update blog post (using PATCH for partial updates)
  app.patch("/api/blog-posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Make all fields optional for updates
      const updateSchema = insertBlogPostSchema.partial();
      const validatedData = updateSchema.parse(req.body);
      
      const updatedPost = await storage.updateBlogPost(id, validatedData);
      
      if (!updatedPost) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      
      console.error("Error updating blog post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });
  
  // Delete blog post
  app.delete("/api/blog-posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBlogPost(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });
  
  // Learning Resources API
  
  // Get all learning resources
  app.get("/api/learning-resources", async (req, res) => {
    try {
      const resources = await storage.getLearningResources();
      res.json(resources);
    } catch (error) {
      console.error("Error fetching learning resources:", error);
      res.status(500).json({ error: "Failed to fetch learning resources" });
    }
  });
  
  // Get single learning resource
  app.get("/api/learning-resources/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const resource = await storage.getLearningResource(id);
      
      if (!resource) {
        return res.status(404).json({ error: "Learning resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      console.error("Error fetching learning resource:", error);
      res.status(500).json({ error: "Failed to fetch learning resource" });
    }
  });
  
  // Create learning resource
  app.post("/api/learning-resources", async (req, res) => {
    try {
      // Make isActive optional for client convenience
      const relaxedSchema = insertLearningResourceSchema.extend({
        isActive: z.boolean().optional(),
      });
      
      const validatedData = relaxedSchema.parse(req.body);
      const resource = await storage.createLearningResource(validatedData);
      
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      
      console.error("Error creating learning resource:", error);
      res.status(500).json({ error: "Failed to create learning resource" });
    }
  });
  
  // Update learning resource (using PATCH for partial updates)
  app.patch("/api/learning-resources/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Make all fields optional for updates
      const updateSchema = insertLearningResourceSchema.partial();
      const validatedData = updateSchema.parse(req.body);
      
      const updatedResource = await storage.updateLearningResource(id, validatedData);
      
      if (!updatedResource) {
        return res.status(404).json({ error: "Learning resource not found" });
      }
      
      res.json(updatedResource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      
      console.error("Error updating learning resource:", error);
      res.status(500).json({ error: "Failed to update learning resource" });
    }
  });
  
  // Delete learning resource
  app.delete("/api/learning-resources/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteLearningResource(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Learning resource not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting learning resource:", error);
      res.status(500).json({ error: "Failed to delete learning resource" });
    }
  });
  
  // File Upload API
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileInfo = {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        filePath: req.file.path
      };

      res.status(201).json({
        message: "File uploaded successfully",
        file: fileInfo
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // File Download API
  app.get("/api/learning-resources/:id/download", async (req, res) => {
    try {
      const { id } = req.params;
      const resource = await storage.getLearningResource(id);
      
      if (!resource) {
        return res.status(404).json({ error: "Learning resource not found" });
      }

      const filePath = path.join(process.cwd(), 'server/uploads', resource.fileName);
      
      // Check if file exists
      if (!existsSync(filePath)) {
        return res.status(404).json({ error: "File not found on disk" });
      }

      // Increment download count
      await storage.incrementDownloadCount(id);

      // Set appropriate headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${resource.fileName}"`);
      res.setHeader('Content-Type', resource.fileType);
      res.setHeader('Content-Length', resource.fileSize.toString());

      // Stream the file
      res.sendFile(filePath);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Failed to download file" });
    }
  });

  // Create learning resource with file
  app.post("/api/learning-resources/with-file", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Parse the metadata from request body
      const metadata = JSON.parse(req.body.metadata || '{}');
      
      // Create learning resource with file info
      const resourceData = {
        title: metadata.title,
        description: metadata.description,
        fileName: req.file.filename,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        category: metadata.category,
        resourceType: metadata.resourceType,
        difficulty: metadata.difficulty,
        ageGroup: metadata.ageGroup,
        isActive: metadata.isActive ?? true,
      };

      // Validate the data
      const relaxedSchema = insertLearningResourceSchema.extend({
        isActive: z.boolean().optional(),
      });
      
      const validatedData = relaxedSchema.parse(resourceData);
      const resource = await storage.createLearningResource(validatedData);
      
      res.status(201).json(resource);
    } catch (error) {
      // If validation fails, clean up uploaded file
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      }

      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      
      console.error("Error creating learning resource with file:", error);
      res.status(500).json({ error: "Failed to create learning resource with file" });
    }
  });

  // Get download count (optional endpoint for analytics)
  app.post("/api/learning-resources/:id/increment-download", async (req, res) => {
    try {
      const { id } = req.params;
      const resource = await storage.getLearningResource(id);
      
      if (!resource) {
        return res.status(404).json({ error: "Learning resource not found" });
      }
      
      await storage.incrementDownloadCount(id);
      res.json({ message: "Download count incremented" });
    } catch (error) {
      console.error("Error incrementing download count:", error);
      res.status(500).json({ error: "Failed to increment download count" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
