#!/bin/bash
DIR=$(cd $(dirname $0); pwd)
APP="maps-aws-lambda"
APPTAG="dev"

# -------
# start
# -------
function start() {
	cp ../../dist/node/ts/maps.js ./src/maps.js

	echo -e "\033[0;34m[${APP}] start\033[0;39m"
	docker-compose build
	docker-compose up -d
	docker ps

	#docker image history ${APP}:${APPTAG}
}

# -------
# stop
# -------
function stop() {
	#docker stop ${APP}
	#docker rm ${APP}
	#docker rmi ${APP}:${APPTAG}

	# down
	echo -e "\033[0;34m[${APP}] stop ...\033[0;39m"
	docker-compose down --rmi all --volumes
	echo -e "\033[0;34m[${APP}] stop ... completed\033[0;39m"
}

# -------
# test
# ------
function test() {
	FILES="./test/*.json"
	for JSON in ${FILES}; do
		curl -XPOST "http://localhost:9001/2015-03-31/functions/function/invocations" -d $(printf '%s' $(cat ${JSON}))
		echo ""
	done
}

# -------
# exec
# -------
# docker exec
function exec() {
	docker exec -it ${APP} /bin/bash
}

if [ "${1}" = "start" ]; then
	stop
	start "${2}"

elif [ "${1}" = "stop" ]; then
	stop

elif [ "${1}" = "exec" ]; then
	exec

elif [ "${1}" = "test" ]; then
	test

else
	stop
	echo -e "\033[0;34m[${APP}] init\033[0;39m"

	start "${2}"
fi
