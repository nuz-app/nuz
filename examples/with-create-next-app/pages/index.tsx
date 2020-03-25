import * as React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { resolve } from '@nuz/core';
import dynamic from 'next/dynamic'

import Layout from '../components/Layout'

const HelloWorld = dynamic(
  () => resolve('hello-world') as any,
  { nuz: true } as any,
)

const IndexPage: NextPage = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
      <div>
        <HelloWorld />
      </div>
    </Layout>
  )
}

export default IndexPage
