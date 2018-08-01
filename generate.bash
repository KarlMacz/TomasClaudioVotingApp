#!/bin/bash

# --------------------------------------------------
#                      Project
# --------------------------------------------------
#   This Bash File contains a function that lets you
#   generate APK or IPA file.
# --------------------------------------------------

generate() {
    if [ -z $1 ]; then
        echo "Usage:";
        echo "    generate [command] [destination]";
        echo "";
        echo "Available commands:";
        echo "    apk                   Generate APK file.";
        echo "    ipa                   Generate IPA file.";
    else
        if [ $1 == "apk" ]; then
            cd ./android;
            cd ./app/build/outputs/apk;
            rm -rf ./app-release.apk;
            cd ./../../../../../;
            ./gradlew assembleRelease;
            cd ./app/build/outputs/apk;

            if [ -z $2 ]; then
                explorer .;
            else
                cp ./app-release.apk $2;
            fi

            cd ./../../../../../;
        elif [ $1 == "ipa" ]; then
            echo "This command is currently unavailable.";
        else
            echo "Please specify a command.";
        fi
    fi
}
