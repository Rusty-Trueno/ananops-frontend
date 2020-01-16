import React, { Component, } from 'react';
import {Descriptions, Badge,Button } from 'antd';
import moment from 'moment';
import './index.styl'
import axios from 'axios'
import { Link } from 'react-router-dom'
// const token=window.localStorage.getItem('token')
class ItemDetail extends Component{
    constructor(props){
        super(props)
        this.state={
          imcItemDetail:{

          },
          token:window.localStorage.getItem('token')
        }
        this.getDetail = this.getDetail.bind(this);
    }
    componentDidMount(){
      const { 
        match : { params : { itemId } }
      } = this.props
      console.log(itemId)
      this.getDetail(itemId);   
    }
    getDetail=(id)=>{
      axios({
        method: 'GET',
        url: '/imc/inspectionItem/getItemByItemId/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
    .then((res) => {
        if(res && res.status === 200){   
            console.log(res.data.result)  
        this.setState({
           imcItemDetail:res.data.result
        }) ;
        }
    })
    .catch(function (error) {
        console.log(error);
    });
    

    }
    render(){
      const {imcItemDetail}=this.state
      const {match : { params : { itenId,taskId } }} = this.props   
      console.log("日志信息：" + JSON.stringify(imcItemDetail))
        return(
                <div className="bg">
                  <Descriptions bordered className="descriptions">
                    <Descriptions.Item label="巡检任务子项ID " span={3}>{imcItemDetail.id}</Descriptions.Item>
                    <Descriptions.Item label="巡检任务子项名称" span={1.5}>{imcItemDetail.itemName}</Descriptions.Item>
                    <Descriptions.Item label="对应的巡检任务ID " span={3}>{imcItemDetail.inspectionTaskId}</Descriptions.Item>
                    <Descriptions.Item label="巡检网点" span={1.5}>{imcItemDetail.location}</Descriptions.Item>
                    <Descriptions.Item label="计划起始时间" span={1.5}>{imcItemDetail.scheduledStartTime}</Descriptions.Item>
                    <Descriptions.Item label="实际起始时间" span={1.5}>{imcItemDetail.actualStartTime}</Descriptions.Item>
                    <Descriptions.Item label="实际完成时间" span={1.5}>{imcItemDetail.actualFinishTime}</Descriptions.Item>
                    <Descriptions.Item label="计划完成天数" span={1.5}>{imcItemDetail.days}</Descriptions.Item>
                    <Descriptions.Item label="巡检周期（天）" span={1.5}>{imcItemDetail.frequency}</Descriptions.Item>
                    <Descriptions.Item label="维修工ID " span={1.5}>{imcItemDetail.maintainerId}</Descriptions.Item>
                    <Descriptions.Item label="巡检内容" span={1.5}>{imcItemDetail.description}</Descriptions.Item>
                    <Descriptions.Item label="操作" span={3}>
                      <Link to={`/cbd/item/${taskId}`}>返回上一级</Link>
                    </Descriptions.Item>
                  </Descriptions>
                
                </div>  
        )
    }

}
export default ItemDetail