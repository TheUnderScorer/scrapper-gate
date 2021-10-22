#!/usr/bin/env bash

echo "Starting Xvfb"
Xvfb :99 -ac &
sleep 5

export DISPLAY=:99
echo "Executing command $@"

exec "$@"
