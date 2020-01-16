import React, {Component,} from 'react';
import {Button, Row, Col, Table, Input, Popconfirm, message, Card, Statistic, Progress, Icon} from 'antd';
import {Link} from 'react-router-dom'
import axios from 'axios'

const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;

class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: window.localStorage.getItem('token'),
            current: FIRST_PAGE,
            data: [],
            alarmCount: null,
            processedCount: null,
            urgencyCount: null,
            dealingCount: null,
            dealRate: null,
            failureRate: null,
        }
        this.getAlarmListByGroupId = this.getAlarmListByGroupId.bind(this);

    }

    componentDidMount() {
        //保存当前页面的路由路径
        this.getAlarmListByGroupId();
        this.getAlarmCount();
        this.getProcessedCount();
        this.getUrgencyCount();
        this.getDealingCount();
    }

    //分页
    handlePageChange = (page) => {
        this.getAlarmListByGroupId(page - 1)
    }

    //获取告警总数
    getAlarmCount = () => {
        axios({
            method: 'POST',
            url: '/amc/alarm/getAllAlarmCount',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            },
        })
            .then((res) => {
                if (res && res.status === 200) {
                    this.setState({
                        alarmCount: res.data.result,
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    //获取待处理告警数
    getDealingCount = () => {
        axios({
            method: 'POST',
            url: '/amc/alarm/getDealingCount',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            },
        })
            .then((res) => {
                if (res && res.status === 200) {
                    this.setState({
                        dealingCount: res.data.result,
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    //获取急需处理告警数
    getUrgencyCount = () => {
        axios({
            method: 'POST',
            url: '/amc/alarm/getUrgencyCount',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            },
        })
            .then((res) => {
                if (res && res.status === 200) {
                    this.setState({
                        urgencyCount: res.data.result,
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //获取已处理告警数
    getProcessedCount = () => {
        axios({
            method: 'POST',
            url: '/amc/alarm/getDealedCount',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            },
        })
            .then((res) => {
                if (res && res.status === 200) {
                    this.setState({
                        processedCount: res.data.result,
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getAlarmListByGroupId = () => {
        // const baseQuery={orderBy:'updateTime',pageSize:PAGE_SIZE,pageNum:page}
        axios({
            method: 'POST',
            url: '/amc/alarm/getAlarmListByGroupId',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            },
            data: JSON.stringify({
                'baseQuery': null
            })
        })
            .then((res) => {
                if (res && res.status === 200) {
                    this.setState({
                        data: res.data.result.list,
                    });
                    console.log(this.state.data)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    deleteAlarmByAlarmId = (record) => {
        axios({
            method: 'POST',
            url: '/amc/alarm/deleteAlarmByAlarmId/' + record.id,
            headers: {
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            }
        })
            .then((res) => {
                if (res && res.status === 200) {
                    console.log(res.data.result)
                    this.getAlarmListByGroupId()
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render() {
        const {
            data,
            urgencyCount,
            processedCount,
            alarmCount,
            dealingCount,
        } = this.state;
        const columns = [
                {
                    title: '等级',
                    dataIndex: 'alarmLevel',
                    key: 'alarmLevel',
                    filters: [
                        {
                            text: '紧急',
                            value: 1,
                        },
                        {
                            text: '可疑',
                            value: 2,
                        },
                        {
                            text: '提醒',
                            value: 3,
                        },
                    ],
                    render:
                        (text, record) => {
                            return (record.alarmLevel === 1 ? '紧急' : (record.alarmLevel === 2 ? '可疑' : '提醒'))

                        }
                },
                {
                    title: '告警名称',
                    key:
                        'alarmName',
                    render:
                        (text, record) => {
                            return (record.alarmName && record.alarmName) || '--'
                        }
                }
                ,
                {
                    title: '受影响设备',
                    key:
                        'alarmAsset',
                    render:
                        (text, record) => {
                            return (record.alarmAsset && record.alarmAsset) || '--'
                        }

                }
                ,
                {
                    title: '最新发生时间',
                    key:
                        'lastOccurTime',
                    render:
                        (text, record) => {
                            return (record.lastOccurTime && record.lastOccurTime) || '--'
                        }
                }
                ,
                {
                    title: '描述',
                    key:
                        'description',
                    render:
                        (text, record) => {
                            return (record.description && record.description) || '--'
                        }
                }
                ,
                {
                    title: '状态',
                    key:
                        'alarmStatus',
                    render:
                        (text, record) => {
                            if (record.alarmStatus === 1) {
                                return "未处理";
                            } else {
                                return "已处理";
                            }
                        }

                }
                ,
                {
                    title: '操作',
                    key:
                        'action',
                    render:
                        (text, record) => (
                            <div className="operate-btns"
                                 style={{display: 'block'}}
                            >
                                <Link
                                    to={`/cbd/amc/alarm/detail/${record.id}`}
                                    style={{marginRight: '12px'}}
                                >详情</Link>
                                <Link
                                    to={`/cbd/amc/alarm/modify/${record.id}`}
                                    style={{marginRight: '12px'}}
                                >修改</Link>
                                <Popconfirm
                                    title="确定要删除吗？"
                                    onConfirm={() => {
                                        this.deleteAlarmByAlarmId(record)
                                    }}
                                >
                                    <Button
                                        type="simple"
                                        style={{border: 'none', padding: 0, color: "#357aff", background: 'transparent'}}
                                    >删除</Button>
                                </Popconfirm>

                            </div>
                        ),

                }
                ,
            ]
        ;
        return (
            <div>
                <div>
                    <h1>安全告警处理</h1>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Card title="告警总数" bordered={false}>
                                <Statistic value={8}/>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card title="急需处理告警数" bordered={false}>
                                <Statistic value={urgencyCount}/>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card title="未处理告警数" bordered={false}>
                                <Statistic value={dealingCount}/>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card title="已处理告警数" bordered={false}>
                                <Statistic value={processedCount}/>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card title="处理量" bordered={false}>
                                <Progress type="circle" percent={95}/>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card title="故障率" bordered={false}>
                                <Progress type="circle" strokeColor="red" percent={5}/>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div>
                    <Link to={`/cbd/amc/alarm/create/`}>
                        <Button type="danger"> +发起报警</Button>
                    </Link>
                </div>
                <div>
                    <Table dataSource={data} columns={columns} />
                </div>
            </div>
        )
    }
}

export default Report;