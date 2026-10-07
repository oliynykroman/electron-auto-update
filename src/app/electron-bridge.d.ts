export interface RuntimeInfo {
  shellVersion: string;
  environment: string;
  source: 'local' | 'remote';
}

export interface UpdateResult {
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
}

declare global {
  interface Window {
    updateDemo?: {
      getRuntimeInfo(): Promise<RuntimeInfo>;
      checkForUpdate(currentVersion: string): Promise<UpdateResult>;
      reloadInterface(): Promise<void>;
    };
  }
}

