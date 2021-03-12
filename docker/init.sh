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

	exec_mongo_start

	if [ "${1}" = "tsn" ]; then
		exec_start_tsn
	elif [ "${1}" = "tsndev" ]; then
		exec_start_tsndev
	else
		exec_start
	fi
}

# -------
# stop
# -------
function stop() {
	npm_run_stop
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
# npm run
# -------
# npm run prod
function npm_run() {
	cd ${DIR}/../
	npm run prod_docker_start
	npm run prod_docker_moni
	cd ${DIR}
}

# npm run ts-node
function npm_run_tsn() {
	cd ${DIR}/../
	npm run tsn_start
	cd ${DIR}
}

# npm run ts-node-dev
function npm_run_tsndev() {
	cd ${DIR}/../
	npm run tsn_start_dev
	cd ${DIR}
}

# npm run prod - stop
function npm_run_stop() {
	cd ${DIR}/../
	npm run prod_docker_stop
	npm run prod_docker_delete

	if [ -e .pm2.docker ]; then
		rm -Rf .pm2.docker
	fi

	cd ${DIR}
}

# -------
# exec
# -------
# docker exec
function exec() {
	docker exec -it ${APP} /bin/bash
}

# docker exec - start - prod = pm2
function exec_start() {
	echo -e "\033[0;34m[${APP}] start node[pm2]\033[0;39m"

	CMD="docker exec -it ${APP} /bin/bash -c '/usr/local/${APP}/docker/init.sh exec_start'"

	eval ${CMD}
}

# docker exec - start - ts-node
function exec_start_tsn() {
	echo -e "\033[0;34m[${APP}] start ts-node\033[0;39m"

	CMD="docker exec -it ${APP} /bin/bash -c '/usr/local/${APP}/docker/init.sh exec_start_tsn'"
	eval ${CMD}
}

# docker exec - start - ts-node-dev
function exec_start_tsndev() {
	echo -e "\033[0;34m[${APP}] start ts-node-dev\033[0;39m"

	CMD="docker exec -it ${APP} /bin/bash -c '/usr/local/${APP}/docker/init.sh exec_start_tsndev'"
	eval ${CMD}
}

# docker exec - mongo - start
function exec_mongo_start() {
	echo -e "\033[0;34m[${APP}] start mongod ...\033[0;39m"

	DB="/data"

	CMD="docker exec -it maps_mongo /bin/bash -c '/usr/bin/mongod --config ${DB}/conf/mongod.conf --dbpath ${DB}/db --fork --logpath ${DB}/logs/mongod.log'"
	eval ${CMD}

	echo -e "\033[0;34m[${APP}] start mongod ... completed\033[0;39m"
}

# docker exec - mongo - stop
function exec_mongo_stop() {
	echo -e "\033[0;34m[${APP}] stop mongod ...\033[0;39m"

	DB="/data"

	CMD="docker exec -it maps_mongo /bin/bash -c '/usr/bin/mongod --shutdown'"
	eval ${CMD}

	echo -e "\033[0;34m[${APP}] stop mongod ... completed\033[0;39m"
}


if [ "${1}" = "start" ]; then
	stop
	start "${2}"

elif [ "${1}" = "stop" ]; then
	stop

elif [ "${1}" = "exec" ]; then
	exec

elif [ "${1}" = "exec_start" ]; then
	npm_run

elif [ "${1}" = "exec_start_tsn" ]; then
	npm_run_tsn

elif [ "${1}" = "exec_start_tsndev" ]; then
	npm_run_tsndev

else
	stop
	echo -e "\033[0;34m[${APP}] init\033[0;39m"

	docker tag node:latest maps:dev
	docker build -t maps:dev .
	docker images

	start "${2}"
fi
