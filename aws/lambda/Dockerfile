FROM public.ecr.aws/lambda/nodejs:18

COPY src/maps.js src/app.js package.json  ${LAMBDA_TASK_ROOT}/

RUN npm install

CMD [ "app.handler" ]