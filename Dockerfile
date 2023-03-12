# Installing dependencies:
 
FROM node:16-alpine AS install-dependencies
ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /user/src/app
 
COPY package.json package-lock.json ./
 
RUN npm ci --omit=dev
 
COPY . .
 
 
# Creating a build:
 
FROM node:16-alpine AS create-build
ENV NODE_OPTIONS=--max-old-space-size=4096
 
WORKDIR /user/src/app
 
COPY --from=install-dependencies /user/src/app ./
 
RUN npm run build
 
USER node
 
 
# Running the application:
 
FROM node:16-alpine AS run
ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /user/src/app
 
COPY --from=install-dependencies /user/src/app/node_modules ./node_modules
COPY --from=create-build /user/src/app/dist ./dist
COPY package.json ./
 
CMD ["npm", "run", "start:prod"]

# FROM node:16-alpine

# ENV NODE_OPTIONS=--max-old-space-size=4096

# WORKDIR /user/src/app
 
# COPY . .
 
# RUN npm ci --omit=dev

# RUN npm run build
 
# USER node
 
# CMD ["npm", "run", "start:prod"]
