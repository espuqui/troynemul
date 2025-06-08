#!/bin/bash

set -e

cd android
./build_apk.sh
adb install TroyNemul.apk
