export default {
  data () {
    return {
      editStatus: false,
      btnStatus: false,
      modalStatus: false,
      tableData: [],
      search: '',
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.page.pageSize = val
      this.pageLoad()
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.pageLoad()
    },
    searchFn () {
      this.page.pageNo = 1
      this.pageLoad()
    },
  }
}
