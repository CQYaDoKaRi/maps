#!/bin/bash

cd docker

if [ "${1}" = "www" ]; then
	./init.sh exec_run
elif [ "${1}" = "www_dev" ]; then
	./init.sh exec_run_dev
else
	./init.sh
fi
