#!/bin/bash

cd docker

if [ "${1}" = "www" ]; then
	./init.sh exec_run
else
	./init.sh
fi