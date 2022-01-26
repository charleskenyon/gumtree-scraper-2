#!/bin/bash

STACK_NAME="GumtreeScraperStack"
REGION=$(aws configure get region)
ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
QUEUE_URL=$(aws sqs get-queue-url --queue-name gumtree-scraper-queue --query 'QueueUrl' --output text)
LAMBDA_S3_BUCKET=crk-lambda-functions

if [ -z "${REPO_NAME}" ]; then
    REPO_NAME="$( pwd | sed -e 's/^.*\///' )"
fi

post_and_exit() {
    echo "${1}"
    exit 1
}

npm run test || post_and_exit "tests failed"

echo "uploading lambda zips to s3..."

npm run build:lambda

for LAMBDA_DIR in opt db-iterator-lambda query-scraper-lambda email-notification-lambda; do
    echo $LAMBDA_DIR

    if [ $LAMBDA_DIR = "opt" ]; then
        cp "src/$LAMBDA_DIR/nodejs/package.json" "dist/$LAMBDA_DIR/nodejs"
        cp "src/$LAMBDA_DIR/nodejs/package-lock.json" "dist/$LAMBDA_DIR/nodejs"
        cd "dist/$LAMBDA_DIR/nodejs"
        npm i
        cd ../
    elif [ $LAMBDA_DIR = "email-notification-lambda" ]; then
        cd "dist/$LAMBDA_DIR"
    else
        cp "src/$LAMBDA_DIR/package.json" "dist/$LAMBDA_DIR"
        cp "src/$LAMBDA_DIR/package-lock.json" "dist/$LAMBDA_DIR"
        cd "dist/$LAMBDA_DIR"
        npm i
    fi

    rm *.zip
    FOLDER_MD5_HASH=$(find . -type f -exec md5sum {} + | LC_ALL=C sort | md5sum | awk '{ print substr( $0, 1, length($0)-3 ) }')
    S3_KEY="$REPO_NAME/$LAMBDA_DIR/$FOLDER_MD5_HASH.zip"
    zip -r $LAMBDA_DIR.zip *
    aws s3 cp --region $REGION "$LAMBDA_DIR.zip" "s3://$LAMBDA_S3_BUCKET/$S3_KEY"

    if [ $LAMBDA_DIR = "db-iterator-lambda" ]; then
        DB_ITERATOR_LAMBDA_S3_KEY=$S3_KEY
    elif [ $LAMBDA_DIR = "query-scraper-lambda" ]; then
        QUERY_SCRAPER_LAMBDA_S3_KEY=$S3_KEY
    elif [ $LAMBDA_DIR = "email-notification-lambda" ]; then
        EMAIL_NOTIFICATION_LAMBDA_S3_KEY=$S3_KEY
    elif [ $LAMBDA_DIR = "opt" ]; then
        OPT_S3_KEY=$S3_KEY
    fi

    cd ../../
done

echo "generating cloudformation template..."

npx cdk synth \
    --toolkit-stack-name=$STACK_NAME \
    --context stackName=$STACK_NAME \
    --context region=$REGION \
    --context accountId=$ACCOUNT_ID \
    --context lambdaS3Bucket=$LAMBDA_S3_BUCKET \
    --context optS3Key=$OPT_S3_KEY \
    --context dbIteratorLambdaS3Key=$DB_ITERATOR_LAMBDA_S3_KEY \
    --context queryScraperLambdaS3Key=$QUERY_SCRAPER_LAMBDA_S3_KEY \
    --context emailNotificationLambdaS3Key=$EMAIL_NOTIFICATION_LAMBDA_S3_KEY \
    --context queueUrl=$QUEUE_URL \
    --quiet || post_and_exit "cdk synth failed"

echo "checking cloudformation template..."

CLOUDFORMATION_TEMPLATE="cdk.out/$STACK_NAME.template.json"

checkov --file $CLOUDFORMATION_TEMPLATE --skip-check "CKV_AWS_27,CKV_AWS_28,CKV_AWS_116,CKV_AWS_119,CKV_AWS_173" || post_and_exit "checkov validation failed"

echo "starting cloudformation deployment..."

npx cdk deploy \
    --context stackName=$STACK_NAME \
    --context region=$REGION \
    --context accountId=$ACCOUNT_ID \
    --context lambdaS3Bucket=$LAMBDA_S3_BUCKET \
    --context optS3Key=$OPT_S3_KEY \
    --context dbIteratorLambdaS3Key=$DB_ITERATOR_LAMBDA_S3_KEY \
    --context queryScraperLambdaS3Key=$QUERY_SCRAPER_LAMBDA_S3_KEY \
    --context emailNotificationLambdaS3Key=$EMAIL_NOTIFICATION_LAMBDA_S3_KEY \
    --context queueUrl=$QUEUE_URL || post_and_exit "cdk build failed"
