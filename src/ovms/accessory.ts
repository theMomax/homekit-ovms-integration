import { Accessory, Service, Characteristic, uuid} from "hap-nodejs";
import { OVMSAPI } from './api'
import { Binding } from './util/binding'
import { ElectricVehicleChargingStation } from '../homekit/services/charging-station'
import { EstimatedRange } from '../homekit/characteristics/range'
import { CurrentPower } from '../homekit/characteristics/power'

import { program } from '../config/commander'

var debug = require('debug')('ovms:accessory:debug')
var info = require('debug')('ovms:accessory:info')
var warn = require('debug')('ovms:accessory:warn')
var error = require('debug')('ovms:accessory:error')

program
    .option('--poll-interval <number>', 'the number of milliseconds to wait after each regular update', 60000)


export class OVMSIntegration extends Accessory {

    constructor(api: OVMSAPI, displayName: string) {

        super(displayName, uuid.generate("homekit-ovms-integration-" + displayName))

        let ai = this.getService(Service.AccessoryInformation)

        new Binding(ai.getCharacteristic(Characteristic.Model), api.vehicleType, abort).update()
        ai.getCharacteristic(Characteristic.Manufacturer).updateValue("OVMS")
        new Binding(ai.getCharacteristic(Characteristic.FirmwareRevision), api.ovmsVersion, abort).update()
        new Binding(ai.getCharacteristic(Characteristic.HardwareRevision), api.ovmsHardware, abort).update()

        this.addService(new ChargingStationIntegration(api))
    }

}

class ChargingStationIntegration extends ElectricVehicleChargingStation {

    constructor(api: OVMSAPI, displayName: string = 'Charging Station') {
        super(displayName)

        const active = new Binding(this.getCharacteristic(Characteristic.Active), async () => {
            if (await api.isActive()) {
                return 1
            }
            return 0
        }, () => {}, program.pollInterval)
        active.bind()

        const log = (err: Error) => {
            warn(err)
            active.update()
        }

        new Binding(this.getCharacteristic(Characteristic.BatteryLevel), async () => {
            return (await api.soc()).toFixed(0)
        } , log, program.pollInterval).bind()

        new Binding(this.getCharacteristic(Characteristic.ChargingState), async () => {
            const isCharging = await api.isCharging()
            if (isCharging) {
                return 1
            }
            if ((await api.soc()) < 100) {
                return 0
            } else {
                return 2
            }
        } , log, program.pollInterval).bind()

        new Binding(this.getCharacteristic(Characteristic.StatusLowBattery), async () => {
            if ((await api.soc()) <= 20) {
                return 1
            }
            return 0
        } , log, program.pollInterval).bind()

        new Binding(this.getCharacteristic(EstimatedRange), async () => {
            return Number((await api.rangeEstimation()).valueOf() * (await api.usesMetricSystem ? 1 : 1.61))
        } , log, program.pollInterval).bind()

        new Binding(this.getCharacteristic(CurrentPower), async () => {
            return Number((await api.power()).valueOf() * 1000)
        } , log, program.pollInterval).bind()
    }
}

function abort(err: Error) {
    error(err)
    throw err
}