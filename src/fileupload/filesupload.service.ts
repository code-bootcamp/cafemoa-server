import { Injectable } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import { FileUpload } from "graphql-upload";
import {v4 as uuidv4} from 'uuid';


const getToday = () => {
    const date = new Date()
    const yyyy = date.getFullYear()
    const mm = date.getMonth() +1
    const dd = date.getDate()
    return `${yyyy}/${mm}/${dd}`
}


interface IUpload{
    files:FileUpload[];
}

@Injectable()
export class FilesUploadService {
    async upload ({ files }) {
        const waitedFiles = await Promise.all(files);
        console.log(waitedFiles);

        const storage = new Storage({
            projectId: 'primal-library-370305',
            keyFilename: 'gcp-file-storage.json',
        }).bucket('kimsanghyeon');

        const results = await Promise.all(
            waitedFiles.map(
                (file)=>{
                return new Promise<string>((resolve, reject) => {
                    const fname = `${getToday()}/${uuidv4()}/origin/${file.filename}`;
                    file
                    .createReadStream()
                    .pipe(storage.file(fname).createWriteStream())
                    .on('finish', () => resolve(`${'kimsanghyeon'}/${fname}`))
                    .on('error', () => reject('실패'));
                });
            }),
        );
        console.log(results)
      return results;

    }
}