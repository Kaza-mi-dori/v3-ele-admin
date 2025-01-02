import { ElMessage, ElMessageBox } from "element-plus";
import type { Router } from "vue-router";

export const handleDeleteRow = (row: any, api: any, callback: () => void) => {
  // 确认是否删除
  ElMessageBox.confirm("确定删除该记录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 删除数据
      api(row.id).then(() => {
        ElMessage.success("删除成功");
        callback();
      });
    })
    .catch(() => {
      // 取消删除
      ElMessage.info("已取消删除");
    });
};

export const handleBatchDelete = (
  rows: any[],
  api: any,
  callback: () => void
) => {
  // 确认是否删除
  ElMessageBox.confirm("确定删除选中记录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 判断是否为有效数据，如果是则不允许删除(提示)
      const auditedRows = rows.filter(
        (row) => row.audited || (row["状态"] && row["状态"] === "已审核")
      );
      if (auditedRows.length > 0) {
        ElMessageBox.alert("已审核数据请联系管理员删除", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return;
      }
      // 删除数据
      api(rows.map((row) => row.id)).then(() => {
        ElMessage.success("删除成功");
        callback();
      });
    })
    .catch(() => {
      // 取消删除
      ElMessage.info("已取消删除");
    });
};

/**
 * 同一审批操作
 * @param row 数据行
 * @param api 审核接口
 * @param auditedProp 审核字段
 * @param auditedValue 审核值(例如：true/有效/已审核/1，根据接口定)
 * @param callback 回调函数
 */
export const handleAuditRow = (
  row: any,
  api: any,
  auditedProp: string,
  auditedValue: any,
  callback: () => void
) => {
  // 确认是否审核
  const message =
    row.状态 === "有效"
      ? "确定将该记录审核状态重置为无效吗？(审核后该记录将变为无效状态)"
      : "确定审核该记录吗？(审核后该记录将变为有效状态)";

  ElMessageBox.confirm(message, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 审核数据, 全量更新审核字段
      api({ ...row, [auditedProp]: auditedValue }).then(() => {
        ElMessage.success("审核成功");
        callback();
      });
    })
    .catch(() => {
      // 取消审核
      ElMessage.info("已取消审核");
    });
};

/**
 * 点击详情操作
 */
export const handleClickRecord = (row: any, router: Router) => {
  const route = router.resolve({
    name: "ReportForm",
    query: {
      type: "orderDetail",
      id: row.id,
    },
  });
  console.log(route);
  router.push(route);
};
