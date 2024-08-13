import * as fs from 'fs/promises';
import * as path from 'path';

export class RepositoryService {
  constructor(private base: string = 'persistent/storage/') {}

  public async readTextFile(pathFile: string) {
    return await fs.readFile(path.join(this.base, pathFile), {
      encoding: 'utf8',
    });
  }

  public async readJpegFile(pathFile: string) {
    const buffer = await fs.readFile(path.join(this.base, pathFile), {
      encoding: 'base64',
    });
    return `data:image/jpg;base64,${buffer}`;
  }

  public async writeTxtFile(directory: string, name: string, content: string) {
    await fs.mkdir(path.join(this.base, directory), { recursive: true });
    return await fs.appendFile(
      path.join(this.base, directory, name + '.txt'),
      content,
    );
  }

  public async writeJpegFile(
    directory: string,
    name: string,
    content: string | Buffer,
  ) {
    await fs.mkdir(path.join(this.base, directory), { recursive: true });
    return await fs.writeFile(path.join(this.base, directory, name), content);
  }

  protected async getFiles(directoryPath: string) {
    await fs.mkdir(path.join(this.base, directoryPath), { recursive: true });
    return await fs.readdir(path.join(this.base, directoryPath));
  }
}
