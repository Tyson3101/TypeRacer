export interface WikiAriticle {
  title: string;
  revision: string;
}

export interface Socket {
  connected: boolean;
  disconnected: boolean;
  on: (EventName: string, CallBack: Function) => void;
  off: (EventName: string, CallBack: Function) => void;
  emit: (EventName: string, ...args: any) => void;
}
