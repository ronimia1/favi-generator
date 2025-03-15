declare module 'archiver' {
  import { Readable } from 'stream';
  
  function archiver(format: string, options?: any): Archiver;
  
  interface Archiver {
    pipe(destination: any): any;
    append(input: any, data: any): this;
    file(filepath: string, options: any): this;
    finalize(): Promise<void>;
    on(event: string, listener: (err?: any) => void): this;
  }
  
  export = archiver;
}