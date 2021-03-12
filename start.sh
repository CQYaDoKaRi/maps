#!/bin/bash

./build.sh

cd docker

if [ "${1}" = "tsn" ]; then
	./init.sh start tsn
elif [ "${1}" = "tsndev" ]; then
	./init.sh start tsndev
else
	./init.sh
fi
