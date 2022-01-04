#!/bin/bash

STACK_NAME="GumtreeScraperStack"
REGION=$(aws configure get region)
ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)

post_and_exit() {
    echo "${1}"
    exit 1
}

echo "generating cloudformation template..."

npx cdk synth \
    --toolkit-stack-name=$STACK_NAME \
    --context stackName=$STACK_NAME \
    --context region=$REGION \
    --context accountId=$ACCOUNT_ID --quiet || post_and_exit "cdk synth failed"

echo "checking cloudformation template..."

CLOUDFORMATION_TEMPLATE="cdk.out/$STACK_NAME.template.json"

checkov --file $CLOUDFORMATION_TEMPLATE || post_and_exit "checkov validation failed"

echo "starting cloudformation deployment..."

npx cdk deploy \
    --context stackName=$STACK_NAME \
    --context region=$REGION \
    --context accountId=$ACCOUNT_ID || post_and_exit "cdk build failed"
