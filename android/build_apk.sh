#!/bin/bash

set -e

KEYSTORE_PASSWD=`cat release.passwd`

# Compilar
gradle :app:assembleRelease

# Firmar
$ANDROID_SDK_ROOT/build-tools/35.0.0/apksigner sign \
 --ks-key-alias alias_name --ks release.keystore \
 --ks-pass pass:$KEYSTORE_PASSWD --key-pass pass:$KEYSTORE_PASSWD \
 app/build/outputs/apk/release/app-release-unsigned.apk

# Copia local
cp app/build/outputs/apk/release/app-release-unsigned.apk TroyNemul.apk
