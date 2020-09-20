var debug = require('debug')('init:debug')
var info = require('debug')('init:info')
var warn = require('debug')('init:warn')
var error = require('debug')('init:error')

import { program } from './config/commander'

import ovms from './ovms/init'


const MAC_PREFIX = "52:79:31:5B:DC:3F"

program
    .option('--pincode <plaintext>', 'numeric pincode for the hosted HomeKit accessory formatted as XXX-XX-XXX', '123-45-678')
    .option('--username <plaintext>', 'the username for the generated HomeKit accessory', MAC_PREFIX)
    .option('--crash-retry-interval <number>', 'the number of milliseconds to wait for retry after a crash', 20000)



export default async function init() {
    info(program.pincode)
    while (true) {
        try {
            let accessory = await ovms()
            accessory.publish({
                username: program.username,
                pincode: program.pincode,
            })
            await never()
        } catch (err) {
            error(err)
            await delay(program.crashRetryInterval)
        }
    }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms))
}

function never() {
    return new Promise( resolve => {} );
}