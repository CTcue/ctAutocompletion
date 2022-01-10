FROM node:17-alpine

LABEL maintainer="Bernd van der Veen <bernd@ctcue.com>"

USER root

# Install all dependencies
RUN apk update && apk add tzdata

# Timezone configuration
#  - Set the correct timezone based on the TZ environment option
#    https://serverfault.com/a/683651/132191
# Node ENV will default to development, just to be sure force it.
ENV NODE_ENV=production TZ=Europe/Amsterdam

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apk del tzdata

# App
RUN mkdir -p /app/node_modules && chown -R node:node /app

USER node
WORKDIR /app

# Copy package.json for dependencies
COPY --chown=node:node package.json .

RUN yarn install

# Copy all
COPY --chown=node:node . .

# Setup runtime env
EXPOSE 4060

CMD ["node", "app.js"]
