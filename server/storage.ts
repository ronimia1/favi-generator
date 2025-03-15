import { 
  faviconSets, 
  type FaviconSet, 
  type InsertFaviconSet,
  processingJobs,
  type ProcessingJob,
  type InsertProcessingJob
} from "@shared/schema";

export interface IStorage {
  // FaviconSet operations
  getFaviconSet(id: number): Promise<FaviconSet | undefined>;
  createFaviconSet(faviconSet: InsertFaviconSet): Promise<FaviconSet>;
  getAllFaviconSets(): Promise<FaviconSet[]>;
  deleteFaviconSet(id: number): Promise<boolean>;
  
  // ProcessingJob operations
  getProcessingJob(id: number): Promise<ProcessingJob | undefined>;
  createProcessingJob(job: InsertProcessingJob): Promise<ProcessingJob>;
  updateProcessingJob(id: number, updates: Partial<ProcessingJob>): Promise<ProcessingJob | undefined>;
  deleteProcessingJob(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private faviconSets: Map<number, FaviconSet>;
  private processingJobs: Map<number, ProcessingJob>;
  private faviconSetCurrentId: number;
  private processingJobCurrentId: number;

  constructor() {
    this.faviconSets = new Map();
    this.processingJobs = new Map();
    this.faviconSetCurrentId = 1;
    this.processingJobCurrentId = 1;
  }

  // FaviconSet operations
  async getFaviconSet(id: number): Promise<FaviconSet | undefined> {
    return this.faviconSets.get(id);
  }

  async createFaviconSet(faviconSet: InsertFaviconSet): Promise<FaviconSet> {
    const id = this.faviconSetCurrentId++;
    const newFaviconSet: FaviconSet = { ...faviconSet, id };
    this.faviconSets.set(id, newFaviconSet);
    return newFaviconSet;
  }

  async getAllFaviconSets(): Promise<FaviconSet[]> {
    return Array.from(this.faviconSets.values());
  }

  async deleteFaviconSet(id: number): Promise<boolean> {
    return this.faviconSets.delete(id);
  }

  // ProcessingJob operations
  async getProcessingJob(id: number): Promise<ProcessingJob | undefined> {
    return this.processingJobs.get(id);
  }

  async createProcessingJob(job: InsertProcessingJob): Promise<ProcessingJob> {
    const id = this.processingJobCurrentId++;
    const newJob: ProcessingJob = { ...job, id };
    this.processingJobs.set(id, newJob);
    return newJob;
  }

  async updateProcessingJob(id: number, updates: Partial<ProcessingJob>): Promise<ProcessingJob | undefined> {
    const job = this.processingJobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updates };
    this.processingJobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteProcessingJob(id: number): Promise<boolean> {
    return this.processingJobs.delete(id);
  }
}

export const storage = new MemStorage();
