# homekit-ovms-integration
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FtheMomax%2Fhomekit-ovms-integration.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FtheMomax%2Fhomekit-ovms-integration?ref=badge_shield)

A HomeKit integration for electric vehicles.

This project integrates [OVMS](https://www.openvehicles.com) into Apple HomeKit. The exposed metrics mostly concern the car's battery and range, as well as the charger component.

## Getting Started

### Development

* `git clone https://github.com/theMomax/homekit-ovms-integration.git`
* `cd homekit-ovms-integration`
* `npm install`
* `npm run build`
* `DEBUG="*" npm run start -- -a <your OVMS address> -p <your OVMS password>`

See [Integrations](#Integrations) for information on how to configure each integration.

### Install Release

* `npm i -g homekit-ovms-integration`
* `DEBUG="*,-*:debug,-follow-redirects" homekit-ovms-integration -a <your OVMS address> -p <your OVMS password>`
## App

I've started working on an iOS app ([Home Batteries](https://github.com/theMomax/home-batteries)) that offers an overview for this project's custom services. It also provides an UI for creating automations. Check out the link for more details. The [Eve App](https://apps.apple.com/de/app/elgato-eve/id917695792) also supports all of the custom Services/Characteristics defined below.

## Custom HomeKit Services & Characteristics

### Services

#### ElectricVehicleChargingStation

Property                   |  Value
:-------------------------:|:-------------------------:
UUID  |  00000004-0000-1000-8000-0036AC324978
Required Characteristics  |  BatteryLevel<br>ChargingState<br>StatusLowBattery<br>Active
Optional Characteristics  |  Name<br>EstimatedRange<br>CurrentPower

### Characteristics

#### CurrentPower

as defined [here](https://github.com/theMomax/homekit-battery-integration)

#### EstimatedRange

Property                   |  Value
:-------------------------:|:-------------------------:
UUID  |  00000007-0001-1000-8000-0036AC324978
Permissions  |  Paired Read, Notify
Format  |  float
Unit   |  kilometers

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FtheMomax%2Fhomekit-ovms-integration.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FtheMomax%2Fhomekit-ovms-integration?ref=badge_large)