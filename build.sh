#!/bin/bash

post_and_exit() {
    echo "${1}"
    exit 1
}

# npm run test || post_and_exit "tests failed"
