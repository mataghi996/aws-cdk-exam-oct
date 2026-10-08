#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsCdkExamOctStack } from '../lib/aws-cdk-exam-oct-stack';

const app = new cdk.App();

new AwsCdkExamOctStack(app, 'AwsCdkExamOctStack', {
  env: {
    region: 'ca-central-1'
  }
});