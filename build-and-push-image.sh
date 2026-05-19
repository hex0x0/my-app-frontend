#!/bin/bash

export https_proxy=http://127.0.0.1:8889

docker stop my-app-frontend

docker rm my-app-frontend

docker build --network=host -t hex0x0/my-app-frontend .

docker rmi $(docker images -qa -f 'dangling=true')

docker push hex0x0/my-app-frontend
