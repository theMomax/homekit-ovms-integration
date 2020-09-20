
import { exit } from "process";
import { OVMSAPI } from './api';

import { OVMSIntegration } from './accessory'
import { Accessory } from "hap-nodejs";

import { program } from '../config/commander'

var debug = require('debug')('ovms:init:debug')
var info = require('debug')('ovms:init:info')
var warn = require('debug')('ovms:init:warn')
var error = require('debug')('ovms:init:error')

program
    .requiredOption('-a, --address <url>', 'address of your OVMS installation in your local network')
    .requiredOption('-p, --password <plaintext>', 'password for your local OVMS installation')

export default async function init(): Promise<Accessory> {
    info('intializing ovms integration')

    if (!program.address) {
        error('parameter address not defined')
        exit(1)
    }

    if (!program.password) {
        error('parameter password not defined')
        exit(2)
    }

    let api = new OVMSAPI(program.address, program.password)

    return new OVMSIntegration(api, (await api.vehicleId()).valueOf())
}

