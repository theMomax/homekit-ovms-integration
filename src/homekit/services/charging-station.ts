import { Service, Characteristic } from 'hap-nodejs';
import { EstimatedRange } from '../characteristics/range'
import { CurrentPower } from '../characteristics/power'

/**
 * Custom Service "Electric Vehicle Charging Station"
 */
export class ElectricVehicleChargingStationService extends Service {
    static UUID: string = "00000004-0000-1000-8000-0036AC324978"

    constructor(displayName: string, subtype?: string) {
        super(displayName, ElectricVehicleChargingStationService.UUID, subtype)

        // Required Characteristics
        this.addCharacteristic(Characteristic.BatteryLevel);
        this.addCharacteristic(Characteristic.ChargingState);
        this.addCharacteristic(Characteristic.StatusLowBattery);
        this.addCharacteristic(Characteristic.Active)

        // Optional Characteristics
        this.addOptionalCharacteristic(Characteristic.Name);
        this.addOptionalCharacteristic(EstimatedRange)
        this.addOptionalCharacteristic(CurrentPower)
    }
}