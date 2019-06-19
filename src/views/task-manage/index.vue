<template>
  <div class="user">
    <div class="title">
      <h3>用户管理</h3>
    </div>

    <div class="toolbar">
      <div class="left-menu">
        <div class="item">
          <div class="item-title">创建时间</div>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>

        <div class="item">
          <div class="item-title">账号</div>
          <el-input
            placeholder="请输入内容"
            v-model="account"
            class="input-with-select"
            style="width: 350px;"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="right-menu">
        <div class="user-create" @click="dialogFormVisible = true">
          <i class="iconfont">&#xe68a;</i>
          <span>创建用户</span>
        </div>
      </div>
    </div>

    <div class="user-table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="date" label="账号" width="180"></el-table-column>
        <el-table-column prop="name" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="text">密码重置</el-button>
            <span style="color:#666;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              style="color:#F56C6C;"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="user-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="100"
        layout="prev, pager, next, jumper"
        :total="1000"
      ></el-pagination>
    </div>

    <el-dialog title="创建用户" :visible.sync="dialogFormVisible" center="">
      <el-form :model="form">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input v-model="form.passwordCheck"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-radio-group v-model="form.role">
            <el-radio :label="1">系统管理员</el-radio>
            <el-radio :label="2">客服</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormSubmit">创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { mapActions, mapGetters } from "vuex";
import {getUser,createUsers,updateUsers,deleteUsers,resetUsers} from '@/api/task.js'
// import localeText from '../../static/localeText.json'
import axios from "axios";
import userDialog from "@/components/userDialog.vue";
export default {
  name: "userManagement",
  components: {
    "ag-grid-vue": AgGridVue,
    "user-dialog": userDialog
    // 'auth-dialog': authDialog,
    // 'department-dialog': departmentDialog,
    // 'sectionoffice-dialog': sectionofficeDialog,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      dateRange: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      currentPage: 1,
      pageSize: 10,
      dialogFormVisible: false,
      form: {
        account: "",
        password: "",
        passwordCheck: "",
        radio: 1
      },
      formLabelWidth: "120px",
      account: ""

    };
  },

  created() {
    let params = {
      page: this.currentPage,
      limit: this.pageSize
    };
    this.getUser(params);
    // this.localeText = localeText;
  },
  mounted() {
    // this.gridOptions.api.sizeColumnsToFit()
    // this.Utils.dateFormat();
    // this.dataInit();
  },
  beforeDestroy() {},
  destroyed() {},
  methods: {
    ...mapActions(["TASK_ID", "QL_DATA", "SECTION_TREE"]),
    ...mapGetters(["getTaskId", "getSectionTree", "getAccount"]),
    getUser(params) {
      getUser(params).then(res => {
        console.log(res.data)
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    dialogFormSubmit() {
      this.dialogFormVisible = false;
    },
    parentMethod() {
      console.log(this.gridOptions);
      this.$refs.compUser.quickRecgnizeHandle();
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.dataInit();
    },
    handleCurrentChange(v) {
      this.currentPage = v;
      this.dataInit();
    },

    editHandle() {
      let arr = this.gridOptions.api.getSelectedRows();
      console.log("edit");
      console.log(arr);
      this.updateMsg.ifUpdate = true;
      this.updateMsg.data = arr[0];
      this.$refs.compUser.showDialog();
    },
    deleteConfirm() {
      this.Utils.confirmBox(this, "确定删除选中用户?", this.mydeleteHandle);
    },
    mydeleteHandle() {
      let arr = this.gridOptions.api.getSelectedRows();
      let deleteArr = [];

      for (let k in arr) {
        deleteArr.push(arr[k].id);
      }

      let params = new URLSearchParams();
      params.append("userIds", deleteArr);

      this.loading = true;
      deleteUsers(params)
        .then(res => {
          if (res.status === 200) {
            this.$message.success("删除成功");
          }
        })
        .then(() => {
          this.dataInit();
        })
        .catch(err => {
          console.error("deleteUsers--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    resetConfirm() {
      this.Utils.confirmBox(this, "确定重置密码?", this.resetHandle);
    },
    resetHandle() {
      let arr = this.gridOptions.api.getSelectedRows();
      let resetArr = [];

      for (let k in arr) {
        resetArr.push(arr[k].account);
      }
      console.log("resetHandle");
      // let params = new URLSearchParams()
      // params.append('accounts', resetArr)

      // this.loading = true
      resetUsers(resetArr)
        .then(res => {
          if (res.status === 200) {
            this.$message.success("重置成功");
          }
        })
        .then(() => {
          this.dataInit();
        })
        .catch(err => {
          console.error("resetUsers--err:", err);
          this.$message.error(err.response.data.msg);
        });
    }
  }
};
</script>

<style scoped lang='scss'>
@import "@/styles/variables.scss";

.user {
  width: 100%;
  min-height: 980px;
  padding: 10px 30px;
  overflow: hidden;
  background-color: #eee;

  .title {
    width: 100%;
    padding-left: 10px;
    border-bottom: 1px solid #ccc;
  }

  .toolbar {
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-between;

    .left-menu {
      display: flex;
      .item {
        width: 500px;
        display: flex;
        align-items: center;
        .item-title {
          margin-right: 20px;
        }
      }
    }

    .right-menu {
      width: 230px;
      height: 42px;
      line-height: 42px;
      padding-right: 70px;
      .user-create {
        // width: 100%;
        height: 42px;
        // margin: 0 auto;
        box-sizing: border-box;
        border: 1px solid $themeColor;
        border-radius: 21px;
        font-size: 14px;
        color: $themeColor;
        padding-left: 15px;
        // text-align: center;
      }
    }
  }

  .user-table {
    margin-top: 20px;
  }

  .user-pagination {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
