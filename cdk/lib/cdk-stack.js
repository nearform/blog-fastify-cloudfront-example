'use strict'

const cdk = require('aws-cdk-lib')
const cloudfront = require('aws-cdk-lib/aws-cloudfront')
const origins = require('aws-cdk-lib/aws-cloudfront-origins')

// note: no http/s in the host
const SERVICE_HOST = process.env.SERVICE_HOST || 'eaf2-188-95-144-239.ngrok.io'

class CdkStack extends cdk.Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // see https://docs.aws.amazon.com/cdk/api/latest/docs/aws-cloudfront-readme.html

    // The code that defines your stack goes here

    const cachePolicyPrivateDynamic = new cloudfront.CachePolicy(this, 'private-dynamic-content', {
      cachePolicyName: 'private-dynamic-content',
      defaultTtl: cdk.Duration.seconds(0),
      minTtl: cdk.Duration.seconds(0),
      maxTtl: cdk.Duration.days(1),
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Authorization'),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true
    })

    const originRequestPolicy = new cloudfront.OriginRequestPolicy(this, 'forward-all', {
      originRequestPolicyName: 'forward-all',
      headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList(
        'CloudFront-Is-Mobile-Viewer',
        'CloudFront-Viewer-Country',
        'CloudFront-Viewer-City',
        'CloudFront-Viewer-Latitude',
        'CloudFront-Viewer-Longitude'
      ),
      cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
      queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all()
    })

    new cloudfront.Distribution(this, 'example', {
      defaultBehavior: {
        origin: new origins.HttpOrigin(SERVICE_HOST),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
        cachePolicy: cachePolicyPrivateDynamic,
        originRequestPolicy: originRequestPolicy
      }
    })
  }
}

module.exports = { CdkStack }
