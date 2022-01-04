FOLDER_NAME="${1}"

if [ -z ${FOLDER_NAME} ]; then
    echo "Please specify lambda folder name"
    exit 1
fi

npm run build:lambda

docker run --rm \
-v "$PWD/dist/$FOLDER_NAME":/var/task:ro,delegated \
lambci/lambda:nodejs12.x \
index.handler '{}'

rm -rf dist