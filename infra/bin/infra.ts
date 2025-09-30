#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { WebStack } from "../lib/stack/web-stack";

const app = new cdk.App();
new WebStack(app, "WebStack", {});
