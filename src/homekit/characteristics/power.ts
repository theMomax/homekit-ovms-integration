import { Characteristic, Formats, Perms } from 'hap-nodejs';
import { Units } from '../units/si'

/**
 * Generic custom Power Characteristic
 */

class Power extends Characteristic {

    constructor(displayName: string, uuid: string) {
        super(displayName, uuid);
        this.setProps({
        format: Formats.FLOAT,
        // @ts-ignore
        unit: Units.WATT,
        perms: [Perms.PAIRED_READ, Perms.NOTIFY]
        });
        this.value = this.getDefaultValue();
    }
}

/**
 * Custom Characteristic "Current Power"
 */

export class CurrentPower extends Power {

    static readonly UUID: string = '00000001-0001-1000-8000-0036AC324978';

    constructor() {
        super('Current Power', CurrentPower.UUID);
    }
}