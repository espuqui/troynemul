#!/bin/bash

set -e

KEYSTORE_PASSWD=`cat release.passwd`

# Bundle para Google Play
gradle bundleRelease

# Firma para google play
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
-keystore release.keystore \
 -storepass $KEYSTORE_PASSWD -keypass $KEYSTORE_PASSWD \
 app/build/outputs/bundle/release/app-release.aab   alias_name