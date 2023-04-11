FROM public.ecr.aws/lambda/nodejs:18

COPY src/maps.js src/app.js package.json  ${LAMBDA_TASK_ROOT}/

# Lambda Insights & npm install
RUN curl -O https://lambda-insights-extension.s3-ap-northeast-1.amazonaws.com/amazon_linux/lambda-insights-extension.rpm && \
    rpm -U lambda-insights-extension.rpm && \
    rm -f lambda-insights-extension.rpm && \
    npm install

CMD [ "app.handler" ]