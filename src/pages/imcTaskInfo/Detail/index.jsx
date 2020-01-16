import React, { Component, } from 'react';
import {Descriptions, Badge,Button } from 'antd';
import moment from 'moment';
import './index.styl'
import axios from 'axios'
import { Link } from 'react-router-dom'
// const token=window.localStorage.getItem('token')
class TaskDetail extends Component{
    constructor(props){
        super(props)
        this.state={
          imcTaskDetail:{

          },
          token:window.localStorage.getItem('token')
        }
        this.getDetail = this.getDetail.bind(this);
    }
    componentDidMount(){
      const { 
        match : { params : { id } }
      } = this.props
      console.log(id)
      this.getDetail(id);   
    }
    getDetail=(id)=>{
      axios({
        method: 'GET',
        url: '/imc/inspectionTask/getTaskByTaskId/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
    .then((res) => {
        if(res && res.status === 200){   
            console.log(res.data.result)  
        this.setState({
           imcTaskDetail:res.data.result
        }) ;
        }
    })
    .catch(function (error) {
        console.log(error);
    });
    

    }
    render(){
      const {imcTaskDetail}=this.state
      const {match : { params : { id } }} = this.props   
      console.log("日志信息：" + JSON.stringify(imcTaskDetail))
        return(
                <div className="bg">
                  <Descriptions bordered className="descriptions">
                    <Descriptions.Item label="巡检任务ID " span={3}>{imcTaskDetail.id}</Descriptions.Item>
                    <Descriptions.Item label="巡检任务名称" span={1.5}>{imcTaskDetail.taskName}</Descriptions.Item>
                    {/* <Descriptions.Item label="巡检任务对应的甲方用户id" span={1.5}>{imcTaskDetail.userId}</Descriptions.Item>    */}
                    <Descriptions.Item label="计划起始时间" span={1.5}>{imcTaskDetail.scheduledStartTime}</Descriptions.Item>
                    {/* <Descriptions.Item label="实际起始时间" span={1.5}>{imcTaskDetail.actualStartTime}</Descriptions.Item> */}
                    <Descriptions.Item label="实际完成时间" span={1.5}>{imcTaskDetail.actualFinishTime}</Descriptions.Item>
                    <Descriptions.Item label="项目ID " span={1.5}>{imcTaskDetail.projectId}</Descriptions.Item>
                    <Descriptions.Item label="项目负责人ID" span={1.5}>{imcTaskDetail.principalId}</Descriptions.Item>
                    <Descriptions.Item label="服务商ID" span={1.5}>{imcTaskDetail.facilitatorId}</Descriptions.Item>
                    <Descriptions.Item label="巡检任务对应的服务商组织的Id " span={1.5}>{imcTaskDetail.facilitatorGroupId}</Descriptions.Item>
                    <Descriptions.Item label="计划完成天数" span={1.5}>{imcTaskDetail.days}</Descriptions.Item>
                    <Descriptions.Item label="巡检类型" span={1.5}>{imcTaskDetail.inspectionType}</Descriptions.Item>
                    <Descriptions.Item label="巡检周期" span={3}>{imcTaskDetail.frequency}</Descriptions.Item>
                    <Descriptions.Item label="巡检产生的维修维护费用" span={1.5}>{imcTaskDetail.maintenanceCost}</Descriptions.Item>
                    <Descriptions.Item label="备注" span={1.5}>{imcTaskDetail.remark}</Descriptions.Item>
                    <Descriptions.Item label="操作" span={3}>
                      <Link to={`/cbd/inspection`}>返回上一级</Link>
                    </Descriptions.Item>
                  </Descriptions>
                
                </div>  
        )
    }

}
export default TaskDetail