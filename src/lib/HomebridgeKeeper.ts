export class HomebridgeKeeper {
  private static _hap: any;

  public static set hap(hap: any) {
    HomebridgeKeeper._hap = hap;
  }

  public static get hap(): any {
    return HomebridgeKeeper._hap;
  }
}
