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
        <el-select v-model="state" size="small" class="handle-search mr20">
          <el-option label="全部" value=""></el-option>
          <el-option label="未处理" value="1"></el-option>
          <el-option label="已处理" value="2"></el-option>
        </el-select>
      </div>
      <div>
        <el-button class="mr20" size="small" type="primary" @click="getFault">查询</el-button>
        <el-button class="mr20" size="small" type="primary" @click="exportFault">导出</el-button>

      </div>
    </div>
    <div class="list">
      <el-table :data="list" :row-class-name="tableRowClassName"
        :header-cell-style="{background:'#eef1f6',color:'#333'}" class="table" ref="multipleTable"
        header-cell-class-name="table-header">
        <el-table-column label="ID" type="index" width="200" align="center">
          <template slot-scope="scope">
            <div class="blue pointer" @click="$router.push({path:'/faultInfo',query:{faultId:scope.row.faultId}})">
              {{scope.row.index}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="deviceId" label="SN码" align="center"></el-table-column>
        <el-table-column prop="mobile" label="客户手机号" width="150" align="center"></el-table-column>
        <el-table-column prop="content" label="问题描述" width="200" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="问题图片" width="120" align="center">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.picture"
              :preview-src-list="[scope.row.picture]">
              <div slot="error" class="image-slot">
                未上传图片
              </div>
            </el-image>
            <!-- <img :src="scope.row.picture" :preview-src-list='' style="width: 100px;height: 100px;" alt=""> -->
          </template>
        </el-table-column>
        <el-table-column prop="faultTime" label="提交时间" width="200" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.state==1">未处理</div>
            <div v-else-if="scope.row.state==2">已处理</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="pointer" style="color:#02a7f0"
              @click="$router.push({path:'/faultInfo',query:{faultId:scope.row.faultId}})">
            <span v-if="scope.row.state==1 ">处理</span>
            <span v-else>查看详情</span>
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
        state: '',
        hotelList: [],
        list: []
      }
    },
    created() {
      this.getAllHotel();
      this.getFault()
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        row.index = rowIndex + 1
      },
      getAllHotel() {
        this.$http('/backstage/getAllHotel').then(res => {
          if (res.code == 200) {
            this.hotelList = res.data;
          }
        })
      },
      getFault() {
        this.$http('/backstage/getFault', {
          hotId: this.hotId,
          deviceId: this.deviceId,
          state: this.state,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.total = res.data.count
            this.list = res.data.list;
          }
        })
      },
      exportFault() {
        this.$download('/backstage/ExportFault', {
          hotId: this.hotId,
          deviceId: this.deviceId,
          state: this.state,

        }).then(res => {
          var blob = new Blob([res], { type: 'application/vnd.ms-excel application/x-excel' }); //type这里表示xlsx类型
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          console.log(href)
          downloadElement.href = href;
          downloadElement.download = '故障列表.xls'; //下载后文件名
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
        this.getFault();
      },
      //改变每页显示条数
      handleSizeChange(val) {
        this.getFault();
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

  .blue {
    color: #02a7f0
  }

  .el-image {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
    color: #c0c4cc;

  }
  .image-slot{
width: 100%;
height: 100%;
  }
</style>