import { Characteristic } from "hap-nodejs";


export class Binding<T> {

    private characteristic: Characteristic
    
    private get: () => Promise<T>

    private onError: (error: Error) => void

    private interval: number

    private active: boolean

    constructor(characteristic: Characteristic, get: () => Promise<T>, onError: (error: Error) => void, interval: number = 1000) {
        this.characteristic = characteristic
        this.get = get
        this.onError = onError
        this.interval = interval
    }

    public async bind(): Promise<void> {
        this.active = true
        do {
            const start = new Date()

            await this.update()

            if (this.interval) {
                await delay(Math.max(0, this.interval - (new Date().getTime() - start.getTime())))
            }
        } while (this.active)
    }

    public async pause(): Promise<void> {
        this.active = false
    }

    public async update(): Promise<void> {
        try {
            this.characteristic.updateValue((await this.get()) as any)
        } catch (err) {
            this.onError(err)
        }
    }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms))
}