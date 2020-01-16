import React, { Component, } from 'react';
import { Form,Input,Button,message,DatePicker,Radio } from 'antd';
import moment from 'moment';
import axios from 'axios';
import locale from 'antd/es/date-picker/locale/zh_CN';
const token = window.localStorage.getItem('token')
class AlarmNew extends Component{
    constructor(props){
        super(props)
        this.state={
            alarmDetail:{
            }
        }
    }
    componentDidMount(){
        const {match : { params : { id } }} = this.props
        if(id){
            axios({
                method: 'POST',
                url: '/amc/alarm/getAlarmById/'+id,
                headers: {
                    'deviceId': this.deviceId,
                    'Authorization':'Bearer '+token,
                },
            })
                .then((res) => {
                    if(res && res.status === 200){
                        console.log(res.data.result)
                        this.setState({
                            alarmDetail:res.data.result
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const {
            form,
            history,
            match : { params : {id } },
        } = this.props
        const { getFieldValue } = form;
        const values = form.getFieldsValue()
        if(!getFieldValue('alarmName')){
            message.error('请填写告警名称')
        }
        if(!getFieldValue('alarmType')){
            message.error('请填写告警类型')
        }
        if(!getFieldValue('alarmType')){
            message.error('请填写告警等级')
        }
        if(!getFieldValue('alarmType')){
            message.error('请填写告警位置')
        }
        if(!getFieldValue('lastOccurTime')){
            message.error('请填写最近发生时间')
        }
        if(id){
            values.id=id
        }
        values.lastOccurTime=getFieldValue('lastOccurTime').format('YYYY-MM-DD HH:mm:ss')
        axios({
            method: 'POST',
            url: '/amc/alarm/save',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+token,
            },
            data:JSON.stringify(values)
        })
            .then((res) => {
                if(res && res.status === 200){
                    history.push('/cbd/alarm/report')
                }
            })
            .catch(function (error) {
                console.log(error);
                message.info("您不具备该权限")
            });
    }
    render(){
        const createFormItemLayout = {
            labelCol: {span:8},
            wrapperCol : {span:8},
        }
        const {
            form: { getFieldDecorator },
            match : { params : { id } }
        } = this.props
        const { alarmDetail } = this.state
        return(
            <div>
                <div >
                    <Form
                        onSubmit={this.handleSubmit}
                    >
                        <Form.Item
                            {...createFormItemLayout}
                            label="告警名称"
                        >
                            {getFieldDecorator('alarmName',{
                                initialValue: id && alarmDetail.alarmName,
                                rules:[{
                                    required:true,
                                    message:"告警名称",
                                }]
                            })(
                                <Input placeholder="告警名称" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="告警类型"
                        >
                            {getFieldDecorator('alarmType',{
                                initialValue: id && alarmDetail.alarmType,
                                rules:[{
                                    required:true,
                                    message:"请填写告警类型",
                                }]
                            })(
                                <Input placeholder="请输入告警类型" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="告警等级"
                        >
                            {getFieldDecorator('alarmLevel',{
                                initialValue: id && alarmDetail.alarmLevel,
                                rules:[{
                                    required:true,
                                    message:"请选择告警等级",
                                }]
                            })(
                                <Radio.Group defaultValue={1}>
                                    <Radio value={1}>紧急</Radio>
                                    <Radio value={2}>可疑</Radio>
                                    <Radio value={3}>提醒</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="告警资产"
                        >
                            {getFieldDecorator('alarmAsset',{
                                initialValue: id && alarmDetail.alarmAsset,
                                rules:[{
                                    required:true,
                                    message:"请填写告警资产",
                                }]
                            })(
                                <Input placeholder="请输入告警资产" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="告警位置"
                        >
                            {getFieldDecorator('alarmLocation',{
                                initialValue: id && alarmDetail.alarmLocation,
                                rules:[{
                                    required:true,
                                    message:"请填写告警位置",
                                }]
                            })(
                                <Input placeholder="请输入告警位置" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="最近发生时间"
                        >
                            {getFieldDecorator('lastOccurTime',{
                                initialValue: id && moment(alarmDetail.lastOccurTime),
                                rules:[{
                                    required:true,
                                    message:"请选择最近发生时间",
                                }]
                            })(
                                <DatePicker
                                    locale={locale}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请选择最近发生时间"
                                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="描述信息"
                        >
                            {getFieldDecorator('description',{
                                initialValue: id && alarmDetail.description,
                                rules:[{
                                    required:false,
                                    message:"请填写描述信息",
                                }]
                            })(
                                <Input placeholder="请输入描述信息" />
                            )}
                        </Form.Item>
                        <section className="operator-container">
                            <div style={{textAlign:"center"}}>
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    size="default"
                                >{id ? '编辑' : '新建'}
                                </Button>
                                <Button
                                    style={{marginLeft:"28px"}}
                                    size="default"
                                    onClick={()=> {
                                        const {
                                            history,
                                        } = this.props
                                        history.push('/cbd/amc/report')
                                    }}
                                >取消
                                </Button>
                            </div>
                        </section>
                    </Form>
                </div>
            </div>
        )
    }
}
export default Form.create()(AlarmNew);