declare module 'mongoose' {
  export interface Document {
    wasNew?: boolean;
  }
}
