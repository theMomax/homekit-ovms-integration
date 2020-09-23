import { Characteristic } from "hap-nodejs";

var debug = require('debug')('ovms:binding:debug')
var info = require('debug')('ovms:binding:info')
var warn = require('debug')('ovms:binding:warn')
var error = require('debug')('ovms:binding:error')

export class Binding<T> {

    private characteristic: Characteristic
    
    private get: () => Promise<T>

    private onError: (error: Error) => void

    private interval: number

    private active: boolean

    constructor(characteristic: Characteristic, get: () => Promise<T>, onError: (error: Error) => void, interval: number = 60000) {
        this.characteristic = characteristic
        this.get = get
        this.onError = onError
        this.interval = interval
    }

    public async bind(): Promise<void> {
        info('binding of characteristic ' + this.characteristic.displayName + ' is now enabled')
        this.active = true
        do {
            const start = new Date()

            await this.update()

            if (this.interval) {
                const d = Math.max(0, this.interval - (new Date().getTime() - start.getTime()))
                debug('waiting for ' + d + 'ms until next update on characteristic ' + this.characteristic.displayName)
                await delay(d)
            }
        } while (this.active)
    }

    public async pause(): Promise<void> {
        info('binding of characteristic ' + this.characteristic.displayName + ' is now disabled')
        this.active = false
    }

    public async update(): Promise<void> {
        try {
            const nv = await this.get()
            info('update characteristic ' + this.characteristic.displayName + ': ' + nv)
            this.characteristic.updateValue(nv as any)
        } catch (err) {
            error(err)
            this.onError(err)
        }
    }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms))
}