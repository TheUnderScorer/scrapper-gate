#!/usr/bin/env sh
case "$1" in
    'api')
        NODE_ENV=production node /app/src/app/server/build/src/app/server/src/index.js
    ;;
    *)
    exec "$@"
esac

exit 0
