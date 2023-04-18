#!/bin/bash
DIR=$(cd $(dirname $0); pwd)
APP="maps-aws-lambda"
APPTAG="dev"

AWS_ACCOUNT_ID="360733559741"
AWS_REGION="ap-northeast-1"
AWS_ECR_REP="maps.lambda"

if [ -e "${DIR}/init.env.sh" ]; then
	source ${DIR}/init.env.sh
fi

# -------
# start
# -------
function start() {

	echo -e "\033[0;34m[${APP}] start\033[0;39m"
	build
	docker-compose up -d
	docker ps

	#docker image history ${APP}:${APPTAG}
}

function build() {
	down

	cp ../../dist/node/ts/maps.js ./src/maps.js

	docker-compose build
}

# -------
# stop
# -------
function stop() {
	#docker stop ${APP}
	#docker rm ${APP}
	#docker rmi ${APP}:${APPTAG}

	# down	echo -e "\033[0;34m[${APP}] stop ...\033[0;39m"
	down
	echo -e "\033[0;34m[${APP}] stop ... completed\033[0;39m"
}

function down() {
	docker-compose down --rmi all --volumes &> /dev/null
}

# -------
# test
# -------
function test() {
	FILES="./test/*.json"
	for JSON in ${FILES}; do
		curl -XPOST "http://localhost:9001/2015-03-31/functions/function/invocations" -d $(printf '%s' $(cat ${JSON}))
		echo ""
	done
}

# -------
# ECR
# -------
function ecr() {
	if [ -z "${AWS_ACCOUNT_ID}" ]; then
		echo -e "\033[0;34m[${APP}] set variable [AWS_ACCOUNT_ID]\033[0;39m"
		exit
	fi

	# build
	build

	# create an ECR repository
	aws ecr describe-repositories --repository-names ${AWS_ECR_REP} --region ${AWS_REGION} &> /dev/null
	if [ ${?} -ne 0 ]; then
		aws ecr create-repository --repository-name ${AWS_ECR_REP} --region ${AWS_REGION}
	fi
	
	# sign in to AWS
	aws ecr get-login-password | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}".dkr.ecr."${AWS_REGION}".amazonaws.com

	# tag the image
	docker tag ${APP}:${APPTAG} "${AWS_ACCOUNT_ID}".dkr.ecr."${AWS_REGION}".amazonaws.com/"${AWS_ECR_REP}":latest

	# push the image to ECR
	docker push "${AWS_ACCOUNT_ID}".dkr.ecr."${AWS_REGION}".amazonaws.com/"${AWS_ECR_REP}":latest

	# clean the image
	docker rmi "${AWS_ACCOUNT_ID}".dkr.ecr."${AWS_REGION}".amazonaws.com/"${AWS_ECR_REP}":latest
}


# -------
# make for CodeCommit
# -------
function makeForCodeCommit() {
	SRC="src.codecommit"
	if [ ! -d ${SRC} ]; then
		mkdir ${SRC}
	fi

	rm -Rf ${SRC}/src

	# redme
	cp  ReadMe-CodeCommit.md ${SRC}/ReadMe.md

	# sources
	cp Dockerfile ${SRC}/
	cp package.json ${SRC}/
	cp -pR src ${SRC}/

	# aws codebuild
	cp -pR buildspec.yml ${SRC}/

	echo "make [${SRC}]"
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

elif [ "${1}" = "ecr" ]; then
	ecr

elif [ "${1}" = "make" ]; then
	makeForCodeCommit

else
	stop
	echo -e "\033[0;34m[${APP}] init\033[0;39m"

	start "${2}"
fi
