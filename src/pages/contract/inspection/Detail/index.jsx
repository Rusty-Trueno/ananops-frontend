import React,{Component,} from 'react'
import {Descriptions, Badge,Button, Form, message } from 'antd';
import moment from 'moment';
import './index.styl'
import { Link } from 'react-router-dom'
import Inspection from '../Index';
import axios from 'axios'
const token=window.localStorage.getItem('token')

class InspectionDetail extends Component{
    constructor(props){
        super(props)
        this.state={
          inspectionDetail:{
          }
        }
      this.getDetail = this.getDetail.bind(this);
    }
    componentDidMount(){
      const { 
        match : { params : { id } }
      } = this.props
      this.getDetail(id);   
    }
    getDetail=(id)=>{
      axios({
        method: 'POST',
        url: '/pmc/InspectDevice/getTaskById/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+token,
        },
      })
    .then((res) => {
        if(res && res.status === 200){     
        this.setState({
           inspectionDetail:res.data.result
        }) ;
        }
    })
    .catch(function (error) {
        console.log(error);
        message.info("您不具备该权限")
    });
    

    }
    render(){
      const { 
        match : { params : { projectId } }
      } = this.props
      const {inspectionDetail}=this.state
      console.log(JSON.stringify(inspectionDetail))
        return(
            <div className="bg">
            <Descriptions bordered className="descriptions">
              <Descriptions.Item label="巡检任务ID">{inspectionDetail.id}</Descriptions.Item>
              <Descriptions.Item label="任务名称">{inspectionDetail.taskName}</Descriptions.Item>
              <Descriptions.Item label="任务类型">{inspectionDetail.taskType}</Descriptions.Item>
              <Descriptions.Item label="项目ID" span={1.5}>{inspectionDetail.projectId}</Descriptions.Item>
              <Descriptions.Item label="项目名称" span={1.5}>{inspectionDetail.projectName}</Descriptions.Item>
              <Descriptions.Item label="预计开始时间" span={1.5}>{inspectionDetail.scheduledStartTime}</Descriptions.Item>
              <Descriptions.Item label="预计完成时间" span={1.5}>{inspectionDetail.scheduledFinishTime}</Descriptions.Item>
              <Descriptions.Item label="最晚开始时间" span={1.5}>{inspectionDetail.deadlineTime}</Descriptions.Item>
              <Descriptions.Item label="巡检周期（天）" span={1.5}>{inspectionDetail.cycleTime}</Descriptions.Item>
              <Descriptions.Item label="是否立即执行" span={1.5}>{inspectionDetail.isNow==0?'否':'是'}</Descriptions.Item>
              <Descriptions.Item label="描述" span={1.5}>{inspectionDetail.description}</Descriptions.Item>
              <Descriptions.Item label="巡检内容" span={3}>{inspectionDetail.inspectionContent}</Descriptions.Item>           
              <Descriptions.Item label="巡检情况" span={3}>{inspectionDetail.inspectionCondition}</Descriptions.Item>
              <Descriptions.Item label="处理结果" span={3}>{inspectionDetail.dealResult}</Descriptions.Item>
              <Descriptions.Item label="操作" span={3}><Link to={`/cbd/pro/inspection/${projectId}`}>返回上级</Link></Descriptions.Item>
            </Descriptions>
          
          </div>  
        )
    }
}
export default InspectionDetail
