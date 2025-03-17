import { Injectable } from "@nestjs/common";
import { FileResponse } from "./file.interface";
import { path } from "app-root-path";
import { ensureDir, writeFile } from "fs-extra";

@Injectable()
export class FileService {
  async saveFiles(
    files: Express.Multer.File[],
    folder: string = "default",
  ): Promise<FileResponse[]> {
    const uploadFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadFolder);

    const response: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        const { originalname, buffer } = file;
        await writeFile(`${uploadFolder}/${originalname}`, buffer);

        return {
          url: `/uploads/${folder}/${originalname}`,
          name: originalname,
        };
      }),
    );

    return response;
  }
}
