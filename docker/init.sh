#!/bin/bash
DIR=$(cd $(dirname $0); pwd)
APP="maps"
APPTAG="dev"

# -------
# stop
# -------
function stop() {
	#docker stop ${APP}
	#docker rm ${APP}
	#docker rmi ${APP}:${APPTAG}

	# down
	echo -e "\033[0;31m[${APP}] stop\033[0;39m"
	docker-compose down --rmi all --volumes
}

# -------
# run
# -------
# run node
function run() {
	echo -e "\033[0;31m[${APP}] start node\033[0;39m"
	cd ${DIR}/../
	node index.js
}

# -------
# exec
# -------
# docker exec
function exec() {
	docker exec -it ${APP} /bin/bash
}

# docker exec - run node
function exec_run() {
	CMD="docker exec -it ${APP} /bin/bash -c '/usr/local/${APP}/docker/init.sh run'"
	eval ${CMD}
}


if [ "${1}" = "start" ]; then
	stop

	# start
	echo -e "\033[0;31m[${APP}] start\033[0;39m"

	docker tag node:latest maps:dev
	docker build -t maps:dev .
	docker images

	docker-compose build
	docker-compose up -d
	docker ps
	docker image history ${APP}:${APPTAG}

	exec_run

elif [ "${1}" = "stop" ]; then
	stop

elif [ "${1}" = "run" ]; then
	run

elif [ "${1}" = "exec" ]; then
	exec

elif [ "${1}" = "exec_run" ]; then
	exec_run

fi
