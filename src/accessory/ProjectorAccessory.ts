import { inherits } from 'util';

import { HomebridgeKeeper as HK } from '../HomebridgeKeeper';

import { Util } from '../lib/Util';
import { Projector } from '../lib/Projector';

import { ProjectorStateController, ProjectorState } from './ProjectorState';

export class ProjectorAccessory {
  private static CONFIG_FILE = '/etc/homebridge/homebridge-projector.json';

  private projector: Projector;

  private stateController: ProjectorStateController;
  private state: ProjectorState | null = null;

  private informationService: any;
  private service: any;

  constructor(private log: any, private config: any) {
    this.projector = new Projector({
      remote: 'benq',
      keys: {
        powerOn: 'KEY_F1',
        powerOff: 'KEY_F2',
        mute: 'KEY_MUTE',
        volumeUp: 'KEY_VOLUMEUP',
        volumeDown: 'KEY_VOLUMEDOWN'
      }
    });
    this.stateController = new ProjectorStateController(ProjectorAccessory.CONFIG_FILE);

    this.informationService = new HK.hap.Service.AccessoryInformation();

    this.informationService
      .setCharacteristic(HK.hap.Characteristic.Manufacturer, 'KR')
      .setCharacteristic(HK.hap.Characteristic.Model, 'Rev-1')
      .setCharacteristic(HK.hap.Characteristic.SerialNumber, 'KR-Projector-0001');

    this.service = new HK.hap.Service.Switch(this.config['name']);

    this.service
      .getCharacteristic(HK.hap.Characteristic.On)
      .on('get', this.getState.bind(this))
      .on('set', this.setState.bind(this));

    this.service
      .addCharacteristic(HK.hap.Characteristic.Mute)
      .on('get', this.getMute.bind(this))
      .on('set', this.setMute.bind(this));

    this.service
      .addCharacteristic(this.makeVolumeCharacteristic(), 'Volume')
      .on('get', this.getVolume.bind(this))
      .on('set', this.setVolume.bind(this));

    // Read current state from file
    this.stateController.load().then(state => {
      this.state = state;
    }).catch((err) => {
      this.log('Cannot read state, restore default. ', err);
      this.state = this.stateController.getDefault();
    })
  }

  public identify(callback: () => void): void {
    this.log('Projector Accessory');
    callback();
  }

  public getServices() {
    return [this.informationService, this.service];
  }

  private getState(callback: (err: Error | null, state?: boolean) => void): void {
    if (this.state === null) {
      return callback(new Error('The projector state is not available'));
    }
    callback(null, this.state.enabled);
  }

  private setState(on: boolean, callback: (err?: Error | null) => void): void {
    if (this.state === null) {
      return callback(new Error('The projector state is not available'));
    }

    const state = on ? 'on' : 'off';
    this.log('Turning the projector %s!...', state);

    let power = on ? this.projector.powerOn() : this.projector.powerOff();

    power.then(() => {
      this.log('...projector is now ' + state + '.');

      this.state!.enabled = on;
      return this.stateController.store(this.state!);
    }).then(() => {
      callback();
    }).catch((err: Error) => {
      this.log(err);

      callback(err);
    });
  }

  private getMute(callback: (err: Error | null, state?: boolean) => void): void {
    if (this.state === null) {
      return callback(new Error('The projector state is not available'));
    }
    callback(null, this.state.mute);
  }

  private setMute(on: boolean, callback: (err?: Error) => void): void {
    if (this.state === null) {
      return callback(new Error('The projector state is not available'));
    }
    if (this.state.enabled === false) {
      return callback(new Error('The projector is powred down'))
    }

    const state = on ? 'on' : 'off';

    this.projector.mute().then(() => {
      this.state!.mute = on;
      return this.stateController.store(this.state!);
    }).then(() => {
      callback();
    }).catch((err: Error) => {
      callback(err);
    });
  }

  private getVolume(callback: (err: Error | null, volume?: number) => void): void {
    if (this.state === null) {
      return callback(new Error('Projector state is not available'));
    }
    callback(null, this.state.volume);
  }

  private setVolume(volume: number, callback: (err?: Error | null) => void): void {
    if (this.state === null) {
      return callback(new Error('Projector state is not available'));
    }
    if (this.state.enabled === false) {
      return callback(new Error('The projector is powred down'))
    }

    this.log('set volume from ' + this.state.volume + ' to ' + volume);

    this.changeVolume(this.state.volume, volume).then(() => {
      this.state!.volume = volume;
      return this.stateController.store(this.state!);
    }).then(() => {
      callback();
    }).catch((err: Error) => {
      callback(err);
    });
  }

  private changeVolume(currVolume: number, nextVolume: number): Promise<void> {
    currVolume = currVolume / 5;
    nextVolume = nextVolume / 5;

    if (currVolume === nextVolume) {
      return Promise.resolve();
    }

    let change = currVolume > nextVolume ?
      this.projector.volumeDown.bind(this.projector) :
      this.projector.volumeUp.bind(this.projector);

    let steps = Math.abs(currVolume - nextVolume);

    let promise = change();
    for (let i = 0; i < steps - 1; i++) {
      promise = promise.then(() => Util.delay(250));
      promise = promise.then(() => change());
    }

    return promise;
  }

  private makeVolumeCharacteristic(): any {
    let VolumeCharacteristic: any = function () {
      HK.hap.Characteristic.call(this, 'Volume', '91288267-5678-49B2-8D22-F57BE995AA00');
      this.setProps({
        format: HK.hap.Characteristic.Formats.INT,
        unit: HK.hap.Characteristic.Units.PERCENTAGE,
        maxValue: 100,
        minValue: 0,
        minStep: 5,
        perms: [HK.hap.Characteristic.Perms.READ, HK.hap.Characteristic.Perms.WRITE, HK.hap.Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    inherits(VolumeCharacteristic, HK.hap.Characteristic);
    return VolumeCharacteristic;
  }
}
