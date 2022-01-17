#!/bin/bash

STACK_NAME="GumtreeScraperStack"
REGION=$(aws configure get region)
ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
LAMBDA_S3_BUCKET=crk-lambda-functions

if [ -z "${REPO_NAME}" ]; then
    REPO_NAME="$( pwd | sed -e 's/^.*\///' )"
fi

post_and_exit() {
    echo "${1}"
    exit 1
}

echo "uploading lambda zips to s3..."

npm run build:lambda

for LAMBDA_DIR in opt db-iterator-lambda; do
    echo $LAMBDA_DIR
    cp "src/$LAMBDA_DIR/package.json" "dist/$LAMBDA_DIR"
    cp "src/$LAMBDA_DIR/package-lock.json" "dist/$LAMBDA_DIR"
    cd "dist/$LAMBDA_DIR"
    npm i
    rm *.zip
    FOLDER_MD5_HASH=$(find . -type f -exec md5sum {} + | LC_ALL=C sort | md5sum)
    S3_KEY="$REPO_NAME/$LAMBDA_DIR/${FOLDER_MD5_HASH::-3}.zip"
    zip -r $LAMBDA_DIR.zip *
    aws s3 cp --region $REGION "$LAMBDA_DIR.zip" "s3://$LAMBDA_S3_BUCKET/$S3_KEY"

    if [ $LAMBDA_DIR = "db-iterator-lambda" ]; then
        DB_ITERATOR_LAMBDA_S3_KEY=$S3_KEY
    elif [ $LAMBDA_DIR = "opt" ]; then
        OPT_S3_KEY="${S3_KEY}"
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
    --quiet || post_and_exit "cdk synth failed"

echo "checking cloudformation template..."

CLOUDFORMATION_TEMPLATE="cdk.out/$STACK_NAME.template.json"

checkov --file $CLOUDFORMATION_TEMPLATE --skip-check "CKV_AWS_28,CKV_AWS_116,CKV_AWS_119" || post_and_exit "checkov validation failed"

echo "starting cloudformation deployment..."

npx cdk deploy \
    --context stackName=$STACK_NAME \
    --context region=$REGION \
    --context accountId=$ACCOUNT_ID \
    --context lambdaS3Bucket=$LAMBDA_S3_BUCKET \
    --context optS3Key=$OPT_S3_KEY \
    --context dbIteratorLambdaS3Key=$DB_ITERATOR_LAMBDA_S3_KEY || post_and_exit "cdk build failed"
