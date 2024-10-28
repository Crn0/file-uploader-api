import path from "path";
import { readdir, unlink } from "fs/promises";

class CleanUp {
  static async images(dirname) {
    const res = await readdir(path.join(dirname, "..", "temp", "images"));

    res.forEach(async (fileName) => {
      const filePath = `${path.join(dirname, "..", "temp", "images")}/${fileName}`;

      if (fileName === ".gitkeep") return;

      await unlink(filePath);
    });
  }
}

export default Object.freeze(CleanUp);
