import * as glob from "glob";
import * as path from "path";

// -------------------------------------------------------------------------
// Util functions
// -------------------------------------------------------------------------

const importFactories = (files: Array<string>) => files.forEach(require);

const loadFiles =
    (filePattern: string) =>
        (pathToFolder: string) =>
            (successFn: (files: Array<string>) => void) =>
                (failedFn: (error: any) => void) => {
                    glob(path.join(process.cwd(), pathToFolder, filePattern), (error: any, files: Array<string>) => error
                        ? failedFn(error)
                        : successFn(files));
                };

const loadFactoryFiles = loadFiles("**/*Factory{.js,.ts}");

// -------------------------------------------------------------------------
// Facade functions
// -------------------------------------------------------------------------

export const loadEntityFactories = (pathToFolder: string): Promise<Array<string>> => {
    return new Promise((resolve, reject) => {
        loadFactoryFiles(pathToFolder)(files => {
            importFactories(files);
            resolve(files);
        })(reject);
    });
};

export const loadSeeds = (pathToFolder: string): Promise<Array<string>> => {
    return new Promise((resolve, reject) => {
        loadFiles("**/*{.js,.ts}")(pathToFolder)(resolve)(reject);
    });
};
