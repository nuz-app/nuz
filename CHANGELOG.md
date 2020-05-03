# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-beta.2](https://github.com/lamhieu-vk/nuz/compare/v0.2.4...v1.0.0-beta.2) (2020-05-03)


### Bug Fixes

* **nuz-cli:** fix spelling `whoami` ([91bde80](https://github.com/lamhieu-vk/nuz/commit/91bde80b1f285e9b8232d78b294a3c7d9ef12416))
* **nuz-registry:** invalid import paths ([bfdb216](https://github.com/lamhieu-vk/nuz/commit/bfdb21606d8cc08485660a142e9da6e4a3dc86cd))
* **nuz-registry:** invalid scope id regexp ([cc9a183](https://github.com/lamhieu-vk/nuz/commit/cc9a183fd5780d21ebfb42ea7fa5b956c0474715))
* **nuz-registry:** update result after deleted item ([0805d2d](https://github.com/lamhieu-vk/nuz/commit/0805d2d6b5ee6550cfa4e7da63327aba46935a9a))
* **nuz-registry:** update result of list collaborators ([dde9e90](https://github.com/lamhieu-vk/nuz/commit/dde9e90389bde66002d28b4a52c7a3fb9d4490b5))
* **nuz-registry:** validate is invalid on deprecate module route ([64e91c6](https://github.com/lamhieu-vk/nuz/commit/64e91c6a7551dbe0d510b29fe01c68c902af616d))
* common issues, use params instead of data for get apis ([6313a47](https://github.com/lamhieu-vk/nuz/commit/6313a4765b1808e708bf5e50738240a060b2581e))
* lint of code ([151328c](https://github.com/lamhieu-vk/nuz/commit/151328c5a1bffd39463cfb18231e45f192b52ef8))
* lint of code ([b185441](https://github.com/lamhieu-vk/nuz/commit/b185441922e94f082e028cc94d78b4b24f392200))


### Features

* **nuz-cli:** add create, delete scope and composition commands ([3b021e3](https://github.com/lamhieu-vk/nuz/commit/3b021e384cb1184876d4192c58a9ba16b7ba511e))
* **nuz-cli:** add login commands and alias user commands ([a1b3748](https://github.com/lamhieu-vk/nuz/commit/a1b37489a382f77eeca66ee71f1cfbfd0b8479de))
* **nuz-cli:** add whoiam to user command ([68dafad](https://github.com/lamhieu-vk/nuz/commit/68dafad81a50aa6a4bf6edcb4f888b1f15156056))
* **nuz-cli:** allow logout other user ([fa11089](https://github.com/lamhieu-vk/nuz/commit/fa11089e3401a61ef1d2122dcfb4df583d04b96b))
* **nuz-cli:** implement collaborator operations for composition command ([6704b9e](https://github.com/lamhieu-vk/nuz/commit/6704b9e37ae10621d7d0ffcd191d95b58762f244))
* **nuz-cli:** implement collaborator operations for module command ([afdd6fd](https://github.com/lamhieu-vk/nuz/commit/afdd6fd60733536d956098984c9f6f4fdd3c2d11))
* **nuz-cli:** implement collaborator operations for scope command ([14c0426](https://github.com/lamhieu-vk/nuz/commit/14c04267abad2ebc9517d1adf8170fe9ad980ac2))
* **nuz-cli:** implement create and delete token for user commands ([b07a60f](https://github.com/lamhieu-vk/nuz/commit/b07a60f06425774ff73281e1951296bfae38563a))
* **nuz-cli:** implement deprecate for a module ([ce88fad](https://github.com/lamhieu-vk/nuz/commit/ce88fad66f43db292b3c07832908878f5a64b549))
* **nuz-cli:** implement list for user commands ([6501b77](https://github.com/lamhieu-vk/nuz/commit/6501b774c4eb331e470a27aafb56edb925bde0d2))
* **nuz-cli:** implement logout feature ([478f17c](https://github.com/lamhieu-vk/nuz/commit/478f17cbbbaaac2c276a6d761412cc1115172da7))
* **nuz-cli:** implement my list for user command ([06d1478](https://github.com/lamhieu-vk/nuz/commit/06d1478bcbb5d73b48cda1a703474c5b1f434349))
* **nuz-cli:** implement register for user commands ([fb7613d](https://github.com/lamhieu-vk/nuz/commit/fb7613d98b387e3585057f451a3e801d3755c5c5))
* **nuz-cli:** implement set and remove modules for composition commands ([e920903](https://github.com/lamhieu-vk/nuz/commit/e92090373744475e84b2bbb0ae5fad7f86292c07))
* **nuz-cli:** implement use for user command ([2e12db1](https://github.com/lamhieu-vk/nuz/commit/2e12db1e51b5deffcaf49b740f38ee3e19e1ab84))
* **nuz-cli:** store logged date of user in auth file ([5bc097e](https://github.com/lamhieu-vk/nuz/commit/5bc097ed01811fbfefff7490e788954ad80e65c1))
* **nuz-registry:** add `add/remove` collaborator for module ([c14f3e3](https://github.com/lamhieu-vk/nuz/commit/c14f3e35f55f4b1fc004eb2d2722dc203c1b4bea))
* **nuz-registry:** add basic operations for scope ([34137bb](https://github.com/lamhieu-vk/nuz/commit/34137bb24f3f2194674fec56fc48ef37dd13f785))
* **nuz-registry:** add collaborators list for some commands ([bafd188](https://github.com/lamhieu-vk/nuz/commit/bafd18807c47aab11f6dcf7c160a9a49cefad23e))
* **nuz-registry:** add create and delete operations for composition ([ec1df22](https://github.com/lamhieu-vk/nuz/commit/ec1df22114c309ee7d4d900196c6d04031df96b8))
* **nuz-registry:** add publish operation for module ([701a19b](https://github.com/lamhieu-vk/nuz/commit/701a19b55cd56e7597460e5e17548bcc75cfba72))
* **nuz-registry:** add set deprecate for the module ([4fc5959](https://github.com/lamhieu-vk/nuz/commit/4fc5959b4c33cf6e70c6e84f60be1e8623a33538))
* **nuz-registry:** added `add/remove` modules for the composition ([29c19a3](https://github.com/lamhieu-vk/nuz/commit/29c19a39e5aa09c70b92d1724fdeb6135b3a7bc0))
* **nuz-registry:** allow update collaborator for services ([766cc97](https://github.com/lamhieu-vk/nuz/commit/766cc97706f665c7c329dbcd20a3026f20cb304f))
* **nuz-registry:** check exists collaborator before add ([1f50254](https://github.com/lamhieu-vk/nuz/commit/1f50254f6a4e13bb5c1493bb5c1b821aee960706))
* **nuz-registry:** get all compositions, modules and scopes of user ([bda616e](https://github.com/lamhieu-vk/nuz/commit/bda616e168e99636718363dd9a9c4572b2dd9efa))
* **nuz-registry:** implement delete scope based on policy ([45a2994](https://github.com/lamhieu-vk/nuz/commit/45a29942da26a4869d97990723893aef24734c17))
* **nuz-registry:** implement login user ([befd8ff](https://github.com/lamhieu-vk/nuz/commit/befd8ff60ddcdebe433f4ca0007487d7d9645e18))
* **nuz-registry:** implement to get collaborators ([398ac8b](https://github.com/lamhieu-vk/nuz/commit/398ac8bd343bba2eb1161965b06707cde904503b))
* **nuz-registry:** implements user service and worker ([47e85ab](https://github.com/lamhieu-vk/nuz/commit/47e85ab725049a2f13b7c804103dcc81160b9481))
* done serve and publish commands ([2eabb86](https://github.com/lamhieu-vk/nuz/commit/2eabb860e0f0d6f72d825b255c72bd2abdd65f82))
* implement fetch for registry and use with core ([31b8e6d](https://github.com/lamhieu-vk/nuz/commit/31b8e6dce41ffbc3d79cd061491d597000454bff))
* initial document website ([9da1779](https://github.com/lamhieu-vk/nuz/commit/9da1779f16fe80cdef59d077cf736fe0d5a95b36))
* **nuz-registry:** reused collaborator operations for service ([991a414](https://github.com/lamhieu-vk/nuz/commit/991a414b5e00c648fc9dbda62658be1441b9532b))
* **nuz-registry:** update `modules` of `composition` model ([2572780](https://github.com/lamhieu-vk/nuz/commit/2572780bf5980c03ae0fefdeeff81ac610fcaef8))
* **nuz-registry:** use authorization in headers to sent access token ([1f87bfa](https://github.com/lamhieu-vk/nuz/commit/1f87bfad224b7ae92c715d63665eb12e5b380fd0))
* **nuz-registry:** use cache for worker ([61a9ff1](https://github.com/lamhieu-vk/nuz/commit/61a9ff1cbbd32d94c77a5de446aa1f4c3af7738a))
