import { IrSend } from './IrSend';
import { Util } from './Util';

export interface ProjectorDefinition {
  remote: string;
  keys: {
    powerOn: string;
    powerOff: string;
    mute: string;
    volumeUp: string;
    volumeDown: string;
  }
}

export class Projector {
  private static POWER_OFF_DELAY = 2000;
  private irSend: IrSend;

  public constructor(private definition: ProjectorDefinition) {
    this.irSend = new IrSend(definition.remote);
  }
  public powerOn(): Promise<void> {
    return this.sendKey(this.definition.keys.powerOn);
  }

  public powerOff(): Promise<void> {
    return this.sendKey(this.definition.keys.powerOff).then(() => {
      return Util.delay(Projector.POWER_OFF_DELAY);
    }).then(() => {
      return this.sendKey(this.definition.keys.powerOff);
    });
  }

  public mute(): Promise<void> {
    return this.sendKey(this.definition.keys.mute);
  }

  public volumeUp(): Promise<void> {
    return this.sendKey(this.definition.keys.volumeUp);
  }

  public volumeDown(): Promise<void> {
    return this.sendKey(this.definition.keys.volumeDown);
  }

  private sendKey(key: string, window: number = 200): Promise<void> {
    return Promise.resolve().then(() => {
      return this.irSend.sendStart(key);
    }).then(() => {
      return Util.delay(window);
    }).then(() => {
      return this.irSend.sendStop(key);
    });
  }
}
