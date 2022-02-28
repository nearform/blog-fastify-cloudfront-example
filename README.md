# Cache with AWS CloudFront and fastify <!-- omit in toc -->

- [Getting started](#getting-started)
  - [Requirements](#requirements)
    - [Install node.js](#install-nodejs)
    - [Install AWS CDK](#install-aws-cdk)
  - [Create the CDK project](#create-the-cdk-project)
  - [Create the service](#create-the-service)
  - [Deploy](#deploy)
    - [Notes](#notes)

## Getting started

### Requirements

- node.js
- AWS CDK

#### Install node.js

see https://nodejs.org/en/download/

#### Install AWS CDK

```bash
mkdir /.aws

cat <<EOT > ~/.aws/credentials
[default]
aws_access_key_id = AK...
aws_secret_access_key = abc...
EOT

cat <<EOT > ~/.aws/config
[default]
region = eu-west-2
EOT

npm install -g aws-cdk
cdk bootstrap aws://123.../eu-west-2
```

see https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html

### Create the CDK project

```bash
mkdir /path/to/project/cdk && cd /path/to/project/cdk
cdk init app --language javascript
```

it will create the content of `/cdk` dir

**edit `cdk/lib/cdk-stack.js`**

see https://docs.aws.amazon.com/cdk/latest/guide/hello_world.html

### Create the service

```bash
cd /path/to/project/app
npm i
npm start
```

**edit `cdk/lib/cdk-stack.js`**

### Deploy

Deploy CloudFront configuration using

```bash
SERVICE_HOST=eaf2-188-95-144-239.ngrok.io cdk deploy
```

in `cdk` folder.

For educational purpose only, the service runs locally and it's publicly exposed with `ngrok`.

#### Notes

Can't script CloudFront clear cache after deploy, so run

```bash
aws cloudfront create-invalidation --distribution-id E37... --paths "/*"
```
