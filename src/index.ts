import {HAPStorage} from "hap-nodejs/dist/lib/model/HAPStorage"
import path from "path"

import { program } from './config/commander'

import init from './init'


program
    .option('-s, --storage-path <path>', "path to HAP-nodejs' persistence folder", './persis')

program.parse(process.argv)

HAPStorage.setCustomStoragePath(path.resolve(program.storagePath))

init()