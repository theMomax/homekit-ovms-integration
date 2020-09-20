import { Characteristic, Formats, Perms } from 'hap-nodejs';
import { Units } from '../units/si'

/**
 * Generic custom Power Characteristic
 */

class Range extends Characteristic {

    constructor(displayName: string, uuid: string) {
        super(displayName, uuid);
        this.setProps({
        format: Formats.FLOAT,
        // @ts-ignore
        unit: Units.KM,
        perms: [Perms.PAIRED_READ, Perms.NOTIFY]
        });
        this.value = this.getDefaultValue();
    }
}

/**
 * Custom Characteristic "Estimated Range"
 */

export class EstimatedRange extends Range {

    static readonly UUID: string = '00000007-0001-1000-8000-0036AC324978';

    constructor() {
        super('Estimated Range', EstimatedRange.UUID);
    }
}