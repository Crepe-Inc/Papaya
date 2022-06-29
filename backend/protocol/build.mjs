import childprocess from "child_process"
import Bluebird from "bluebird";
const {Promise} = Bluebird;
import * as fs from "fs"


async function generateProtobuf(path){

        if(!path) return;
        if(fs.existsSync("./protocol/messages/" + path.split(".")[0] + ".ts")) return;

        let a = childprocess.exec(`npx protoc --ts_out ./protocol/messages --proto_path ./protocol/proto ./protocol/proto/${path}`)
        a.on("exit", (code)=>{
            if(code != 0){
                console.log(`Error processing file: ${path}`)
                return;
            }
            console.log(`Processed file: ${path}`)


        })

        a.on("error", (e)=>{
            console.log(e)
        })
        //console.log(path)
} 

class protobufGenerator{

    protofiles;
    running = 0;
    tasks = [];

    constructor(){
        this.protofiles = fs.readdirSync("./protocol/proto");
    }

    doMore(){
        
        Promise.map(this.protofiles, async function(filename){
            generateProtobuf(filename);
            return
        }, {concurrency: 30}).thenReturn();

    }


}


let gen = new protobufGenerator()

gen.doMore();



