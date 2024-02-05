ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)
QUEUE_URL=$(aws sqs get-queue-url --queue-name gumtree-scraper-queue --query 'QueueUrl' --output text)
FOLDER_NAME=$1

if [ -z $FOLDER_NAME ]; then
    echo "Please specify lambda folder name"
    exit 1
fi

if [ $FOLDER_NAME = "db-iterator-lambda" ]; then
    EVENT="{}"
elif [ $FOLDER_NAME = "query-scraper-lambda" ]; then
    EVENT="{\"Records\":[{\"body\":\"{\\\"category\\\":\\\"\\\",\\\"location\\\":\\\"\\\",\\\"query\\\":\\\"digitone\\\",\\\"emails\\\":[\\\"rory.kenyon01@gmail.com\\\"]}\"}]}"
elif [ $FOLDER_NAME = "email-notification-lambda" ]; then
    EVENT="{\"Records\":[{\"eventName\":\"INSERT\",\"dynamodb\":{\"NewImage\":{\"location\":{\"S\":\"London\"},\"price\":{\"S\":\"£1,350pm\"},\"title\":{\"S\":\"flat\"},\"link\":{\"S\":\"https://www.gumtree.com/p/property-to-rent\"},\"emails\":{\"L\":[{\"S\":\"rory.kenyon01@gmail.com\"}]}}}}]}"
fi

echo "${EVENT}"

npm run build:lambda

docker run --rm \
-v "$PWD/dist/$FOLDER_NAME":/var/task:ro,delegated \
-v "$PWD/src/$FOLDER_NAME/node_modules":/node_modules \
-v "$PWD/dist/opt":/opt:ro,delegated \
-e AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID \
-e AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY \
-e QUEUE_URL=$QUEUE_URL \
lambci/lambda:nodejs12.x \
index.handler $EVENT
