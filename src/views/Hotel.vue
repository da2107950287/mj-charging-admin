<template>
  <div class="container">
    <div class="search-box">
      <div>
        <label class="label" for="">酒店名称</label>
        <el-select v-model="hotName" filterable size="small" class="handle-search mr20">
          <el-option label="全部" value=""></el-option>

          <el-option v-for="item in hotelList" :key="item.hotId" :label="item.hotName" :value="item.hotName">
          </el-option>
        </el-select>
      </div>
      <div>
        <label class="label" style="width: 20px;" for="">省</label>
        <el-select v-model="province" filterable size="small" @change="provinceChange" class="handle-search mr20">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in provinceList" :key="item.label" :label="item.label" :value="item.label"></el-option>
        </el-select>
      </div>
      <div>
        <label class="label" style="width: 20px;" for="">市</label>
        <el-select v-model="city" filterable size="small" @change="cityChang" class="handle-search mr20">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in cityList" :key="item.label" :label="item.label" :value="item.label">
          </el-option>
        </el-select>
      </div>

      <div>
        <label class="label" style="width: 20px;" for="">区</label>
        <el-select v-model="area" filterable size="small" class="handle-search mr20">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in areaList" :key="item.label" :label="item.label" :value="item.label">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-button class="mr20" size="small" type="primary" @click="getHotel">查询</el-button>
        <el-button class="mr20" size="small" type="primary" @click="ExportHotel">导出</el-button>

      </div>
    </div>
    <div class="list">
      <el-table :data="list" class="table" ref="multipleTable" :header-cell-style="{background:'#eef1f6',color:'#333'}"
        header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100px" align="center"></el-table-column>
        <el-table-column prop="hotName" label="酒店名称" align="center"></el-table-column>
        <el-table-column prop="number1" label="活跃设备" align="center"></el-table-column>
        <el-table-column label="设备数" align="center">
          <template slot-scope="scope">
            <div class="device-num pointer" @click="$router.push({path:'/device',query:{hotId:scope.row.hotId}})">
              {{scope.row.number2}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="income1" label="今日收益" align="center"></el-table-column>
        <el-table-column prop="income2" label="累计收益" align="center"></el-table-column>
        <el-table-column label="新旧藏宝么会员" align="center">
          <template slot-scope="scope">
            <div>注册：{{scope.row.register2}}</div>
            <div>登录：{{scope.row.login2}}</div>
          </template>
        </el-table-column>
        <el-table-column label="新旧藏宝天下会员" align="center">
          <template slot-scope="scope">
            <div>注册：{{scope.row.login2}}</div>
            <div>登录：{{scope.row.login1}}</div>
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
  import area from '../assets/js/area.js'
  export default {
    data() {
      return {
        PageNumber: 1,
        PageSize: 20,
        total: 0,
        hotName: '',
        province: '',
        city: '',
        area: '',
        hotelList: [],
        list: [],
        provinceList: [],
        cityList: [],
        areaList: [],
      }
    },
    created() {
      this.getHotel();
      this.getAllHotel();
      this.provinceList = area.map(item => {
        return item
      })
    },
    methods: {
      provinceChange() {
        this.city = '';
        this.area = '';
        let index = this.provinceList.findIndex(item => {
          return item.label == this.province
        })
        this.cityList = this.provinceList[index].children.map(item => {
          return item
        })
      },
      cityChang() {
        this.area = ''
        let index = this.cityList.findIndex(item => {
          return item.label == this.city
        })
        this.areaList = this.cityList[index].children.map(item => {
          return item
        })
      },
      getAllHotel() {
        this.$http('/backstage/getAllHotel').then(res => {
          if (res.code == 200) {
            this.hotelList = res.data;
          }
        })
      },
      getHotel() {
        this.$http('/backstage/getHotel', {
          hotName: this.hotName,
          province: this.province,
          city: this.city,
          area: this.area,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.total = res.data.count
            this.list = res.data.list;
          }
        })
      },
      ExportHotel() {

        this.$download('/backstage/ExportHotel', {
          hotName: this.hotName,
          province: this.province,
          city: this.city,
          area: this.area,
      
        }).then(res => {
          var blob = new Blob([res], { type: 'application/vnd.ms-excel application/x-excel' }); //type这里表示xlsx类型
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          console.log(href)
          downloadElement.href = href;
          downloadElement.download = '酒店列表.xls'; //下载后文件名
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
        this.getHotel();
      },
      //改变每页显示条数
      handleSizeChange(val) {
        this.getHotel();
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