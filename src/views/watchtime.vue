<template>
  <div class="watchtime">
    <div class="inputbutton">
      <div class="wrap">
        <div class="button01">
          <download-excel name="ExportUesrTimer.xls" :data="daochuExcel">
            <el-button class="btn1" type="primary" plain>导出信息</el-button>
          </download-excel>
        </div>
        <div>
          <el-button class="btn2" type="danger" plain @click="deleteweek = true">删除信息</el-button>
        </div>
        <div>
          <el-button class="btn2" type="warning" plain @click="open">删除全部信息</el-button>
        </div>
      </div>
      <el-drawer :visible.sync="deleteweek" :direction="direction">
        <span class="shoudongtext">删除信息</span>

        <el-input class="inputnum" placeholder="请输入你要删除的周" v-model="deleteWeekNum" show-word-limit></el-input>
        <el-button class="plainbutton" type="danger" plain round @click="deleteUserTimer">确认删除</el-button>
      </el-drawer>
      <div class="search">
        <el-input
          clearable
          placeholder="输入关键字搜索"
          prefix-icon="el-icon-search"
          v-model="searchText"
          @input="inputChange"
        ></el-input>
      </div>
    </div>
    <el-table
      :data="tableData"
      stripe
      max-height="500px"
      style="width: 100%"
      :default-sort="{prop: 'week', order: 'descending'}"
      :row-style="{height:'20px'}"
      sort-by="week"
    >
      <el-table-column prop="username" label="姓名" v-show="isShow"></el-table-column>
      <el-table-column prop="uid" v-if="a!=='人脸'" label="学号" width="120"></el-table-column>
      <el-table-column prop="class" :label="a==='人脸'?'所在教室':'班级'"></el-table-column>
      <el-table-column prop="mon" label="周一"></el-table-column>
      <el-table-column prop="tues" label="周二"></el-table-column>
      <el-table-column prop="wed" label="周三"></el-table-column>
      <el-table-column prop="thur" label="周四"></el-table-column>
      <el-table-column prop="fri" label="周五"></el-table-column>
      <el-table-column prop="sat" label="周六"></el-table-column>
      <el-table-column prop="sun" label="周日"></el-table-column>
      <el-table-column prop="week" label="当前周" sortable width="120"></el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[ 9, 13,20]"
        :page-size="number"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      newtableData: [],
      searchValueData: [],
      a: "扫码",
      isShow: true,
      type: "",
      currentPage: 1, //当前页
      total: 0, //总条数
      number: 9, //每页number条
      searchText: "",
      daochuExcel: [],
      timer: "",
      direction: "rtl",
      deleteweek: false,
      deleteWeekNum: ""
    };
  },
  methods: {
    open() {
        this.$confirm('此操作将永久删除全部信息， 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteAllWeeks()
          this.getAllFacTimer();

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      async deleteAllWeeks(){
        const { data } = await this.$http.get("/deleteAllWeeks", {
          params: { type: this.type }
        });
        if (data.status === 0) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      } else {
        this.$message({
          type: "error",
          message: "删除失败"
        });
      }

      },
      async deleteUserTimer() {
      const { data } = await this.$http.get("/deleteWeeks", {
        params: { week: this.deleteWeekNum, type: this.type }
      });
      console.log(data.status)
      if (data.status === 0) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
         this.deleteWeekNum = "";
        this.getAllFacTimer();
      } else {
        this.$message({
          type: "error",
          message: "删除失败，请检查你输入的数据!"
        });
      }
    },
    //导出表格后删除
    // deleteMeg(){
    //     this.$confirm('是否删除已导出的信息?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //     var daochuID = []
    //      this.daochuExcel.forEach(i => {
    //        daochuID.push(i.id)
    //      })

    //     this.deleteUserTimer(daochuID)

    //     }).catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '取消删除'
    //       });
    //     });
    //   },
    searchValue(str) {
      this.searchValueData = [];
      this.newtableData.forEach(el => {
        if (
          el.username.indexOf(str) !== -1 ||
          el.class.indexOf(str) !== -1 ||
          el.week.indexOf(str) !== -1 ||
          el.uid.indexOf(str) !== -1
        ) {
          this.searchValueData.push(el);
        }
      });
      this.total = this.searchValueData.length;
      this.daochuExcel = this.searchValueData;
      this.tableData = this.searchValueData.slice(
        (this.currentPage - 1) * this.number,
        this.currentPage * this.number
      );
      // console.log(this.searchValueData)
    },
    //输入框值改变触发函数
    inputChange(str) {
      //定时器，防抖
      if (this.timer !== "") {
        clearTimeout(this.timer);
        this.timer = "";
      }
      this.timer = setTimeout(() => {
        this.searchValue(str);
        this.timer = "";
      }, 500);
    },
    handleSizeChange(val) {
      this.number = val;
      if (this.searchText === "") {
        this.getTableData();
      } else {
        this.searchValue(this.searchText);
      }
    },
    //获取当前页面值
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.searchText === "") {
        this.getTableData();
      } else {
        this.searchValue(this.searchText);
      }
    },
    getTableData() {
      this.tableData = this.newtableData.slice(
        (this.currentPage - 1) * this.number,
        this.currentPage * this.number
      );
    },
    async getAllFacTimer() {
      if (this.type === "1") {
        //人脸
        const { data } = await this.$http.get(
          `/getAllUserTimer?type=${this.type}`
        );
        this.newtableData = data.data;
        this.daochuExcel = data.data;
        this.total = data.data.length;
      } else if (this.type === "2") {
        const { data } = await this.$http.get(
          `/getAllUserTimer?type=${this.type}`
        );
        this.daochuExcel = data.data;
        this.newtableData = data.data;
        this.total = data.data.length;
      }
      this.getTableData();
    },
    getA() {
      var token = localStorage.getItem("a");
      this.a = token;
      var T = localStorage.getItem("type");
      this.type = T;
    }
  },
  created() {
    //先获取值，再进行判断
    this.getA();
    this.getAllFacTimer();
  }
};
</script>
<style scoped>
.button01 {
  margin-top: 10px;
}
.inputbutton {
  display: flex;
  justify-content: space-between;
  margin-top: -10px;
  /* margin-bottom: 10px; */
}

.block {
  margin-top: 15px;
}
.el-table th > .cell {
  font-size: 20px !important;
}
.btn1 {
  margin-top: -10px;
  margin-bottom: 10px;
}
.btn2 {
  margin-bottom: 10px;
  margin-left: 10px;
}
.search {
  margin-left: 10px;
}
.shoudongtext {
  color: rgb(0, 138, 201);
  font-size: 30px;
  font-weight: bold;
}
.inputnum {
  margin-top: 40px;
  width: 90%;
}
.plainbutton {
  margin-top: 30px;
  width: 140px;
}
.wrap {
  display: flex;
}
</style>