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
        <label class="label" for="">房间号</label>
        <el-input v-model="roomId" size="small" placeholder="" clearable class="handle-search mr20"></el-input>
      </div>
      <!-- <label class="label" for="">注册时间</label>
      <el-date-picker class="mr20" size="small" v-model="time" value-format="yyyy-MM-dd" type="daterange"
        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="isDisabled">
      </el-date-picker> -->
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

      <div>
        <el-button class="mr20" size="small" type="primary" @click="getRegisterDevice">查询</el-button>
        <el-button class="mr20" size="small" type="primary" @click="exportRegisterDevice">导出</el-button>
        <el-button class="mr20" size="small" type="primary" @click="$router.go(-1)">返回</el-button>
      </div>


    </div>
    <div class="list">
      <el-table :data="list" class="table" ref="multipleTable" :header-cell-style="{background:'#eef1f6',color:'#333'}"
        header-cell-class-name="table-header">
        <el-table-column prop="hotName" label="酒店" align="center"></el-table-column>
        <el-table-column prop="roomId" label="房间号" align="center"></el-table-column>
        <el-table-column label="注册账号" align="center">
          <template slot-scope="scope">
            <div>{{mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <div>{{fullname}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" width="200" align="center"></el-table-column>
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
        roomId: '',
        starttime: '',
        endtime: '',
        uid: '',
        fullname: '',
        list: [],
        hotelList: [],
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
      this.uid = this.$route.query.uid;

      this.mobile = this.$route.query.mobile;
      this.fullname = this.$route.query.fullname
      this.getAllHotel()
      this.getRegisterDevice();

    },
    methods: {
      getAllHotel() {
        this.$http('/backstage/getAllHotel').then(res => {
          if (res.code == 200) {
            this.hotelList = res.data;
          }
        })
      },
      getRegisterDevice() {
        this.$http('/backstage/getRegisterDevice', {
          uid: this.uid,
          hotId: this.hotId,
          roomId: this.roomId,
          starttime: this.starttime,
          endtime: this.endtime,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.total = res.data.count
            this.list = res.data.list;
          }
        })
      },
      exportRegisterDevice() {
        this.$download('/backstage/ExportRegisterDevice', {
          uid: this.uid,
          hotId: this.hotId,
          roomId: this.roomId,
          starttime: this.starttime,
          endtime: this.endtime,
        }).then(res => {
          var blob = new Blob([res], { type: 'application/vnd.ms-excel application/x-excel' }); //type这里表示xlsx类型
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          console.log(href)
          downloadElement.href = href;
          downloadElement.download = '用户注册列表.xls'; //下载后文件名
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
        this.getRegisterDevice();
      },
      //改变每页显示条数
      handleSizeChange(val) {
        this.getRegisterDevice();
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
    padding: 24px 29px;
    background: #FFFFFF;
    box-shadow: 0px 11px 20px 0px rgba(0, 0, 0, 0.05);
    border-radius: 11px;
  }

  .list {
    margin-top: 30px;
    padding: 30px 24px;
    background: #fff;
  } */

  .device-num {
    color: #409EFF;
  }
</style>