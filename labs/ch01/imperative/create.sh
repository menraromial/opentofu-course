#!/usr/bin/env bash
# Imperative version: each line is an order given to Docker, run in this order.
set -euo pipefail

docker network create ch01-net
docker run -d --name ch01-web --network ch01-net -p 8081:80 nginx:1.29-alpine
