import { ElMessageBox, ElMessage } from "element-plus";

type DeleteFunction = (id: any) => Promise<void>;

interface BatchDeleteParams {
  tableData: any[]; // 表格数据
  tableRef?: any; // 表格引用（用于清空选择）
  deleteApi: DeleteFunction; // 删除接口
  alertMessage?: string; // 删除前提示消息
  confirmMessage?: string; // 删除确认提示
  successCallback?: () => void; // 删除成功后的回调
}

export const handleBatchDeleteForm = ({
  tableData,
  tableRef,
  deleteApi,
  alertMessage = "请选择要删除的数据",
  confirmMessage = "确定批量删除选中的数据吗？",
  successCallback,
}: BatchDeleteParams) => {
  const selected = tableData.filter((item: any) => item.checked);

  // 如果没有选中任何数据，提示用户
  if (!selected.length) {
    ElMessageBox.alert(alertMessage, "提示", {
      confirmButtonText: "确定",
      type: "warning",
    });
    return;
  }

  // 提示用户确认删除
  ElMessageBox.confirm(confirmMessage, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const ids = selected.map((item: any) => item.id); // 获取选中项的ID

      // 批量调用删除接口
      const deleteTasks = ids.map((id: any) => deleteApi(id));

      // 等待所有删除请求完成
      Promise.all(deleteTasks).then(() => {
        // 删除完成后清空选择，重新加载数据
        tableRef?.value?.clearSelection();
        if (successCallback) {
          successCallback();
        }
      });
    })
    .catch(() => {
      // 取消删除
      ElMessage.info("已取消删除");
    });
};
