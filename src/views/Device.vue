<template>
  <div class="container">
    <div class="search-box">
      <div>
        <label class="label" for="">所属酒店</label>
        <el-select v-model="hotId" filterable size="small" class="handle-search mr20">
          <el-option label="全部" value=""></el-option>

          <el-option v-for="item in hotelList" :key="item.hotId" :label="item.hotName" :value="item.hotId"></el-option>
        </el-select>
      </div>
      <div>
        <label class="label" for="">SN 码</label>
        <el-input v-model="deviceId" size="small" placeholder="" clearable class="handle-search mr20"></el-input>

      </div>
      <div>
        <label class="label" for="">状态</label>
        <el-select v-model="deviceState" size="small" class="handle-search mr20">
          <el-option label="全部" value=""></el-option>
          <el-option label="未使用" value="1"></el-option>
          <el-option label="使用中" value="2"></el-option>
          <el-option label="故障" value="3"></el-option>
        </el-select>
      </div>
      <div>
        <el-button class="mr20" size="small" type="primary" @click="getDevice">查询</el-button>
        <el-button class="mr20" size="small" type="primary" @click="exportDevice">导出</el-button>
      </div>
    </div>
    <div class="list">
      <el-table :data="list"  class="table" ref="multipleTable" :header-cell-style="{background:'#eef1f6',color:'#333'}" header-cell-class-name="table-header">

        <el-table-column prop="deviceId" label="SN码" width="100" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.deviceState==1">未使用</span>
            <span v-else-if="scope.row.deviceState==2">使用中</span>
            <span v-else-if="scope.row.deviceState==3">故障</span>

          </template>
        </el-table-column>
        <el-table-column prop="hotName" label="所属酒店" align="center"></el-table-column>

        <el-table-column prop="roomId" label="房间号" align="center"></el-table-column>
        <el-table-column prop="number1" label="最近扫码" align="center"></el-table-column>
        <el-table-column prop="income1" label="今日收益" align="center"></el-table-column>

        <el-table-column prop="income2" label="累计收益" align="center"></el-table-column>
        <el-table-column label="新拉会员" width="100" align="center">
          <template slot-scope="scope">
            <div>藏宝么：{{scope.row.register2}}</div>
            <div>藏宝天下：{{scope.row.register1}}</div>
          </template>
        </el-table-column>
        <el-table-column label="登录会员" width="100" align="center">
          <template slot-scope="scope">
            <div>藏宝么：{{scope.row.login2}}</div>
            <div>藏宝天下：{{scope.row.login1}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="省市区" width="200" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}</div>
          </template>
        </el-table-column>
      </el-table>
      <Page :total="total" :PageNumber.sync="PageNumber" :PageSize.sync="PageSize" @current-change="changeCurrentPage"
        @size-change="handleSizeChange">
      </Page>

    </div>
  </div>
</template>
<script>
  import Page from '../components/Page.vue'
  export default {
    data() {
      return {
        PageNumber: 1,
        PageSize: 20,
        total: 0,
        hotId: '',
        deviceId: '',
        deviceState: '',
        hotelList: [],
        list: []
      }
    },
    created() {
      this.hotId = this.$route.query.hotId || ''
      this.getAllHotel();
      this.getDevice()
    },
    methods: {
      getAllHotel() {
        this.$http('/backstage/getAllHotel').then(res => {
          if (res.code == 200) {
            this.hotelList = res.data;
          }
        })
      },
      getDevice() {
        this.$http('/backstage/getDevice', {
          hotId: this.hotId,
          deviceId: this.deviceId,
          deviceState: this.deviceState,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.total = res.data.count
            this.list = res.data.list;
          }
        })
      },
      exportDevice() {
        this.$download('/backstage/ExportDevice',{
          hotId: this.hotId,
          deviceId: this.deviceId,
          deviceState: this.deviceState,
   
        }).then(res => {
          var blob = new Blob([res], { type: 'application/vnd.ms-excel application/x-excel' }); //type这里表示xlsx类型
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          console.log(href)
          downloadElement.href = href;
          downloadElement.download = '设备列表.xls'; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象 
        }).catch(err => {
          this.$message({
            message: '下载失败！',
            type: 'error',
            showClose: true
          })
        })

      },
      //修改查询条件
      queryChange() {
        this.PageNumber = 1;
        this.getDevice();
      },
      //改变当前页数
      changeCurrentPage(val) {
        this.getDevice();
      },
      //改变每页显示条数
      handleSizeChange(val) {
        this.getDevice();
      }
    },
    components: {
      Page
    }
  }
</script>
<style scoped>
  .index {

    background: #f6f6f6;
  }

  /* .search-box {
    width: 100%;
    padding: 24px 29px 14px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    background: #FFFFFF;
    box-shadow: 0px 11px 20px 0px rgba(0, 0, 0, 0.05);
    border-radius: 11px;

  }

  .search-box>div {
    margin-bottom: 10px;
  }

  .list {
    margin-top: 30px;
    padding: 30px 24px;
    background: #fff;
  } */
</style>