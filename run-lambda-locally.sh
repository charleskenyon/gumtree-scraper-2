ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)
FOLDER_NAME=$1

if [ -z ${FOLDER_NAME} ]; then
    echo "Please specify lambda folder name"
    exit 1
fi

npm run build:lambda

docker run --rm \
-v "$PWD/dist/$FOLDER_NAME":/var/task:ro,delegated \
-e AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID \
-e AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY \
lambci/lambda:nodejs12.x \
index.handler '{}'

rm -rf dist