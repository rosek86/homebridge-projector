import { HomebridgeKeeper as HK } from './HomebridgeKeeper';
import { ProjectorAccessory } from './accessory/ProjectorAccessory';

export = (homebridge: any) => {
  HK.hap = homebridge.hap;
  homebridge.registerAccessory('homebridge-projector', 'Projector', ProjectorAccessory);
}
