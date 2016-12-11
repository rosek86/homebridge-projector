export class Util {
  public static delay(time: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, time);
    });
  }
}