### Workflow

**Note**: [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-core) is required to implement micro-frontends in your application, [@nuz/cli](#) and [@nuz/registry](#) just is some packages to support build, config and host the modules in the application. 

#### Description

[@nuz/core](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-core) will read config received on bootstrap to transform, download and prepare modules to resolve while your application working.

#### How it define and resolve modules?

Workflow of nuz or the way of [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-core) using to resolve a module:

**1**. Reading bootstrap config and determining the necessary information.
**2**. Preload resource if module includes preload config.
**3**. When the module called to resolve, [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-core) will check in caches if resource was prepared before will return cache, if not it will download resource.
**4**. Handle to resolve module. For style resources, [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-core) will inject to head as `link` tag. For script resources, [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-core) will create a context to execute it and pick the module exported to return on resolve.

**Note**:

* On the initial event of application, [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-core) only downloads externals resource and preload modules defined in config.
* Externals will execute after resource downloaded.
* Preload modules is an action to injecting `link` tag to head let the browser know the resource of the module to download first but not execute it.

#### How is a valid module?

A module valid must built as **UMD** format, should be export with a library name. You can use [Rollup](https://github.com/rollup/rollup) or [Webpack](https://github.com/webpack/webpack) to bundle module but I recommend using [@nuz/cli](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-cli) to do it. [@nuz/cli](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-cli) will optimize performance, minify code size and support splitting-code.

#### What is a module resource?

**Module** is alias name of **inside module**. It is a javascript file and one, more or maybe not have style files.
