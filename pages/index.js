import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Input, Button, Loading, Grid, Card, Divider, Text, Spacer } from '@geist-ui/react'
import useSWR from 'swr'
import axios from 'axios'

const fetcher = url => axios.get(url).then(res => res.data)
function Profile({ name }) {
  const { data, error } = useSWR('http://site.yunzitui.com:10024/api/media/list', fetcher)
  // const { data, error } = useSWR('http://localhost:10024/api/media/list', fetcher)

  if (error) return <div>读取失败</div>
  if (!data) return <Loading />

  return <div style={{ width: 1200 }}>
    <Grid.Container gap={2} justify="center">
      {
        data.data.filter(e => e.name.indexOf(name) > -1).map(e => {
          let num = data.nums.filter(n => parseInt(n.media_id) === e.id)
          return <Grid xs={6} key={e.id}>
            <MockItem name={e.name} id={e.id} alias={e.alias} num={num} />
          </Grid>
        })
      }
    </Grid.Container>
  </div>
}

const MockItem = ({ name, id, alias, num }) => {
  return <Card shadow style={{ width: '100%' }}>
    <Card.Content>
      <Link href="/media/[id]" as={`/media/${id}-${alias}`} >
        <h4 style={{ textAlign: 'center', cursor: 'pointer' }}>{name}</h4>
      </Link >
      <Grid.Container gap={.8} justify="center" height="48px">
        <Grid xs={8} >
          <Text>昨日: {num[0]?.num}</Text>
        </Grid >
        <Grid xs={8}>
          <Text>今日: {num[1]?.num}</Text>
        </Grid >
      </Grid.Container>
    </Card.Content>
  </Card>
}

export default function Home() {

  const [name, setName] = useState('')

  return (
    <div className="container">
      <Head>
        <title>媒体入口</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>媒体入口</h1>
        <Divider y={1} />
        <Input placeholder="筛选媒体" onChange={e => setName(e.target.value)} />
        <Divider y={1} />
        <Profile name={name} />
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
