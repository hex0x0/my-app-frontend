#!/bin/bash

docker stop my-app-frontend

docker rm my-app-frontend

docker build --network=host -t hex0x0/my-app-frontend .

docker rmi $(docker images -qa -f 'dangling=true')

docker push hex0x0/my-app-frontend
