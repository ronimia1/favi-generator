import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFaviconSetSchema, insertProcessingJobSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs"; // For createReadStream
import sharp from "sharp";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import archiver from "archiver";

// Setup multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 20 // Max 20 files at once
  },
  fileFilter: (_req, file, cb) => {
    // Accept only image files
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, GIF and SVG are allowed.'));
    }
  }
});

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), 'uploads');
const faviconDir = path.join(uploadDir, 'favicons');

async function ensureDirectories() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(faviconDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directories:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  await ensureDirectories();

  // API endpoint to get all favicon sets
  app.get('/api/favicon-sets', async (_req: Request, res: Response) => {
    try {
      const faviconSets = await storage.getAllFaviconSets();
      res.json(faviconSets);
    } catch (error) {
      console.error('Error fetching favicon sets:', error);
      res.status(500).json({ message: 'Failed to fetch favicon sets' });
    }
  });

  // API endpoint to get a specific favicon set
  app.get('/api/favicon-sets/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }

      const faviconSet = await storage.getFaviconSet(id);
      if (!faviconSet) {
        return res.status(404).json({ message: 'Favicon set not found' });
      }

      res.json(faviconSet);
    } catch (error) {
      console.error('Error fetching favicon set:', error);
      res.status(500).json({ message: 'Failed to fetch favicon set' });
    }
  });

  // API endpoint to process images and create favicon sets
  app.post('/api/process-images', upload.array('images', 20), async (req: Request, res: Response) => {
    try {
      console.log('Upload request received:', req.headers, 'File count:', req.files?.length);
      
      // Ensure req.files exists and is properly cast
      const files = Array.isArray(req.files) ? req.files : [];
      
      if (files.length === 0) {
        console.log('No files detected in the request');
        return res.status(400).json({ message: 'No files uploaded' });
      }

      // Create a processing job
      const job = await storage.createProcessingJob({
        totalImages: files.length,
        completedImages: 0,
        status: 'processing',
        createdAt: new Date().toISOString()
      });

      // Process each file
      const processPromises = files.map(async (file, index) => {
        try {
          console.log(`Processing file ${index + 1}/${files.length}: ${file.originalname}`);
          
          // Create unique filename based on timestamp and original name
          const timestamp = Date.now();
          const fileExt = path.extname(file.originalname);
          const baseFilename = path.basename(file.originalname, fileExt);
          const sanitizedFilename = baseFilename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          
          // Generate favicons in different sizes
          const sizes = [16, 32, 48];
          const sizesPaths: Record<string, string> = {};
          
          for (const size of sizes) {
            const outputFilename = `${sanitizedFilename}_${size}x${size}_${timestamp}.png`;
            const outputPath = path.join(faviconDir, outputFilename);
            
            await sharp(file.buffer)
              .resize(size, size)
              .png()
              .toFile(outputPath);
            
            // Store relative path for easier retrieval
            sizesPaths[size.toString()] = `/api/favicons/${outputFilename}`;
          }
          
          // Create favicon set entry
          await storage.createFaviconSet({
            originalName: file.originalname,
            originalFormat: fileExt.replace('.', ''),
            sizes: sizesPaths,
            createdAt: new Date().toISOString()
          });
          
          // Update job progress
          const updatedJob = await storage.updateProcessingJob(job.id, {
            completedImages: index + 1
          });
          console.log(`Updated job progress: ${index + 1}/${files.length} completed`);
          console.log(`Job status: ${JSON.stringify(updatedJob)}`);
        } catch (error) {
          console.error(`Error processing file ${file.originalname}:`, error);
          throw error;
        }
      });
      
      try {
        await Promise.all(processPromises);
        await storage.updateProcessingJob(job.id, {
          status: 'completed'
        });
        res.status(200).json({ 
          message: 'Images processed successfully',
          jobId: job.id
        });
      } catch (error) {
        await storage.updateProcessingJob(job.id, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    } catch (error) {
      console.error('Error processing images:', error);
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 5MB' });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ message: 'Too many files. Maximum is 20 files' });
        }
        return res.status(400).json({ message: error.message });
      }
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: fromZodError(error).message 
        });
      }
      
      res.status(500).json({ message: 'Failed to process images' });
    }
  });

  // API endpoint to get a processing job status
  app.get('/api/processing-jobs/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }

      const job = await storage.getProcessingJob(id);
      if (!job) {
        return res.status(404).json({ message: 'Processing job not found' });
      }
      
      // To help debug: log the state of the job
      console.log(`GET /api/processing-jobs/${id} - Status: ${job.status}, Completed: ${job.completedImages}/${job.totalImages}`);

      res.json(job);
    } catch (error) {
      console.error('Error fetching processing job:', error);
      res.status(500).json({ message: 'Failed to fetch processing job' });
    }
  });

  // API endpoint to serve favicon files
  app.get('/api/favicons/:filename', async (req: Request, res: Response) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(faviconDir, filename);
      
      try {
        await fs.access(filePath);
        res.sendFile(filePath);
      } catch (error) {
        res.status(404).json({ message: 'Favicon file not found' });
      }
    } catch (error) {
      console.error('Error serving favicon file:', error);
      res.status(500).json({ message: 'Failed to serve favicon file' });
    }
  });

  // API endpoint to download a zip of all favicons
  app.get('/api/download-all', async (_req: Request, res: Response) => {
    try {
      // Create a zip file
      const zip = archiver('zip', {
        zlib: { level: 9 } // Compression level
      });
      
      // Listen for errors on the zip
      zip.on('error', (err) => {
        console.error('Archive error:', err);
        res.status(500).json({ message: 'Failed to create zip file' });
      });
      
      // Set the headers for the response
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=all_favicons.zip');
      
      // Pipe the zip to the response
      zip.pipe(res);
      
      // Get all favicon sets
      const faviconSets = await storage.getAllFaviconSets();
      
      // Add each favicon file to the zip
      for (const set of faviconSets) {
        for (const [size, url] of Object.entries(set.sizes)) {
          if (typeof url === 'string') {
            const filename = url.split('/').pop();
            if (filename) {
              const filePath = path.join(faviconDir, filename);
              
              try {
                // Check if file exists
                await fs.access(filePath);
                
                // Add file to zip with a structured directory
                const originalName = set.originalName.replace(/\.[^/.]+$/, ""); // Remove extension
                const sanitizedName = originalName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                
                // Use append to add the file to the archive
                zip.append(fsSync.createReadStream(filePath), { 
                  name: `${sanitizedName}_${size}x${size}.png` 
                });
              } catch (error) {
                console.error(`File not found: ${filePath}`);
                continue;
              }
            }
          }
        }
      }
      
      // Finalize the zip
      zip.finalize();
    } catch (error) {
      console.error('Error creating zip file:', error);
      res.status(500).json({ message: 'Failed to create zip file' });
    }
  });

  // API endpoint to download a specific favicon set
  app.get('/api/download/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }

      const faviconSet = await storage.getFaviconSet(id);
      if (!faviconSet) {
        return res.status(404).json({ message: 'Favicon set not found' });
      }

      // Create a zip file
      const zip = archiver('zip', {
        zlib: { level: 9 } // Compression level
      });
      
      // Listen for errors on the zip
      zip.on('error', (err) => {
        console.error('Archive error:', err);
        res.status(500).json({ message: 'Failed to create zip file' });
      });
      
      // Set the headers for the response
      const originalName = faviconSet.originalName.replace(/\.[^/.]+$/, ""); // Remove extension
      const sanitizedName = originalName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=${sanitizedName}_favicons.zip`);
      
      // Pipe the zip to the response
      zip.pipe(res);
      
      // Add each favicon file to the zip
      for (const [size, url] of Object.entries(faviconSet.sizes)) {
        if (typeof url === 'string') {
          const filename = url.split('/').pop();
          if (filename) {
            const filePath = path.join(faviconDir, filename);
            
            try {
              // Check if file exists
              await fs.access(filePath);
              
              // Use append to add the file to the archive
              zip.append(fsSync.createReadStream(filePath), { 
                name: `${sanitizedName}_${size}x${size}.png` 
              });
            } catch (error) {
              console.error(`File not found: ${filePath}`);
              continue;
            }
          }
        }
      }
      
      // Finalize the zip
      zip.finalize();
    } catch (error) {
      console.error('Error creating zip file:', error);
      res.status(500).json({ message: 'Failed to create zip file' });
    }
  });

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
