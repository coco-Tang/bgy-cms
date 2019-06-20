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
        <div class="user-create" @click="createUserdialog = true">
          <i class="iconfont">&#xe68a;</i>
          <span>创建用户</span>
        </div>
      </div>
    </div>

    <div class="user-table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="account" label="账号" width="180"></el-table-column>
        <el-table-column prop="name" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="pwdReset(scope.row.id)" type="text">密码重置</el-button>
            <span style="color:#666;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row.id)"
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
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totalPage"
        :background="true"
      ></el-pagination>
    </div>

    <!-- <base-dialog :show="dialog_show" @close="dialog_close" @submit="dialog_submit" title="创建用户">
    <el-form :model="createUserform" ref="createUser">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="createUserform.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="createUserform.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input v-model="createUserform.passwordCheck"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-radio-group v-model="createUserform.role">
            <el-radio :label="1">系统管理员</el-radio>
            <el-radio :label="2">客服</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </base-dialog> -->

    <el-dialog title="创建用户" :visible.sync="createUserdialog" center="">
      <el-form :model="createUserform" ref="createUser" :rules="createUserformRules">
        <el-form-item label="账号"  prop="account" :label-width="formLabelWidth">
          <el-input v-model="createUserform.account"></el-input>
        </el-form-item>
        <el-form-item label="密码"  prop="password" :label-width="formLabelWidth">
          <el-input v-model="createUserform.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"  prop="passwordCheck" :label-width="formLabelWidth">
          <el-input v-model="createUserform.passwordCheck" type="password"></el-input>
        </el-form-item>
        <el-form-item label="角色"  prop="role" :label-width="formLabelWidth">
          <el-radio-group v-model="createUserform.role">
            <el-radio :label="1">系统管理员</el-radio>
            <el-radio :label="2">客服</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createUserformClose">取 消</el-button>
        <el-button type="primary" @click="createUserSubmit">创建</el-button>
      </div>
    </el-dialog>

    <el-dialog title="密码重置" :visible.sync="pwdResetdialog" center="">
      <el-form :model="pwdResetform" ref="pwdReset">
        <el-form-item>
          <el-input v-model="pwdResetform.password" placeholder="新密码（6-20位字符，包含数字、字母）"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwdResetformClose">取 消</el-button>
        <el-button type="primary" @click="pwdResetSubmit">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import BaseDialog from "../../components/BaseDialog";
import { mapActions, mapGetters } from "vuex";
import {
  getUser,
  createUser,
  // updateUsers,
  deleteUser,
  resetUser
} from "@/api/task.js";
import { Message, MessageBox } from "element-ui";
export default {
  name: "userManagement",
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空！"));
      }
      const reg = /^[a-zA-Z0-9]{6,12}$/;
      if (!reg.test(value)) {
        return callback(new Error("6到12位（字母，数字）！"));
      }
      if (this.createUserform.passwordCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.createUser.validateField("passwordCheck");
        }
      // if (!value) {
      //   return callback(new Error("密码不能为空！"));
      //   const reg = /^[a-zA-Z0-9]{6,12}$/;
      //   if (!reg.test(value)) {
      //     console.log('不满6位')
      //     return callback(new Error("6到12位（字母，数字）！"));
      //   }
      //   if (this.createUserform.passwordCheck !== "") {
      //     // 对第二个密码框单独验证
      //     this.$refs.createUser.validateField("passwordCheck");
      //   }
      //   // callback();
      // }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入您的密码！"));
      } else if (value !== this.createUserform.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const validateAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空！"));
      }
      const reg = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{4,10}$/;
      if (!reg.test(value)) {
        return callback(new Error("4到10位（中文，字母，数字，下划线，减号）！"));
      }
    };
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
      createUserdialog: false,
      createUserform: {
        account: "",
        password: "",
        passwordCheck: "",
        role: 1
      },
      createUserformRules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        passwordCheck: [{ validator: validatePassCheck, trigger: "blur" }],
        account: [{ validator: validateAccount, trigger: "blur" }]
      },
      pwdResetdialog: false,
      pwdResetform: {
        password: ""
      },
      formLabelWidth: "120px",
      account: ""
    };
  },
  computed: {
    totalPage() {
      return this.tableData.length;
    }
  },
  // components: {
  //   BaseDialog
  // },
  created() {
    this.getUser();
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    ...mapActions(["TASK_ID", "QL_DATA", "SECTION_TREE"]),
    ...mapGetters(["getTaskId", "getSectionTree", "getAccount"]),
    getUser() {
      let params = {
        page: this.currentPage,
        limit: this.pageSize
      };
      getUser(params).then(res => {
        // console.log(res.data)
        this.tableData = res.data.filter(item => {
          return !item.deleteFlag;
        });
      });
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getUser();
    },
    handleCurrentChange(v) {
      this.currentPage = v;
      this.getUser();
    },
    pwdReset(id) {
      this.pwdResetdialog = true;
      this.id = id;
    },
    handleDelete(id) {
      MessageBox.confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser(id).then(res => {
            // console.log(res)
            if (res.code === 200) {
              Message.success(res.message);
              this.getUser();
            }
          });
        })
        .catch(() => {
          Message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    createUserformClose() {
      this.$refs["createUser"].resetFields();
      this.createUserdialog = false;
    },
    createUserSubmit() {
      const { account, password, role } = this.createUserform;
      // console.log(this.form)
      createUser({ account, password, role }).then(res => {
        // console.log(res);
        if (res.code === 1) {
          Message.success(res.message);
          this.getUser();
          this.$refs["createUser"].resetFields();
          this.createUserdialog = false;
        }
      });
    },
    pwdResetformClose() {
      this.$refs["pwdReset"].resetFields();
      this.pwdResetdialog = false;
    },
    pwdResetSubmit() {
      const { password } = this.pwdResetform;
      const id = this.id;
      resetUser({ id, password }).then(res => {
        console.log(res.data);
        if (res.code === 200) {
          Message.success(res.message);
          this.pwdResetformClose();
          // this.$router.replace({path: "/login"});
        }
      });
    },
    parentMethod() {
      console.log(this.gridOptions);
      this.$refs.compUser.quickRecgnizeHandle();
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
          this.getUser();
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
          this.getUser();
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
