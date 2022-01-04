#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GumtreeScraperStack } from '../lib/gumtree-scraper-stack';

const app = new cdk.App();

const stackName = app.node.tryGetContext('stackName');
const region = app.node.tryGetContext('region');
const accountId = app.node.tryGetContext('accountId');

new GumtreeScraperStack(app, stackName, {
  env: {
    account: accountId,
    region,
  },
});
