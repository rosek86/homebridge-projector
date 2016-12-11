# homebridge-projector

## Homebridge plugin for BenQ W1110 projector
(C) 2016, Krzysztof Rosinski

This [homebridge](https://github.com/nfarina/homebridge) plugin exposes BenQ W1110 projector via infra-red remote control to Apple's [HomeKit](http://www.apple.com/ios/home/). This plugin is intended to be used on the [Raspberry Pi](https://www.raspberrypi.org/) and was tested on Raspberry Pi 3 Model B only.

The infra-read receiver and transmitter has to be first connected to Raspberry Pi and [LIRC](http://www.lirc.org/) package needs to be configured.

# install
npm install

# Resources
http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/
