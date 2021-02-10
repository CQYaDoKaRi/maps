#!/bin/bash
DIR=$(cd $(dirname $0); pwd)
APP="maps"
APPTAG="dev"

# -------
# start
# -------
function start() {
	echo -e "\033[0;34m[${APP}] start\033[0;39m"
	docker-compose build
	docker-compose up -d
	docker ps

	#docker image history ${APP}:${APPTAG}

	exec_mongo
	exec_run
}

# -------
# stop
# -------
function stop() {
	exec_mongo_stop

	#docker stop ${APP}
	#docker rm ${APP}
	#docker rmi ${APP}:${APPTAG}

	# down
	echo -e "\033[0;34m[${APP}] stop ...\033[0;39m"
	docker-compose down --rmi all --volumes
	echo -e "\033[0;34m[${APP}] stop ... completed\033[0;39m"
}

# -------
# run
# -------
# run node
function run() {
	cd ${DIR}/../
	# - dev
	npm run start
	# - release
	#node index.js
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
	echo -e "\033[0;34m[${APP}] start node\033[0;39m"

	CMD="docker exec -it ${APP} /bin/bash -c '/usr/local/${APP}/docker/init.sh run'"
	eval ${CMD}
}

function exec_mongo() {
	echo -e "\033[0;34m[${APP}] start mongod ...\033[0;39m"

	DB="/data"

	CMD="docker exec -it maps_mongo /bin/bash -c '/usr/bin/mongod --config ${DB}/conf/mongod.conf --dbpath ${DB}/db --fork --logpath ${DB}/logs/mongod.log'"
	eval ${CMD}

	echo -e "\033[0;34m[${APP}] start mongod ... completed\033[0;39m"
}

function exec_mongo_stop() {
	echo -e "\033[0;34m[${APP}] stop mongod ...\033[0;39m"

	DB="/data"

	CMD="docker exec -it maps_mongo /bin/bash -c '/usr/bin/mongod --shutdown'"
	eval ${CMD}

	echo -e "\033[0;34m[${APP}] stop mongod ... completed\033[0;39m"
}


if [ "${1}" = "start" ]; then
	start

elif [ "${1}" = "stop" ]; then
	stop

elif [ "${1}" = "run" ]; then
	run

elif [ "${1}" = "exec" ]; then
	exec

elif [ "${1}" = "exec_run" ]; then
	exec_run

else
	stop
	echo -e "\033[0;34m[${APP}] init\033[0;39m"

	docker tag node:latest maps:dev
	docker build -t maps:dev .
	docker images

	start
fi