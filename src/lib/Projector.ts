import { IrSend } from './IrSend';
import { Util } from './Util';

export class Projector {
  private irSend: IrSend;

  public constructor() {
    this.irSend = new IrSend('benq');
  }
  public powerOn(): Promise<void> {
    return this.sendKey('KEY_F1');
  }

  public powerOff(): Promise<void> {
    return this.sendKey('KEY_F2').then(() => {
      return Util.delay(2000);
    }).then(() => {
      return this.sendKey('KEY_F2');
    });
  }

  public mute(): Promise<void> {
    return this.sendKey('KEY_MUTE', 200);
  }

  public volumeUp(): Promise<void> {
    return this.sendKey('KEY_VOLUMEUP', 200);
  }

  public volumeDown(): Promise<void> {
    return this.sendKey('KEY_VOLUMEDOWN', 200);
  }

  private sendKey(key: string, window: number = 1000): Promise<void> {
    return Promise.resolve().then(() => {
      return this.irSend.sendStart(key);
    }).then(() => {
      return Util.delay(window);
    }).then(() => {
      return this.irSend.sendStop(key);
    });
  }
}
