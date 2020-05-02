import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './styles.module.css';

const missions = [
  {
    title: <>Develop</>,
    description: (
      <>
        Developing a modern web application becomes easier and faster by sharing modules together, keeping them up to date without having to rebuild the application.
      </>
    ),
  },
  {
    title: <>Maintain</>,
    description: (
      <>
        Easy to maintain, when you need to upgrade a library or a new component, you only need to specify a few commands to configure and everything is updated immediately.
      </>
    ),
  },
  {
    title: <>Operate</>,
    description: (
      <>
        The use of runtime modules makes it easier to manage and control the quality. When a problem occurs, the system automatically switches to using the fallback version of itself.
      </>
    ),
  },
];

const packages = [
  {
    title: <>@nuz/core</>,
    description: (
      <>
        Core to manage and handles resolve runtime packages in the application.
      </>
    ),
  },
  {
    title: <>@nuz/cli</>,
    description: (
      <>
        The command-line interfaces to manage modules and interact with the registry server.
      </>
    ),
  },
  {
    title: <>@nuz/registry</>,
    description: (
      <>
        A factory to create the registry server for the Nuz ecosystem.
      </>
    ),
  },
];

const conpects = [
  {
    title: <>Module</>,
    description: (
      <>
        A module can be a component or a library built according to the standard. You can think of it as an npm package but it will be downloaded and executed at runtime.
      </>
    ),
  },
  {
    title: <>Composition</>,
    description: (
      <>
        The component is an information panel listing the desired modules and versions. You can think of it like the "dependencies" list in the package.json file when using npm.
      </>
    ),
  },
  {
    title: <>Scope</>,
    description: (
      <>
        Scopes are a way of grouping related packages together. Nuz was developd base on "npm-scoped".
      </>
    ),
  },
];

const problems = [
  {
    title: <>Operational</>,
    description: (
      <>
        Product teams must work together but not be dependent on delivery on issues like development, build and release.
      </>
    ),
  },
  {
    title: <>Ownership</>,
    description: (
      <>
        Product teams manage the source code and configuration information of the features they develop. Each team manages its own repository.
      </>
    ),
  },
  {
    title: <>Permissions</>,
    description: (
      <>
        Manage decentralization among teams and members effectively, from repositories to building and releasing products.
      </>
    ),
  },
  {
    title: <>Scalability</>,
    description: (
      <>
        High scalability of the system as new teams are created, applications become more features.
      </>
    ),
  },
  {
    title: <>Risks control</>,
    description: (
      <>
        When a feature of a team fails unexpectedly, it will not lead to other parties being involved.
      </>
    ),
  },
  {
    title: <>Quality control</>,
    description: (
      <>
        Quality control of source code, features of product teams.
      </>
    ),
  },
];

const solutions = [
  {
    title: <>Modules-Based</>,
    description: (
      <>
        A modern web application will be a master app which is composed of many modules together. So, let product teams develop and manage their modules, release anytime without rebuilding the whole application. Module splitting helps you reduce the area when something goes wrong, easily unit test and manage the quality.
      </>
    ),
  },
  {
    title: <>Registry</>,
    description: (
      <>
        Having multiple product teams now no longer makes a big part of your code because it has been broken down into modules. The Nuz registry helps you store module information, set permissions for the teams that manage them. Registry ensures you the best performance of your application.
      </>
    ),
  },
  {
    title: <>Safe Mode</>,
    description: (
      <>
        Because it manages runtime modules, loads and initializes Nuz's modules in a safe context to avoid affecting other things. When the module initialization fails, it will try again, if it fails again it will be retry by the fallback version of the module. Finally, if it still fails, it will handle it to avoid page errors.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">🔮 {siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/doc1')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.features}>
          <div className="container">
            <h1 className={classnames('hero__title', styles.textCenter)}>Missions</h1>
            <h3 className={classnames('hero__subtitle', styles.textCenter)}>Change the way you develop, maintain, and operate a web application.</h3>
            <br />
            <div className="row">
              {missions.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        <section className={classnames(styles.features, styles.packages)}>
          <div className="container">
            <h1 className={classnames('hero__title', styles.textCenter)}>Packages</h1>
            <div className="row">
              {packages.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
            <br />
            <h2 className={classnames('hero__title', styles.textCenter)}>Conpects by Nuz</h2>
            <div className="row">
              {conpects.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        <section className={styles.features}>
          <div className="container">
            <h1 className={classnames('hero__title', styles.textCenter)}>Solution for Micro Frontends</h1>
            <h2 className={classnames('hero__subtitle', styles.textCenter)}>Problems encountered</h2>
            <div className="row">
              {problems.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
            <br />
            <h2 className={classnames('hero__subtitle', styles.textCenter)}>Resovled by Nuz</h2>
            <div className="row">
              {solutions.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
