import { URL } from "url";

import {parseValueByIdentifier} from './util/parse'

const axios = require('axios')

import { program } from '../config/commander'

var debug = require('debug')('ovms:api:debug')
var info = require('debug')('ovms:api:info')
var warn = require('debug')('ovms:api:warn')
var error = require('debug')('ovms:api:error')


program
    .option('--cache-invalidation-duration <number>', 'the number of milliseconds for which a value may be cached before it must be re-fetched', 10000)

export class OVMSAPI {

    private url: URL
    private apiKey: string

    constructor(url: URL, apiKey: string) {
        this.url = url
        this.apiKey = apiKey
        this.lastUpdated = new Date(1979, 0)
        debug('API set up for base-url ' + url)
    }

    private lastUpdated: Date

    private async read(identifier: string, command: string): Promise<String> {
        let response: any
        try {
            response = await axios.get(this.url + '/api/execute?apikey=' + encodeURIComponent(this.apiKey) + '&command=' + encodeURIComponent(command))
            debug(response)
        } catch (err) {
            error(err)
            throw err
        }

        this.lastUpdated = new Date()

        const value = parseValueByIdentifier(identifier, response.data)
        if (value === undefined) {
            throw new Error('could not read ' + identifier + ' using command ' + command)
        }
        return value
    };

    public async isActive(): Promise<Boolean> {
        if (new Date().getTime() - this.lastUpdated.getTime() < 1000 * program.cacheInvalidationDuration) {
            return true
        }
        try {
            await this._vehicleId()
            return true
        } catch (err) {
            return false
        }
    }

    private _vehicleId = async () => {
        return this.read('id', 'config list vehicle');
    };

    private vehicleIdCache = new Cache(this._vehicleId);

    public vehicleId = () => { 
        return this.vehicleIdCache.read()
    };

    private _vehicleType = async () => {
        return this.read('vehicle.type', 'config list auto')
    }
    private vehicleTypeCache = new Cache(this._vehicleType)

    public vehicleType = () => { return this.vehicleTypeCache.read() }


    private _usesMetricSystem = async () => {
        return (await this.read('units.distance', 'config list vehicle')) === 'K'
    }
    private usesMetricSystemCache = new Cache(this._usesMetricSystem)

    public usesMetricSystem = () => { return this.usesMetricSystemCache.read() }


    private  _ovmsVersion = async () => {
        return this.read('m.version', 'metrics list m.version')
    }
    private ovmsVersionCache = new Cache(this._ovmsVersion)

    public ovmsVersion = () => { return this.ovmsVersionCache.read() }


    private  _ovmsHardware = async () => {
        return this.read('m.hardware', 'metrics list m.hardware')
    }
    private ovmsHardwareCache = new Cache(this._ovmsHardware)

    public ovmsHardware = () => { return this.ovmsHardwareCache.read() }


    private  _power = async () => {
        return Number.parseFloat(await (await this.read('v.b.power', 'metrics list v.b.power')).valueOf())
    }
    private powerCache = new Cache(this._power)

    public power = () => { return this.powerCache.read() }

    private  _soc = async () => {
        return Number.parseFloat((await this.read('v.b.soc', 'metrics list v.b.soc')).replace('%', ''))
    }
    private socCache = new Cache(this._soc)

    public soc = () => { return this.socCache.read() }


    private  _rangeEstimation = async () => {
        return Number.parseFloat((await this.read('v.b.range.est', 'metrics list v.b.range.est')).replace('km', '').replace('mi', ''))
    }
    private rangeEstimationCache = new Cache(this._rangeEstimation)

    public rangeEstimation = () => { return this.rangeEstimationCache.read() }


    private  _isCharging = async () => {
        return (await this.read('v.c.charging', 'metrics list v.c.charging')) !== 'no'
    }
    private isChargingCache = new Cache(this._isCharging)

    public isCharging = () => { return this.isChargingCache.read() }

}

class Cache<T> {
        
    private lastUpdated: Date = new Date(1970, 0)

    private value: T

    private get: () => Promise<T>

    constructor(get: () => Promise<T>) {
        this.get = get;
    }

    public async read(): Promise<T> {
        if (new Date().getTime() - this.lastUpdated.getTime() < 1000 * program.cacheInvalidationDuration) {
            return this.value;
        }
        const v = await this.get();
        this.value = v;
        this.lastUpdated = new Date();
        return v;
    }

}