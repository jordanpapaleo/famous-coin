'use strict';

var FamousPlatform  = require('famous');
var Compositor      = FamousPlatform.renderers.Compositor;
var ThreadManager   = FamousPlatform.renderers.ThreadManager;
var Engine          = FamousPlatform.engine;
var Context         = FamousPlatform.core.Context;
var HTMLElement     = FamousPlatform.domRenderables.HTMLElement;
var Famous          = FamousPlatform.core.Famous;
FamousPlatform.stylesheets;

var compositor      = new Compositor();
var threadmanager   = new ThreadManager(Famous, compositor);
var engine          = new Engine();
engine.update(threadmanager);

require('./app/index');
