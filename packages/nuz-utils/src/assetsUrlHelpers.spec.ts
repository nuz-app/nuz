import * as assetsUrlHelpers from './assetsUrlHelpers'

describe('parse', () => {
  it('Export is function', () => {
    expect(assetsUrlHelpers.parse).toBeInstanceOf(Function)
  })

  describe('Parse valid info', () => {
    const pathnames = [
      [
        '/module/-/0.0.0/other.js',
        {
          moduleId: 'module',
          version: '0.0.0',
          file: 'other.js',
        },
      ],
      [
        '/module/-/0.0.0/other.js.map',
        {
          moduleId: 'module',
          version: '0.0.0',
          file: 'other.js.map',
        },
      ],
      [
        '/module/-/0.0.0/styles/other.css',
        {
          moduleId: 'module',
          version: '0.0.0',
          file: 'styles/other.css',
        },
      ],
      [
        '/module/-/0.0.0/styles/other.css.map',
        {
          moduleId: 'module',
          version: '0.0.0',
          file: 'styles/other.css.map',
        },
      ],
      [
        '/module/-/0.0.0/images/other.jpg',
        {
          moduleId: 'module',
          version: '0.0.0',
          file: 'images/other.jpg',
        },
      ],
      [
        '/module/-/0.0.0/images/other',
        {
          moduleId: 'module',
          version: '0.0.0',
          file: 'images/other',
        },
      ],
      [
        '/@scope/module/-/0.0.0/other.js',
        {
          moduleId: '@scope/module',
          version: '0.0.0',
          file: 'other.js',
        },
      ],
      [
        '/@scope/module/-/0.0.0/other.js.map',
        {
          moduleId: '@scope/module',
          version: '0.0.0',
          file: 'other.js.map',
        },
      ],
      [
        '/@scope/module/-/0.0.0/styles/other.css',
        {
          moduleId: '@scope/module',
          version: '0.0.0',
          file: 'styles/other.css',
        },
      ],
      [
        '/@scope/module/-/0.0.0/styles/other.css.map',
        {
          moduleId: '@scope/module',
          version: '0.0.0',
          file: 'styles/other.css.map',
        },
      ],
      [
        '/@scope/module/-/0.0.0/images/other.jpg',
        {
          moduleId: '@scope/module',
          version: '0.0.0',
          file: 'images/other.jpg',
        },
      ],
      [
        '/@scope/module/-/0.0.0/images/other',
        {
          moduleId: '@scope/module',
          version: '0.0.0',
          file: 'images/other',
        },
      ],
    ]

    it.each(pathnames)('Pathname `%s`', (pathname, expected) => {
      expect(assetsUrlHelpers.parse(pathname as string)).toMatchObject(expected)
    })
  })

  describe('Fails', () => {
    it('Throw if invalid pathname', () => {
      expect(() => assetsUrlHelpers.parse('/')).toThrowErrorMatchingSnapshot()
    })

    it('Throw if invalid version', () => {
      expect(() =>
        assetsUrlHelpers.parse('/module/-/0-0/images/other.js'),
      ).toThrowErrorMatchingSnapshot()

      expect(() =>
        assetsUrlHelpers.parse('/module/-/../images/other.js'),
      ).toThrowErrorMatchingSnapshot()
    })

    it('Throw if invalid module id', () => {
      expect(() =>
        assetsUrlHelpers.parse('/@/-/0.0.0/other.js'),
      ).toThrowErrorMatchingSnapshot()

      expect(() =>
        assetsUrlHelpers.parse('/0.0.0/-/0.0.0/other.js'),
      ).toThrowErrorMatchingSnapshot()
    })
  })
})

