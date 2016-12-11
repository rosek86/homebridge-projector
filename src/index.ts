import { ProjectorAccessory } from './lib/ProjectorAccessory';
import { HomebridgeKeeper as HK } from './lib/HomebridgeKeeper';

export = (homebridge: any) => {
  HK.hap = homebridge.hap;
  homebridge.registerAccessory('homebridge-projector', 'Projector', ProjectorAccessory);
}
