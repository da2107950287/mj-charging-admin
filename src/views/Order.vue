<template>
  <div class="container">
    <div class="search-box">
      <div class="search-top">
        <div>
          <label class="label" for="">所属酒店</label>
          <el-select v-model="hotId" filterable size="small" class="handle-search mr20">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in hotelList" :key="item.hotId" :label="item.hotName" :value="item.hotId">
            </el-option>
          </el-select>
        </div>
        <div>
          <label class="label" for="">订单号</label>
          <el-input v-model="olId" size="small" placeholder="" clearable class="handle-search mr20"></el-input>

        </div>
        <div>
          <label class="label" for="">订单类型</label>
          <el-select v-model="olType" size="small" class="handle-search mr20">
            <el-option label="全部" value=""></el-option>
            <el-option label="支付" value="1"></el-option>
            <el-option label="藏宝天下登录" value="2"></el-option>
            <el-option label="藏宝天下注册" value="3"></el-option>
            <el-option label="藏宝么登录" value="4"></el-option>
            <el-option label="藏宝么注册" value="5"></el-option>
          </el-select>
        </div>
        <div>
          <el-button class="mr20" size="small" type="primary" @click="select">查询</el-button>
          <el-button class="mr20" size="small" type="primary" @click="ExportOrderlist">导出</el-button>
        </div>
      </div>
      <div class="search-bottom">
        <div>
          <label class="label" for="">SN 码</label>
          <el-input v-model="deviceId" size="small" placeholder="" clearable class="handle-search mr20"></el-input>

        </div>
        <div>
          <label class="label" for="">开始时间</label>
          <el-date-picker size="small" value-format="yyyy-MM-dd" v-model="starttime" type="date" placeholder="选择日期"
            class="handle-search mr20" :picker-options="isDisabled1">
          </el-date-picker>
        </div>
        <div>
          <label class="label" for="">结束时间</label>
          <el-date-picker size="small" value-format="yyyy-MM-dd" v-model="endtime" type="date" placeholder="选择日期"
            class="handle-search mr20" :picker-options="isDisabled2">
          </el-date-picker>
        </div>
      </div>
      <div class="item">
        <div class="label pointer" :style="{color:days==='0'?'#409EFF':'#000'}" @click="daysOrder('0')">今日</div>
        <div class="label pointer" :style="{color:days==='7'?'#409EFF':'#000'}" @click="daysOrder('7')">7日</div>
        <div class="label pointer" :style="{color:days==='30'?'#409EFF':'#000'}" @click="daysOrder('30')">30日</div>
      </div>
      <div class="item">
        <div class="mr20">订单数：{{total}}</div>
        <div class="mr20">支付金额：{{payMoney}}</div>
        <div class="mr20">退款金额：{{refundMoney}}</div>
      </div>
      <div class="item">
        <div class="mr20">注册用户：{{totalRegister}}</div>
        <div class="mr20">藏宝天下：{{register1}}</div>
        <div class="mr20">藏宝么：{{register2}}</div>
        <div class="mr20">登录用户：{{totalLogin}}</div>
        <div class="mr20">藏宝天下登录：{{login1}}</div>
        <div class="mr20">藏宝么登录：{{login2}}</div>
      </div>
    </div>
    <div class="list">
      <el-table :data="list"  class="table" ref="multipleTable" :header-cell-style="{background:'#eef1f6',color:'#333'}" header-cell-class-name="table-header">

        <el-table-column type="index" label="ID" width="100" align="center"></el-table-column>

        <el-table-column prop="olId" label="订单号" align="center"></el-table-column>

        <el-table-column label="订单类型" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.olType==1">支付</div>
            <div v-else-if="scope.row.olType==2">藏宝天下登录</div>
            <div v-else-if="scope.row.olType==3">藏宝天下注册</div>
            <div v-else-if="scope.row.olType==4">藏宝么登录</div>
            <div v-else-if="scope.row.olType==5">藏宝么注册</div>
          </template>
        </el-table-column>
        <el-table-column prop="olPrice" label="付款金额" align="center"></el-table-column>
        <el-table-column prop="deviceId" label="设备SN码" align="center"></el-table-column>

        <el-table-column prop="hotName" label="酒店" align="center"></el-table-column>
        <el-table-column prop="roomId" label="房间号" align="center"></el-table-column>
        <el-table-column label="有效时长" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.hours}}h</div>
          </template>
        </el-table-column>
        <el-table-column prop="payTime" label="付款时间" align="center"></el-table-column>


        <el-table-column label="操作" align="center">
          <template slot-scope="scope">


            <div v-if=" (scope.row.olState == 2 || scope.row.olState == 3) && scope.row.payTime &&scope.row.olType==1"
              class="pointer" style=" color: #02a7f0;" @click="orderlistRefund(scope.row.olId)">退款</div>
            <div v-else style="color: #aaa;cursor:pointer;">退款
            </div>

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
        olType: '',
        olId: '',
        starttime: '',
        endtime: '',
        days: '',
       
        payMoney: '',//支付金额
        register2: '',//藏宝么注册
        register1: '',//藏宝天下注册
        refundMoney: '',//退款金额
        login2: '',//藏宝么登陆
        login1: '',//藏宝天下登陆
        totalLogin: '',
        totalRegister: '',
        hotelList: [],
        list: [],
        isDisabled1: {
          disabledDate: (time) => {
            // 大于某个日期不能选择
            let myDate = new Date();
            let _beforeDay = myDate.setDate(new Date().getDate());
            if (this.endtime) {
              return time.getTime() > new Date(this.endtime).getTime();
            } else {
              return time.getTime() >= _beforeDay;
            }

          }
        },
        isDisabled2: {
          disabledDate: (time) => {
            // 大于某个日期不能选择
            let myDate = new Date();
            let _beforeDay = myDate.setDate(new Date().getDate());
            if (this.starttime) {
              return time.getTime() > _beforeDay || time.getTime() <= new Date(this.starttime).getTime() - 8.64e7;
            } else {
              return time.getTime() >= _beforeDay;
            }

          }
        },


      }
    },

    created() {
      this.hotId = this.$route.query.hotId || ''
      this.getHotel();
      this.getOrderlist()
    },
    methods: {
      select(){
        this.days=''
        this.getOrderlist()
      },
      orderlistRefund(olId) {
        this.$confirm('确认退款？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/backstage/orderlistRefund', {
            olId
          }).then(res => {
            if (res.code == 200) {
              this.getOrderlist()
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          })
        })
      },
      daysOrder(days) {
        this.days = days;
        this.starttime = "";
        this.endtime = "";
        this.PageNumber = 1;
        this.getOrderlist()
      },
      getHotel() {
        this.$http('/backstage/getAllHotel').then(res => {
          if (res.code == 200) {
            this.hotelList = res.data;
          }
        })
      },
      getOrderlist() {
   
        this.$http('/backstage/getOrderlist', {
          hotId: this.hotId,
          deviceId: this.deviceId,
          olType: this.olType,
          olId: this.olId,
          starttime: this.starttime || '',
          endtime: this.endtime || '',
          days: this.days,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.total = res.data.count;
            this.list = res.data.list;
            if (this.PageNumber == 1) {
              this.payMoney = res.data.payMoney;
              this.register2 = res.data.register2;
              this.register1 = res.data.register1;
              this.refundMoney = res.data.refundMoney;
              this.login2 = res.data.login2;
              this.login1 = res.data.login1;
              this.totalLogin = this.login1 + this.login2;
              this.totalRegister = this.register1 + this.register2
            }
          }
        })
      },
      ExportOrderlist() {

        this.$download('/backstage/ExportOrderlist').then(res => {
          var blob = new Blob([res], { type: 'application/vnd.ms-excel application/x-excel' }); //type这里表示xlsx类型
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          console.log(href)
          downloadElement.href = href;
          downloadElement.download = '订单列表.xls'; //下载后文件名
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

      //改变当前页数
      changeCurrentPage(val) {
        this.days=''
        this.getOrderlist();
      },
      //改变每页显示条数
      handleSizeChange(val) {
        this.days=''
        this.getOrderlist();
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

  .pointer {
    cursor: pointer;
   
  }

  .pointer:active {
    color: #409EFF;

  }



  .search-box {
    width: 100%;
    padding: 24px 29px;
    flex-direction: column;

    background: #FFFFFF;
    box-shadow: 0px 11px 20px 0px rgba(0, 0, 0, 0.05);
    border-radius: 11px;

  }

  .search-box>div {
    margin-bottom: 0;
  }

  .search-top,
  .search-bottom {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .search-top>div,
  .search-bottom>div {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
  }

  .search-bottom {
    margin-top: 24px;
  }

  .item {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    color: #000;

  }

  .item>div {
    margin-bottom: 10px;
  }

  /deep/ .el-date-editor {
    width: 200px;
  }

  /* .list {
    margin-top: 30px;
    padding: 30px 24px;
    background: #fff;
  } */
</style>