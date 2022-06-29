import * as fs from "fs"

class reexportGenerator{
    getExport(filename){

        if(!filename) return ``;
        let modulename = filename.split(".")[0]
        if(modulename)
            return `export { ${modulename} } from "./messages/${modulename}"\n`
        else
            return ``
    }

    generateReexport(){
        this.protofiles = fs.readdirSync("./protocol/proto").map(x=>x.split(".")[0]);
        this.messagefiles = fs.readdirSync("./protocol/messages").map(x=>x.split(".")[0]);

        for(let file of this.protofiles){
            if(!this.messagefiles.includes(file)) console.log(`Warning! ${file} was not processed`)
        }

        let str = "";
        while(this.messagefiles.length > 0){
            str += this.getExport(this.messagefiles.pop())
        }
        fs.writeFileSync("./protocol/messages.ts", str)
    }
}

let rex = new reexportGenerator();

rex.generateReexport();