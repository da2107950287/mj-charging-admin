<template>
  <div class="container">
    <div class="search-box">
      <div>
        <label class="label" for="">ID</label>
        <el-input v-model="uid" size="small" placeholder="" clearable class="handle-search mr20"></el-input>

      </div>
      <div>
        <label class="label" for="">姓名</label>
        <el-input v-model="fullname" size="small" placeholder="" clearable class="handle-search mr20"></el-input>
      </div>
      <div>
        <label class="label" for="">手机号</label>
        <el-input v-model="mobile" size="small" placeholder="" clearable class="handle-search mr20"></el-input>
      </div>
      <div>
        <el-button class="mr20" size="small" type="primary" @click="getUserinfo">查询</el-button>
        <el-button class="mr20" size="small" type="primary" @click="dialogVisible=true;show=1;">添加</el-button>
        <el-button class="mr20" size="small" type="primary" @click="exportUserinfo">导出</el-button>
      </div>
    </div>
    <div class="list">
      <el-table :data="list" class="table" ref="multipleTable" :header-cell-style="{background:'#eef1f6',color:'#333'}"
        header-cell-class-name="table-header">
        <el-table-column prop="uid" label="ID" width="200" align="center"></el-table-column>
        <el-table-column prop="fullname" label="姓名" align="center"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="150" align="center"></el-table-column>
        <el-table-column prop="registerNumber1" label="今日注册" align="center"></el-table-column>
        <el-table-column label="累计注册" align="center">
          <template slot-scope="scope">
            <div class="pointer"
              @click="$router.push({path:'/registerDevice',query:{uid:scope.row.uid,mobile:scope.row.mobile,fullname:scope.row.fullname}})">
              {{scope.row.registerNumber2}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <span @click="editInfo(scope.row)" class="pointer">编辑</span>
            <span @click="deleteUserinfo(scope.row.uid)" class="pointer">删除</span>

            <span @click="updateState(scope.row)" class="pointer">
              <span v-if="scope.row.state==2">启用</span>
              <span v-else-if="scope.row.state==1">禁用</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <Page :total="total" :PageNumber.sync="PageNumber" :PageSize.sync="PageSize" @current-change="changeCurrentPage"
        @size-change="handleSizeChange">
      </Page>
      <el-dialog :title="show==1 ? '添加':'编辑'" center :visible.sync="dialogVisible" :close-on-click-modal="false" width="450px">
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
          <el-form-item prop="fullname" label="姓名">
            <el-input v-model="form.fullname"  minlength="1" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="手机号">
            <el-input v-model="form.mobile" maxlength=11></el-input>
          </el-form-item>
          <el-form-item prop="role" label="角色">
            <el-radio v-model="form.role" label="2">注册员</el-radio>
          </el-form-item>
          <el-form-item prop="state" label="状态">
            <el-radio-group v-model="form.state">
              <el-radio label="1">启用</el-radio>
              <el-radio label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button v-if="show==1" type="primary" @click="insertUserinfo">添加</el-button>
            <el-button v-else-if="show==2" type="primary" @click="updateUserinfo">保存</el-button>
            <el-button @click="dialogVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  import Page from '../components/Page.vue'
  import { isPhone } from '../assets/js/utils.js'
  export default {

    data() {
      var validateMobile = (rule, value, callback) => {
        value = value.replace(/\ +/g, "").replace(/[\r\n]/g, "")
        if (value == '') {
          return callback(new Error("手机号不能为空"))
        } else if (!isPhone(value)) {
          return callback(new Error("手机号不正确"))
        } else {
          return callback();
        }
      }
      var validateFullname = (rule, value, callback) => {
        value = value.replace(/\ +/g, "").replace(/[\r\n]/g, "")
        if (value == '') {
          return callback(new Error("姓名不能为空"))
        } else {
          return callback();
        }
      }
      return {
        PageNumber: 1,
        PageSize: 20,
        total: 0,
        show: 1,
        uid: '',
        mobile: '',
        fullname: '',
        hotelList: [],
        list: [],
        dialogVisible: false,
        form: {
          role: "2",
          state: "1",
        },
        rules: {
          fullname: [
            { required: true, message: "请输入姓名", trigger: "blur" },
            { trigger: "change", validator: validateFullname }

          ],
          mobile: [
            { required: true, message: "请输入手机号", trigger: "blur" },
            { trigger: "change", validator: validateMobile }
          ],
          state: [{ required: true, message: "请选择状态", trigger: "blur" }],
          role: [{ required: true, }],
        },
      }
    },
    watch: {
      dialogVisible() {
        if (this.dialogVisible == false) {
          this.form = {
            role: '2',
            state: '1'
          }
        }
      },
      'form.mobile'(){
        this.form.mobile=this.form.mobile.replace(/[\W]/g,'');
      }
    },
    created() {
      this.getUserinfo()
    },
    methods: {
      editInfo(row) {
        this.dialogVisible = true;
        this.form = JSON.parse(JSON.stringify(row));
        this.show = 2;
      },
      updateUserinfo() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$http('/backstage/updateUserinfo',
              this.form
            ).then(res => {
              this.dialogVisible = false;
              this.$message.success(res.msg)
              this.getUserinfo()
            })
          }
        })
      },
      insertUserinfo() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$http('/backstage/insertUserinfo', this.form).then(res => {
              this.dialogVisible = false;
              this.$message.success(res.msg)
              this.getUserinfo()
            })
          }
        })

      },
      deleteUserinfo(uid) {
        this.$confirm('确认删除该注册员？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/backstage/deleteUserinfo', { uid }).then(res => {
            if (res.code == 200) {
              this.getUserinfo()
              this.$message.success(res.msg)
            }
          })
        })
      },
      getUserinfo() {
        this.$http('/backstage/getUserinfo', {
          uid: this.uid,
          mobile: this.mobile,
          fullname: this.fullname,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.total = res.data.count
            this.list = res.data.list;
          }
        })
      },
      exportUserinfo() {
        this.$download('/backstage/ExportUserinfo', {
          uid: this.uid,
          mobile: this.mobile,
          fullname: this.fullname,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }
        ).then(res => {
          var blob = new Blob([res], { type: 'application/vnd.ms-excel application/x-excel' }); //type这里表示xlsx类型
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          console.log(href)
          downloadElement.href = href;
          downloadElement.download = '注册员列表.xls'; //下载后文件名
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
      updateState(row) {
        row.state = row.state ^ 3;
        this.$http('/backstage/updateUserinfo',
          row
        ).then(res => {
          this.$message.success(res.msg)
          this.getUserinfo()
        })
      },
      //修改查询条件
      queryChange() {
        this.PageNumber = 1;
        this.getUserinfo();
      },
      //改变当前页数
      changeCurrentPage(val) {
        this.getUserinfo();
      },
      //改变每页显示条数
      handleSizeChange(val) {
        this.getUserinfo();
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
    color: #02a7f0;
    margin-right: 10px;
  }

  /* .search-box {
    width: 100%;
    height: 80px;
    padding-top: 24px;
    padding-left: 29px;
    background: #FFFFFF;
    box-shadow: 0px 11px 20px 0px rgba(0, 0, 0, 0.05);
    border-radius: 11px;
  }*/

  .list {

    padding: 30px 24px;
    background: #fff;
    margin-top: 30px;
  }
</style>