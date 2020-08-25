import Layout from '../../components/layout'
import { useState, useEffect } from 'react'
import qs from 'qs';
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Table, Pagination, Divider, Button } from '@zeit-ui/react'
import axios from 'axios'
import _ from 'lodash'

const dayjs = require('dayjs')

export default function Post({ postData }) {

    const [data, setData] = useState([])
    const [pagination, setPagination] = useState({ size: 15, num: 1, count: 1 })
    const router = useRouter()
    const { id } = router.query
    const operation = (actions, rowData) => {
        return <a href={`${rowData.rowValue.url}`} target='_blank'>{rowData.rowValue.url}</a>
    }

    const fetchData = async () => {
        await axios({
            method: 'post',
            url: 'http://localhost:3000/api/all',
            data: qs.stringify({
                size: pagination.size,
                num: pagination.num,
                media_id: _.split(id, '-')[0]
            })
        }).then(function (response) {
            let data = response.data.data
            let total = response.data.total
            setPagination({ ...pagination, count: Math.round(total / pagination.size) + 1 })
            setData(data.map(e => {
                return { ...e, time: dayjs(e.time).format(`YYYY-MM-DD HH:mm:ss`), operation }
            }))
        })
    }

    useEffect(() => {
        fetchData()
        console.log(id)
    }, [pagination.num, id])

    let pageData = _.filter(postData, e => e.name === id)[0]

    return <Layout>
        <Head>
            <title>{pageData.id}</title>
        </Head>
        <div style={{ display: 'flex' }}>
            <h2 style={{ width: '50%' }}>{pageData.id}</h2>
            <h2 style={{ width: '50%', textAlign: 'right' }}>
                <Link href="/">
                    <a>返回</a>
                </Link>
            </h2>
        </div>
        <Table data={data}>
            <Table.Column prop="site" label="媒体" />
            <Table.Column prop="title" label="标题" />
            <Table.Column prop="operation" label="地址" />
            <Table.Column prop="time" label="时间" />
        </Table>
        <Divider />
        <Pagination count={pagination.count} initialPage={pagination.num} limit={pagination.size} onChange={e => setPagination({ ...pagination, num: e })} />
    </Layout>
}

export async function getServerSideProps(context) {
    let postData = []
    await axios({
        method: 'get',
        url: 'http://localhost:3000/api/media/list'
    }).then((res) => {
        postData = res.data.map(e => {
            return {
                id: e.name,
                name: `${e.id}-${e.alias}`
            }
        })
    })

    return {
        props: { postData }, // 将作为道具传递到页面组件
    }
}