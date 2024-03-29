import Layout from '../../components/layout'
import { useState, useEffect } from 'react'
import qs from 'qs';
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Table, Pagination, Divider, Button, Input, Spacer, Collapse, Grid } from '@geist-ui/react'
import axios from 'axios'
import _ from 'lodash'
import { Column } from '@antv/g2plot';
import DatePicker, { registerLocale } from "react-datepicker";
import zh from 'date-fns/locale/zh-CN';
registerLocale('zh', zh)

const dayjs = require('dayjs')

export default function Post({ postData }) {

    const [data, setData] = useState([])
    const [title, setTitle] = useState('')
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState({ size: 15, num: 1, count: 1 })

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [num, setNum] = useState(0);

    const router = useRouter()
    const { id } = router.query

    const renderAction = (value, rowData) => {
        return <a href={`${rowData.url}`} target='_blank'>{rowData.url}</a>
    }

    // 获取媒体详情
    const fetchData = async () => {
        await axios({
            method: 'post',
            url: 'http://site.yunzitui.com:7788/api/all',
            // url: 'http://localhost:7788/api/all',
            data: qs.stringify({
                size: pagination.size,
                num: pagination.num,
                media_id: _.split(id, '-')[0],
                title: title
            })
        }).then(function (response) {
            let data = response.data.data
            let total = response.data.total
            setPagination({ ...pagination, count: Math.round(total / pagination.size) + 1 })
            setData(data.map(e => {
                return { ...e, time: dayjs(e.time).format(`YYYY-MM-DD HH:mm:ss`) }
            }))

            const columnPlot = new Column('container', {
                data: response.data.graph,
                xField: 'date',
                yField: 'num',
            });
            columnPlot.render();
        })
    }

    useEffect(() => {
        fetchData()
    }, [pagination.num, id])

    const searchCount = async () => {
        await axios({
            method: 'post',
            url: 'http://site.yunzitui.com:7788/api/order/count',
            // url: 'http://localhost:7788/api/order/count',
            data: qs.stringify({
                startTime: dayjs(startDate).format('YYYY-MM-DD hh:mm:ss'),
                endTime: dayjs(endDate).format('YYYY-MM-DD hh:mm:ss'),
                media_id: _.split(id, '-')[0]
            })
        }).then(function (response) {
            setNum(response.data)
        })
    }

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
        <Grid.Container gap={1}>
            <Grid xs={8}>
                <Input placeholder="搜索" value={title} onChange={e => setTitle(e.target.value)} width="100%" />
            </Grid>
            <Grid xs={8}>
                <Button onClick={() => fetchData()} scale={0.8} type="success">搜索</Button>
            </Grid>
        </Grid.Container >
        <Spacer y={1} />
        <Grid.Container gap={1}>
            <Grid xs={6}>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} locale="zh" />
            </Grid>
            <Grid xs={6}>
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} locale="zh" />
            </Grid>
            <Grid xs={6}>
                <Button onClick={() => searchCount()} scale={0.8} type="success">搜索</Button>
            </Grid>
            <Grid xs={6}>
                <div>数量：{num}</div>
            </Grid>
        </Grid.Container >
        <Spacer y={1} />
        <Collapse title="发布数量表">
            <div id="container"></div>
        </Collapse>
        <Spacer y={1} />
        <Table data={data}>
            <Table.Column prop="site" label="媒体" />
            <Table.Column prop="title" label="标题" />
            <Table.Column prop="url" label="地址" render={renderAction} />
            <Table.Column prop="time" label="时间" />
        </Table>
        <Divider />
        <Pagination count={pagination.count} initialPage={1} page={pagination.num} limit={pagination.size} onChange={e => setPagination({ ...pagination, num: e })} />
        <div>
            <span>跳转至 </span>
            <Input placeholder="跳转至" value={page} onChange={e => setPage(e.target.value)} />
            <span> 页     </span>
            <Button onClick={() => setPagination({ ...pagination, num: page })} scale={0.8} auto type="success">确认</Button>
        </div>
    </Layout>
}

export async function getServerSideProps(context) {
    let postData = []
    await axios({
        method: 'get',
        url: 'http://site.yunzitui.com:7788/api/media/list'
        // url: 'http://localhost:7788/api/media/list'
    }).then((res) => {
        postData = res.data.data.map(e => {
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