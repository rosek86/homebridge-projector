import { exec } from 'child_process';

export class IrSend {
  public constructor(private remote: string) {
  }

  public sendStart(key: string): Promise<void> {
    return this.run(this.buildRequest('SEND_START', key));
  }

  public sendStop(key: string): Promise<void> {
    return this.run(this.buildRequest('SEND_STOP', key));
  }

  public sendOnce(key: string): Promise<void> {
    return this.run(this.buildRequest('SEND_ONCE', key));
  }

  private buildRequest(cmd: string, key: string): string {
    return 'irsend ' + cmd + ' ' + this.remote + ' ' + key;
  }

  private run(command: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      exec(command, (err) => err ? reject(err) : resolve());
    });
  }
}