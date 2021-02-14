#!/bin/bash
TYPE="${1}"

DIR=$(cd $(dirname $0); pwd)

function ver(){
        FN="${DIR}/public/ver.js"
        DT=`date "+%Y%m%d%H%M%S"`

        echo "Version='${DT}';" > ${FN}
        echo "${FN}=${DT}"
}

function build(){
        npm run tsc_build
        npm run build
}

# ver for gulp
if [ "${TYPE}" = "ver" ]; then
        ver
# build for dev
elif [ "${TYPE}" = "dev" ]; then
	build
	npm run gulp watch
# build for release
else
	build
fi
