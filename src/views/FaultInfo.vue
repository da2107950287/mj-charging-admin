<template>
  <div class="container">
    <div class="search-box1">
      <div class="title">故障详情</div>
      <div class="fault-info">
        <div class="fault-info-left">
          <div><span>设备SN：</span>{{info.deviceId}}</div>
          <div><span>设备所属酒店：</span>{{info.hotName}}</div>
          <div><span>客户手机号：</span>{{info.mobile}}</div>
          <div>
            <span>故障内容：</span>
            <el-input type="textarea" :rows="2" disabled style="width: 300px;" placeholder="请输入内容"
              v-model="info.content">
            </el-input>
          </div>
          <div>
            <span>状态：</span>
            <el-radio-group v-if="state==1" v-model="info.state">
              <el-radio :label='1'>未处理</el-radio>
              <el-radio :label='2'>已处理</el-radio>
            </el-radio-group>
            <el-radio v-else-if="state==2">已处理</el-radio>
          </div>
          <div>
            <span>处理结果：</span>
            <el-input :disabled="state==2?true:false" type="textarea" :rows="2" style="width: 300px;" maxlength=200
              placeholder="请输入内容" v-model="info.result">
            </el-input>
          </div>
        </div>
        <div class="fault-info-right">
          <div><span>上报时间：</span>{{info.faultTime}}</div>
          <div><span>房间号：</span>{{info.roomId}}</div>
          <div><span>客户角色：</span>
            <span v-if="info.role==1">酒店客户</span>
            <span v-else-if="info.role==2">藏宝天下登录</span>
            <span v-else-if="info.role==3">藏宝天下注册</span>
            <span v-else-if="info.role==4">藏宝么登录</span>
            <span v-else-if="info.role==5">藏宝么注册</span>
          </div>
          <div>
            <span>故障图片：</span>
            <el-image v-if="info.picture" style="width: 200px; height: 200px" :src="info.picture" :preview-src-list="[info.picture]">
            
            </el-image>
            <div v-else slot="error" class="image-slot" >
              未上传图片
            </div>
          </div>
        </div>
      </div>
      <div class="btns">
        <el-button v-if="state==1" class="mr20" size="small" type="primary" @click="updateFault">确 认</el-button>
        <el-button class="mr20" size="small" type="primary" @click="$router.go(-1)">取 消</el-button>
      </div>
    </div>

  </div>
</template>
<script>
  import Page from '../components/Page.vue'
  export default {
    data() {
      return {
        faultId: this.$route.query.faultId,
        info: {},
        state: ''
      }
    },
    created() {
      this.showFault()
    },
    methods: {

      showFault() {
        this.$http('/backstage/showFault', {
          faultId: this.faultId
        }).then(res => {
          if (res.code == 200) {
            this.info = res.data;
            this.state = res.data.state;
          }
        })
      },

      updateFault() {
        

        if (this.info.result.replace(/[ ]/g, "").replace(/[\r\n]/g, "").replace(/\u2006/g, '') == '') {
          this.$message.error('处理结果不能为空')
          return false;
        }
        this.$http('/backstage/updateFault', {
          faultId: this.faultId,
          state: this.info.state,
          result: this.info.result,
        }).then(res => {
          if(res.code==200){
            this.$router.push('/fault')
          }else{
            this.$message.error(res.msg)
          }
        })
      }
    },
    components: {
      Page
    }
  }
</script>
<style lang="scss" scoped>
  .index {

    background: #f6f6f6;
  }

  .search-box1 {
    width: 100%;

    padding: 24px 29px;

    background: #FFFFFF;
    box-shadow: 0px 11px 20px 0px rgba(0, 0, 0, 0.05);
    border-radius: 11px;
  }

  .title {
    font-size: 24px;
    text-align: center;
  }

  .fault-info {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    .fault-info-left>div,
    .fault-info-right>div {
      white-space: nowrap;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #000;
      line-height: 36px
    }

    .fault-info-left>div span:first-child,
    .fault-info-right>div span:first-child {
      display: inline-block;
      width: 110px;
    }

    .fault-info-right {
      margin-left: 150px;
    }
  }

  .btns {
    text-align: center;
    padding: 20px;
  }

  .el-image {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
    color: #c0c4cc;

  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
    color: #c0c4cc;
    width: 200px; 
    height: 200px

  }
</style>