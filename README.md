# homebridge-projector

## Homebridge plugin for BenQ W1110 projector
(C) 2016, Krzysztof Rosinski

This [homebridge](https://github.com/nfarina/homebridge) plugin exposes BenQ W1110 projector via infra-red signal to Apple's [HomeKit](http://www.apple.com/ios/home/). This plugin is intended to be used on the [Raspberry Pi](https://www.raspberrypi.org/) and was tested on Raspberry Pi 3 Model B only.

The infra-read receiver and transmitter has to be connected to Raspberry Pi and [LIRC](http://www.lirc.org/) package has to be configured.

# Raspberry Pi

## Required Parts

* [Raspberry Pi 3](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/)
* [Proto Plate](https://www.adafruit.com/products/2310)
* [940 nm Infrared emitting diode](http://uk.rs-online.com/web/p/ir-leds/8187663/)
* [38kHz Infrared Receiver](http://uk.rs-online.com/web/p/ir-receivers/7085086/)
* Hook up wires
* Resistors

## Hook up

![Hook up](img/homebridge-projector_bb.png?raw=true)

# LIRC

Please follow [this](http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/) guide to configure LIRC on a Raspberry Pi

# install
npm install

# Resources
http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/
