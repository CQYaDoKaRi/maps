#!/bin/bash

BUILD=true
if [ "${1}" = "next" ]; then
	BUILD=false
fi

if "${BUILD}"; then
	./build.sh
fi

cd docker

if [ "${1}" = "tsn" ]; then
	./init.sh start tsn
elif [ "${1}" = "tsndev" ]; then
	./init.sh start tsndev
elif [ "${1}" = "next" ]; then
	./init.sh start next
else
	./init.sh
fi
