import * as fs from 'fs';

export interface ProjectorState {
  enabled: boolean;
  mute: boolean;
  volume: number;
}

export class ProjectorStateController {
  public constructor(private filePath: string) {
  }

  public load(): Promise<ProjectorState> {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(this.filePath, 'utf8', (err, data) => {
        err ? reject(err) : resolve(data);
      });
    }).then((data) => {
      return <ProjectorState>JSON.parse(data);
    });
  }

  public getDefault(): ProjectorState {
    return {
      enabled: false,
      mute: false,
      volume: 0
    };
  }

  public store(state: ProjectorState): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let data = JSON.stringify(state);
      fs.writeFile(this.filePath, data, (err) => {
        err ? reject(err) : resolve();
      });
    });
  }
}