describe('create', () => {
  it('Export is function', () => {
    expect(assetsUrlHelpers.create).toBeInstanceOf(Function)
  })

  const origin = 'https://static.nuz.app'

  describe('Generate valid', () => {
    const params = [
      [['module', '0.0.0', 'other.js'], `${origin}/module/-/0.0.0/other.js`],
      [
        ['module', '0.0.0', 'other.js.map'],
        `${origin}/module/-/0.0.0/other.js.map`,
      ],
      [
        ['module', '0.0.0', 'styles/other.css'],
        `${origin}/module/-/0.0.0/styles/other.css`,
      ],
      [
        ['module', '0.0.0', 'styles/other.css.map'],
        `${origin}/module/-/0.0.0/styles/other.css.map`,
      ],
      [
        ['module', '0.0.0', 'images/other.jpg'],
        `${origin}/module/-/0.0.0/images/other.jpg`,
      ],
      [
        ['module', '0.0.0', 'images/other'],
        `${origin}/module/-/0.0.0/images/other`,
      ],
      [
        ['@scope/module', '0.0.0', 'other.js'],
        `${origin}/@scope/module/-/0.0.0/other.js`,
      ],
      [
        ['@scope/module', '0.0.0', 'other.js.map'],
        `${origin}/@scope/module/-/0.0.0/other.js.map`,
      ],
      [
        ['@scope/module', '0.0.0', 'styles/other.css'],
        `${origin}/@scope/module/-/0.0.0/styles/other.css`,
      ],
      [
        ['@scope/module', '0.0.0', 'styles/other.css.map'],
        `${origin}/@scope/module/-/0.0.0/styles/other.css.map`,
      ],
      [
        ['@scope/module', '0.0.0', 'images/other.jpg'],
        `${origin}/@scope/module/-/0.0.0/images/other.jpg`,
      ],
      [
        ['@scope/module', '0.0.0', 'images/other'],
        `${origin}/@scope/module/-/0.0.0/images/other`,
      ],
    ]

    it.each(params)('Params %j', (args, expected) => {
      // @ts-ignore
      expect(assetsUrlHelpers.create(...args, origin)).toEqual(expected)
    })
  })

  describe('Fails', () => {
    it('Throw if invalid version', () => {
      expect(() =>
        assetsUrlHelpers.create('module', '0-0', 'filename', origin),
      ).toThrowErrorMatchingSnapshot()

      expect(() =>
        assetsUrlHelpers.create('module', '..', 'filename', origin),
      ).toThrowErrorMatchingSnapshot()
    })

    it('Throw if invalid module id', () => {
      expect(() =>
        assetsUrlHelpers.create('@', '0.0.0', 'filename', origin),
      ).toThrowErrorMatchingSnapshot()

      expect(() =>
        assetsUrlHelpers.create('0.0.0', '0.0.0', 'filename', origin),
      ).toThrowErrorMatchingSnapshot()
    })
  })
})

describe('createOrigin', () => {
  it('Export is function', () => {
    expect(assetsUrlHelpers.createOrigin).toBeInstanceOf(Function)
  })

  const origin = 'https://static.nuz.app'

  describe('Generate valid', () => {
    const params = [
      [['module', '0.0.0', origin], `${origin}/module/-/0.0.0/`],
      [['module', '0.0.0', origin + '/'], `${origin}/module/-/0.0.0/`],
      [['@scope/module', '0.0.0', origin], `${origin}/@scope/module/-/0.0.0/`],
      [
        ['@scope/module', '0.0.0', origin + '/'],
        `${origin}/@scope/module/-/0.0.0/`,
      ],
    ]

    it.each(params)('Params %j', (args, expected) => {
      // @ts-ignore
      expect(assetsUrlHelpers.createOrigin(...args)).toEqual(expected)
    })
  })

  describe('Fails', () => {
    it('Throw if invalid version', () => {
      expect(() =>
        assetsUrlHelpers.createOrigin('module', '0-0', origin),
      ).toThrowErrorMatchingSnapshot()

      expect(() =>
        assetsUrlHelpers.createOrigin('module', '..', origin),
      ).toThrowErrorMatchingSnapshot()
    })

    it('Throw if invalid module id', () => {
      expect(() =>
        assetsUrlHelpers.createOrigin('@', '0.0.0', origin),
      ).toThrowErrorMatchingSnapshot()

      expect(() =>
        assetsUrlHelpers.createOrigin('0.0.0', '0.0.0', origin),
      ).toThrowErrorMatchingSnapshot()
    })
  })
})
