import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { handleBatchDeleteRows } from "./useTableOp";

/**
 * 列表页相关响应式变量基础封装
 * 父组件需要提供fetchListApi, deleteApi, batchDeleteApi, auditApi, exportApi等相关API操作
 * 将列表页的交互逻辑封装到此钩子中
 * 同时让父组件主要负责页面布局和业务逻辑
 * */
export function useListPage(options: any) {
  const {
    fetchListApi,
    deleteApi,
    batchDeleteApi,
    auditApi,
    exportApi,
    defaultQuery = {},
    handleAfterFetch = null,
  } = options;

  // 状态定义
  const loading = ref(false);
  const tableData = ref([]);
  const selectedRows = ref([]);
  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
  });
  const showSelection = ref<boolean>(false);

  // 查询参数
  const queryForm = ref({
    页码: 1,
    页容量: 10,
    ...defaultQuery,
  });

  // 加载数据
  const loadData = async () => {
    if (!fetchListApi) return;

    loading.value = true;
    try {
      const res = await fetchListApi({
        ...queryForm.value,
        页码: pagination.currentPage,
        页容量: pagination.pageSize,
      });

      tableData.value = res["当前记录"] || [];
      pagination.total = +(res["记录总数"] || 0);

      if (handleAfterFetch) {
        handleAfterFetch(res);
      }
    } catch (error) {
      console.error("加载数据失败", error);
      ElMessage.error("加载数据失败");
    } finally {
      loading.value = false;
    }
  };

  // 处理是否显示删除按钮
  const toggleDeleteButton = () => {
    if (!showSelection.value) {
      ElMessage.info("请勾选要删除的数据，然后点击确认删除");
    }
    showSelection.value = !showSelection.value;
  };

  // 处理筛选
  const handleFilter = (filters: any) => {
    // 根据业务需要转换筛选条件
    queryForm.value = { ...queryForm.value, ...filters };
    pagination.currentPage = 1;
    loadData();
  };

  const handleSizeChange = (size: number) => {
    console.log("size");
    pagination.pageSize = size;
    pagination.currentPage = 1;
    loadData();
  };

  // 重置筛选
  const handleResetFilter = () => {
    queryForm.value = { ...defaultQuery, 页码: 1, 页容量: pagination.pageSize };
    pagination.currentPage = 1;
    loadData();
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    pagination.currentPage = page;
    loadData();
  };

  // 处理删除
  const handleDelete = async (row: any) => {
    if (!deleteApi) return;

    try {
      await ElMessageBox.confirm("确认删除此条记录?", "提示", {
        type: "warning",
      });

      loading.value = true;
      await deleteApi([row.id]);
      ElMessage.success("删除成功");
      loadData();
    } catch (error) {
      console.error("删除失败", error);
      if (error !== "cancel") {
        ElMessage.error("删除失败");
      }
    } finally {
      loading.value = false;
    }
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning("请选择要删除的数据");
      return;
    }
    handleBatchDeleteRows(selectedRows.value, deleteApi, loadData);
  };

  // 更多API封装...
  // 封装的最好是页面互动相对固定的

  onMounted(() => {
    loadData();
  });

  return {
    loading,
    tableData,
    selectedRows,
    showSelection,
    pagination,
    queryForm,
    loadData,
    toggleDeleteButton,
    handleSizeChange,
    handleFilter,
    handleResetFilter,
    handlePageChange,
    handleBatchDelete,
    handleDelete,
    // 返回更多方法...
  };
}
