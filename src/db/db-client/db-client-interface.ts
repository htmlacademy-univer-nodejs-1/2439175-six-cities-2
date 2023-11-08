export interface DatabaseClientInterface {
    connect(ip: string): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
}